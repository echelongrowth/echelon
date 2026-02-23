"use client";

import { useState } from "react";

const defaultItems = [
  "Complete high-impact networking outreach this week",
  "Publish one market-facing proof of expertise",
  "Close one strategic skill gap milestone",
  "Review role-market fit and compensation positioning",
];

export function ProgressChecklist() {
  const [checked, setChecked] = useState<boolean[]>(
    defaultItems.map(() => false)
  );
  const completedCount = checked.filter(Boolean).length;
  const completionPct = Math.round((completedCount / defaultItems.length) * 100);

  return (
    <section className="section-shell rounded-2xl p-8 fade-in-soft">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-indigo-300/70" />
        <p className="label-micro">Tactical Execution</p>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-semibold text-slate-100">Progress Tracking</h3>
        <p className="rounded-md border border-slate-600/50 bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-200">
          {completionPct}% complete
        </p>
      </div>
      <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800/90">
        <div
          className="h-full rounded-full bg-indigo-300/70 transition-all duration-300 ease-in-out"
          style={{ width: `${completionPct}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Track weekly execution against your strategic plan.
      </p>
      <div className="mt-6 space-y-3">
        {defaultItems.map((item, idx) => (
          <label
            className="group flex items-start gap-3 rounded-lg border border-slate-700/60 bg-slate-900/55 p-4 transition-all duration-150 ease-out hover:bg-slate-800/70"
            key={item}
          >
            <span
              className={`mt-1 h-5 w-0.5 rounded-full ${
                checked[idx] ? "bg-indigo-300/80" : "bg-slate-600/70"
              }`}
            />
            <button
              aria-label={`Toggle item ${idx + 1}`}
              className={`relative mt-0.5 h-6 w-11 rounded-full border transition-all duration-200 ease-in-out ${
                checked[idx]
                  ? "border-indigo-300/55 bg-indigo-300/25"
                  : "border-slate-600/80 bg-slate-800/90"
              }`}
              onClick={(event) => {
                event.preventDefault();
                setChecked((prev) =>
                  prev.map((value, currentIdx) =>
                    currentIdx === idx ? !value : value
                  )
                );
              }}
              type="button"
            >
              <span
                className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-slate-100 transition-all duration-200 ease-in-out ${
                  checked[idx] ? "left-5" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-sm text-slate-200 transition-colors duration-200 ease-in-out group-hover:text-slate-100">
              {item}
            </span>
            <span className="ml-auto rounded-md border border-slate-600/60 bg-slate-800/55 px-2 py-0.5 text-[11px] text-slate-300">
              {checked[idx] ? "Complete" : "Pending"}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
