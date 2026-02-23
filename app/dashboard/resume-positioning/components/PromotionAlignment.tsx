import type { ResumeAnalysis } from "@/types/resume-positioning";

export function PromotionAlignment({
  data,
}: {
  data: ResumeAnalysis["promotion_alignment"];
}) {
  return (
    <section className="l1-surface rounded-xl p-8">
      <p className="label-micro">
        Promotion Alignment
      </p>
      <p className="mt-4 text-sm text-slate-300">
        Current Level Fit:{" "}
        <span className="font-medium text-slate-100">{data.current_level_fit}</span>
      </p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Next Level Readiness</span>
          <span className="font-medium text-slate-100">
            {data.next_level_readiness_percentage}%
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-800/80">
          <div
            className="h-full rounded-full bg-slate-500/85"
            style={{ width: `${data.next_level_readiness_percentage}%` }}
          />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        {data.readiness_gap_summary}
      </p>
    </section>
  );
}
