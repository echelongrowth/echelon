"use client";

import { useState } from "react";
import { UploadPanel } from "@/app/dashboard/resume-positioning/components/UploadPanel";
import { ResumeAnalysisReport } from "@/app/dashboard/resume-positioning/components/ResumeAnalysisReport";
import type { ResumeAnalysis } from "@/types/resume-positioning";

export function ResumePositioningWorkspace({
  initialAnalysis,
  latestCreatedAt,
}: {
  initialAnalysis: ResumeAnalysis | null;
  latestCreatedAt: string | null;
}) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(initialAnalysis);
  const [showUpload, setShowUpload] = useState<boolean>(!initialAnalysis);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Career Intelligence Command Center
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
              Resume Positioning Intelligence
            </h2>
            {latestCreatedAt ? (
              <p className="mt-2 text-sm text-slate-400">
                Latest analysis:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(latestCreatedAt))}
              </p>
            ) : null}
          </div>
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/45 hover:shadow-[0_0_18px_rgba(139,92,246,0.2)]"
            onClick={() => setShowUpload((current) => !current)}
            type="button"
          >
            {showUpload ? "Hide Intake" : "Analyze New Resume"}
          </button>
        </div>
      </section>

      {showUpload ? (
        <UploadPanel
          onCompleted={(nextAnalysis) => {
            setAnalysis(nextAnalysis);
            setShowUpload(false);
          }}
        />
      ) : null}

      {analysis ? <ResumeAnalysisReport analysis={analysis} /> : null}
    </div>
  );
}

