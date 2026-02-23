import type { PlanType } from "@/types/intelligence";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PRO_WINDOW_DAYS = 90;
const PRO_WINDOW_MS = PRO_WINDOW_DAYS * ONE_DAY_MS;

export type RecalibrationReason = "free_expired" | "pro_waiting" | "allowed";

export type RecalibrationStatus = {
  canRecalibrate: boolean;
  remainingDays: number;
  reason: RecalibrationReason;
};

export function getRecalibrationStatus(
  planType: PlanType,
  latestAssessmentCreatedAt: string | null
): RecalibrationStatus {
  if (!latestAssessmentCreatedAt) {
    return {
      canRecalibrate: true,
      remainingDays: 0,
      reason: "allowed",
    };
  }

  const nowMs = Date.now();
  const createdAtMs = new Date(latestAssessmentCreatedAt).getTime();
  const elapsedMs = Math.max(0, nowMs - createdAtMs);

  if (planType === "free") {
    if (elapsedMs < ONE_DAY_MS) {
      const remainingMs = ONE_DAY_MS - elapsedMs;
      return {
        canRecalibrate: true,
        remainingDays: Math.max(1, Math.ceil(remainingMs / ONE_DAY_MS)),
        reason: "allowed",
      };
    }

    return {
      canRecalibrate: false,
      remainingDays: 0,
      reason: "free_expired",
    };
  }

  if (elapsedMs >= PRO_WINDOW_MS) {
    return {
      canRecalibrate: true,
      remainingDays: 0,
      reason: "allowed",
    };
  }

  const remainingMs = PRO_WINDOW_MS - elapsedMs;
  return {
    canRecalibrate: false,
    remainingDays: Math.max(1, Math.ceil(remainingMs / ONE_DAY_MS)),
    reason: "pro_waiting",
  };
}

