import { redirect } from "next/navigation";
import Link from "next/link";
import { ProgressChecklist } from "@/components/progress-checklist";
import { RiskLeverageRadar } from "@/components/risk-leverage-radar";
import { DashboardHeader } from "@/components/dashboard-header";
import { calculateScores } from "@/lib/scoring";
import { getPlanTypeForUser } from "@/lib/plan";
import { getRecalibrationStatus } from "@/lib/recalibration";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { AssessmentAnswers } from "@/types/assessment";
import type {
  FreeIntelligenceReport,
  IntelligenceReport,
  PlanType,
} from "@/types/intelligence";
import type { Json } from "@/types/database";

function isAssessmentAnswers(value: Json | null): value is AssessmentAnswers {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.profile === "object" &&
    typeof candidate.skills === "object" &&
    typeof candidate.positioning === "object" &&
    typeof candidate.selfEvaluation === "object"
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseIntelligenceReport(
  value: Json | null
): IntelligenceReport | FreeIntelligenceReport | null {
  if (!isObject(value)) return null;
  return value as IntelligenceReport | FreeIntelligenceReport;
}

function aiReadinessScore(level: AssessmentAnswers["skills"]["aiFamiliarity"]): number {
  if (level === "Beginner") return 30;
  if (level === "Intermediate") return 65;
  if (level === "Advanced") return 90;
  return 45;
}

function getRadarData(answers: AssessmentAnswers) {
  return [
    {
      metric: "Differentiation",
      value: answers.selfEvaluation.marketDifferentiation * 10,
    },
    {
      metric: "Leadership",
      value: answers.selfEvaluation.leadershipVisibility * 10,
    },
    {
      metric: "Network",
      value: answers.selfEvaluation.networkStrength * 10,
    },
    {
      metric: "Technical",
      value: answers.selfEvaluation.technicalRelevance * 10,
    },
    {
      metric: "AI Readiness",
      value: aiReadinessScore(answers.skills.aiFamiliarity),
    },
  ];
}

function ScoreCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: number;
  helper: string;
}) {
  const statusLabel =
    title.includes("Leverage")
      ? value >= 70
        ? "High Leverage"
        : value >= 50
          ? "Moderate Leverage"
          : "Low Leverage"
      : value <= 35
        ? "Low Risk Exposure"
        : value <= 60
          ? "Moderate Risk Exposure"
          : "High Risk Exposure";

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-violet-500/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <p className="mt-4 bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] bg-clip-text text-6xl font-semibold tracking-tight text-transparent">
        {value}
      </p>
      <p className="mt-3 text-sm font-medium text-slate-200">{statusLabel}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </article>
  );
}

function LockedProCard() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
      <div className="pointer-events-none space-y-3 blur-[3px]">
        <div className="h-5 w-40 rounded bg-slate-700/70" />
        <div className="h-4 w-full rounded bg-slate-700/70" />
        <div className="h-4 w-10/12 rounded bg-slate-700/70" />
        <div className="h-4 w-8/12 rounded bg-slate-700/70" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-xl border border-white/20 bg-slate-950/85 px-5 py-4 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-100">
            Pro feature locked
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Upgrade to unlock full 90-day roadmap and tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

function daysSince(value: string): number {
  const createdAtMs = new Date(value).getTime();
  const elapsedMs = Math.max(0, Date.now() - createdAtMs);
  return Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
}

