import { supabase } from "@/lib/supabase";

export type YouTubeRssChannel = {
  id: string;
  name: string;
  yt_channel_id?: string | null;
  rss_url?: string | null;
  url?: string | null;
  category?: string | null;
  priority?: number | null;
  is_active?: boolean | null;
};

export type YouTubeRssVideo = {
  yt_video_id: string;
  title: string;
  url: string;
  published_at?: string;
  channel_name?: string;
};

export type ChannelScanResult = {
  channelId: string;
  channelName: string;
  channelResolved: boolean;
  skipped: boolean;
  videosFound: number;
  videosInserted: number;
  skippedDuplicates: number;
  errors: string[];
};

export function buildYouTubeRssUrl(channelId: string) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

export async function resolveYouTubeChannelIdFromUrl(
  url: string,
): Promise<string | null> {
  const channelMatch = url.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/);
  if (channelMatch?.[1]) return channelMatch[1];

  if (!url.includes("youtube.com/@")) return null;

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; AndrewRadarBrain/1.0; +https://andrew-radar-brain.vercel.app)",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) return null;
    const html = await response.text();
    const patterns = [
      /"channelId":"(UC[a-zA-Z0-9_-]+)"/,
      /"externalId":"(UC[a-zA-Z0-9_-]+)"/,
      /<meta[^>]+itemprop=["']channelId["'][^>]+content=["'](UC[a-zA-Z0-9_-]+)["']/,
      /"browseId":"(UC[a-zA-Z0-9_-]+)"/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) return match[1];
    }
  } catch (error) {
    console.error("YouTube handle resolution failed", { url, error });
  }

  return null;
}

export async function fetchYouTubeRssFeed(rssUrl: string) {
  const response = await fetch(rssUrl, { next: { revalidate: 900 } });
  if (!response.ok) {
    throw new Error(`RSS fetch failed with ${response.status}`);
  }
  return response.text();
}

export function parseYouTubeRss(xml: string): YouTubeRssVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const videos: YouTubeRssVideo[] = [];

  for (const entry of entries) {
    const ytVideoId = readTag(entry, "yt:videoId");
    const title = decodeXml(readTag(entry, "title") ?? "");
    const channelName = decodeXml(readTag(entry, "name") ?? "");
    const publishedAt = readTag(entry, "published") ?? undefined;
    const link = entry.match(/<link[^>]+href="([^"]+)"/)?.[1];

    if (!ytVideoId || !title) continue;

    videos.push({
      yt_video_id: ytVideoId,
      title,
      url: link ?? `https://www.youtube.com/watch?v=${ytVideoId}`,
      published_at: publishedAt,
      channel_name: channelName,
    });
  }

  return videos;
}

export async function scanChannelForVideos(
  channel: YouTubeRssChannel,
): Promise<ChannelScanResult> {
  const errors: string[] = [];
  let videosInserted = 0;
  let skippedDuplicates = 0;
  let resolvedChannelId = channel.yt_channel_id ?? null;
  let rssUrl = channel.rss_url ?? null;
  let channelResolved = Boolean(resolvedChannelId || rssUrl);

  if (!resolvedChannelId && !rssUrl && channel.url) {
    resolvedChannelId = await resolveYouTubeChannelIdFromUrl(channel.url);
    if (resolvedChannelId) {
      rssUrl = buildYouTubeRssUrl(resolvedChannelId);
      channelResolved = true;
    }
  }

  if (!rssUrl && resolvedChannelId) {
    rssUrl = buildYouTubeRssUrl(resolvedChannelId);
  }

  if (!rssUrl) {
    return {
      channelId: channel.id,
      channelName: channel.name,
      channelResolved: false,
      skipped: true,
      videosFound: 0,
      videosInserted: 0,
      skippedDuplicates: 0,
      errors: ["Channel has no yt_channel_id, rss_url, or resolvable url."],
    };
  }

  try {
    const xml = await fetchYouTubeRssFeed(rssUrl);
    const videos = parseYouTubeRss(xml);

    if (!supabase) {
      return {
        channelId: channel.id,
        channelName: channel.name,
        channelResolved,
        skipped: true,
        videosFound: videos.length,
        videosInserted: 0,
        skippedDuplicates: 0,
        errors: ["Supabase client is not initialized."],
      };
    }

    if (resolvedChannelId && (!channel.yt_channel_id || !channel.rss_url)) {
      await supabase
        .from("youtube_channels")
        .update({ yt_channel_id: resolvedChannelId, rss_url: rssUrl })
        .eq("id", channel.id);
    }

    for (const video of videos) {
      const { error } = await supabase.from("youtube_videos").insert({
        channel_id: channel.id,
        yt_video_id: video.yt_video_id,
        channel_name: video.channel_name || channel.name,
        title: video.title,
        url: video.url,
        category: channel.category,
        published_at: video.published_at,
        ingested_at: new Date().toISOString(),
      });

      if (!error) {
        videosInserted += 1;
        continue;
      }

      if (error.code === "23505" || /duplicate/i.test(error.message)) {
        skippedDuplicates += 1;
      } else {
        console.error("youtube_videos insert failed", {
          channel: channel.name,
          video: video.yt_video_id,
          error,
        });
        errors.push(`${video.yt_video_id}: insert failed`);
      }
    }

    return {
      channelId: channel.id,
      channelName: channel.name,
      channelResolved,
      skipped: false,
      videosFound: videos.length,
      videosInserted,
      skippedDuplicates,
      errors,
    };
  } catch (error) {
    console.error("youtube rss scan failed", { channel, error });
    return {
      channelId: channel.id,
      channelName: channel.name,
      channelResolved,
      skipped: false,
      videosFound: 0,
      videosInserted: 0,
      skippedDuplicates: 0,
      errors: [error instanceof Error ? error.message : "RSS scan failed"],
    };
  }
}

export async function scanAllActiveChannels() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      ok: false,
      channelsScanned: 0,
      channelsResolved: 0,
      videosFound: 0,
      videosInserted: 0,
      skippedDuplicates: 0,
      skippedChannels: 0,
      errors: ["Supabase env vars are missing."],
    };
  }

  if (!supabase) {
    return {
      ok: false,
      channelsScanned: 0,
      channelsResolved: 0,
      videosFound: 0,
      videosInserted: 0,
      skippedDuplicates: 0,
      skippedChannels: 0,
      errors: ["Supabase client is not initialized."],
    };
  }

  const { data, error } = await supabase
    .from("youtube_channels")
    .select("id,name,yt_channel_id,rss_url,url,category,priority,is_active")
    .eq("is_active", true);

  if (error) {
    console.error("youtube_channels scan query failed", error);
    return {
      ok: false,
      channelsScanned: 0,
      channelsResolved: 0,
      videosFound: 0,
      videosInserted: 0,
      skippedDuplicates: 0,
      skippedChannels: 0,
      errors: ["Could not read youtube_channels."],
    };
  }

  const results = [];
  for (const channel of (data ?? []) as YouTubeRssChannel[]) {
    results.push(await scanChannelForVideos(channel));
  }

  return {
    ok: true,
    channelsScanned: results.length,
    channelsResolved: results.filter((result) => result.channelResolved).length,
    videosFound: results.reduce((sum, result) => sum + result.videosFound, 0),
    videosInserted: results.reduce((sum, result) => sum + result.videosInserted, 0),
    skippedDuplicates: results.reduce(
      (sum, result) => sum + result.skippedDuplicates,
      0,
    ),
    skippedChannels: results.filter((result) => result.skipped).length,
    errors: results.flatMap((result) =>
      result.errors.map((error) => `${result.channelName}: ${error}`),
    ),
  };
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
