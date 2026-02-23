"use client";

import { useEffect, useState } from "react";

const stages = [
  "Analyzing narrative structure...",
  "Evaluating leadership signals...",
  "Benchmarking executive framing...",
  "Calculating leverage profile...",
];

export function AnalysisLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % stages.length);
    }, 1200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="l1-surface rounded-xl p-6">
      <p className="label-micro">
        Analysis In Progress
      </p>
      <p className="mt-3 text-lg font-medium text-slate-100">{stages[index]}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800/80">
        <div className="h-full w-1/2 animate-[pulse_2.6s_ease-in-out_infinite] rounded-full bg-slate-500/85" />
      </div>
    </section>
  );
}
