import { redirect } from "next/navigation";
import { getPlanTypeForUser } from "@/lib/plan";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ResumePositioningWorkspace } from "@/app/dashboard/resume-positioning/components/ResumePositioningWorkspace";
import { UpgradeGate } from "@/app/dashboard/resume-positioning/components/UpgradeGate";
import type { Json } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-positioning";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isResumeAnalysis(value: Json | null): value is ResumeAnalysis {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  if (
    !candidate.dimension_scores ||
    typeof candidate.dimension_scores !== "object" ||
    !candidate.promotion_alignment ||
    typeof candidate.promotion_alignment !== "object" ||
    !candidate.compensation_leverage_outlook ||
    typeof candidate.compensation_leverage_outlook !== "object"
  ) {
    return false;
  }

  return (
    typeof candidate.executive_positioning_score === "number" &&
    typeof candidate.positioning_tier === "string" &&
    isStringArray(candidate.strengths) &&
    Array.isArray(candidate.critical_gaps) &&
    Array.isArray(candidate.strategic_rewrite_samples) &&
    typeof candidate.strategic_summary === "string"
  );
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

  const planType =
    profile?.plan === "pro" || profile?.plan === "free"
      ? profile.plan
      : getPlanTypeForUser(user);

  if (planType !== "pro") {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <UpgradeGate />
        </div>
      </main>
    );
  }

  const { data: latestAnalysisRow } = await supabase
    .from("resume_analyses")
    .select("analysis_json,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const initialAnalysis = isResumeAnalysis(latestAnalysisRow?.analysis_json ?? null)
    ? (latestAnalysisRow?.analysis_json as ResumeAnalysis)
    : null;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <ResumePositioningWorkspace
          initialAnalysis={initialAnalysis}
          latestCreatedAt={latestAnalysisRow?.created_at ?? null}
        />
      </div>
    </main>
  );
}

