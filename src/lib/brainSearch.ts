import { generateBrainReply, type BrainCategory } from "@/lib/brainRouter";
import { supabase } from "@/lib/supabase";

export type BrainSearchResult = {
  answer: string;
  matchedVideos: Array<{
    id: string;
    title: string;
    url: string;
    channel_name?: string;
    category?: string;
  }>;
  category: BrainCategory;
  hasSupabase: boolean;
};

type VideoRow = {
  id: string;
  title: string;
  url: string;
  channel_name?: string;
  category?: string;
  transcript?: string;
  summary?: string;
  key_takeaways?: string[];
  action_items?: string[];
};

export async function searchBrainKnowledge({
  query,
  category,
}: {
  query: string;
  category: BrainCategory;
}): Promise<BrainSearchResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      answer: `${generateBrainReply(query, category)}\n\nI do not have enough saved video knowledge yet. Add channels and run ingestion first.`,
      matchedVideos: [],
      category,
      hasSupabase: false,
    };
  }

  if (!supabase) {
    return {
      answer: `${generateBrainReply(query, category)}\n\nSupabase is not initialized for saved video search yet.`,
      matchedVideos: [],
      category,
      hasSupabase: false,
    };
  }

  let request = supabase
    .from("youtube_videos")
    .select("id,title,url,channel_name,category,transcript,summary,key_takeaways,action_items")
    .limit(100);

  if (category !== "General") {
    request = request.eq("category", category);
  }

  const { data, error } = await request;
  if (error || !data) {
    return {
      answer: `${generateBrainReply(query, category)}\n\nI could not search saved video knowledge yet: ${error?.message ?? "no data"}.`,
      matchedVideos: [],
      category,
      hasSupabase: true,
    };
  }

  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 2);
  const matchedVideos = (data as VideoRow[])
    .filter((video) => {
      const searchText = [
        video.title,
        video.summary,
        video.transcript,
        ...(video.key_takeaways ?? []),
        ...(video.action_items ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return terms.some((term) => searchText.includes(term));
    })
    .slice(0, 5)
    .map((video) => ({
      id: video.id,
      title: video.title,
      url: video.url,
      channel_name: video.channel_name,
      category: video.category,
    }));

  const titles = matchedVideos.map((video) => `- ${video.title}`).join("\n");
  const knowledgeNote = matchedVideos.length
    ? `\n\nSaved video matches:\n${titles}`
    : "\n\nI do not have enough saved video knowledge yet. Add channels and run ingestion first.";

  return {
    answer: `${generateBrainReply(query, category)}${knowledgeNote}`,
    matchedVideos,
    category,
    hasSupabase: true,
  };
}
