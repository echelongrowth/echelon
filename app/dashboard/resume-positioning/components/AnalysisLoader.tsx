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
    <section className="apple-surface rounded-[20px] p-6">
      <p className="apple-label">
        Analysis In Progress
      </p>
      <p className="mt-3 text-lg font-medium text-[var(--db-text)]">{stages[index]}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--db-surface-subtle)]">
        <div className="h-full w-1/2 animate-[pulse_2.6s_ease-in-out_infinite] rounded-full bg-[var(--db-accent)]" />
      </div>
    </section>
  );
}
