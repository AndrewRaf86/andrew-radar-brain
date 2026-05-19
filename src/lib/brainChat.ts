export type BrainMode =
  | "Auto"
  | "AI Brain"
  | "Dating Brain"
  | "Health/Fitness/Food Brain"
  | "General Signal";

export type ChatIntent =
  | "Ask"
  | "Analyze"
  | "Save"
  | "Action Plan"
  | "Rewrite Reply";

export type BrainMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  brainMode: BrainMode;
  intent: ChatIntent;
  createdAt: string;
  imageName?: string;
  imagePreviewUrl?: string;
  priority?: number;
};

export type BrainChatResponse = {
  brainUsed: BrainMode;
  response: string;
  shortAnswer: string;
  whatItMeans: string;
  recommendedNextMove: string;
  suggestedReply?: string;
  savedNotePreview: string;
  priority: number;
};

const STORAGE_KEY = "andrew-radar-brain-chat";

const aiTerms = [
  "claude",
  "codex",
  "automation",
  "ai",
  "agents",
  "vercel",
  "supabase",
  "n8n",
  "youtube transcripts",
  "prompts",
  "workflow",
  "api",
  "coding",
  "app",
  "dashboard",
  "business idea",
  "saas",
  "client",
  "website",
  "agent",
];

const datingTerms = [
  "girl",
  "dating",
  "bumble",
  "tinder",
  "whatsapp",
  "message",
  "attraction",
  "date",
  "girlfriend",
  "text",
  "spanish reply",
  "kiss",
  "relationship",
  "flirty",
  "reply",
  "woman",
];

const fitnessTerms = [
  "workout",
  "health",
  "fitness",
  "food",
  "protein",
  "gut",
  "boxing",
  "recipe",
  "supplement",
  "meal",
  "diet",
  "sleep",
  "recovery",
  "calories",
  "muscle",
  "fat loss",
  "stomach",
  "digestion",
  "soreness",
  "nutrition",
  "cooking",
  "mobility",
  "pain",
  "training",
  "conditioning",
  "longevity",
  "hormones",
  "peptides",
  "meal prep",
  "high protein",
  "footwork",
  "cardio",
];

export function detectBrainMode(
  text: string,
  selectedBrain: BrainMode = "Auto",
): BrainMode {
  if (selectedBrain !== "Auto" && selectedBrain !== "General Signal") {
    return selectedBrain;
  }

  const normalized = text.toLowerCase();
  if (aiTerms.some((term) => normalized.includes(term))) return "AI Brain";
  if (datingTerms.some((term) => normalized.includes(term))) return "Dating Brain";
  if (fitnessTerms.some((term) => normalized.includes(term))) {
    return "Health/Fitness/Food Brain";
  }

  return "General Signal";
}

