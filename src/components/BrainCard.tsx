import Link from "next/link";

export function BrainCard({
  title,
  description,
  href,
  channelCount,
  videoCount,
  topInsight,
  buttonLabel = "Open brain",
}: {
  title: string;
  description: string;
  href: string;
  channelCount: number;
  videoCount: number;
  topInsight: string;
  buttonLabel?: string;
}) {
  return (
    <section className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.045] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        <span className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
          {videoCount} items
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-black/20 p-3">
          <p className="text-zinc-500">Channels</p>
          <p className="mt-1 text-2xl font-semibold text-white">{channelCount}</p>
        </div>
        <div className="rounded-md bg-black/20 p-3">
          <p className="text-zinc-500">Latest</p>
          <p className="mt-1 text-2xl font-semibold text-white">{videoCount}</p>
        </div>
      </div>
      <p className="mt-5 flex-1 text-sm leading-6 text-zinc-300">{topInsight}</p>
      <Link
        href={href}
        className="mt-5 inline-flex w-fit rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
      >
        {buttonLabel}
      </Link>
    </section>
  );
}
