"use client";

import { useActionState, useEffect, useState } from "react";
import { analyzeResumeSubmission } from "@/app/dashboard/resume-positioning/actions";
import { AnalysisLoader } from "@/app/dashboard/resume-positioning/components/AnalysisLoader";
import type {
  FreeResumeAnalysis,
  ResumeAnalysis,
  ResumeAnalysisActionState,
} from "@/types/resume-positioning";

export function UploadPanel({
  onCompleted,
}: {
  onCompleted: (
    analysis: ResumeAnalysis | FreeResumeAnalysis,
    analysisId: string
  ) => void;
}) {
  const initialResumeAnalysisState: ResumeAnalysisActionState = {
    ok: false,
    error: null,
    analysis: null,
    analysisId: null,
  };

  const [state, formAction, isPending] = useActionState(
    analyzeResumeSubmission,
    initialResumeAnalysisState
  );
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (state.ok && state.analysis && state.analysisId) {
      onCompleted(state.analysis, state.analysisId);
    }
  }, [onCompleted, state.analysis, state.analysisId, state.ok]);

  return (
    <div className="space-y-6">
      <section className="apple-surface rounded-[20px] p-6 sm:p-8">
        <p className="apple-label">
          Resume Positioning Intake
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--db-text)]">
          Resume Positioning Intelligence
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--db-muted)]">
          Upload a resume PDF or paste resume text to generate structured
          executive-level positioning diagnostics.
        </p>

        <form action={formAction} className="mt-6 space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-[var(--db-text)]"
              htmlFor="resumeFile"
            >
              Upload Resume (PDF)
            </label>
            <input
              accept="application/pdf"
              className="block w-full rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)] px-3 py-2 text-sm text-[var(--db-text)] file:mr-4 file:rounded-lg file:border file:border-[var(--db-border)] file:bg-[var(--db-surface)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--db-text)] hover:file:bg-[var(--db-surface-subtle)]"
              id="resumeFile"
              name="resumeFile"
              onChange={(event) =>
                setFileName(event.target.files?.[0]?.name ?? "")
              }
              type="file"
            />
            {fileName ? (
              <p className="mt-2 text-xs text-[var(--db-muted)]">{fileName}</p>
            ) : null}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-[var(--db-text)]"
              htmlFor="resumeText"
            >
              Or Paste Resume Text
            </label>
            <textarea
              className="min-h-48 w-full rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)] px-4 py-3 text-sm text-[var(--db-text)] outline-none transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] focus:border-[color-mix(in_oklab,var(--db-accent)_45%,transparent)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--db-accent)_25%,transparent)]"
              id="resumeText"
              name="resumeText"
              placeholder="Paste resume content here..."
            />
          </div>

          {state.error ? (
            <p className="rounded-xl border border-[#a73a3550] bg-[#a73a3515] px-4 py-3 text-sm text-[#ff9a95]">
              {state.error}
            </p>
          ) : null}

          <button
            className="apple-primary-btn inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Generating Intelligence..." : "Generate Resume Intelligence"}
          </button>
        </form>
      </section>

      {isPending ? <AnalysisLoader /> : null}
    </div>
  );
}
