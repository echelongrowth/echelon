"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function SurfaceCard({ children, className = "", ...props }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[20px] border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.16)] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-[1280px] px-4 md:px-6 ${className}`.trim()}>
      {children}
    </section>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export function PrimaryButton({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-12 items-center justify-center rounded-xl border border-[#7aa4ff55] bg-gradient-to-r from-[#3f6fe8] to-[#5b8cff] px-5 text-sm font-medium text-white transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[1px] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b8cff55] disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
      {...props}
    />
  );
}

export function GhostButton({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-12 items-center justify-center rounded-xl border border-[var(--app-border)] bg-transparent px-5 text-sm font-medium text-[var(--app-text)] transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[1px] hover:bg-[#ffffff0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b8cff55] disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
      {...props}
    />
  );
}

export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <SurfaceCard className="p-6 md:p-7">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">
        {label}
      </p>
      <p className="mt-4 text-center text-6xl font-light tracking-[-0.03em] text-[var(--app-text)]">
        {value}
      </p>
      <p className="mt-3 text-center text-sm text-[var(--app-muted)]">{helper}</p>
    </SurfaceCard>
  );
}

export function FormInput({
  id,
  label,
  input,
}: {
  id: string;
  label: string;
  input: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--app-text)]" htmlFor={id}>
        {label}
      </label>
      {input}
    </div>
  );
}

export function PricingCard({
  children,
  highlighted = false,
  className = "",
}: {
  children: ReactNode;
  highlighted?: boolean;
  className?: string;
}) {
  return (
    <SurfaceCard
      className={`p-7 md:p-8 ${highlighted ? "scale-[1.01] border-[#5b8cff55]" : ""} ${className}`.trim()}
    >
      {children}
    </SurfaceCard>
  );
}

export function FadeInSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
