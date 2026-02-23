export function StrategicSummary({ summary }: { summary: string }) {
  return (
    <section className="l1-surface rounded-xl p-8">
      <p className="label-micro">
        Strategic Summary
      </p>
      <p className="mt-4 text-sm leading-7 text-slate-300">{summary}</p>
    </section>
  );
}
