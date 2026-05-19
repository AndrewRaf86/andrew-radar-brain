import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  getYouTubeRssUrl,
  parseYouTubeRssFeed,
  type YouTubeChannel,
} from "@/lib/youtubeIngestion";

type ChannelRow = YouTubeChannel & {
  id: string;
};

export async function POST() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({
      ok: false,
      channelsChecked: 0,
      videosFound: 0,
      videosInserted: 0,
      message: "Supabase env vars are missing. Add channels in Supabase before running RSS scan.",
    });
  }

  if (!supabase) {
    return NextResponse.json({
      ok: false,
      channelsChecked: 0,
      videosFound: 0,
      videosInserted: 0,
      message: "Supabase client is not initialized.",
    });
  }

  const { data: channels, error } = await supabase
    .from("youtube_channels")
    .select("id,name,yt_channel_id,channel_url,category,priority,is_active")
    .eq("is_active", true)
    .not("yt_channel_id", "is", null);

  if (error) {
    return NextResponse.json({
      ok: false,
      channelsChecked: 0,
      videosFound: 0,
      videosInserted: 0,
      message: error.message,
    });
  }

  let videosFound = 0;
  let videosInserted = 0;

  for (const channel of (channels ?? []) as ChannelRow[]) {
    const rssUrl = getYouTubeRssUrl(channel.yt_channel_id);
    const response = await fetch(rssUrl, { next: { revalidate: 3600 } });
    if (!response.ok) continue;

    const xml = await response.text();
    const videos = parseYouTubeRssFeed(xml).map((video) => ({
      ...video,
      channel_id: channel.id,
      channel_name: video.channel_name || channel.name,
      category: channel.category,
      transcript_status: "missing",
      summary_status: "missing",
    }));
    videosFound += videos.length;

    for (const video of videos) {
      const { error: insertError } = await supabase
        .from("youtube_videos")
        .upsert(video, { onConflict: "yt_video_id", ignoreDuplicates: true });
      if (!insertError) videosInserted += 1;
    }

    await supabase
      .from("youtube_channels")
      .update({ last_checked_at: new Date().toISOString() })
      .eq("id", channel.id);
  }

  return NextResponse.json({
    ok: true,
    channelsChecked: channels?.length ?? 0,
    videosFound,
    videosInserted,
    message: "YouTube RSS scan completed. Transcript extraction is not active yet.",
  });
}
