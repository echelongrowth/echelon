"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PlanType } from "@/types/intelligence";
import { AccountMenu } from "@/components/account-menu";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { NotificationsBell } from "@/components/notifications-bell";

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
    return "bg-[color-mix(in_oklab,var(--db-text)_10%,transparent)] text-[var(--db-text)]";
  }

  if (planType === "pro") {
    return "bg-[color-mix(in_oklab,var(--db-accent)_14%,transparent)] text-[var(--db-accent)]";
  }

  return "bg-[color-mix(in_oklab,var(--db-border)_85%,transparent)] text-[var(--db-muted)]";
}

function statusToneClass(trend: RiskTrend): string {
  if (trend === "Improving") return "text-[#0A7F49] dark:text-[#56D39C]";
  if (trend === "Elevated") return "text-[#A73A35] dark:text-[#FF9A95]";
  return "text-[var(--db-muted)]";
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
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--db-border)] bg-[var(--db-surface)]/90 text-sm font-medium text-[var(--db-text)]">
        {getInitials(firstName)}
      </div>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-[var(--db-text)]">
          {firstName}
        </h1>
        <div className="mt-1.5 flex items-center gap-2">
          <p className="text-sm text-[var(--db-muted)]">Strategic Profile Active</p>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${planBadgeClass(
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
    <section className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-[var(--db-muted)] md:grid-cols-4">
      <p>
        Status{" "}
        <span className="font-medium text-[#0A7F49] dark:text-[#56D39C]">Active</span>
      </p>
      <p>
        Last <span className="font-medium text-[var(--db-text)]">{lastCalibrationDays}d ago</span>
      </p>
      <p>
        Next <span className="font-medium text-[var(--db-text)]">{nextRecalibrationDays}d</span>
      </p>
      <p>
        Risk <span className={`font-medium ${statusToneClass(riskTrend)}`}>{riskTrend}</span>
      </p>
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
    <div className="flex w-full items-center gap-2.5 md:w-auto md:justify-end">
      {canRecalibrate ? (
        <Link
          className="apple-primary-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
          href={recalibrateHref}
        >
          Recalibrate
        </Link>
      ) : (
        <button
          className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-full border border-[var(--db-border)] px-4 text-sm font-medium text-[var(--db-muted)]/70"
          disabled
          type="button"
        >
          Recalibrate
        </button>
      )}

      <Link
        className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
        href="/pricing"
      >
        Upgrade
      </Link>
      <NotificationsBell />
      <AccountMenu />
    </div>
  );
}

const transition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1],
} as const;

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
    <motion.header
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] border-b border-[var(--db-border)] pb-5"
      initial={{ opacity: 0, y: 10 }}
      transition={transition}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <Link className="inline-flex items-center" href="/dashboard">
            <BrandLogo size="md" variant="full" />
          </Link>
          <UserIdentity firstName={firstName} planType={planType} />
          <StrategicStatus
            lastCalibrationDays={lastCalibrationDays}
            nextRecalibrationDays={nextRecalibrationDays}
            riskTrend={riskTrend}
          />
        </div>
        <HeaderActions
          canRecalibrate={canRecalibrate}
          recalibrateHref={recalibrateHref}
        />
      </div>
    </motion.header>
  );
}
