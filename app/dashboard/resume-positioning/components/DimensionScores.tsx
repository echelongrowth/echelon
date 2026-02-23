import type { ResumeAnalysis } from "@/types/resume-positioning";

const labels: Record<keyof ResumeAnalysis["dimension_scores"], string> = {
  strategic_ownership: "Strategic Ownership",
  leadership_visibility: "Leadership Visibility",
  business_impact: "Business Impact",
  market_differentiation: "Market Differentiation",
  narrative_clarity: "Narrative Clarity",
  executive_presence: "Executive Presence",
};

export function DimensionScores({
  scores,
}: {
  scores: ResumeAnalysis["dimension_scores"];
}) {
  return (
    <section className="l1-surface rounded-xl p-8">
      <p className="label-micro">
        Dimension Scores
      </p>
      <div className="mt-5 space-y-4">
        {(Object.keys(scores) as Array<keyof ResumeAnalysis["dimension_scores"]>).map(
          (key) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{labels[key]}</span>
                <span className="font-medium text-slate-100">{scores[key]}</span>
              </div>
        <div className="mt-2 h-2 rounded-full bg-slate-800/80">
          <div
                  className="h-full rounded-full bg-slate-500/85"
                  style={{ width: `${scores[key]}%` }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
