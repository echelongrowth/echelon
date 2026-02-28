import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { generateStrategicSideProjects } from "@/lib/ai/generateStrategicSideProjects";
import { getPlanTypeForUser } from "@/lib/plan";
import { createNotification } from "@/lib/notifications";
import type { AssessmentAnswers } from "@/types/assessment";
import type { Json } from "@/types/database";
import type {
  SideProjectsApiResponse,
  StrategicSideProjectResponse,
} from "@/types/side-projects";

const ENTREPRENEURIAL_UNAVAILABLE_REASON =
  "Strategic Side-Project Engine activates for entrepreneurial or side-income career tracks.";
const REGEN_LIMIT_MESSAGE =
  "Generation limit reached. 3 strategic analyses per 30 days.";

function isAssessmentAnswers(value: Json | null): value is AssessmentAnswers {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    !!candidate.profile &&
    !!candidate.skills &&
    !!candidate.positioning &&
    !!candidate.selfEvaluation
  );
}

function toCareerGoalSlug(goal: AssessmentAnswers["positioning"]["careerGoal"]): string {
  if (goal === "Launch Startup") return "startup";
  if (goal === "Build Side Income") return "side_income";
  return "other";
}

function toMindset(
  interest: AssessmentAnswers["positioning"]["entrepreneurshipInterest"]
): string {
  return interest === "Yes" ? "entrepreneurial" : "operator";
}

function getNumericYears(years: number | ""): number {
  return typeof years === "number" ? years : 0;
}

function toNumberArrayAverage(values: number[]): number {
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
}

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("plan,full_name")
      .eq("id", user.id)
      .maybeSingle();

    // Do not hard-fail if users profile row or RLS access is missing.
    // Fall back to auth metadata plan so feature gating remains operational.
    const derivedPlan = getPlanTypeForUser(user);
    const plan =
      profile?.plan === "pro" || profile?.plan === "free"
        ? profile.plan
        : derivedPlan;
    if (plan !== "pro") {
      const unavailable: SideProjectsApiResponse = {
        feature_available: false,
        feature_unavailable_reason: ENTREPRENEURIAL_UNAVAILABLE_REASON,
      };
      return NextResponse.json(unavailable, { status: 200 });
    }

    const { data: latestAssessmentRow, error: assessmentError } = await supabase
      .from("assessments")
      .select("answers")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (assessmentError || !isAssessmentAnswers(latestAssessmentRow?.answers ?? null)) {
      return NextResponse.json(
        { error: "Assessment data is required before side-project generation." },
        { status: 400 }
      );
    }

    const assessment = latestAssessmentRow.answers;
    const careerGoal = toCareerGoalSlug(assessment.positioning.careerGoal);
    const mindset = toMindset(assessment.positioning.entrepreneurshipInterest);

    const metadataCareerGoal =
      typeof user.user_metadata?.career_goal === "string"
        ? user.user_metadata.career_goal
        : "";
    const metadataMindset =
      typeof user.user_metadata?.mindset === "string"
        ? user.user_metadata.mindset
        : "";

    const entrepreneurialTrackEnabled =
      careerGoal === "startup" ||
      careerGoal === "side_income" ||
      mindset === "entrepreneurial" ||
      metadataCareerGoal === "startup" ||
      metadataCareerGoal === "side_income" ||
      metadataMindset === "entrepreneurial";

    if (!entrepreneurialTrackEnabled) {
      const unavailable: SideProjectsApiResponse = {
        feature_available: false,
        feature_unavailable_reason: ENTREPRENEURIAL_UNAVAILABLE_REASON,
      };
      return NextResponse.json(unavailable, { status: 200 });
    }

    const { count, error: countError } = await supabase
      .from("side_projects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("generated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (countError) {
      return NextResponse.json(
        { error: "Unable to validate generation limits." },
        { status: 500 }
      );
    }

    const generationsUsed = count ?? 0;
    if (generationsUsed >= 3) {
      const blocked: SideProjectsApiResponse = {
        feature_available: true,
        regeneration_blocked: true,
        message: REGEN_LIMIT_MESSAGE,
      };
      return NextResponse.json(blocked, { status: 200 });
    }

    const { data: latestAnalysisRow } = await supabase
      .from("resume_analyses")
      .select("id,analysis_json")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const analysisJson = latestAnalysisRow?.analysis_json ?? {};
    const analysisObject =
      analysisJson && typeof analysisJson === "object"
        ? (analysisJson as Record<string, unknown>)
        : {};
    const skillGaps = Array.isArray(analysisObject.critical_gaps)
      ? analysisObject.critical_gaps
          .map((gap) => {
            if (!gap || typeof gap !== "object") return null;
            const candidate = gap as Record<string, unknown>;
            return typeof candidate.title === "string" ? candidate.title : null;
          })
          .filter((gap): gap is string => Boolean(gap))
      : [];

    const skillStack = [
      ...assessment.skills.primarySkills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      ...assessment.skills.secondarySkills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ];

    const riskLeverageIndex = toNumberArrayAverage([
      assessment.selfEvaluation.marketDifferentiation,
      assessment.selfEvaluation.leadershipVisibility,
      assessment.selfEvaluation.networkStrength,
      assessment.selfEvaluation.technicalRelevance,
    ]);
    const marketExposure = Math.max(0, 100 - riskLeverageIndex * 10);

    let generated: StrategicSideProjectResponse;
    try {
      generated = await generateStrategicSideProjects({
        analysis_json: analysisJson,
        user_profile: {
          full_name:
            profile?.full_name ??
            (typeof user.user_metadata?.full_name === "string"
              ? user.user_metadata.full_name
              : null),
          plan,
        },
        career_goal: careerGoal,
        industry: assessment.profile.industry || "Not specified",
        current_role: assessment.profile.currentRole || "Not specified",
        years_experience: getNumericYears(assessment.profile.yearsOfExperience),
        skill_stack: skillStack,
        skill_gaps: skillGaps,
        ai_readiness_level: assessment.skills.aiFamiliarity || "Unknown",
        risk_leverage_index: riskLeverageIndex,
        market_exposure: marketExposure,
      });
    } catch {
      return NextResponse.json(
        {
          error:
            "Unable to generate strategic analysis right now. Please try again shortly.",
        },
        { status: 502 }
      );
    }

    const { error: insertError } = await supabase.from("side_projects").insert({
      user_id: user.id,
      analysis_id: latestAnalysisRow?.id ?? null,
      career_goal: careerGoal,
      projects_json: generated as unknown as Json,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Unable to persist side-project analysis." },
        { status: 500 }
      );
    }

    const success: SideProjectsApiResponse = {
      feature_available: true,
      regeneration_blocked: false,
      analysis_id: latestAnalysisRow?.id ?? null,
      projects: generated.projects,
      generations_used_last_30_days: generationsUsed + 1,
    };

    try {
      await createNotification(supabase, {
        userId: user.id,
        planType: plan,
        type: "side_projects_ready",
        title: "Strategic side-project recommendations are ready",
        body: "Your latest entrepreneurial roadmap has been generated.",
        ctaUrl: "/dashboard#strategic-projects",
        dedupeKey: `side-projects-ready:${user.id}:${generationsUsed + 1}`,
      });
    } catch {
      // Notification delivery should not block primary workflow.
    }

    return NextResponse.json(success, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: "Strategic Side-Project Engine is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
