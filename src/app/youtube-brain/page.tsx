export default function YouTubeBrainPage() {
  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
          Knowledge layer
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          YouTube Brain
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          The YouTube Brain will store selected channel videos, transcripts,
          summaries, and searchable knowledge for Telegram-first questions.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatusCard title="Telegram" value="Replies active when TELEGRAM_BOT_TOKEN exists" />
        <StatusCard title="YouTube RSS" value="Scan foundation ready" />
        <StatusCard title="Transcripts" value="Manual for now" />
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-xl font-bold text-white">Setup flow</h2>
        <ol className="mt-5 space-y-4 text-sm leading-6 text-zinc-300">
          <li>1. Add channels in Supabase table `youtube_channels`.</li>
          <li>2. Run `POST /api/youtube/scan` to pull latest RSS video metadata.</li>
          <li>3. Add transcripts manually for now, then run `POST /api/youtube/summarize`.</li>
          <li>4. Search from Telegram or `POST /api/brain/search`.</li>
        </ol>
      </section>
    </div>
  );
}

function StatusCard({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-zinc-200">{value}</p>
    </article>
  );
}
