export function StrategicSummary({ summary }: { summary: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Strategic Summary
      </p>
      <p className="mt-4 text-sm leading-7 text-slate-300">{summary}</p>
    </section>
  );
}

