import { ChannelList } from "@/components/ChannelList";
import { InsightPanel } from "@/components/InsightPanel";
import { VideoCard } from "@/components/VideoCard";
import { getChannelsByCategory } from "@/data/channels";
import { getVideosByCategory } from "@/data/mockVideos";

export default function FitnessFoodPage() {
  const channels = getChannelsByCategory("fitness-food");
  const videos = getVideosByCategory("fitness-food");

  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">Fitness/Food Brain</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          This brain is for fitness, food, boxing, longevity, gut health, meal prep, supplements, and training. It helps Andrew turn content into practical weekly actions.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightPanel title="Training action">Keep strength work progressive and add short boxing footwork blocks before conditioning.</InsightPanel>
        <InsightPanel title="Food action">Prep two protein anchors and one high-volume dinner so the default meal is already decided.</InsightPanel>
        <InsightPanel title="Recovery action">Watch joints, sleep, and digestion before adding more volume or supplements.</InsightPanel>
        <InsightPanel title="Ignore list">Ignore complicated stacks, miracle protocols, and recipes that look good but do not repeat well.</InsightPanel>
      </section>

      <ChannelList channels={channels} />

      <section>
        <h2 className="text-2xl font-bold text-white">Fitness/Food mock videos</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
