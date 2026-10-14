import { useEffect, useState } from "react";
import { Wind, Brain, ListOrdered, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Breathing() {
  const [on, setOn] = useState(false);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setPhase((p) => (p + 1) % 2), 4000);
    return () => clearInterval(id);
  }, [on]);
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-6 text-center shadow-soft">
      <div className="flex items-center gap-2 font-semibold"><Wind className="size-5 text-primary" /> Breathe with me</div>
      <div className="grid size-40 place-items-center">
        <div className={`grid size-40 place-items-center rounded-full bg-lavender ${on ? "animate-breathe" : "scale-75"}`}>
          <span className="text-sm font-medium text-accent-foreground">{on ? (phase === 0 ? "Breathe in…" : "Breathe out…") : "Ready"}</span>
        </div>
      </div>
      <Button className="rounded-full" variant={on ? "outline" : "default"} onClick={() => { setPhase(0); setOn(!on); }}>{on ? "Stop" : "Start 1-minute breathing"}</Button>
    </div>
  );
}

const LESSONS = [
  { icon: Brain, title: "Active recall", body: "Close your notes and write or say what you remember. Then check. Retrieving info strengthens memory far more than re-reading." },
  { icon: ListOrdered, title: "Prioritization", body: "Rank topics by how likely they appear and how weak you are. Likely + weak first. Don't try to perfect everything." },
  { icon: Puzzle, title: "Break it down", body: "Turn 'study chapter 5' into tiny actions: open the book, read the summary, write 3 questions. Small steps beat big intentions." },
];

export function Lessons() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {LESSONS.map(({ icon: Icon, title, body }) => (
        <div key={title} className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="mb-3 grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Icon className="size-5" /></div>
          <h3 className="mb-1 text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}
