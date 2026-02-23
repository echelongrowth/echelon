import type { User } from "@supabase/supabase-js";
import type { PlanType } from "@/types/intelligence";

function isPlanType(value: unknown): value is PlanType {
  return value === "free" || value === "pro";
}

export function getPlanTypeForUser(user: User): PlanType {
  const userMetadataPlan = user.user_metadata?.plan_type;
  const appMetadataPlan = user.app_metadata?.plan_type;

  if (isPlanType(userMetadataPlan)) return userMetadataPlan;
  if (isPlanType(appMetadataPlan)) return appMetadataPlan;

  return "free";
}

