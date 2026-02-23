"use client";

import { motion } from "framer-motion";

const points = "100,28 154,80 126,146 74,138 52,88";

export function RiskRadarCard() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      className="pointer-events-none w-[310px] transform-gpu rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm will-change-transform"
      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      style={{ opacity: 0.76 }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Risk Radar
      </p>
      <svg
        className="mt-2 h-[170px] w-full"
        fill="none"
        viewBox="0 0 200 170"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="radar-fill" x1="40" x2="165" y1="30" y2="150">
            <stop stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="1" stopColor="#4F8CFF" stopOpacity="0.32" />
          </linearGradient>
          <filter id="radar-glow" height="200%" width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur" stdDeviation="2" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon points="100,14 170,80 136,156 64,156 30,80" stroke="rgba(148,163,184,0.24)" />
        <polygon points="100,36 148,82 124,136 76,136 52,82" stroke="rgba(148,163,184,0.2)" />
        <polygon
          filter="url(#radar-glow)"
          points={points}
          stroke="#4F8CFF"
          strokeWidth="1.6"
          fill="url(#radar-fill)"
        />
      </svg>
    </motion.div>
  );
}
