import type { ResumeAnalysis } from "@/types/resume-positioning";

export function CompensationLeverage({
  data,
}: {
  data: ResumeAnalysis["compensation_leverage_outlook"];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Compensation Leverage
      </p>
      <p className="mt-4 text-sm text-slate-300">
        Positioning Band:{" "}
        <span className="font-medium text-slate-100">{data.positioning_band}</span>
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {data.leverage_assessment}
      </p>
    </section>
  );
}

