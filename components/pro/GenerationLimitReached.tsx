export function GenerationLimitReached({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)]/70 p-6">
      <p className="apple-label">Strategic Side-Project Engine</p>
      <h3 className="mt-2 text-[21px] font-semibold tracking-tight text-[var(--db-text)]">
        Generation Limit Reached
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--db-muted)]">{message}</p>
    </div>
  );
}
