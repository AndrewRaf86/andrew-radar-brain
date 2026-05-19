export type YouTubeBrainCategory =
  | "AI Brain"
  | "Dating Brain"
  | "Fitness/Food Brain";

export type YouTubeChannel = {
  id?: string;
  name: string;
  yt_channel_id: string;
  channel_url?: string;
  category: YouTubeBrainCategory;
  priority?: number;
  is_active?: boolean;
};

export type YouTubeVideo = {
  yt_video_id: string;
  title: string;
  url: string;
  channel_name?: string;
  category?: YouTubeBrainCategory;
  published_at?: string;
};

export function extractYouTubeChannelId(input: string): string | null {
  const trimmed = input.trim();
  if (/^UC[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;

  const channelMatch = trimmed.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/);
  if (channelMatch?.[1]) return channelMatch[1];

  const feedMatch = trimmed.match(/[?&]channel_id=(UC[a-zA-Z0-9_-]+)/);
  if (feedMatch?.[1]) return feedMatch[1];

  return null;
}

export function getYouTubeRssUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

export function parseYouTubeRssFeed(xml: string): YouTubeVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries.map((entry) => {
    const ytVideoId = readTag(entry, "yt:videoId") ?? "";
    const title = decodeXml(readTag(entry, "title") ?? "Untitled video");
    const channelName = decodeXml(readTag(entry, "name") ?? "");
    const publishedAt = readTag(entry, "published") ?? undefined;
    const link = entry.match(/<link[^>]+href="([^"]+)"/)?.[1];

    return {
      yt_video_id: ytVideoId,
      title,
      url: link ?? `https://www.youtube.com/watch?v=${ytVideoId}`,
      channel_name: channelName,
      published_at: publishedAt,
      category: classifyVideoText(`${title} ${channelName}`),
    };
  });
}

export function classifyVideoText(input: string): YouTubeBrainCategory {
  const text = input.toLowerCase();
  if (
    /dating|bumble|tinder|whatsapp|attraction|girlfriend|text|reply|kiss|relationship/.test(
      text,
    )
  ) {
    return "Dating Brain";
  }
  if (
    /workout|gym|boxing|protein|calories|supplement|gut|food|recipe|meal|recovery|sleep|fat loss|muscle|stomach|diet/.test(
      text,
    )
  ) {
    return "Fitness/Food Brain";
  }
  return "AI Brain";
}

export function chunkTranscript(transcript: string, maxChars = 3000): string[] {
  const clean = transcript.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const chunks: string[] = [];
  for (let index = 0; index < clean.length; index += maxChars) {
    chunks.push(clean.slice(index, index + maxChars));
  }
  return chunks;
}

export function generateMockTranscriptSummary(input: {
  title: string;
  transcript?: string;
  notes?: string;
  category?: string;
}) {
  const source = input.transcript || input.notes || input.title;
  const category = input.category || classifyVideoText(`${input.title} ${source}`);
  const preview = source.replace(/\s+/g, " ").trim().slice(0, 220);

  return {
    summary: `${input.title}: ${preview || "No transcript provided yet."}`,
    key_takeaways: [
      "This is a mock summary until a real transcript and AI summarizer are connected.",
      `Category signal: ${category}.`,
      "Save the useful idea, then decide whether it creates a repeatable action.",
    ],
    action_items: [
      "Add or verify the transcript manually for now.",
      "Re-run summarization after real transcript extraction is connected.",
    ],
    category,
  };
}

export function buildVideoSearchText(video: object): string {
  return Object.values(video)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => typeof value === "string")
    .join(" ");
}

function readTag(xml: string, tagName: string) {
  const escapedTag = tagName.replace(":", "\\:");
  const match = xml.match(new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`));
  return match?.[1]?.trim() ?? null;
}

function decodeXml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}
