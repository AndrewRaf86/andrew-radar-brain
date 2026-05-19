import { ChannelList } from "@/components/ChannelList";
import { InsightPanel } from "@/components/InsightPanel";
import { VideoCard } from "@/components/VideoCard";
import { getChannelsByCategory } from "@/data/channels";
import { getVideosByCategory } from "@/data/mockVideos";

export default function DatingPage() {
  const channels = getChannelsByCategory("dating");
  const videos = getVideosByCategory("dating");

  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">Dating Brain</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          This brain is for pattern recognition around dating, communication, confidence, masculine presentation, and avoiding over-investing. It turns noisy dating content into simple behavioral reminders.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightPanel title="What pattern keeps showing up?">Attraction improves when Andrew leads simply, communicates less anxiously, and watches real effort.</InsightPanel>
        <InsightPanel title="How Andrew should act">Make a clear plan, hold a warm frame, and let mutual investment reveal itself.</InsightPanel>
        <InsightPanel title="What to avoid">Do not over-text, explain too much, chase vague interest, or turn every signal into a research project.</InsightPanel>
        <InsightPanel title="Simple field notes">Short messages. Clean clothes. Good logistics. Calm pace. Observe behavior after the date.</InsightPanel>
      </section>

      <ChannelList channels={channels} />

      <section>
        <h2 className="text-2xl font-bold text-white">Dating mock videos</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
