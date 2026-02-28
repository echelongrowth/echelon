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
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Dimension Scores
      </p>
      <div className="mt-5 space-y-4">
        {(Object.keys(scores) as Array<keyof ResumeAnalysis["dimension_scores"]>).map(
          (key) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--db-muted)]">{labels[key]}</span>
                <span className="font-medium text-[var(--db-text)]">{scores[key]}</span>
              </div>
        <div className="mt-2 h-2 rounded-full bg-[var(--db-surface-subtle)]">
          <div
                  className="h-full rounded-full bg-[var(--db-accent)]"
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
