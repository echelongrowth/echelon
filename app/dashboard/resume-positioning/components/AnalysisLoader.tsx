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
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Analysis In Progress
      </p>
      <p className="mt-3 text-lg font-medium text-slate-100">{stages[index]}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-1/2 animate-[pulse_2.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF]" />
      </div>
    </section>
  );
}

