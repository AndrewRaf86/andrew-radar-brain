export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-zinc-400">{hint}</p> : null}
    </div>
  );
}
