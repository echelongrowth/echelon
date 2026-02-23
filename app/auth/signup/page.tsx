import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";
import { redirect } from "next/navigation";
import type { PlanType } from "@/types/intelligence";

type SignupSearchParams = { plan?: string };

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<SignupSearchParams> | SignupSearchParams;
}) {
  const resolvedSearchParams =
    searchParams && "then" in searchParams
      ? await searchParams
      : searchParams;

  const planParam = resolvedSearchParams?.plan;
  if (planParam !== "free" && planParam !== "pro") {
    redirect("/pricing");
  }

  const initialPlan: PlanType = planParam;

  return (
    <AuthCard
      description="Create your Echelon account to access the dashboard."
      footerHref="/auth/login"
      footerLinkText="Login"
      footerText="Already have an account?"
      title="Create Account"
    >
      <AuthForm initialPlan={initialPlan} mode="signup" />
    </AuthCard>
  );
}
