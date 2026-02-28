import type { ResumeAnalysis } from "@/types/resume-positioning";

export function RewriteSamples({
  samples,
}: {
  samples: ResumeAnalysis["strategic_rewrite_samples"];
}) {
  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Strategic Rewrite Samples
      </p>
      <div className="mt-5 space-y-3">
        {samples.map((item, index) => (
          <article
            className="rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)] p-4"
            key={`${item.original_pattern}-${index}`}
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--db-muted)]">
              Original Pattern
            </p>
            <p className="mt-2 text-sm text-[var(--db-muted)]">{item.original_pattern}</p>

            <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--db-muted)]">
              Executive Rewrite
            </p>
            <p className="mt-2 text-sm text-[var(--db-text)]">{item.executive_rewrite}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
