import { NextResponse } from "next/server";
import { generateMockChatResponse } from "@/lib/brainChat";

export async function POST(request: Request) {
  const payload = await readJson(request);
  const text = extractTelegramText(payload);

  if (!text) {
    return NextResponse.json({
      ok: true,
      brainUsed: "General Signal",
      response: null,
      note: "Telegram response sending is not active yet.",
    });
  }

  const response = generateMockChatResponse({
    text,
    selectedBrain: "Auto",
    intent: "Ask",
  });

  return NextResponse.json({
    ok: true,
    brainUsed: response.brainUsed,
    response,
    note: "Telegram response sending is not active yet.",
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

function extractTelegramText(payload: Record<string, unknown> | null) {
  const message = getRecord(payload, "message") ?? getRecord(payload, "edited_message");
  const text = getString(message, "text") ?? getString(message, "caption");
  return text?.trim() || "";
}

function getRecord(parent: Record<string, unknown> | null, key: string) {
  if (!parent) return null;
  const value = parent[key];
  return isRecord(value) ? value : null;
}

function getString(parent: Record<string, unknown> | null, key: string) {
  if (!parent) return null;
  const value = parent[key];
  return typeof value === "string" ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
