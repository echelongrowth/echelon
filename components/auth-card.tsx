import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  children: ReactNode;
};

export function AuthCard({
  title,
  description,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthCardProps) {
  return (
    <section className="w-full rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-200 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
          Echelon
        </p>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--app-border)] px-4 text-xs font-medium text-[var(--app-text)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#ffffff0a]"
          href="/"
        >
          Back to Home
        </Link>
      </div>
      <h1 className="mt-3 text-[30px] font-semibold tracking-tight text-[var(--app-text)]">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-7 text-[var(--app-muted)]">{description}</p>
      <div className="mt-7">{children}</div>
      <p className="mt-6 text-sm text-[var(--app-muted)]">
        {footerText}{" "}
        <Link
          className="font-medium text-[var(--app-text)] underline underline-offset-4 transition-colors duration-200 hover:text-[var(--app-accent)]"
          href={footerHref}
        >
          {footerLinkText}
        </Link>
      </p>
    </section>
  );
}
