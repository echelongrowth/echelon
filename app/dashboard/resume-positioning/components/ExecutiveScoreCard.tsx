import type { ResumeAnalysis } from "@/types/resume-positioning";

export function ExecutiveScoreCard({
  score,
  tier,
  strengths,
  aiReadinessScore,
}: {
  score: number;
  tier: ResumeAnalysis["positioning_tier"];
  strengths: string[];
  aiReadinessScore: number;
}) {
  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Executive Positioning
      </p>
      <div className="mt-4 flex items-end gap-3">
        <p className="apple-kpi text-6xl">
          {score}
        </p>
        <span className="mb-2 rounded-full border border-[var(--db-border)] bg-[var(--db-surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--db-text)]">
          {tier}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--db-muted)]">
        AI Readiness Score:{" "}
        <span className="font-semibold text-[var(--db-text)]">{aiReadinessScore}</span>
      </p>
      <ul className="mt-5 space-y-2">
        {strengths.map((item) => (
          <li
            className="rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)] px-4 py-3 text-sm text-[var(--db-text)]"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
