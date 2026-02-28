import { redirect } from "next/navigation";
import Link from "next/link";
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
  searchParams?: { recalibrate?: string } | Promise<{ recalibrate?: string }>;
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

  const resolvedSearchParams =
    searchParams && "then" in searchParams ? await searchParams : searchParams;
  const isRecalibrationMode = resolvedSearchParams?.recalibrate === "1";

  if (!latestAssessment) {
    return (
      <main className="dashboard-theme min-h-screen">
        <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-5">
            <Link
              className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
              href="/dashboard"
            >
              Back to Dashboard
            </Link>
          </div>
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
    <main className="dashboard-theme min-h-screen">
      <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5">
          <Link
            className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
            href="/dashboard"
          >
            Back to Dashboard
          </Link>
        </div>
        <AssessmentForm
          initialAnswers={latestAssessment.answers}
          mode="recalibrate"
        />
      </div>
    </main>
  );
}
