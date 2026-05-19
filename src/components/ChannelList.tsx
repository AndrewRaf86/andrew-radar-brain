import type { Channel } from "@/lib/types";

export function ChannelList({ channels }: { channels: Channel[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white">Tracked channels</h2>
        <span className="text-sm text-zinc-400">{channels.length} total</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel, index) => (
          <div
            key={`${channel.name}-${index}`}
            className="rounded-md border border-white/10 bg-black/20 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-zinc-100">{channel.name}</p>
              <span className="rounded bg-white/[0.07] px-2 py-0.5 text-[11px] uppercase text-zinc-400">
                {channel.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
