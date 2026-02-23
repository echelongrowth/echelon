import type { ResumeAnalysis } from "@/types/resume-positioning";

export function RewriteSamples({
  samples,
}: {
  samples: ResumeAnalysis["strategic_rewrite_samples"];
}) {
  return (
    <section className="l1-surface rounded-xl p-8">
      <p className="label-micro">
        Strategic Rewrite Samples
      </p>
      <div className="mt-5 space-y-3">
        {samples.map((item, index) => (
          <article
            className="rounded-xl border border-slate-700/55 bg-slate-900/55 p-4"
            key={`${item.original_pattern}-${index}`}
          >
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
              Original Pattern
            </p>
            <p className="mt-2 text-sm text-slate-300">{item.original_pattern}</p>

            <p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-400">
              Executive Rewrite
            </p>
            <p className="mt-2 text-sm text-slate-100">{item.executive_rewrite}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
