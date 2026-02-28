import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProgressChecklist } from "@/components/progress-checklist";
import { RiskLeverageRadar } from "@/components/risk-leverage-radar";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav";
import { EntrepreneurialSideProjectEngine } from "@/components/pro/EntrepreneurialSideProjectEngine";
import { MetricCard, SectionHeader, SurfaceCard } from "@/components/dashboard-primitives";
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
import type { StrategicSideProject } from "@/types/side-projects";

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

function isStrategicSideProjects(value: Json | null): value is { projects: StrategicSideProject[] } {
  if (!isObject(value)) return false;
  const projects = value.projects;
  if (!Array.isArray(projects)) return false;

  return projects.every((project) => {
    if (!project || typeof project !== "object") return false;
    const candidate = project as Record<string, unknown>;
    return (
      typeof candidate.title === "string" &&
      typeof candidate.strategicObjective === "string" &&
      typeof candidate.marketOpportunity === "string" &&
      typeof candidate.monetizationAngle === "string" &&
      typeof candidate.aiIntegrationAngle === "string" &&
      typeof candidate.executionRoadmap === "string" &&
      typeof candidate.resumeBulletExample === "string" &&
      typeof candidate.riskAssessment === "string"
    );
  });
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

function LockedProCard() {
  return (
    <SurfaceCard className="rounded-[20px] p-7" subtle>
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--db-border)] text-xs text-[var(--db-muted)]">
          i
        </span>
        <div>
          <p className="apple-label">Pro Feature</p>
          <h4 className="mt-2 text-lg font-semibold text-[var(--db-text)]">
            90-Day Strategic Plan Locked
          </h4>
          <p className="mt-2 text-sm leading-6 text-[var(--db-muted)]">
            Unlock full roadmap and side-project strategy with Pro access.
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}

function SectionShell({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id}>
      <SurfaceCard className="rounded-[20px] p-7 md:p-8">
        <SectionHeader label={label} title={title} />
        <div className="mt-6">{children}</div>
      </SurfaceCard>
    </section>
  );
}

function DashboardHero({
  firstName,
  leverageScore,
  riskScore,
  hasIntelligence,
}: {
  firstName: string;
  leverageScore: number;
  riskScore: number;
  hasIntelligence: boolean;
}) {
  return (
    <SurfaceCard className="apple-hero-glow relative overflow-hidden rounded-[20px] p-8 md:p-10">
      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="apple-label">Executive Intelligence Briefing</p>
          <h2 className="mt-4 max-w-3xl text-[30px] font-semibold leading-tight tracking-tight text-[var(--db-text)] md:text-[32px]">
            Design Career Leverage With Strategic Precision
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[var(--db-muted)]">
            {firstName}, this command layer consolidates strategic scores, market signals, and
            execution priorities into one calm system view for deliberate career compounding.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="apple-primary-btn inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium"
              href="/assessment"
            >
              Get Strategic Intelligence
            </Link>
            <Link
              className="apple-ghost-btn inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium"
              href="/pricing"
            >
              Unlock Full Evolution
            </Link>
          </div>
        </div>
        <SurfaceCard className="rounded-[20px] p-6" subtle>
          <p className="apple-label">Live Snapshot</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/85 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--db-muted)]">Leverage</p>
              <p className="mt-2 text-4xl font-light text-[var(--db-text)]">{leverageScore}</p>
            </div>
            <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/85 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--db-muted)]">Risk</p>
              <p className="mt-2 text-4xl font-light text-[var(--db-text)]">{riskScore}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/85 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--db-muted)]">Strategic Path</p>
            <div className="mt-3 space-y-2.5 text-sm text-[var(--db-muted)]">
              <p>Assessment completed</p>
              <p>{hasIntelligence ? "Intelligence report active" : "Intelligence report pending"}</p>
              <p>Execution milestones tracking</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </SurfaceCard>
  );
}

function daysSince(value: string): number {
  const createdAtMs = new Date(value).getTime();
  const elapsedMs = Math.max(0, Date.now() - createdAtMs);
  return Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
}

