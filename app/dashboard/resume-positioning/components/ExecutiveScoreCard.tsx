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
    <section className="l1-surface rounded-xl p-8">
      <p className="label-micro">
        Executive Positioning
      </p>
      <div className="mt-4 flex items-end gap-3">
        <p className="kpi-number text-6xl">
          {score}
        </p>
        <span className="mb-2 rounded-full border border-slate-500/55 bg-slate-700/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100">
          {tier}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        AI Readiness Score:{" "}
        <span className="font-semibold text-slate-100">{aiReadinessScore}</span>
      </p>
      <ul className="mt-5 space-y-2">
        {strengths.map((item) => (
          <li
            className="rounded-xl border border-slate-700/55 bg-slate-900/55 px-4 py-3 text-sm text-slate-200"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
