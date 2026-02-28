"use client";

import { useState } from "react";
import Link from "next/link";
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
      <section className="apple-surface rounded-[20px] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="apple-label">
              Career Intelligence Command Center
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--db-text)]">
              Resume Positioning Intelligence
            </h2>
            {latestCreatedAt ? (
              <p className="mt-2 text-sm text-[var(--db-muted)]">
                Latest analysis:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(latestCreatedAt))}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
              href="/dashboard"
            >
              Back to Dashboard
            </Link>
            <button
              className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
              onClick={() => setShowUpload((current) => !current)}
              type="button"
            >
              {showUpload ? "Hide Intake" : "Analyze New Resume"}
            </button>
          </div>
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
