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
    return "border-slate-400/45 bg-slate-700/45 text-slate-100";
  }

  if (planType === "pro") {
    return "border-indigo-300/35 bg-indigo-400/15 text-indigo-100 animate-[pulse_4s_ease-in-out_infinite]";
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
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-600/60 bg-slate-900/70 text-sm font-semibold text-slate-100">
        {getInitials(firstName)}
      </div>
      <div>
        <p className="label-micro">
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
    <section className="l2-surface rounded-xl p-5">
      <p className="label-micro">
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
          className="inline-flex h-11 items-center justify-center rounded-lg border border-indigo-300/25 bg-indigo-400/20 px-5 text-sm font-medium text-indigo-100 transition-all duration-200 ease-out hover:border-indigo-200/45 hover:bg-indigo-400/28"
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
        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-500/40 bg-slate-800/45 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-out hover:border-slate-400/65 hover:bg-slate-700/45"
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
    <header className="fade-in-up l1-surface rounded-xl p-8">
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
