import { generateBrainReply, type BrainCategory } from "@/lib/brainRouter";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type BrainSearchResult = {
  answer: string;
  matchedVideos: Array<{
    id: string;
    title: string;
    url: string;
    channel_name?: string;
    category?: string;
    summary?: string;
    takeaways?: string[];
    action_items?: string[];
  }>;
  category: BrainCategory;
  hasSupabase: boolean;
  searchFailed?: boolean;
  savedVideoContext: string;
};

type VideoRow = {
  id: string;
  title: string;
  url: string;
  channel_name?: string;
  category?: string;
  transcript?: string;
  summary?: string;
  takeaways?: string[];
  action_items?: string[];
};

const noKnowledgeMessage =
  "No saved YouTube knowledge found yet. Add channels/videos or run ingestion first.";

export async function searchBrainKnowledge({
  query,
  category,
}: {
  query: string;
  category: BrainCategory;
}): Promise<BrainSearchResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      answer: `${generateBrainReply(query, category)}\n\n${noKnowledgeMessage}`,
      matchedVideos: [],
      category,
      hasSupabase: false,
      savedVideoContext: "",
    };
  }

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch (error) {
    console.error("Supabase server client unavailable for brain search", error);
    return {
      answer: `${generateBrainReply(query, category)}\n\nSupabase is not initialized for saved video search yet.`,
      matchedVideos: [],
      category,
      hasSupabase: false,
      searchFailed: true,
      savedVideoContext: "",
    };
  }

  let request = supabase
    .from("youtube_videos")
    .select("id,title,url,channel_name,category,transcript,summary,takeaways,action_items")
    .limit(100);

  if (category !== "General") {
    request = request.eq("category", category);
  }

  const { data, error } = await request;
  if (error || !data) {
    console.error("youtube_videos search failed", error);
    return {
      answer: `${generateBrainReply(query, category)}\n\n${noKnowledgeMessage}`,
      matchedVideos: [],
      category,
      hasSupabase: true,
      searchFailed: true,
      savedVideoContext: "",
    };
  }

  if (!data.length) {
    return {
      answer: `${generateBrainReply(query, category)}\n\n${noKnowledgeMessage}`,
      matchedVideos: [],
      category,
      hasSupabase: true,
      savedVideoContext: "",
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
        video.channel_name,
        video.url,
        video.summary,
        video.transcript,
        ...(video.takeaways ?? []),
        ...(video.action_items ?? []),
        video.category,
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
      summary: video.summary,
      takeaways: video.takeaways,
      action_items: video.action_items,
    }));

  const titles = matchedVideos.map((video) => `- ${video.title}`).join("\n");
  const knowledgeNote = matchedVideos.length
    ? `\n\nSaved video matches:\n${titles}`
    : `\n\n${noKnowledgeMessage}`;

  return {
    answer: `${generateBrainReply(query, category)}${knowledgeNote}`,
    matchedVideos,
    category,
    hasSupabase: true,
    savedVideoContext: formatSavedVideoContext(matchedVideos),
  };
}

function formatSavedVideoContext(
  videos: BrainSearchResult["matchedVideos"],
) {
  if (!videos.length) return "";

  return videos
    .map((video, index) => {
      const takeaways = video.takeaways?.length
        ? `\nTakeaways: ${video.takeaways.slice(0, 3).join("; ")}`
        : "";
      const actions = video.action_items?.length
        ? `\nAction items: ${video.action_items.slice(0, 3).join("; ")}`
        : "";
      const summary = video.summary ? `\nSummary: ${video.summary}` : "";
      return [
        `${index + 1}. ${video.title}`,
        video.channel_name ? `Channel: ${video.channel_name}` : "",
        `URL: ${video.url}`,
        summary,
        takeaways,
        actions,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}