export function generateMockChatResponse({
  text,
  selectedBrain = "Auto",
  intent = "Ask",
  imageName,
}: {
  text: string;
  selectedBrain?: BrainMode;
  intent?: ChatIntent;
  imageName?: string;
}): BrainChatResponse {
  const brainUsed = detectBrainMode(text, selectedBrain);
  const summary = summarize(text);
  const priority = scorePriority(text, intent, brainUsed, imageName);
  const maybeImageNote = imageName
    ? ` I see the attached file name "${imageName}", but image understanding is mocked until a vision API is connected.`
    : "";

  if (brainUsed === "AI Brain") {
    const shortAnswer =
      "Useful signal, but only if it becomes a repeatable workflow instead of another shiny tool.";
    const whatItMeans =
      "This belongs in the AI Brain as a possible system: capture input, transform it, save the output, and decide the next action. If it touches Codex, Claude, Vercel, Supabase, n8n, NotebookLM, YouTube transcripts, or your local Mac workflow, the key question is whether it reduces repeated work.";
    const recommendedNextMove =
      intent === "Action Plan"
        ? "Write the smallest manual version first: one input, one output, one place to save it, and one success check."
        : "Save the idea, test it once manually, and ignore any platform setup until the workflow proves useful.";
    return {
      brainUsed,
      response: [
        `Brain used: ${brainUsed}.`,
        shortAnswer,
        whatItMeans,
        recommendedNextMove,
        `Saved note preview: ${summary}`,
        `Priority: ${priority}/5.`,
        maybeImageNote.trim(),
      ]
        .filter(Boolean)
        .join("\n\n"),
      shortAnswer,
      whatItMeans,
      recommendedNextMove,
      savedNotePreview: summary,
      priority,
    };
  }

  if (brainUsed === "Dating Brain") {
    const includesSpanish = hasSpanishSignal(text);
    const shortAnswer =
      "The move is to stay warm, direct, and relaxed without trying to over-explain yourself.";
    const whatItMeans =
      "This looks like a dating or messaging signal. The useful read is probably about pace, interest, and tone. Do not chase certainty from one message; make the next step easy and let her effort tell you more.";
    const suggestedReply = includesSpanish
      ? "Jaja me gusta esa energia. Hagamos algo simple esta semana, dime que dia te viene mejor."
      : "Haha I like that. Let us keep it simple: drinks this week. What night works for you?";
    const recommendedNextMove =
      intent === "Rewrite Reply"
        ? "Send a short confident reply with one clear next step, then stop there."
        : "Match effort, keep the tone light, and do not stack follow-ups if she has not responded.";
    return {
      brainUsed,
      response: [
        `Brain used: ${brainUsed}.`,
        shortAnswer,
        whatItMeans,
        `Suggested reply: ${suggestedReply}`,
        includesSpanish
          ? "English translation: Haha I like that energy. Let us do something simple this week; tell me which day works better for you."
          : "",
        recommendedNextMove,
        `Saved note preview: ${summary}`,
        `Priority: ${priority}/5.`,
        maybeImageNote.trim(),
      ]
        .filter(Boolean)
        .join("\n\n"),
      shortAnswer,
      whatItMeans,
      recommendedNextMove,
      suggestedReply,
      savedNotePreview: summary,
      priority,
    };
  }

  if (brainUsed === "Health/Fitness/Food Brain") {
    const shortAnswer =
      "Make this practical: one food choice, one training choice, or one recovery choice for the next 24 hours.";
    const whatItMeans =
      "This belongs in the Health/Fitness/Food Brain if it changes behavior around protein, sleep, boxing, workouts, gut health, calories, recovery, or supplements. Do not treat it like a diagnosis. If it is a health concern, confirm with a doctor.";
    const recommendedNextMove =
      intent === "Action Plan"
        ? "Pick one next action: prep a protein anchor, adjust the workout, improve sleep, or remove the supplement/noise for now."
        : "Turn the note into a realistic next step you can do today, then watch energy, digestion, soreness, and consistency.";
    return {
      brainUsed,
      response: [
        `Brain used: ${brainUsed}.`,
        shortAnswer,
        whatItMeans,
        recommendedNextMove,
        `Saved note preview: ${summary}`,
        `Priority: ${priority}/5.`,
        maybeImageNote.trim(),
      ]
        .filter(Boolean)
        .join("\n\n"),
      shortAnswer,
      whatItMeans,
      recommendedNextMove,
      savedNotePreview: summary,
      priority,
    };
  }

  const shortAnswer =
    "This is a general signal for now. Save it lightly and wait for a clearer pattern.";
  const whatItMeans =
    "It does not strongly map to AI, Dating, or Health/Fitness/Food yet. That is fine. The job is to keep the note without letting it become mental clutter.";
  const recommendedNextMove =
    "Add one sentence about why it might matter, then only revisit it if it connects to a decision or repeated pattern.";

  return {
    brainUsed,
    response: [
      `Brain used: ${brainUsed}.`,
      shortAnswer,
      whatItMeans,
      recommendedNextMove,
      `Saved note preview: ${summary}`,
      `Priority: ${priority}/5.`,
      maybeImageNote.trim(),
    ]
      .filter(Boolean)
      .join("\n\n"),
    shortAnswer,
    whatItMeans,
    recommendedNextMove,
    savedNotePreview: summary,
    priority,
  };
}

export function saveChatLocal(messages: BrainMessage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
}

export function getChatLocal(): BrainMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearChatLocal() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function summarize(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return "Empty signal";
  if (compact.length <= 170) return compact;
  return `${compact.slice(0, 167)}...`;
}

function scorePriority(
  text: string,
  intent: ChatIntent,
  brainUsed: BrainMode,
  imageName?: string,
) {
  let score = brainUsed === "General Signal" ? 2 : 3;
  const normalized = text.toLowerCase();

  if (intent === "Action Plan" || intent === "Rewrite Reply") score += 1;
  if (imageName) score += 1;
  if (
    normalized.includes("today") ||
    normalized.includes("this week") ||
    normalized.includes("urgent") ||
    normalized.includes("decision")
  ) {
    score += 1;
  }

  return Math.min(5, Math.max(1, score));
}

function hasSpanishSignal(text: string) {
  const normalized = text.toLowerCase();
  return (
    normalized.includes("spanish") ||
    normalized.includes("hola") ||
    normalized.includes("jaja") ||
    normalized.includes("que ") ||
    normalized.includes("cómo") ||
    normalized.includes("como estas") ||
    normalized.includes("gracias")
  );
}
