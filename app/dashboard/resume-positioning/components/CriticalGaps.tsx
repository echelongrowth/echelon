import type { ResumeAnalysis } from "@/types/resume-positioning";

const severityTone: Record<
  ResumeAnalysis["critical_gaps"][number]["severity"],
  string
> = {
  Low: "border-[#6ea8ff55] bg-[#5b8cff1f] text-[#b8ceff]",
  Medium: "border-[#c89a4755] bg-[#c89a471a] text-[#ffd28b]",
  High: "border-[#a73a3555] bg-[#a73a351a] text-[#ff9a95]",
};

export function CriticalGaps({
  gaps,
}: {
  gaps: ResumeAnalysis["critical_gaps"];
}) {
  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Critical Gaps
      </p>
      <div className="mt-5 space-y-3">
        {gaps.map((gap, index) => (
          <article
            className="rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)] p-4"
            key={`${gap.title}-${index}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--db-text)]">{gap.title}</h3>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${severityTone[gap.severity]}`}
              >
                {gap.severity}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--db-muted)]">{gap.analysis}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
