import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { calculateScores } from "@/lib/scoring";
import { filterReportByPlan, generateIntelligenceReport } from "@/lib/intelligence";
import { getPlanTypeForUser } from "@/lib/plan";
import { createNotification } from "@/lib/notifications";
import type { AssessmentAnswers } from "@/types/assessment";
import type {
  GenerateIntelligenceRequest,
  GenerateIntelligenceResponse,
} from "@/types/intelligence";

export const runtime = "nodejs";

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

    const body = (await request.json()) as Partial<GenerateIntelligenceRequest>;
    if (!body.assessmentId) {
      return NextResponse.json(
        { error: "assessmentId is required." },
        { status: 400 }
      );
    }

    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("id,user_id,answers")
      .eq("id", body.assessmentId)
      .eq("user_id", user.id)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: "Assessment not found for this user." },
        { status: 404 }
      );
    }

    if (!isAssessmentAnswers(assessment.answers)) {
      return NextResponse.json(
        { error: "Invalid assessment answers format." },
        { status: 400 }
      );
    }

    const planType = getPlanTypeForUser(user);
    const scores = calculateScores(assessment.answers);
    const fullReport = await generateIntelligenceReport({
      answers: assessment.answers,
      leverageScore: scores.leverageScore,
      riskScore: scores.riskScore,
      planType,
    });
    const filteredReport = filterReportByPlan(fullReport, planType);

    const { error: updateError } = await supabase
      .from("assessments")
      .update({
        leverage_score: scores.leverageScore,
        risk_score: scores.riskScore,
        intelligence_report: filteredReport,
      })
      .eq("id", assessment.id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to store intelligence report." },
        { status: 500 }
      );
    }

    const responseBody: GenerateIntelligenceResponse = {
      assessmentId: assessment.id,
      leverageScore: scores.leverageScore,
      riskScore: scores.riskScore,
      planType,
      intelligenceReport: filteredReport,
    };

    try {
      await createNotification(supabase, {
        userId: user.id,
        planType,
        type: "intelligence_ready",
        title: "Strategic intelligence report is ready",
        body: "New leverage and risk insights are available on your dashboard.",
        ctaUrl: "/dashboard",
        dedupeKey: `intelligence-ready:${assessment.id}`,
      });
    } catch {
      // Notification delivery should not block primary workflow.
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown intelligence generation error.",
      },
      { status: 500 }
    );
  }
}
