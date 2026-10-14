// ExamEase service layer. Currently mock-only; set VITE_API_URL to route to a future Express backend.
const API_URL = import.meta.env["VITE_API_URL"] as string | undefined;

export type Mood = "stressed" | "anxious" | "overwhelmed" | "tired" | "frustrated" | "okay";
export interface ChatMessage { role: "user" | "assistant"; content: string }
export interface ChatReply { content: string; quickReplies: string[] }
export interface PlanInput { subject: string; hoursLeft: number; topics: string[] }
export interface PlanSession { id: string; title: string; minutes: number; kind: "study" | "break" | "review" }
export interface StudyPlan { sessions: PlanSession[]; why: string }

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

const has = (t: string, ...w: string[]) => w.some((x) => t.includes(x));

function mockReply(text: string, mood?: Mood): ChatReply {
  const t = text.toLowerCase();
  if (has(t, "panic", "scared", "anxious", "heart"))
    return {
      content:
        "That panicky feeling is real, and it makes sense — your brain is trying to protect something that matters to you. Panic often shows up even when there's time, because it reacts to uncertainty, not the calendar.\n\nLet's slow things down first. Would you like to try a 1‑minute breathing exercise, or tell me what thought keeps looping?",
      quickReplies: ["Try breathing", "The thought is 'I'll fail'", "How much time do I really have?"],
    };
  if (has(t, "breath"))
    return {
      content:
        "Let's try box breathing: breathe in for 4, hold for 4, out for 4, hold for 4. Do it 4 times. You can also open the Breathe tool below for a guided version. How do you feel afterwards?",
      quickReplies: ["A bit calmer", "Still tense", "What next?"],
    };
  if (has(t, "fail", "stupid", "not good"))
    return {
      content:
        "'I'll fail' is a thought, not a fact — and it's a very loud one under stress. What's one piece of evidence that you've handled something hard before?\n\nWe don't need to fix everything; we just need one next step.",
      quickReplies: ["I passed tough exams before", "I can't think of any", "Help me pick a next step"],
    };
  if (has(t, "haven't finished", "not finished", "behind", "too much", "syllabus"))
    return {
      content:
        "Being behind feels heavy, but it's a really common place to be. Let's get clear rather than do everything. Roughly how many topics are left, and how many days until the exam?\n\nIf you'd like, the Study Planner can turn that into short, realistic sessions.",
      quickReplies: ["About 5 topics, 3 days", "How do I prioritize?", "Open the planner"],
    };
  if (has(t, "prioriti"))
    return {
      content:
        "A quick way to prioritize: for each topic ask (1) how likely is it on the exam, and (2) how weak am I at it? High‑likely + weak goes first. Low‑likely + strong can wait or get a quick skim.\n\nWant to list your topics and sort them together?",
      quickReplies: ["Let's sort them", "Teach me active recall", "Thanks, that helps"],
    };
  if (has(t, "focus", "distract", "phone"))
    return {
      content:
        "Focus isn't a personality trait — it's mostly about environment and task size. Two things that help: put your phone in another room, and make the task tiny (\"read 2 pages\" instead of \"study chapter 4\").\n\nWhat usually pulls you away?",
      quickReplies: ["My phone", "My thoughts wander", "I'm just tired"],
    };
  if (has(t, "procrastinat", "start", "lazy"))
    return {
      content:
        "Procrastination usually isn't laziness — it's often avoiding an uncomfortable feeling the task brings up. Try the 5‑minute rule: commit to just 5 minutes. Stopping after is allowed.\n\nWhat's the smallest version of the task you're avoiding?",
      quickReplies: ["Open my notes", "Do one practice question", "Break a task into steps"],
    };
  if (has(t, "step", "break"))
    return {
      content:
        "Let's break it down. Take your big task and ask: \"What's the very first physical action?\" e.g. Revise Biology → open textbook to Ch. 3 → read the summary → write 3 questions from memory.\n\nWhat's the big task on your mind?",
      quickReplies: ["Revise a whole chapter", "Finish an assignment", "Teach me active recall"],
    };
  if (has(t, "recall", "remember", "memor"))
    return {
      content:
        "Active recall means pulling info out of your memory instead of re‑reading it. Close your notes, write what you remember, then check gaps. It feels harder — that's exactly why it works.\n\nWant to try it on one topic right now?",
      quickReplies: ["Yes, let's try", "Maybe later", "Make me a plan"],
    };
  if (has(t, "tired", "exhausted", "sleep"))
    return {
      content:
        "Being tired makes everything feel harder, including your emotions. Rest is part of studying, not the opposite of it. Have you had a proper break or sleep recently?",
      quickReplies: ["Not really", "I feel guilty resting", "I slept okay"],
    };
  if (has(t, "guilty"))
    return {
      content:
        "That guilt is understandable, but a rested brain learns and remembers better. A 20‑minute break now is an investment, not a loss. What kind of break would actually feel good?",
      quickReplies: ["A short walk", "A snack and water", "Back to studying"],
    };
  if (has(t, "listen", "vent", "talk"))
    return {
      content:
        "I'm here, and there's no rush. You can say whatever's on your mind — no judgment, no fixing unless you want it. What's been weighing on you?",
      quickReplies: ["Everything feels like too much", "I'm scared of disappointing people", "I don't know"],
    };
  if (has(t, "disappoint", "parents", "family"))
    return {
      content:
        "That's a lot of pressure to carry. Wanting to make people proud shows you care. Your worth isn't your score, though. Would it help to talk about what they actually expect, or what you expect of yourself?",
      quickReplies: ["What I expect of myself", "I just needed to say it", "Thanks for listening"],
    };
  if (has(t, "thank", "calmer", "helps", "better"))
    return {
      content: "I'm really glad. Remember: one small step at a time is enough. Want to set a next step, or just take a breather?",
      quickReplies: ["Set a next step", "Take a breather", "Make me a plan"],
    };
  const moodLine = mood && mood !== "okay" ? `It sounds like you're feeling ${mood}. ` : "";
  return {
    content: `${moodLine}Thanks for sharing that with me. Can you tell me a little more about what's going on — is it more about how you feel, or about what to study?`,
    quickReplies: ["It's how I feel", "It's what to study", "I can't focus"],
  };
}

