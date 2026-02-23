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
    <div className="l2-surface panel-hover h-80 w-full rounded-xl p-6 lg:col-span-4">
      <p className="label-micro">
        Risk-Leverage Radar
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 24, right: 36, bottom: 24, left: 36 }}
          outerRadius="66%"
        >
          <PolarGrid stroke="rgba(148,163,184,0.32)" strokeWidth={0.8} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#B8C2D4", fontSize: 10 }}
            tickLine={false}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            fill="#6f7fa3"
            fillOpacity={0.24}
            name="Strength"
            stroke="#788caf"
            strokeWidth={1.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
