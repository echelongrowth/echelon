import type { ResumeAnalysis } from "@/types/resume-positioning";
import { ExecutiveScoreCard } from "@/app/dashboard/resume-positioning/components/ExecutiveScoreCard";
import { DimensionScores } from "@/app/dashboard/resume-positioning/components/DimensionScores";
import { CriticalGaps } from "@/app/dashboard/resume-positioning/components/CriticalGaps";
import { RewriteSamples } from "@/app/dashboard/resume-positioning/components/RewriteSamples";
import { PromotionAlignment } from "@/app/dashboard/resume-positioning/components/PromotionAlignment";
import { CompensationLeverage } from "@/app/dashboard/resume-positioning/components/CompensationLeverage";
import { StrategicSummary } from "@/app/dashboard/resume-positioning/components/StrategicSummary";

export function ResumeAnalysisReport({
  analysis,
}: {
  analysis: ResumeAnalysis;
}) {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 xl:grid-cols-2">
        <ExecutiveScoreCard
          score={analysis.executive_positioning_score}
          strengths={analysis.strengths}
          tier={analysis.positioning_tier}
        />
        <DimensionScores scores={analysis.dimension_scores} />
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <PromotionAlignment data={analysis.promotion_alignment} />
        <CompensationLeverage data={analysis.compensation_leverage_outlook} />
      </section>

      <CriticalGaps gaps={analysis.critical_gaps} />
      <RewriteSamples samples={analysis.strategic_rewrite_samples} />
      <StrategicSummary summary={analysis.strategic_summary} />
    </div>
  );
}

