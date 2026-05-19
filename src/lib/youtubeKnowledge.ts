import { createHash } from "node:crypto";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { BrainCategory } from "@/lib/brainRouter";

export type ManualYouTubeVideoInput = {
  yt_video_id?: string;
  channel_name?: string;
  title: string;
  url: string;
  category?: BrainCategory;
  transcript?: string;
  summary?: string;
  takeaways?: string[];
  action_items?: string[];
  published_at?: string;
};

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]{6,})/,
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function extractFirstYouTubeUrl(input: string): string | null {
  const match = input.match(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i);
  return match?.[0]?.replace(/[),.]+$/, "") ?? null;
}

export function stableVideoIdFromUrl(url: string): string {
  return `url-${createHash("sha256").update(url).digest("hex").slice(0, 24)}`;
}

export async function saveYouTubeVideoManual(input: ManualYouTubeVideoInput) {
  const supabase = getSupabaseServerClient();
  const ytVideoId =
    input.yt_video_id || extractYouTubeVideoId(input.url) || stableVideoIdFromUrl(input.url);

  const row = {
    yt_video_id: ytVideoId,
    channel_name: input.channel_name ?? null,
    title: input.title,
    url: input.url,
    category: input.category ?? "General",
    transcript: input.transcript ?? null,
    summary: input.summary ?? null,
    takeaways: input.takeaways ?? null,
    action_items: input.action_items ?? null,
    published_at: input.published_at ?? null,
    ingested_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("youtube_videos")
    .upsert(row, { onConflict: "yt_video_id" })
    .select("id,yt_video_id,title,url,category")
    .single();

  if (error) throw error;

  return {
    saved: true,
    video: data,
  };
}

export function parseTelegramYouTubeSave(input: string, category: BrainCategory) {
  const url = extractFirstYouTubeUrl(input);
  if (!url) return null;

  const withoutUrl = input.replace(url, "").trim();
  const title =
    readField(withoutUrl, "title") ||
    firstMeaningfulLine(withoutUrl) ||
    "Telegram saved YouTube video";
  const transcript = readBlock(withoutUrl, "transcript");
  const summary = readField(withoutUrl, "summary") || (transcript ? undefined : withoutUrl);
  const channelName = readField(withoutUrl, "channel");

  return {
    channel_name: channelName,
    title,
    url,
    category,
    transcript,
    summary,
  };
}

function readField(input: string, field: string) {
  const match = input.match(new RegExp(`${field}\\s*:\\s*(.+)`, "i"));
  return match?.[1]?.trim() || undefined;
}

function readBlock(input: string, field: string) {
  const match = input.match(new RegExp(`${field}\\s*:\\s*([\\s\\S]+)`, "i"));
  return match?.[1]?.trim() || undefined;
}

function firstMeaningfulLine(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 8 && !/^(transcript|summary|channel|title)\s*:/i.test(line));
}
