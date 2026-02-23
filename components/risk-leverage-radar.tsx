"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

type RadarDatum = {
  metric: string;
  value: number;
};

type RiskLeverageRadarProps = {
  data: RadarDatum[];
};

export function RiskLeverageRadar({ data }: RiskLeverageRadarProps) {
  return (
    <div className="h-80 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-[#4F8CFF]/40 hover:shadow-[0_0_28px_rgba(79,140,255,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Risk-Leverage Radar
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148,163,184,0.24)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#CBD5E1", fontSize: 12 }}
            tickLine={false}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            fill="#8B5CF6"
            fillOpacity={0.26}
            name="Strength"
            stroke="#4F8CFF"
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