const SIDE_PROJECT_ENGINE_LOCK_REASON =
  "Strategic Side-Project Engine activates for entrepreneurial or side-income career tracks.";

function deriveFirstName(
  metadata: unknown,
  fullName: string | null,
  email: string | null
): string {
  if (metadata && typeof metadata === "object") {
    const candidate = metadata as Record<string, unknown>;
    const firstName = candidate.first_name;
    if (typeof firstName === "string" && firstName.trim()) {
      return firstName.trim();
    }
    const metadataFullName = candidate.full_name;
    if (typeof metadataFullName === "string" && metadataFullName.trim()) {
      const parsed = metadataFullName.trim().split(/\s+/)[0] ?? "";
      if (parsed) {
        return parsed.charAt(0).toUpperCase() + parsed.slice(1);
      }
    }
  }

  if (fullName && fullName.trim()) {
    const firstName = fullName.trim().split(/\s+/)[0] ?? "";
    if (firstName) {
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
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

function OverviewIcon() {
  return (
    <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 12h16M12 4v16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 16l4-5 3 3 5-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M5 5v14h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 3l2.2 4.8L19 10l-4.8 2.2L12 17l-2.2-4.8L5 10l4.8-2.2L12 3z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "hero", label: "Overview", icon: <OverviewIcon /> },
  { id: "scores", label: "Scores", icon: <ChartIcon /> },
  { id: "ai-readiness", label: "AI Readiness", icon: <SparkIcon /> },
  { id: "skill-gaps", label: "Skill Gaps", icon: <SparkIcon /> },
  { id: "strategic-projects", label: "Roadmap", icon: <ChartIcon /> },
  { id: "execution", label: "Execution", icon: <OverviewIcon /> },
];

function DashboardSideNav() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 w-[240px] rounded-[20px] border border-[var(--db-border)] bg-[var(--db-surface)]/85 p-4 shadow-[var(--db-shadow)] backdrop-blur-md">
        <p className="apple-label px-2">Navigation</p>
        <nav className="mt-3 space-y-1.5">
          {NAV_ITEMS.map((item, index) => (
            <a
              className={`group flex items-center gap-3 rounded-full px-3 py-2.5 text-sm transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
                index === 0
                  ? "bg-[color-mix(in_oklab,var(--db-accent)_14%,transparent)] text-[var(--db-text)]"
                  : "text-[var(--db-muted)] hover:bg-[color-mix(in_oklab,var(--db-accent)_8%,transparent)] hover:text-[var(--db-text)]"
              }`}
              href={`#${item.id}`}
              key={item.id}
            >
              <span className="text-[var(--db-muted)] group-hover:text-[var(--db-text)]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const planType: PlanType = getPlanTypeForUser(user);

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
      <main className="dashboard-theme min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <SurfaceCard className="rounded-[20px] p-8">
            <h1 className="text-[30px] font-semibold tracking-tight text-[var(--db-text)]">Dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--db-muted)]">
              We could not find a valid assessment payload. Please complete your assessment again.
            </p>
            <Link
              className="apple-ghost-btn mt-5 inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
              href="/assessment"
            >
              Complete Assessment
            </Link>
          </SurfaceCard>
        </div>
      </main>
    );
  }

  const computedScores = calculateScores(latestAssessment.answers);
  const leverageScore = latestAssessment.leverage_score ?? computedScores.leverageScore;
  const riskScore = latestAssessment.risk_score ?? computedScores.riskScore;
  const report = parseIntelligenceReport(latestAssessment.intelligence_report);
  const radarData = getRadarData(latestAssessment.answers);
  const { data: latestSideProjectsRow } =
    planType === "pro"
      ? await supabase
          .from("side_projects")
          .select("projects_json")
          .eq("user_id", user.id)
          .order("generated_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : { data: null };
  const initialSideProjects = isStrategicSideProjects(
    latestSideProjectsRow?.projects_json ?? null
  )
    ? latestSideProjectsRow.projects_json.projects
    : null;
  const recalibrationStatus = getRecalibrationStatus(
    planType,
    latestAssessment.created_at
  );
  const goal = latestAssessment.answers.positioning.careerGoal;
  const entrepreneurialInterest =
    latestAssessment.answers.positioning.entrepreneurshipInterest;
  const sideProjectFeatureUnlocked =
    goal === "Launch Startup" ||
    goal === "Build Side Income" ||
    entrepreneurialInterest === "Yes";
  const firstName = deriveFirstName(
    user.user_metadata,
    userProfile?.full_name ?? null,
    user.email ?? null
  );
  const lastCalibrationDays = daysSince(latestAssessment.created_at);
  const riskTrend = riskScore <= 35 ? "Stable" : riskScore <= 60 ? "Improving" : "Elevated";
  const recalibrateHref = "/assessment?recalibrate=1";

  return (
    <main className="dashboard-theme min-h-screen">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader
          canRecalibrate={recalibrationStatus.canRecalibrate}
          firstName={firstName}
          lastCalibrationDays={lastCalibrationDays}
          nextRecalibrationDays={recalibrationStatus.canRecalibrate ? 0 : recalibrationStatus.remainingDays}
          planType={planType}
          recalibrateHref={recalibrateHref}
          riskTrend={riskTrend}
        />

        <div className="mt-6">
          <DashboardMobileNav />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <DashboardSideNav />

          <div className="space-y-12">
            <section id="hero">
              <DashboardHero
                firstName={firstName}
                leverageScore={leverageScore}
                riskScore={riskScore}
                hasIntelligence={Boolean(report)}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-12" id="scores">
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
                <MetricCard
                  helper="Composite indicator of strategic upside and positioning strength."
                  title="Career Leverage Score"
                  trend={leverageScore >= 50 ? "up" : "neutral"}
                  value={leverageScore}
                />
                <MetricCard
                  helper="Composite indicator of market and role exposure risk."
                  title="Risk Exposure Score"
                  trend={riskScore > 60 ? "down" : "up"}
                  value={riskScore}
                />
              </div>
              <RiskLeverageRadar data={radarData} />
            </section>

            <SectionShell id="ai-readiness" label="Market Positioning" title="Strategic Summary">
              <p className="max-w-3xl text-[15px] leading-8 text-[var(--db-muted)]">
                {report?.marketPositioningSummary ??
                  "Intelligence report is not generated yet. Re-run assessment to generate insights."}
              </p>
            </SectionShell>

            <SectionShell id="skill-gaps" label="Positioning Gaps" title="Strategic Gaps">
              {report?.strategicGaps?.length ? (
                <ul className="space-y-3">
                  {report.strategicGaps.map((gap) => (
                    <li
                      className="apple-card-hover rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)]/70 px-5 py-4 text-sm leading-7 text-[var(--db-text)]"
                      key={gap}
                    >
                      {gap}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)]/70 px-5 py-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--db-border)] text-xs text-[var(--db-muted)]">
                    i
                  </span>
                  <p className="text-sm text-[var(--db-muted)]">
                    No gaps generated yet. Submit or update your assessment.
                  </p>
                </div>
              )}
            </SectionShell>

            <SectionShell id="strategic-projects" label="Strategic Projects" title="Roadmap & Recommendations">
              <div className="grid gap-6 xl:grid-cols-2">
                <SurfaceCard className="rounded-[20px] p-7" subtle>
                  <p className="apple-label">30 Days</p>
                  <h3 className="mt-2 text-[21px] font-semibold tracking-tight text-[var(--db-text)]">Roadmap</h3>
                  {report?.roadmap30Days?.length ? (
                    <ul className="mt-5 space-y-3">
                      {report.roadmap30Days.map((item) => (
                        <li
                          className="apple-card-hover rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/85 px-5 py-4 text-sm leading-7 text-[var(--db-text)]"
                          key={item}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-[var(--db-muted)]">
                      Roadmap is unavailable until intelligence generation completes.
                    </p>
                  )}
                </SurfaceCard>

                <SurfaceCard className="rounded-[20px] p-7" subtle>
                  <p className="apple-label">90 Days</p>
                  <h3 className="mt-2 text-[21px] font-semibold tracking-tight text-[var(--db-text)]">Strategic Plan</h3>
                  {planType === "pro" ? (
                    report && "roadmap90Days" in report && report.roadmap90Days.length ? (
                      <ol className="mt-5 space-y-3">
                        {report.roadmap90Days.map((step) => (
                          <li
                            className="apple-card-hover rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/85 px-5 py-4 text-sm leading-7 text-[var(--db-text)]"
                            key={`${step.priority}-${step.action}`}
                          >
                            <p className="font-semibold text-[var(--db-text)]">
                              P{step.priority}: {step.action}
                            </p>
                            <p className="mt-1 text-[var(--db-muted)]">{step.impact}</p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-3 text-sm leading-7 text-[var(--db-muted)]">
                        90-day roadmap will appear after intelligence generation.
                      </p>
                    )
                  ) : (
                    <div className="mt-4">
                      <LockedProCard />
                    </div>
                  )}
                </SurfaceCard>
              </div>

              {planType === "pro" ? (
                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                  <SurfaceCard className="rounded-[20px] p-7" subtle>
                    <p className="apple-label">Capability Growth</p>
                    <h3 className="mt-2 text-[21px] font-semibold tracking-tight text-[var(--db-text)]">
                      Skill Recommendations
                    </h3>
                    {report && "skillRecommendations" in report ? (
                      <ul className="mt-5 space-y-3">
                        {report.skillRecommendations.map((item) => (
                          <li
                            className="apple-card-hover rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/85 px-5 py-4 text-sm leading-7 text-[var(--db-text)]"
                            key={item}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm leading-7 text-[var(--db-muted)]">
                        Recommendations will appear when report generation completes.
                      </p>
                    )}
                  </SurfaceCard>

                  <SurfaceCard className="rounded-[20px] p-7" subtle>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="apple-label">Narrative Positioning</p>
                        <h3 className="mt-2 text-[21px] font-semibold tracking-tight text-[var(--db-text)]">
                          Resume Positioning Insights
                        </h3>
                      </div>
                      <Link
                        className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-xs font-medium"
                        href="/dashboard/resume-positioning"
                      >
                        Open Module
                      </Link>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--db-muted)]">
                      {report && "resumePositioningInsights" in report
                        ? report.resumePositioningInsights
                        : "Resume positioning insights will appear after report generation."}
                    </p>
                    <h4 className="apple-label mt-6">Side-Project Suggestions</h4>
                    {report && "sideProjectSuggestions" in report ? (
                      <ul className="mt-3 space-y-3">
                        {report.sideProjectSuggestions.map((item) => (
                          <li
                            className="apple-card-hover rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/85 px-5 py-4 text-sm leading-7 text-[var(--db-text)]"
                            key={item}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </SurfaceCard>
                </div>
              ) : (
                <SurfaceCard className="mt-8 rounded-[20px] p-7" subtle>
                  <h3 className="text-[21px] font-semibold tracking-tight text-[var(--db-text)]">Upgrade to Pro</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--db-muted)]">
                    Unlock full 90-day roadmap, side-project strategy, and execution tracking.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
                      href="/dashboard/resume-positioning"
                    >
                      View Resume Module
                    </Link>
                    <Link
                      className="apple-primary-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
                      href="/pricing"
                    >
                      Upgrade Plan
                    </Link>
                  </div>
                </SurfaceCard>
              )}
            </SectionShell>

            {planType === "pro" ? (
              <section>
                <EntrepreneurialSideProjectEngine
                  initialProjects={initialSideProjects}
                  initialUnavailableReason={
                    sideProjectFeatureUnlocked ? undefined : SIDE_PROJECT_ENGINE_LOCK_REASON
                  }
                />
              </section>
            ) : null}

            {planType === "pro" ? (
              <section id="execution">
                <ProgressChecklist />
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
