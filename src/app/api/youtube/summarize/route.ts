import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateMockTranscriptSummary } from "@/lib/youtubeIngestion";

export async function POST(request: Request) {
  const body = await readJson(request);
  const videoId = typeof body?.videoId === "string" ? body.videoId : "";
  const transcript = typeof body?.transcript === "string" ? body.transcript : undefined;
  const notes = typeof body?.notes === "string" ? body.notes : undefined;
  const category = typeof body?.category === "string" ? body.category : undefined;
  const title = typeof body?.title === "string" ? body.title : "YouTube video";

  const generated = generateMockTranscriptSummary({
    title,
    transcript,
    notes,
    category,
  });

  if (
    videoId &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    supabase
  ) {
    await supabase
      .from("youtube_videos")
      .update({
        transcript,
        transcript_status: transcript ? "manual" : "missing",
        summary: generated.summary,
        key_takeaways: generated.key_takeaways,
        action_items: generated.action_items,
        summary_status: "mock",
        category: generated.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", videoId);
  }

  return NextResponse.json({ ok: true, videoId, ...generated });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return isRecord(body) ? body : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
