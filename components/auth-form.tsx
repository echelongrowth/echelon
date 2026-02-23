"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthApiError } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { InputField } from "@/components/input-field";
import { PrimaryButton } from "@/components/primary-button";
import type { AuthMode } from "@/types/auth";
import type { PlanType } from "@/types/intelligence";

type AuthFormProps = {
  mode: AuthMode;
  initialPlan?: PlanType;
};

export function AuthForm({ mode, initialPlan = "free" }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              plan_type: initialPlan,
            },
          },
        });
        if (error) throw error;

        setSuccessMessage(
          "Account created. If email confirmation is enabled, check your inbox."
        );
        router.replace("/assessment");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const nextPath = searchParams.get("next");
      const targetPath =
        nextPath && nextPath !== "/dashboard" ? nextPath : "/assessment";
      router.replace(targetPath);
    } catch (error) {
      if (error instanceof AuthApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unable to complete this request. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        autoComplete="email"
        id="email"
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        required
        type="email"
        value={email}
      />
      <InputField
        autoComplete={isSignup ? "new-password" : "current-password"}
        id="password"
        label="Password"
        minLength={8}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Minimum 8 characters"
        required
        type="password"
        value={password}
      />
      {errorMessage ? (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {successMessage}
        </p>
      ) : null}
      <PrimaryButton
        loading={isLoading}
        loadingText={isSignup ? "Creating account..." : "Signing in..."}
        type="submit"
      >
        {isSignup ? "Create account" : "Sign in"}
      </PrimaryButton>
    </form>
  );
}
