import { NextResponse } from "next/server";
import { saveYouTubeVideoManual } from "@/lib/youtubeKnowledge";

export async function GET() {
  try {
    const result = await saveYouTubeVideoManual({
      title: "Test AI workflow video",
      channel_name: "Andrew Test",
      url: "https://www.youtube.com/watch?v=test-ai-workflow",
      category: "AI Brain",
      summary:
        "This test video says useful AI systems should start with one repeatable workflow before automation.",
      takeaways: [
        "Build the workflow manually first",
        "Automate only after the pattern repeats",
      ],
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("test youtube add failed", error);
    return NextResponse.json(
      {
        ok: false,
        saved: false,
        error: error instanceof Error ? error.message : "Test add failed.",
      },
      { status: 500 },
    );
  }
}
