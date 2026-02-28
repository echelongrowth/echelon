import type { ResumeAnalysis } from "@/types/resume-positioning";

export function PromotionAlignment({
  data,
}: {
  data: ResumeAnalysis["promotion_alignment"];
}) {
  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Promotion Alignment
      </p>
      <p className="mt-4 text-sm text-[var(--db-muted)]">
        Current Level Fit:{" "}
        <span className="font-medium text-[var(--db-text)]">{data.current_level_fit}</span>
      </p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--db-muted)]">Next Level Readiness</span>
          <span className="font-medium text-[var(--db-text)]">
            {data.next_level_readiness_percentage}%
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[var(--db-surface-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--db-accent)]"
            style={{ width: `${data.next_level_readiness_percentage}%` }}
          />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--db-muted)]">
        {data.readiness_gap_summary}
      </p>
    </section>
  );
}
