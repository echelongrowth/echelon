import type { ReactNode } from "react";

type AssessmentStepProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AssessmentStep({
  title,
  description,
  children,
}: AssessmentStepProps) {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Assessment Step
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
