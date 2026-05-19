const pipeline = ["Capture", "Summarize", "Classify", "Save to Supabase", "Ask the Brain"];

export default function InboxPage() {
  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">Ingestion Inbox</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          Later this will accept YouTube URLs, transcripts, RSS feed items, or manual notes. For v1 this is visual only.
        </p>
      </section>

      <section className="rounded-lg border border-dashed border-emerald-400/35 bg-emerald-400/[0.04] p-4 sm:p-6">
        <label htmlFor="inbox-paste" className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Paste YouTube URL, transcript, or note
        </label>
        <textarea
          id="inbox-paste"
          className="mt-4 min-h-52 w-full resize-none rounded-lg border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
          placeholder="https://youtube.com/watch?v=...&#10;&#10;Transcript notes, rough idea, or manual signal..."
        />
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {pipeline.map((step, index) => (
          <article key={step} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold text-zinc-500">0{index + 1}</p>
            <h2 className="mt-3 text-base font-semibold text-white">{step}</h2>
          </article>
        ))}
      </section>
    </div>
  );
}
