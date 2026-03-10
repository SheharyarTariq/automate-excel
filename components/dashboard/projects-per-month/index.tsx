"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MonthlyAnalytics } from "@/types";

interface ProjectsPerMonthProps {
  data: MonthlyAnalytics[];
}

export default function ProjectsPerMonth({ data }: ProjectsPerMonthProps) {
  const last12 = data.slice(-12);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
      <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
        Projects Added Per Month
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={last12}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border-subtle)"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "var(--color-border)" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "var(--color-border)" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--color-text-primary)",
            }}
          />
          <Bar
            dataKey="projects_added"
            fill="var(--color-accent-cyan)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
