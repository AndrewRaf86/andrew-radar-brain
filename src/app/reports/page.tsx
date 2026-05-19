const reports = [
  {
    title: "AI Weekly Radar",
    bullets: [
      "Top tool worth testing this week",
      "Automation pattern that can become a workflow",
      "One AI SEO or coding idea to save",
      "One shiny object to ignore",
    ],
  },
  {
    title: "Dating Pattern Review",
    bullets: [
      "Most repeated communication reminder",
      "One behavior to practice on dates",
      "One over-investment pattern to catch early",
      "One presentation upgrade to make automatic",
    ],
  },
  {
    title: "Health/Fitness/Food Action Plan",
    bullets: [
      "Training focus for the next seven days",
      "Two meals to prep before the week starts",
      "One recovery marker to watch",
      "One supplement or diet claim to skip",
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-white">Reports</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
          Mock report cards for the weekly summaries this dashboard will generate after ingestion exists.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {reports.map((report) => (
          <article key={report.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-bold text-white">{report.title}</h2>
            <ul className="mt-5 space-y-3">
              {report.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm leading-6 text-zinc-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
