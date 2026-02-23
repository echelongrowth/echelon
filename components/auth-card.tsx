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
    <section className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm transition-all duration-200 ease-in-out sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Echelon
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
        {title}
      </h1>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
      <div className="mt-7">{children}</div>
      <p className="mt-6 text-sm text-slate-400">
        {footerText}{" "}
        <Link
          className="font-medium text-slate-100 underline underline-offset-4 transition-colors duration-200 hover:text-[#4F8CFF]"
          href={footerHref}
        >
          {footerLinkText}
        </Link>
      </p>
    </section>
  );
}
