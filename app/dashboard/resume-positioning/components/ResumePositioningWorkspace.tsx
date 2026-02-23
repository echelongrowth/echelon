"use client";

import { useState } from "react";
import { UploadPanel } from "@/app/dashboard/resume-positioning/components/UploadPanel";
import { ResumeAnalysisReport } from "@/app/dashboard/resume-positioning/components/ResumeAnalysisReport";
import type { PlanType } from "@/types/intelligence";
import type {
  FreeResumeAnalysis,
  ResumeAnalysis,
} from "@/types/resume-positioning";

export function ResumePositioningWorkspace({
  initialAnalysis,
  initialAnalysisId,
  latestCreatedAt,
  planType,
}: {
  initialAnalysis: ResumeAnalysis | FreeResumeAnalysis | null;
  initialAnalysisId: string | null;
  latestCreatedAt: string | null;
  planType: PlanType;
}) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | FreeResumeAnalysis | null>(
    initialAnalysis
  );
  const [analysisId, setAnalysisId] = useState<string | null>(initialAnalysisId);
  const [showUpload, setShowUpload] = useState<boolean>(!initialAnalysis);

  return (
    <div className="space-y-10">
      <section className="section-shell rounded-2xl p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label-micro">
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
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-500/45 bg-slate-800/45 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-out hover:border-slate-400/65 hover:bg-slate-700/45"
            onClick={() => setShowUpload((current) => !current)}
            type="button"
          >
            {showUpload ? "Hide Intake" : "Analyze New Resume"}
          </button>
        </div>
      </section>

      {showUpload ? (
        <UploadPanel
          onCompleted={(nextAnalysis, nextAnalysisId) => {
            setAnalysis(nextAnalysis);
            setAnalysisId(nextAnalysisId);
            setShowUpload(false);
          }}
        />
      ) : null}

      {analysis && analysisId ? (
        <ResumeAnalysisReport
          analysis={analysis}
          analysisId={analysisId}
          planType={planType}
        />
      ) : null}
    </div>
  );
}