function deriveFirstName(email: string | null, metadata: unknown): string {
  if (metadata && typeof metadata === "object") {
    const candidate = metadata as Record<string, unknown>;
    const firstName = candidate.first_name;
    if (typeof firstName === "string" && firstName.trim()) {
      return firstName.trim();
    }
  }

  if (!email) {
    return "Executive";
  }

  const localPart = email.split("@")[0] ?? "";
  const normalized = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!normalized.length) return "Executive";
  const candidate = normalized[0];
  return candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const planType: PlanType = getPlanTypeForUser(user);

  // Dashboard acts as a smart entry point.
  // Users without an assessment are routed to the assessment flow first.
  const { data: latestAssessment, error: assessmentReadError } = await supabase
    .from("assessments")
    .select("id,answers,created_at,leverage_score,risk_score,intelligence_report")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!assessmentReadError && !latestAssessment) {
    redirect("/assessment");
  }

  if (!latestAssessment || !isAssessmentAnswers(latestAssessment.answers)) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
            <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
            <p className="mt-3 text-sm text-slate-400">
              We could not find a valid assessment payload. Please complete your
              assessment again.
            </p>
            <Link
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-100 transition duration-200 ease-in-out hover:border-[#8B5CF6]/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]"
              href="/assessment"
            >
              Complete Assessment
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const computedScores = calculateScores(latestAssessment.answers);
  const leverageScore = latestAssessment.leverage_score ?? computedScores.leverageScore;
  const riskScore = latestAssessment.risk_score ?? computedScores.riskScore;
  const report = parseIntelligenceReport(latestAssessment.intelligence_report);
  const radarData = getRadarData(latestAssessment.answers);
  const recalibrationStatus = getRecalibrationStatus(
    planType,
    latestAssessment.created_at
  );
  const firstName = deriveFirstName(user.email ?? null, user.user_metadata);
  const lastCalibrationDays = daysSince(latestAssessment.created_at);
  const riskTrend = riskScore <= 35 ? "Stable" : riskScore <= 60 ? "Improving" : "Elevated";
  const recalibrateHref = "/assessment?recalibrate=1";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <DashboardHeader
          canRecalibrate={recalibrationStatus.canRecalibrate}
          firstName={firstName}
          lastCalibrationDays={lastCalibrationDays}
          nextRecalibrationDays={recalibrationStatus.canRecalibrate ? 0 : recalibrationStatus.remainingDays}
          planType={planType}
          recalibrateHref={recalibrateHref}
          riskTrend={riskTrend}
        />

        <section className="mt-10 grid gap-8 lg:grid-cols-3 fade-in-up">
          <ScoreCard
            helper="Composite indicator of strategic upside and positioning strength."
            title="Career Leverage Score"
            value={leverageScore}
          />
          <ScoreCard
            helper="Composite indicator of market and role exposure risk."
            title="Risk Exposure Score"
            value={riskScore}
          />
          <RiskLeverageRadar data={radarData} />
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Market Positioning
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">
            Strategic Summary
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {report?.marketPositioningSummary ??
              "Intelligence report is not generated yet. Re-run assessment to generate insights."}
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Positioning Gaps
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">Strategic Gaps</h2>
          {report?.strategicGaps?.length ? (
            <ul className="mt-5 space-y-3">
              {report.strategicGaps.map((gap) => (
                <li
                  className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-slate-200 transition duration-200 ease-in-out hover:border-[#4F8CFF]/40"
                  key={gap}
                >
                  {gap}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              No gaps generated yet. Submit or update your assessment.
            </p>
          )}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2 fade-in-up">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              30 Days
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-100">Roadmap</h2>
            {report?.roadmap30Days?.length ? (
              <ul className="mt-5 space-y-3">
                {report.roadmap30Days.map((item) => (
                  <li
                    className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-slate-200 transition duration-200 ease-in-out hover:border-[#4F8CFF]/40"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                Roadmap is unavailable until intelligence generation completes.
              </p>
            )}
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              90 Days
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-100">
              Strategic Plan
            </h2>
            {planType === "pro" ? (
              report && "roadmap90Days" in report && report.roadmap90Days.length ? (
                <ol className="mt-5 space-y-3">
                  {report.roadmap90Days.map((step) => (
                    <li
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-slate-200 transition duration-200 ease-in-out hover:border-[#4F8CFF]/40"
                      key={`${step.priority}-${step.action}`}
                    >
                      <p className="font-semibold text-slate-100">
                        P{step.priority}: {step.action}
                      </p>
                      <p className="mt-1 text-slate-400">{step.impact}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  90-day roadmap will appear after intelligence generation.
                </p>
              )
            ) : (
              <LockedProCard />
            )}
          </article>
        </section>

        {planType === "pro" ? (
          <section className="mt-10 grid gap-8 lg:grid-cols-2 fade-in-up">
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Capability Growth
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-100">
                Skill Recommendations
              </h2>
              {report && "skillRecommendations" in report ? (
                <ul className="mt-5 space-y-3">
                  {report.skillRecommendations.map((item) => (
                    <li
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-slate-200 transition duration-200 ease-in-out hover:border-[#4F8CFF]/40"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Recommendations will appear when report generation completes.
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Narrative Positioning
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-100">
                    Resume Positioning Insights
                  </h2>
                </div>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/45 hover:shadow-[0_0_16px_rgba(139,92,246,0.2)]"
                  href="/dashboard/resume-positioning"
                >
                  Open Module
                </Link>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {report && "resumePositioningInsights" in report
                  ? report.resumePositioningInsights
                  : "Resume positioning insights will appear after report generation."}
              </p>
              <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Side-Project Suggestions
              </h3>
              {report && "sideProjectSuggestions" in report ? (
                <ul className="mt-3 space-y-3">
                  {report.sideProjectSuggestions.map((item) => (
                    <li
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-slate-200 transition duration-200 ease-in-out hover:border-[#4F8CFF]/40"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          </section>
        ) : (
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm fade-in-up">
            <h2 className="text-2xl font-semibold text-slate-100">Upgrade to Pro</h2>
            <p className="mt-3 text-sm text-slate-300">
              Unlock full 90-day strategy, skill recommendations, resume insights,
              and progress tracking.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/45 hover:shadow-[0_0_18px_rgba(139,92,246,0.2)]"
                href="/dashboard/resume-positioning"
              >
                View Resume Module
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-4 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0_0_24px_rgba(79,140,255,0.35)]"
                href="/pricing"
              >
                Upgrade Plan
              </Link>
            </div>
          </section>
        )}

        {planType === "pro" ? (
          <section className="mt-10 fade-in-up">
            <ProgressChecklist />
          </section>
        ) : null}

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Current Plan: {planType.toUpperCase()}
          </p>
        </section>
      </div>
    </main>
  );
}
