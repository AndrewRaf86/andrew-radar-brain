export function InsightPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#10141d] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
        {title}
      </p>
      <div className="mt-3 text-sm leading-6 text-zinc-300">{children}</div>
    </section>
  );
}
