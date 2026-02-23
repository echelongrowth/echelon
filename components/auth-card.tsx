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
    <section className="section-shell w-full rounded-2xl p-8 sm:p-10">
      <p className="label-micro">
        Echelon
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-7">{children}</div>
      <p className="mt-6 text-sm text-slate-400">
        {footerText}{" "}
        <Link
          className="font-medium text-slate-100 underline underline-offset-4 transition-colors duration-200 hover:text-indigo-200"
          href={footerHref}
        >
          {footerLinkText}
        </Link>
      </p>
    </section>
  );
}
