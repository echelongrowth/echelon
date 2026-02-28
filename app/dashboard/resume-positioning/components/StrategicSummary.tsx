export function StrategicSummary({ summary }: { summary: string }) {
  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Strategic Summary
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--db-muted)]">{summary}</p>
    </section>
  );
}
