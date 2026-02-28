"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { SectionHeader, SurfaceCard } from "@/components/dashboard-primitives";

type RadarDatum = {
  metric: string;
  value: number;
};

type RiskLeverageRadarProps = {
  data: RadarDatum[];
};

export function RiskLeverageRadar({ data }: RiskLeverageRadarProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-4"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <SurfaceCard className="h-[360px] rounded-[20px] p-6">
        <SectionHeader label="Risk-Leverage Radar" title="Signal Distribution" />
        <div className="h-[280px]">
          <ResponsiveContainer height="100%" width="100%">
            <RadarChart
              data={data}
              margin={{ top: 16, right: 32, bottom: 4, left: 32 }}
              outerRadius="62%"
            >
              <PolarGrid stroke="color-mix(in oklab, var(--db-text) 14%, transparent)" strokeWidth={0.7} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "var(--db-muted)", fontSize: 11 }}
                tickLine={false}
              />
              <PolarRadiusAxis axisLine={false} domain={[0, 100]} tick={false} />
              <Radar
                dataKey="value"
                fill="var(--db-accent)"
                fillOpacity={0.2}
                name="Strength"
                stroke="var(--db-accent)"
                strokeWidth={1.1}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </SurfaceCard>
    </motion.div>
  );
}
