import { NextResponse } from "next/server";
import { saveYouTubeVideoManual } from "@/lib/youtubeKnowledge";
import { detectBrainCategory, type BrainCategory } from "@/lib/brainRouter";

export function GET() {
  return NextResponse.json({
    ok: true,
    description: "POST a JSON body to save one YouTube video into youtube_videos.",
    example: {
      channel_name: "The AI Advantage",
      title: "Example video",
      url: "https://www.youtube.com/watch?v=test123",
      category: "AI Brain",
      transcript: "optional transcript text",
      summary: "optional summary text",
      takeaways: ["point one", "point two"],
      action_items: ["action one"],
    },
    curl: `curl -X POST https://andrew-radar-brain.vercel.app/api/youtube/manual-add \\
  -H "content-type: application/json" \\
  -d '{"channel_name":"The AI Advantage","title":"Example video","url":"https://www.youtube.com/watch?v=test123","category":"AI Brain","summary":"Useful notes"}'`,
  });
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const url = typeof body?.url === "string" ? body.url.trim() : "";

  if (!title || !url) {
    return NextResponse.json(
      { ok: false, saved: false, error: "Missing required title or url." },
      { status: 400 },
    );
  }

  const category =
    typeof body?.category === "string"
      ? normalizeCategory(body.category)
      : detectBrainCategory(`${title} ${body?.summary ?? ""} ${body?.transcript ?? ""}`);

  try {
    const result = await saveYouTubeVideoManual({
      yt_video_id: typeof body?.yt_video_id === "string" ? body.yt_video_id : undefined,
      channel_name:
        typeof body?.channel_name === "string" ? body.channel_name : undefined,
      title,
      url,
      category,
      transcript: typeof body?.transcript === "string" ? body.transcript : undefined,
      summary: typeof body?.summary === "string" ? body.summary : undefined,
      takeaways: stringArrayOrUndefined(body?.takeaways),
      action_items: stringArrayOrUndefined(body?.action_items),
      published_at:
        typeof body?.published_at === "string" ? body.published_at : undefined,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("manual youtube add failed", error);
    return NextResponse.json(
      {
        ok: false,
        saved: false,
        error: error instanceof Error ? error.message : "Manual add failed.",
      },
      { status: 500 },
    );
  }
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
    value === "Health/Fitness/Food Brain" ||
    value === "General"
  ) {
    return value;
  }
  return detectBrainCategory(value);
}

function stringArrayOrUndefined(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
