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
      <section className="l1-surface rounded-xl p-8">
        <p className="label-micro">
          Resume Positioning Intake
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
          Resume Positioning Intelligence
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Upload a resume PDF or paste resume text to generate structured
          executive-level positioning diagnostics.
        </p>

        <form action={formAction} className="mt-6 space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="resumeFile"
            >
              Upload Resume (PDF)
            </label>
            <input
              accept="application/pdf"
              className="block w-full rounded-lg border border-slate-600/55 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 file:mr-4 file:rounded-md file:border-0 file:bg-slate-700/70 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-100 hover:file:bg-slate-700/90"
              id="resumeFile"
              name="resumeFile"
              onChange={(event) =>
                setFileName(event.target.files?.[0]?.name ?? "")
              }
              type="file"
            />
            {fileName ? (
              <p className="mt-2 text-xs text-slate-400">{fileName}</p>
            ) : null}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="resumeText"
            >
              Or Paste Resume Text
            </label>
            <textarea
              className="min-h-48 w-full rounded-lg border border-slate-600/55 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 ease-out focus:border-slate-400/70"
              id="resumeText"
              name="resumeText"
              placeholder="Paste resume content here..."
            />
          </div>

          {state.error ? (
            <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {state.error}
            </p>
          ) : null}

          <button
            className="inline-flex h-11 items-center justify-center rounded-lg border border-indigo-300/25 bg-indigo-400/20 px-5 text-sm font-medium text-indigo-100 transition-all duration-200 ease-out hover:border-indigo-200/45 hover:bg-indigo-400/28 disabled:cursor-not-allowed disabled:opacity-70"
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
