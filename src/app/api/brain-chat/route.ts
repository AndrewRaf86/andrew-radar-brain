import { NextResponse } from "next/server";
import {
  generateMockChatResponse,
  type BrainMode,
  type ChatIntent,
} from "@/lib/brainChat";

const brainModes: BrainMode[] = [
  "Auto",
  "AI Brain",
  "Dating Brain",
  "Fitness/Food Brain",
  "General Signal",
];

const intents: ChatIntent[] = [
  "Ask",
  "Analyze",
  "Save",
  "Action Plan",
  "Rewrite Reply",
];

export async function POST(request: Request) {
  const body = await readJson(request);
  const text = typeof body?.text === "string" ? body.text : "";

  if (!text.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing text" },
      { status: 400 },
    );
  }

  const selectedBrain = normalizeBrain(body?.selectedBrain);
  const intent = normalizeIntent(body?.intent);
  const imageName =
    typeof body?.imageName === "string" ? body.imageName : undefined;
  const response = generateMockChatResponse({
    text,
    selectedBrain,
    intent,
    imageName,
  });

  return NextResponse.json({
    ok: true,
    brainUsed: response.brainUsed,
    response,
  });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return isRecord(body) ? body : null;
  } catch {
    return null;
  }
}

function normalizeBrain(value: unknown): BrainMode {
  return typeof value === "string" && brainModes.includes(value as BrainMode)
    ? (value as BrainMode)
    : "Auto";
}

function normalizeIntent(value: unknown): ChatIntent {
  return typeof value === "string" && intents.includes(value as ChatIntent)
    ? (value as ChatIntent)
    : "Ask";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
