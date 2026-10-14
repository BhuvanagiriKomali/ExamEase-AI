import { useEffect, useRef, useState } from "react";
import { Send, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessage, type ChatMessage, type Mood } from "@/services/api";

const STARTERS = [
  "I'm panicking even though I have time",
  "I haven't finished studying",
  "I can't focus",
  "I keep procrastinating",
  "I just need someone to listen",
];

export function Companion({ mood, seed, onOpenPlanner }: { mood?: Mood | undefined; seed?: { text: string; n: number } | undefined; onOpenPlanner: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi, I'm ExamEase. I'm here to listen, help you think clearly, and teach you a few things that make studying easier. What's on your mind?" },
  ]);
  const [quick, setQuick] = useState<string[]>(STARTERS.slice(0, 3));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, loading]);
  useEffect(() => { if (seed) send(seed.text); }, [seed?.n]); // eslint-disable-line react-hooks/exhaustive-deps

  async function send(text: string) {
    const t = text.trim();
    if (!t || loading) return;
    if (/open the planner|make me a plan/i.test(t)) onOpenPlanner();
    const next = [...messages, { role: "user" as const, content: t }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const r = await sendMessage(next, mood);
      setMessages((m) => [...m, { role: "assistant", content: r.content }]);
      setQuick(r.quickReplies);
    } catch {
      setError("I couldn't reply just now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[560px] flex-col rounded-3xl border bg-card shadow-soft">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <div className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground"><Heart className="size-5" /></div>
        <div>
          <p className="font-semibold">ExamEase companion</p>
          <p className="text-xs text-muted-foreground">Friend · Guide · Teacher</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
            <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> ExamEase is thinking…</div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div ref={endRef} />
      </div>
      <div className="flex flex-wrap gap-2 px-5 pb-3">
        {quick.map((q) => (
          <button key={q} disabled={loading} onClick={() => send(q)} className="rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground transition hover:bg-accent disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t p-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type how you're feeling…" className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <Button type="submit" size="icon" className="rounded-full" disabled={loading || !input.trim()} aria-label="Send"><Send className="size-4" /></Button>
      </form>
    </div>
  );
}

export { STARTERS };
