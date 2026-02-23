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
    <div className="l2-surface panel-hover h-[360px] w-full rounded-2xl p-6 lg:col-span-4">
      <p className="label-micro">Risk-Leverage Radar</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-100">Signal Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 22, right: 44, bottom: 18, left: 44 }}
          outerRadius="63%"
        >
          <PolarGrid stroke="rgba(148,163,184,0.24)" strokeWidth={0.9} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#CBD5E1", fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            fill="#6D83C7"
            fillOpacity={0.18}
            name="Strength"
            stroke="#7F95D6"
            strokeWidth={1.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
