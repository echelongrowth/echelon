import { redirect } from "next/navigation";
import { AssessmentForm } from "@/components/assessment-form";
import { getPlanTypeForUser } from "@/lib/plan";
import { getRecalibrationStatus } from "@/lib/recalibration";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { AssessmentAnswers } from "@/types/assessment";
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

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams?: { recalibrate?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const planType = getPlanTypeForUser(user);
  const { data: latestAssessment, error: assessmentReadError } = await supabase
    .from("assessments")
    .select("id,answers,created_at")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (assessmentReadError) {
    redirect("/dashboard");
  }

  const isRecalibrationMode = searchParams?.recalibrate === "1";

  if (!latestAssessment) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
        <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
          <AssessmentForm mode="initial" />
        </div>
      </main>
    );
  }

  const status = getRecalibrationStatus(planType, latestAssessment.created_at);

  if (!isRecalibrationMode) {
    redirect("/dashboard");
  }

  if (!status.canRecalibrate || !isAssessmentAnswers(latestAssessment.answers)) {
    redirect("/dashboard");
  }


  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <AssessmentForm
          initialAnswers={latestAssessment.answers}
          mode="recalibrate"
        />
      </div>
    </main>
  );
}
