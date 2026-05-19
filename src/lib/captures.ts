import type {
  BrainResponse,
  Capture,
  CaptureCategory,
  CaptureInputCategory,
  CaptureIntent,
} from "@/lib/types";

const STORAGE_KEY = "andrew-radar-brain-captures";

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
];

const datingTerms = [
  "girl",
  "dating",
  "bumble",
  "whatsapp",
  "message",
  "attraction",
  "date",
  "girlfriend",
  "text",
  "spanish reply",
  "kiss",
  "relationship",
];

const fitnessTerms = [
  "workout",
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
];

export function classifyCapture(
  input: string,
  selectedCategory: CaptureInputCategory = "Auto",
): CaptureCategory {
  if (selectedCategory !== "Auto") return selectedCategory;

  const text = input.toLowerCase();
  if (aiTerms.some((term) => text.includes(term))) return "AI Brain";
  if (datingTerms.some((term) => text.includes(term))) return "Dating Brain";
  if (fitnessTerms.some((term) => text.includes(term))) return "Health/Fitness/Food Brain";
  return "General Signal";
}

export function generateMockBrainResponse({
  input,
  intent,
  selectedCategory = "Auto",
}: {
  input: string;
  intent: CaptureIntent;
  selectedCategory?: CaptureInputCategory;
}): BrainResponse {
  const detectedCategory = classifyCapture(input, selectedCategory);
  const summary = summarizeInput(input);
  const priority = scorePriority(input, intent, detectedCategory);

  const responseByCategory: Record<
    CaptureCategory,
    Pick<BrainResponse, "meaning" | "recommendedAction">
  > = {
    "AI Brain": {
      meaning:
        "This looks like a tool, workflow, automation, or business-building signal. It probably belongs in the AI operating system only if it creates a repeatable workflow.",
      recommendedAction:
        intent === "Create action plan"
          ? "Turn it into one small test with an input, output, and success check."
          : "Save the pattern, decide whether it is useful this week, and avoid adding infrastructure before the manual version is clear.",
    },
    "Dating Brain": {
      meaning:
        "This looks like a communication, attraction, relationship, or field-notes signal. The useful part is the behavioral pattern, not over-analysis.",
      recommendedAction:
        intent === "Analyze message"
          ? "Write the shortest calm reply that moves the interaction forward, then watch the response."
          : "Convert it into one simple reminder about pace, standards, or clear leadership.",
    },
    "Health/Fitness/Food Brain": {
      meaning:
        "This looks like a training, food, gut health, recovery, or body-composition signal. It matters if it changes this week's behavior.",
      recommendedAction:
        "Turn it into one repeatable action for the next seven days: a meal, workout block, recovery habit, or thing to ignore.",
    },
    "General Signal": {
      meaning:
        "This does not strongly match one brain yet. Treat it as a loose note until a clearer pattern appears.",
      recommendedAction:
        "Save it lightly, add one sentence about why it matters, and revisit it only if it connects to a real decision.",
    },
  };

  return {
    detectedCategory,
    meaning: responseByCategory[detectedCategory].meaning,
    recommendedAction: responseByCategory[detectedCategory].recommendedAction,
    savedNotePreview: `${intent}: ${summary}`,
    priority,
  };
}

export function saveCaptureLocal({
  input,
  intent,
  selectedCategory = "Auto",
}: {
  input: string;
  intent: CaptureIntent;
  selectedCategory?: CaptureInputCategory;
}): Capture {
  const brainResponse = generateMockBrainResponse({
    input,
    intent,
    selectedCategory,
  });

  const capture: Capture = {
    id: crypto.randomUUID(),
    title: createTitle(input),
    category: brainResponse.detectedCategory,
    intent,
    rawInput: input,
    summary: summarizeInput(input),
    response: `${brainResponse.meaning} ${brainResponse.recommendedAction}`,
    priority: brainResponse.priority,
    sourceType: detectSourceType(input),
    createdAt: new Date().toISOString(),
  };

  const captures = getCapturesLocal();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([capture, ...captures].slice(0, 50)),
  );

  return capture;
}

export function getCapturesLocal(): Capture[] {
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

function summarizeInput(input: string) {
  const compact = input.replace(/\s+/g, " ").trim();
  if (compact.length <= 150) return compact;
  return `${compact.slice(0, 147)}...`;
}

function createTitle(input: string) {
  const compact = input.replace(/\s+/g, " ").trim();
  const firstLine = compact.split(/[.!?\n]/)[0] || "Untitled signal";
  if (firstLine.length <= 70) return firstLine;
  return `${firstLine.slice(0, 67)}...`;
}

function detectSourceType(input: string) {
  const text = input.toLowerCase();
  if (text.includes("youtube.com") || text.includes("youtu.be")) return "youtube";
  if (text.includes("screenshot")) return "screenshot-context";
  if (text.includes("whatsapp") || text.includes("message")) return "message";
  return "manual-note";
}

function scorePriority(
  input: string,
  intent: CaptureIntent,
  category: CaptureCategory,
) {
  let score = 2;
  const text = input.toLowerCase();

  if (intent === "Create action plan" || intent === "Analyze message") score += 1;
  if (text.includes("today") || text.includes("this week") || text.includes("urgent")) {
    score += 1;
  }
  if (category !== "General Signal") score += 1;

  return Math.min(5, Math.max(1, score));
}
