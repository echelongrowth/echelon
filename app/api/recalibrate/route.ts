import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { calculateScores } from "@/lib/scoring";
import { filterReportByPlan, generateIntelligenceReport } from "@/lib/intelligence";
import { getPlanTypeForUser } from "@/lib/plan";
import { getRecalibrationStatus } from "@/lib/recalibration";
import type { AssessmentAnswers } from "@/types/assessment";

export const runtime = "nodejs";

type RecalibrateRequest = {
  answers: AssessmentAnswers;
};

function isAssessmentAnswers(value: unknown): value is AssessmentAnswers {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.profile === "object" &&
    typeof candidate.skills === "object" &&
    typeof candidate.positioning === "object" &&
    typeof candidate.selfEvaluation === "object"
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<RecalibrateRequest>;
    if (!isAssessmentAnswers(body.answers)) {
      return NextResponse.json(
        { error: "A valid assessment payload is required." },
        { status: 400 }
      );
    }

    const planType = getPlanTypeForUser(user);

    const { data: latestAssessment, error: latestAssessmentError } = await supabase
      .from("assessments")
      .select("id,created_at,version_number")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestAssessmentError) {
      return NextResponse.json(
        { error: "Unable to resolve current assessment state." },
        { status: 500 }
      );
    }

    const status = getRecalibrationStatus(
      planType,
      latestAssessment?.created_at ?? null
    );

    if (latestAssessment && !status.canRecalibrate) {
      return NextResponse.json(
        {
          error:
            status.reason === "free_expired"
              ? "Recalibration window is closed for the free plan."
              : `Next recalibration available in ${status.remainingDays} day(s).`,
          reason: status.reason,
          remainingDays: status.remainingDays,
        },
        { status: 403 }
      );
    }

    const scores = calculateScores(body.answers);
    const fullReport = await generateIntelligenceReport({
      answers: body.answers,
      leverageScore: scores.leverageScore,
      riskScore: scores.riskScore,
      planType,
    });
    const filteredReport = filterReportByPlan(fullReport, planType);

    const { data: newAssessmentId, error: rpcError } = await supabase.rpc(
      "recalibrate_assessment",
      {
        p_previous_assessment_id: latestAssessment?.id ?? null,
        p_answers: body.answers,
        p_leverage_score: scores.leverageScore,
        p_risk_score: scores.riskScore,
        p_intelligence_report: filteredReport,
      }
    );

    if (rpcError || !newAssessmentId) {
      return NextResponse.json(
        { error: "Failed to persist recalibration version." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        assessmentId: newAssessmentId,
        leverageScore: scores.leverageScore,
        riskScore: scores.riskScore,
        planType,
        reason: status.reason,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown recalibration error.",
      },
      { status: 500 }
    );
  }
}

