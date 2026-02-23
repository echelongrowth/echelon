import type { PlanType } from "@/types/intelligence";
import type {
  FreeResumeAnalysis,
  ResumeAnalysis,
} from "@/types/resume-positioning";
import { ExecutiveScoreCard } from "@/app/dashboard/resume-positioning/components/ExecutiveScoreCard";
import { DimensionScores } from "@/app/dashboard/resume-positioning/components/DimensionScores";
import { CriticalGaps } from "@/app/dashboard/resume-positioning/components/CriticalGaps";
import { RewriteSamples } from "@/app/dashboard/resume-positioning/components/RewriteSamples";
import { PromotionAlignment } from "@/app/dashboard/resume-positioning/components/PromotionAlignment";
import { CompensationLeverage } from "@/app/dashboard/resume-positioning/components/CompensationLeverage";
import { StrategicSummary } from "@/app/dashboard/resume-positioning/components/StrategicSummary";
import { ProgressTracking } from "@/app/dashboard/resume-positioning/components/ProgressTracking";
import { ProGate } from "@/app/dashboard/resume-positioning/components/ProGate";

export function ResumeAnalysisReport({
  analysis,
  analysisId,
  planType,
}: {
  analysis: ResumeAnalysis | FreeResumeAnalysis;
  analysisId: string;
  planType: PlanType;
}) {
  const isPro = planType === "pro";
  const strengths = analysis.strengths.slice(0, isPro ? undefined : 3);
  const gaps = analysis.critical_gaps.slice(0, isPro ? undefined : 2);
  const priorities = analysis.tactical_execution_priorities.slice(
    0,
    isPro ? undefined : 2
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-8 xl:grid-cols-2">
        <ExecutiveScoreCard
          score={analysis.executive_positioning_score}
          strengths={strengths}
          tier={analysis.positioning_tier}
          aiReadinessScore={analysis.ai_readiness_score}
        />
        {isPro && "dimension_scores" in analysis ? (
          <DimensionScores scores={analysis.dimension_scores} />
        ) : (
          <ProGate title="AI Readiness Breakdown Locked">
            <DimensionScores
              scores={{
                strategic_ownership: 72,
                leadership_visibility: 64,
                business_impact: 68,
                market_differentiation: 61,
                narrative_clarity: 66,
                executive_presence: 63,
              }}
            />
          </ProGate>
        )}
      </section>

      {isPro && "promotion_alignment" in analysis && "compensation_leverage_outlook" in analysis ? (
        <section className="grid gap-8 xl:grid-cols-2">
          <PromotionAlignment data={analysis.promotion_alignment} />
          <CompensationLeverage data={analysis.compensation_leverage_outlook} />
        </section>
      ) : (
        <section className="grid gap-8 xl:grid-cols-2">
          <ProGate title="Promotion Alignment Locked">
            <PromotionAlignment
              data={{
                current_level_fit: "Developing fit for target level.",
                next_level_readiness_percentage: 58,
                readiness_gap_summary:
                  "Executive signaling and quantified impact narratives remain underdeveloped.",
              }}
            />
          </ProGate>
          <ProGate title="Compensation Leverage Locked">
            <CompensationLeverage
              data={{
                positioning_band: "Transitional Band",
                leverage_assessment:
                  "Compensation leverage improves with stronger strategic ownership framing.",
              }}
            />
          </ProGate>
        </section>
      )}

      <CriticalGaps gaps={gaps} />

      <section className="l1-surface rounded-xl p-8">
        <p className="label-micro">Tactical Priorities</p>
        <ul className="mt-4 space-y-3">
          {priorities.map((item) => (
            <li
              className="rounded-lg border border-slate-700/55 bg-slate-900/55 p-4"
              key={item.id}
            >
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.strategic_objective}</p>
            </li>
          ))}
        </ul>
      </section>

      {isPro && "strategic_rewrite_samples" in analysis && "strategic_summary" in analysis ? (
        <>
          <RewriteSamples samples={analysis.strategic_rewrite_samples} />
          <StrategicSummary summary={analysis.strategic_summary} />
          <ProgressTracking
            analysisId={analysisId}
            priorities={analysis.tactical_execution_priorities}
          />
        </>
      ) : (
        <>
          <ProGate title="Strategic Rewrite Samples Locked">
            <RewriteSamples
              samples={[
                {
                  original_pattern: "Built feature set for key product workflows.",
                  executive_rewrite:
                    "Led cross-functional delivery of strategic workflow platform that increased adoption quality.",
                },
              ]}
            />
          </ProGate>
          <ProGate title="Strategic Summary Locked">
            <StrategicSummary summary="Comprehensive executive summary available on Pro plan." />
          </ProGate>
          <ProGate title="Execution Tracking Locked">
            <section className="l1-surface rounded-xl p-8">
              <p className="label-micro">Tactical Execution Intelligence</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <h3 className="text-2xl font-semibold text-slate-100">Progress Tracking</h3>
                <p className="rounded-md border border-slate-600/50 bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-300">
                  0% complete
                </p>
              </div>
            </section>
          </ProGate>
        </>
      )}
    </div>
  );
}
