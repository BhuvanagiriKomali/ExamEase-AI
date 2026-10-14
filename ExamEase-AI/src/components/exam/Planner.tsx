import { useState } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePlan, type StudyPlan } from "@/services/api";

const field = "w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function Planner() {
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState(3);
  const [topics, setTopics] = useState("");
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      setPlan(await generatePlan({ subject, hoursLeft: hours, topics: topics.split(/[,\n]/).map((t) => t.trim()).filter(Boolean) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  const update = (id: string, patch: Partial<StudyPlan["sessions"][number]>) =>
    plan && setPlan({ ...plan, sessions: plan.sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const total = plan?.sessions.reduce((a, s) => a + s.minutes, 0) ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-3xl border bg-card p-6 shadow-soft">
        <label className="block space-y-1 text-sm font-medium">Subject<input className={field} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Biology" /></label>
        <label className="block space-y-1 text-sm font-medium">Hours available today<input type="number" min={1} max={12} className={field} value={hours} onChange={(e) => setHours(Number(e.target.value) || 1)} /></label>
        <label className="block space-y-1 text-sm font-medium">Topics left (comma separated)<textarea rows={3} className={field} value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="Cells, Genetics, Ecology" /></label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full rounded-full" disabled={loading}>{loading ? <><Loader2 className="size-4 animate-spin" /> Making your plan…</> : "Make my plan"}</Button>
      </form>
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        {!plan ? (
          <p className="text-sm text-muted-foreground">Your plan will appear here. It'll be short, realistic, and fully editable.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Total: {Math.floor(total / 60)}h {total % 60}m</p>
            {plan.sessions.map((s) => (
              <div key={s.id} className={`flex items-center gap-2 rounded-2xl p-2 ${s.kind === "break" ? "bg-secondary" : s.kind === "review" ? "bg-accent" : "bg-muted"}`}>
                <input className="flex-1 bg-transparent px-2 text-sm outline-none" value={s.title} onChange={(e) => update(s.id, { title: e.target.value })} />
                <input type="number" min={1} className="w-16 rounded-lg border bg-background px-2 py-1 text-sm" value={s.minutes} onChange={(e) => update(s.id, { minutes: Number(e.target.value) || 1 })} />
                <span className="text-xs text-muted-foreground">min</span>
                <button type="button" aria-label="Remove" onClick={() => setPlan({ ...plan, sessions: plan.sessions.filter((x) => x.id !== s.id) })} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setPlan({ ...plan, sessions: [...plan.sessions, { id: crypto.randomUUID(), title: "New session", minutes: 25, kind: "study" }] })}><Plus className="size-4" /> Add session</Button>
            <div className="rounded-2xl bg-cream p-4 text-sm"><strong>Why this works: </strong>{plan.why}</div>
          </div>
        )}
      </div>
    </div>
  );
}
