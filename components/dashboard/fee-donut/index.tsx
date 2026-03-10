"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface FeeDonutProps {
  breakdown: {
    fixed: number;
    hourly: number;
    retainer: number;
  };
}

const COLORS = [
  "var(--color-accent-green)",
  "var(--color-accent-cyan)",
  "var(--color-accent-gold)",
];

export default function FeeDonut({ breakdown }: FeeDonutProps) {
  const data = [
    { name: "Fixed", value: breakdown.fixed },
    { name: "Hourly", value: breakdown.hourly },
    { name: "Retainer", value: breakdown.retainer },
  ].filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
      <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
        Fee Type Distribution
      </h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={40}
              outerRadius={60}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)]">
                {item.name}{" "}
                <span className="text-[var(--color-text-muted)]">
                  ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
