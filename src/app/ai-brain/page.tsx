import { ChannelList } from "@/components/ChannelList";
import { InsightPanel } from "@/components/InsightPanel";
import { VideoCard } from "@/components/VideoCard";
import { getChannelsByCategory } from "@/data/channels";
import { getVideosByCategory } from "@/data/mockVideos";

export default function AiBrainPage() {
  const channels = getChannelsByCategory("ai");
  const videos = getVideosByCategory("ai");

  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">AI Brain</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          This brain is for tracking AI tools, agents, automation, coding workflows, SEO systems, productivity systems, and build ideas. It helps Andrew decide what to use, what to ignore, and what can become a business workflow.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightPanel title="What changed?">Agent workflows are getting easier to run with lightweight context files, scheduled routines, and focused tools.</InsightPanel>
        <InsightPanel title="Why it matters">The leverage is not more tools. It is turning repeated work into a clear operating system Andrew can actually reuse.</InsightPanel>
        <InsightPanel title="What Andrew should try">Build one weekly AI Radar report and one SEO agent checklist before connecting APIs.</InsightPanel>
        <InsightPanel title="What to ignore">Skip heavy orchestration, Hermes, and complex ingestion until the manual workflow proves useful.</InsightPanel>
      </section>

      <ChannelList channels={channels} />

      <section>
        <h2 className="text-2xl font-bold text-white">AI mock videos</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
