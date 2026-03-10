"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MonthlyAnalytics } from "@/types";

interface MonthlyOverviewProps {
  data: MonthlyAnalytics[];
}

export default function MonthlyOverview({ data }: MonthlyOverviewProps) {
  const last12 = data.slice(-12);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Earnings vs Costs vs Profit
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={last12}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--color-border)" }}
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
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="earnings" fill="var(--color-accent-green)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="costs" fill="var(--color-accent-red)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Profit Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={last12}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--color-border)" }}
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
            <Line
              type="monotone"
              dataKey="profit"
              stroke="var(--color-accent-cyan)"
              strokeWidth={2}
              dot={{ fill: "var(--color-accent-cyan)", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
