import type { HTMLAttributes, ReactNode } from "react";

type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  subtle?: boolean;
};

export function SurfaceCard({
  children,
  className = "",
  subtle = false,
  ...props
}: SurfaceCardProps) {
  const toneClass = subtle ? "apple-surface-subtle" : "apple-surface";
  return (
    <div className={`${toneClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function SectionHeader({
  label,
  title,
  subtitle,
  className = "",
}: {
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="apple-label">{label}</p>
      <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-[var(--db-text)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--db-muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

function deltaTone(direction: "up" | "down" | "neutral"): string {
  if (direction === "up") return "text-[#0A7F49] dark:text-[#56D39C]";
  if (direction === "down") return "text-[#A73A35] dark:text-[#FF9A95]";
  return "text-[var(--db-muted)]";
}

export function MetricCard({
  title,
  value,
  helper,
  trend = "neutral",
}: {
  title: string;
  value: number;
  helper: string;
  trend?: "up" | "down" | "neutral";
}) {
  const trendIcon = trend === "up" ? "\u2191" : trend === "down" ? "\u2193" : "\u2022";

  return (
    <SurfaceCard className="apple-card-hover rounded-[20px] p-7">
      <p className="apple-label">{title}</p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="apple-kpi text-center text-[60px] leading-[0.95]">{value}</p>
        <span className={`text-xs font-medium ${deltaTone(trend)}`}>
          {trendIcon}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--db-muted)]">{helper}</p>
    </SurfaceCard>
  );
}
