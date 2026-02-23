import type { ResumeAnalysis } from "@/types/resume-positioning";

export function PromotionAlignment({
  data,
}: {
  data: ResumeAnalysis["promotion_alignment"];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
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
        <div className="mt-2 h-2 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF]"
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

