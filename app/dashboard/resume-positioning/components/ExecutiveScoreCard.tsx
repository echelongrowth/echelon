import type { ResumeAnalysis } from "@/types/resume-positioning";

export function ExecutiveScoreCard({
  score,
  tier,
  strengths,
}: {
  score: number;
  tier: ResumeAnalysis["positioning_tier"];
  strengths: string[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Executive Positioning
      </p>
      <div className="mt-4 flex items-end gap-3">
        <p className="bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] bg-clip-text text-6xl font-semibold text-transparent">
          {score}
        </p>
        <span className="mb-2 rounded-full border border-violet-300/35 bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-violet-100">
          {tier}
        </span>
      </div>
      <ul className="mt-5 space-y-2">
        {strengths.map((item) => (
          <li
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

