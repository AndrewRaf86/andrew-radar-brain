export type BrainCategory =
  | "AI Brain"
  | "Dating Brain"
  | "Fitness/Food Brain"
  | "General";

const aiTerms = [
  "ai",
  "claude",
  "codex",
  "automation",
  "agent",
  "agents",
  "n8n",
  "supabase",
  "vercel",
  "api",
  "workflow",
  "business idea",
  "youtube transcript",
  "dashboard",
  "app",
  "coding",
  "prompt",
];

const datingTerms = [
  "girl",
  "dating",
  "bumble",
  "tinder",
  "whatsapp",
  "message",
  "date",
  "kiss",
  "attraction",
  "girlfriend",
  "spanish reply",
  "text her",
  "reply to her",
];

const fitnessTerms = [
  "workout",
  "gym",
  "boxing",
  "protein",
  "calories",
  "supplement",
  "gut",
  "food",
  "recipe",
  "meal",
  "recovery",
  "sleep",
  "fat loss",
  "muscle",
  "stomach",
  "diet",
];

export function detectBrainCategory(input: string): BrainCategory {
  const text = input.toLowerCase();
  if (aiTerms.some((term) => text.includes(term))) return "AI Brain";
  if (datingTerms.some((term) => text.includes(term))) return "Dating Brain";
  if (fitnessTerms.some((term) => text.includes(term))) return "Fitness/Food Brain";
  return "General";
}

export function generateBrainReply(
  input: string,
  category: BrainCategory = detectBrainCategory(input),
): string {
  const compact = input.replace(/\s+/g, " ").trim();

  if (category === "AI Brain") {
    return [
      "AI Brain:",
      "This is useful if it becomes a repeatable system, not just another tool to collect.",
      "Build the smallest version first: one input, one output, one place to save it, and one review step.",
      "Next action: write the manual workflow in 5 bullets before adding automation.",
    ].join("\n");
  }

  if (category === "Dating Brain") {
    const spanish = hasSpanishSignal(compact);
    return [
      "Dating Brain:",
      "This probably needs a calm, confident reply rather than extra explanation.",
      "Read it as a signal of interest, uncertainty, or playfulness, then move the interaction forward without chasing.",
      spanish
        ? "Reply option: Jaja me gusta esa energia. Hagamos algo simple esta semana, dime que dia te viene mejor."
        : "Reply option: Haha I like that. Let us keep it simple: drinks this week. What night works for you?",
      spanish
        ? "English: Haha I like that energy. Let us do something simple this week; tell me which day works better for you."
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (category === "Fitness/Food Brain") {
    return [
      "Fitness/Food Brain:",
      "Make this practical for the next 24 hours.",
      "Prioritize protein, sleep, recovery, boxing/training quality, and simple food choices before supplements or complicated protocols.",
      "Next action: choose one meal or workout adjustment you can actually do today.",
      "If this is a medical concern or persistent symptom, confirm with a doctor.",
    ].join("\n");
  }

  return [
    "General:",
    "Short answer: save the signal, but do not overthink it yet.",
    "Next action: tell me the category or the decision you are trying to make, and I will route it better.",
  ].join("\n");
}

function hasSpanishSignal(input: string) {
  const text = input.toLowerCase();
  return (
    text.includes("spanish") ||
    text.includes("hola") ||
    text.includes("jaja") ||
    text.includes("que ") ||
    text.includes("cómo") ||
    text.includes("gracias")
  );
}
