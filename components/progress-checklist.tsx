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
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm transition-all duration-200 ease-in-out">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Tactical Execution
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-semibold text-slate-100">Progress Tracking</h3>
        <p className="text-sm font-medium text-slate-300">{completionPct}% complete</p>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] transition-all duration-200 ease-in-out"
          style={{ width: `${completionPct}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Track weekly execution against your strategic plan.
      </p>
      <div className="mt-6 space-y-3">
        {defaultItems.map((item, idx) => (
          <label
            className="group flex items-start gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-200 ease-in-out hover:border-[#4F8CFF]/40 hover:bg-slate-900/80"
            key={item}
          >
            <button
              aria-label={`Toggle item ${idx + 1}`}
              className={`relative mt-0.5 h-6 w-11 rounded-full border transition-all duration-200 ease-in-out ${
                checked[idx]
                  ? "border-[#4F8CFF] bg-[#4F8CFF]/30 shadow-[0_0_16px_rgba(79,140,255,0.35)]"
                  : "border-slate-600 bg-slate-800"
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
                className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all duration-200 ease-in-out ${
                  checked[idx] ? "left-5" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-sm text-slate-200 transition-colors duration-200 ease-in-out group-hover:text-slate-100">
              {item}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
