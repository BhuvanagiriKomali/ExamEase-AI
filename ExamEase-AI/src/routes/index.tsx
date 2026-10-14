import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Companion, STARTERS } from "@/components/exam/Companion";
import { Planner } from "@/components/exam/Planner";
import { Breathing, Lessons } from "@/components/exam/Learn";
import type { Mood } from "@/services/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExamEase AI — Your Study Friend, Guide & Teacher" },
      { name: "description", content: "Manage exam stress, beat procrastination and plan realistic study sessions with a supportive AI companion." },
      { property: "og:title", content: "ExamEase AI — Your Study Friend, Guide & Teacher" },
      { property: "og:description", content: "Understand your feelings. Learn your way forward." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MOODS: { id: Mood; emoji: string }[] = [
  { id: "stressed", emoji: "😣" }, { id: "anxious", emoji: "😟" }, { id: "overwhelmed", emoji: "🌊" },
  { id: "tired", emoji: "😴" }, { id: "frustrated", emoji: "😤" }, { id: "okay", emoji: "🙂" },
];

function Index() {
  const [mood, setMood] = useState<Mood>();
  const [seed, setSeed] = useState<{ text: string; n: number }>();
  const chatRef = useRef<HTMLElement>(null);
  const planRef = useRef<HTMLElement>(null);
  const go = (r: React.RefObject<HTMLElement | null>) => r.current?.scrollIntoView({ behavior: "smooth" });
  const start = (text: string) => { setSeed((s) => ({ text, n: (s?.n ?? 0) + 1 })); go(chatRef); };

  return (
    <main className="min-h-screen">
      <section className="bg-hero px-4 pb-16 pt-10">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-14 flex items-center gap-2 font-display text-xl font-semibold"><Sparkles className="size-5 text-primary" /> ExamEase AI</nav>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Your study friend, guide & teacher</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Exams are hard. You don't have to figure it all out at once.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Understand your feelings. Learn your way forward.</p>

          <div className="mt-10">
            <p className="mb-3 text-sm font-medium">How are you feeling right now?</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m.id} onClick={() => { setMood(m.id); start(`I'm feeling ${m.id}`); }}
                  className={`rounded-full border px-4 py-2 text-sm capitalize transition ${mood === m.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}>
                  {m.emoji} {m.id}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => start(s)} className="rounded-2xl border bg-card p-4 text-left text-sm font-medium shadow-soft transition hover:-translate-y-0.5 hover:bg-accent">
                {s} →
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={chatRef} className="mx-auto grid max-w-6xl gap-6 px-4 py-14 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-4 text-3xl font-semibold">Talk it through</h2>
          <Companion mood={mood} seed={seed} onOpenPlanner={() => go(planRef)} />
        </div>
        <div className="lg:pt-14"><Breathing /></div>
      </section>

      <section ref={planRef} className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-1 text-3xl font-semibold">Study planner</h2>
        <p className="mb-6 text-muted-foreground">Short sessions, real breaks, and a plan you can change.</p>
        <Planner />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-3xl font-semibold">Quick lessons</h2>
        <Lessons />
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-muted-foreground">
        ExamEase is a study support tool, not a substitute for professional mental-health care. If you're in crisis, please reach out to a trusted adult, counselor, or local helpline.
      </footer>
    </main>
  );
}
