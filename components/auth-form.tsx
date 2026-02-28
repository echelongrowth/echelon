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
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignup = mode === "signup";

  function normalizeName(value: string): string {
    return value.replace(/\s+/g, " ").trim();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isSignup) {
        const normalizedFullName = normalizeName(fullName);
        if (normalizedFullName.length < 2 || normalizedFullName.length > 80) {
          throw new Error("Full Name must be between 2 and 80 characters.");
        }

        const firstName = normalizedFullName.split(/\s+/)[0] ?? normalizedFullName;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              plan_type: initialPlan,
              full_name: normalizedFullName,
              first_name: firstName,
            },
          },
        });
        if (error) throw error;

        // Best-effort profile sync. Signup should not fail if table policy blocks this.
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("users").upsert(
              {
                id: user.id,
                email,
                full_name: normalizedFullName,
                plan: initialPlan,
              },
              { onConflict: "id" }
            );
          }
        } catch {
          // ignore profile sync failures
        }

        setSuccessMessage(
          "Account created. If email confirmation is enabled, check your inbox."
        );
        router.replace("/assessment");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const nextPath = searchParams.get("next");
      const targetPath = nextPath && nextPath.trim() ? nextPath : "/dashboard";
      router.replace(targetPath);
    } catch (error) {
      if (error instanceof AuthApiError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
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
      {isSignup ? (
        <InputField
          autoComplete="name"
          id="fullName"
          label="Full Name"
          maxLength={80}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Your full name"
          required
          type="text"
          value={fullName}
        />
      ) : null}
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
        <p className="rounded-xl border border-[#f2c6c4] bg-[#3a1e1f] px-3 py-2 text-sm text-[#ff9a95]">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-xl border border-[#4a7f67] bg-[#16271f] px-3 py-2 text-sm text-[#7de1b0]">
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
