import type { ResumeAnalysis } from "@/types/resume-positioning";

export function CompensationLeverage({
  data,
}: {
  data: ResumeAnalysis["compensation_leverage_outlook"];
}) {
  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Compensation Leverage
      </p>
      <p className="mt-4 text-sm text-[var(--db-muted)]">
        Positioning Band:{" "}
        <span className="font-medium text-[var(--db-text)]">{data.positioning_band}</span>
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--db-muted)]">
        {data.leverage_assessment}
      </p>
    </section>
  );
}