export async function sendMessage(history: ChatMessage[], mood?: Mood): Promise<ChatReply> {
  if (API_URL) return post<ChatReply>("/chat", { history, mood });
  await wait(700 + Math.random() * 600);
  const last = history[history.length - 1]?.content ?? "";
  return mockReply(last, mood);
}

export async function generatePlan(input: PlanInput): Promise<StudyPlan> {
  if (API_URL) return post<StudyPlan>("/plan", input);
  await wait(900);
  if (!input.subject.trim() || input.topics.length === 0) throw new Error("Please add a subject and at least one topic.");
  const budget = Math.max(30, Math.min(input.hoursLeft * 60, 6 * 60));
  const per = Math.max(20, Math.min(40, Math.floor(budget / input.topics.length / 1.3)));
  const sessions: PlanSession[] = [];
  let used = 0;
  let i = 0;
  for (const topic of input.topics) {
    if (used + per > budget) break;
    sessions.push({ id: `s${i++}`, title: `${input.subject}: ${topic}`, minutes: per, kind: "study" });
    used += per;
    if (used + 5 <= budget) { sessions.push({ id: `s${i++}`, title: "Break — water, stretch, no phone", minutes: sessions.length % 6 === 5 ? 15 : 5, kind: "break" }); used += 5; }
  }
  if (used + 15 <= budget) sessions.push({ id: `s${i++}`, title: "Active recall: write what you remember, check gaps", minutes: 15, kind: "review" });
  const skipped = input.topics.length - sessions.filter((s) => s.kind === "study").length;
  return {
    sessions,
    why:
      `Short ${per}-minute focus blocks keep your attention fresh, and regular breaks help memory settle. Ending with active recall shows you what actually stuck. ` +
      (skipped > 0 ? `${skipped} topic(s) didn't fit — prioritize the most likely, weakest ones first and skim the rest.` : "Everything fits — feel free to edit times to match your energy."),
  };
}
