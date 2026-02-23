import type { ResumeAnalysis } from "@/types/resume-positioning";

const severityTone: Record<
  ResumeAnalysis["critical_gaps"][number]["severity"],
  string
> = {
  Low: "border-blue-300/30 bg-blue-500/10 text-blue-200",
  Medium: "border-amber-300/30 bg-amber-500/10 text-amber-200",
  High: "border-rose-300/30 bg-rose-500/10 text-rose-200",
};

export function CriticalGaps({
  gaps,
}: {
  gaps: ResumeAnalysis["critical_gaps"];
}) {
  return (
    <section className="l1-surface rounded-xl p-8">
      <p className="label-micro">
        Critical Gaps
      </p>
      <div className="mt-5 space-y-3">
        {gaps.map((gap, index) => (
          <article
            className="rounded-xl border border-slate-700/55 bg-slate-900/55 p-4"
            key={`${gap.title}-${index}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-100">{gap.title}</h3>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${severityTone[gap.severity]}`}
              >
                {gap.severity}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{gap.analysis}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
