import { BrainCard } from "@/components/BrainCard";
import { StatCard } from "@/components/StatCard";
import { VideoCard } from "@/components/VideoCard";
import { getChannelsByCategory, channels } from "@/data/channels";
import { getVideosByCategory, mockVideos } from "@/data/mockVideos";

export default function Home() {
  const aiChannels = getChannelsByCategory("ai");
  const datingChannels = getChannelsByCategory("dating");
  const fitnessChannels = getChannelsByCategory("fitness-food");
  const aiVideos = getVideosByCategory("ai");
  const datingVideos = getVideosByCategory("dating");
  const fitnessVideos = getVideosByCategory("fitness-food");
  const todaysSignals = [aiVideos[0], datingVideos[0], fitnessVideos[0]];

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
          Command center
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Andrew Radar Brain
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          AI, Dating, and Fitness/Food intelligence from my YouTube world.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total tracked channels" value={channels.length} />
        <StatCard label="AI channels" value={aiChannels.length} />
        <StatCard label="Dating channels" value={datingChannels.length} />
        <StatCard label="Fitness/Food channels" value={fitnessChannels.length} />
        <StatCard label="Mock videos processed" value={mockVideos.length} />
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <BrainCard
          title="AI Brain"
          description="Tools, agents, automation, coding workflows, SEO systems, productivity, and build ideas."
          href="/ai-brain"
          channelCount={aiChannels.length}
          videoCount={aiVideos.length}
          topInsight="Scheduled AI routines are the highest leverage path before adding a backend."
        />
        <BrainCard
          title="Dating Brain"
          description="Pattern recognition for communication, confidence, presentation, and avoiding over-investment."
          href="/dating"
          channelCount={datingChannels.length}
          videoCount={datingVideos.length}
          topInsight="The repeated pattern is calm leadership with matched investment."
        />
        <BrainCard
          title="Fitness/Food Brain"
          description="Training, food, boxing, longevity, gut health, meal prep, supplements, and recovery."
          href="/fitness-food"
          channelCount={fitnessChannels.length}
          videoCount={fitnessVideos.length}
          topInsight="Weekly protein anchors and boxing footwork are the cleanest immediate actions."
        />
        <BrainCard
          title="Brain Chat"
          description="Paste messages, screenshots, ideas, or links and turn them into categorized intelligence."
          href="/brain-chat"
          channelCount={3}
          videoCount={0}
          topInsight="Local-first capture turns loose signals into a category, action, saved note, and priority score."
          buttonLabel="Open Brain Chat"
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white">Today&apos;s Signal</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {todaysSignals.map((video) => (
            <div key={video.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-emerald-300">{video.title}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{video.whyItMatters}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white">Recent Radar Items</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {mockVideos.slice(0, 6).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
