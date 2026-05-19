import type { RadarVideo } from "@/lib/types";

const statusLabels: Record<RadarVideo["status"], string> = {
  new: "New",
  saved: "Saved",
  ignore: "Ignore",
  "try-this-week": "Try this week",
};

export function VideoCard({ video }: { video: RadarVideo }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#10141d] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-zinc-500">{video.channel}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{video.title}</h3>
        </div>
        <span className="rounded-md border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-200">
          {statusLabels[video.status]}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{video.summary}</p>
      <div className="mt-4 rounded-md bg-black/20 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
          Action
        </p>
        <p className="mt-1 text-sm leading-6 text-zinc-200">{video.action}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {video.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-zinc-300">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
