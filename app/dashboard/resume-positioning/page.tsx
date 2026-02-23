import { redirect } from "next/navigation";
import { getPlanTypeForUser } from "@/lib/plan";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ResumePositioningWorkspace } from "@/app/dashboard/resume-positioning/components/ResumePositioningWorkspace";
import type { PlanType } from "@/types/intelligence";
import type { Json } from "@/types/database";
import type {
  FreeResumeAnalysis,
  ResumeAnalysis,
} from "@/types/resume-positioning";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isResumeAnalysis(value: Json | null): value is ResumeAnalysis | FreeResumeAnalysis {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.executive_positioning_score === "number" &&
    typeof candidate.ai_readiness_score === "number" &&
    typeof candidate.positioning_tier === "string" &&
    isStringArray(candidate.strengths) &&
    Array.isArray(candidate.critical_gaps) &&
    Array.isArray(candidate.tactical_execution_priorities) &&
    (!("dimension_scores" in candidate) || typeof candidate.dimension_scores === "object") &&
    (!("promotion_alignment" in candidate) ||
      typeof candidate.promotion_alignment === "object") &&
    (!("compensation_leverage_outlook" in candidate) ||
      typeof candidate.compensation_leverage_outlook === "object") &&
    (!("strategic_rewrite_samples" in candidate) ||
      Array.isArray(candidate.strategic_rewrite_samples)) &&
    (!("strategic_summary" in candidate) || typeof candidate.strategic_summary === "string")
  );
}

function toFreeView(
  analysis: ResumeAnalysis | FreeResumeAnalysis
): FreeResumeAnalysis {
  return {
    executive_positioning_score: analysis.executive_positioning_score,
    ai_readiness_score: analysis.ai_readiness_score,
    positioning_tier: analysis.positioning_tier,
    strengths: analysis.strengths.slice(0, 3),
    critical_gaps: analysis.critical_gaps.slice(0, 2),
    tactical_execution_priorities: analysis.tactical_execution_priorities.slice(0, 2),
  };
}

export default async function ResumePositioningPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const planType: PlanType =
    profile?.plan === "pro" || profile?.plan === "free"
      ? profile.plan
      : getPlanTypeForUser(user);

  const { data: latestAnalysisRow } = await supabase
    .from("resume_analyses")
    .select("id,analysis_json,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const rawAnalysis = isResumeAnalysis(latestAnalysisRow?.analysis_json ?? null)
    ? (latestAnalysisRow?.analysis_json as ResumeAnalysis | FreeResumeAnalysis)
    : null;
  const initialAnalysis =
    rawAnalysis && planType === "free" ? toFreeView(rawAnalysis) : rawAnalysis;

  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <ResumePositioningWorkspace
          initialAnalysis={initialAnalysis}
          initialAnalysisId={latestAnalysisRow?.id ?? null}
          latestCreatedAt={latestAnalysisRow?.created_at ?? null}
          planType={planType}
        />
      </div>
    </main>
  );
}
