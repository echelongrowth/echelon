"use client";

import { motion } from "framer-motion";

const pathD =
  "M10 96 C44 76, 66 78, 98 70 C128 64, 152 52, 186 46 C220 40, 248 27, 286 18";

export function SalaryProjectionChart() {
  return (
    <motion.div
      animate={{ y: [0, 6, 0] }}
      className="w-full max-w-[320px] rounded-[20px] border border-[var(--app-border)] bg-[#ffffff05] p-5 backdrop-blur-sm"
      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      style={{ opacity: 0.86 }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
        Salary Projection
      </p>
      <svg
        className="mt-3 h-[110px] w-full"
        fill="none"
        viewBox="0 0 300 110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="salary-line" x1="10" x2="286" y1="96" y2="18">
            <stop stopColor="#3f6fe8" />
            <stop offset="1" stopColor="#5b8cff" />
          </linearGradient>
          <filter id="salary-glow" height="200%" width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur" stdDeviation="2.5" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M10 96 H286" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path
          d={pathD}
          filter="url(#salary-glow)"
          stroke="url(#salary-line)"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>
    </motion.div>
  );
}
