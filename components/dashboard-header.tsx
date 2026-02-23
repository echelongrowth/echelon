import Link from "next/link";
import type { PlanType } from "@/types/intelligence";
import { AccountMenu } from "@/components/account-menu";

type PlanBadgeType = PlanType | "executive";
type RiskTrend = "Stable" | "Improving" | "Elevated";

type DashboardHeaderProps = {
  firstName: string;
  planType: PlanBadgeType;
  lastCalibrationDays: number;
  nextRecalibrationDays: number;
  canRecalibrate: boolean;
  riskTrend: RiskTrend;
  recalibrateHref: string;
};

function planLabel(planType: PlanBadgeType): string {
  if (planType === "pro") return "Pro";
  if (planType === "executive") return "Executive";
  return "Free";
}

function planBadgeClass(planType: PlanBadgeType): string {
  if (planType === "executive") {
    return "border-blue-300/35 bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-100 shadow-[0_0_16px_rgba(79,140,255,0.3)]";
  }

  if (planType === "pro") {
    return "border-violet-300/40 bg-violet-500/20 text-violet-100 shadow-[0_0_16px_rgba(139,92,246,0.35)] animate-[pulse_4s_ease-in-out_infinite]";
  }

  return "border-white/15 bg-white/5 text-slate-200";
}

function statusToneClass(trend: RiskTrend): string {
  if (trend === "Improving") return "text-emerald-300";
  if (trend === "Elevated") return "text-rose-300";
  return "text-blue-200";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function UserIdentity({
  firstName,
  planType,
}: {
  firstName: string;
  planType: PlanBadgeType;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-slate-900/70 text-sm font-semibold text-slate-100">
        {getInitials(firstName)}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Career Intelligence Command Center
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
          {firstName}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-xs text-slate-400">Strategic Profile Active</p>
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${planBadgeClass(
              planType
            )}`}
          >
            {planLabel(planType)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function StrategicStatus({
  lastCalibrationDays,
  nextRecalibrationDays,
  riskTrend,
}: {
  lastCalibrationDays: number;
  nextRecalibrationDays: number;
  riskTrend: RiskTrend;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/45 p-5 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Strategic Status
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-200 sm:grid-cols-2">
        <p>
          Career Intelligence Status:{" "}
          <span className="font-medium text-emerald-300">Active</span>
        </p>
        <p>
          Last Calibration:{" "}
          <span className="font-medium text-slate-100">{lastCalibrationDays} days ago</span>
        </p>
        <p>
          Next Recalibration:{" "}
          <span className="font-medium text-slate-100">{nextRecalibrationDays} days</span>
        </p>
        <p>
          Risk Trend:{" "}
          <span className={`font-medium ${statusToneClass(riskTrend)}`}>{riskTrend}</span>
        </p>
      </div>
    </section>
  );
}

export function HeaderActions({
  canRecalibrate,
  recalibrateHref,
}: {
  canRecalibrate: boolean;
  recalibrateHref: string;
}) {
  return (
    <div className="flex w-full items-center justify-start gap-3 lg:w-auto lg:justify-end">
      {canRecalibrate ? (
        <Link
          className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-5 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0_0_24px_rgba(79,140,255,0.3)]"
          href={recalibrateHref}
        >
          Recalibrate Strategic Profile
        </Link>
      ) : (
        <button
          className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-lg border border-white/10 bg-slate-800/70 px-5 text-sm font-medium text-slate-400"
          disabled
          type="button"
        >
          Recalibrate Strategic Profile
        </button>
      )}

      <Link
        className="inline-flex h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/45 hover:shadow-[0_0_18px_rgba(139,92,246,0.2)]"
        href="/pricing"
      >
        Upgrade Plan
      </Link>
      <AccountMenu />
    </div>
  );
}

export function DashboardHeader({
  firstName,
  planType,
  lastCalibrationDays,
  nextRecalibrationDays,
  canRecalibrate,
  riskTrend,
  recalibrateHref,
}: DashboardHeaderProps) {
  return (
    <header className="fade-in-up rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr_auto] xl:items-center">
        <UserIdentity firstName={firstName} planType={planType} />
        <StrategicStatus
          lastCalibrationDays={lastCalibrationDays}
          nextRecalibrationDays={nextRecalibrationDays}
          riskTrend={riskTrend}
        />
        <HeaderActions
          canRecalibrate={canRecalibrate}
          recalibrateHref={recalibrateHref}
        />
      </div>
    </header>
  );
}

