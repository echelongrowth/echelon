import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <AuthCard
      description="Access your growth operating system."
      footerHref="/auth/signup?plan=free"
      footerLinkText="Create account"
      footerText="New to Echelon?"
      title="Login"
    >
      <AuthForm mode="login" />
    </AuthCard>
  );
}
