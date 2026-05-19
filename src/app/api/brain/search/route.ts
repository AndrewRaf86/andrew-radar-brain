import { NextResponse } from "next/server";
import { detectBrainCategory, type BrainCategory } from "@/lib/brainRouter";
import { searchBrainKnowledge } from "@/lib/brainSearch";

export async function POST(request: Request) {
  const body = await readJson(request);
  const query = typeof body?.query === "string" ? body.query : "";

  if (!query.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing query" },
      { status: 400 },
    );
  }

  const category =
    typeof body?.category === "string"
      ? normalizeCategory(body.category)
      : detectBrainCategory(query);
  const result = await searchBrainKnowledge({ query, category });

  return NextResponse.json({
    ok: true,
    answer: result.answer,
    matchedVideos: result.matchedVideos,
    category: result.category,
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

function normalizeCategory(value: string): BrainCategory {
  if (
    value === "AI Brain" ||
    value === "Dating Brain" ||
    value === "Fitness/Food Brain" ||
    value === "General"
  ) {
    return value;
  }
  return detectBrainCategory(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
