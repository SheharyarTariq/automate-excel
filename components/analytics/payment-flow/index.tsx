"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";
import type { Project, Payment } from "@/types";

interface PaymentFlowProps {
  projects: Project[];
  payments: Payment[];
}

const COLORS = [
  "var(--color-accent-green)",
  "var(--color-accent-cyan)",
  "var(--color-accent-gold)",
  "var(--color-accent-red)",
];

export default function PaymentFlow({ projects, payments }: PaymentFlowProps) {
  const receivedVsPending = useMemo(() => {
    return projects
      .filter((p) => p.status === "active")
      .map((p) => ({
        name: p.name.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
        received: p.total_received,
        pending: Math.max(0, p.fee_amount - p.total_received),
      }))
      .slice(0, 10);
  }, [projects]);

  const paymentTypeBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    payments.forEach((p) => {
      map.set(p.payment_type, (map.get(p.payment_type) || 0) + p.amount);
    });
    return Array.from(map.entries()).map(([type, amount]) => ({
      name: type,
      value: amount,
    }));
  }, [payments]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Received vs Pending
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={receivedVsPending} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
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
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Bar dataKey="received" fill="var(--color-accent-green)" stackId="a" />
            <Bar dataKey="pending" fill="var(--color-accent-gold)" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Payment Type Breakdown
        </h3>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={paymentTypeBreakdown}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {paymentTypeBreakdown.map((_, index) => (
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
                formatter={(value) => formatCurrency(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {paymentTypeBreakdown.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)] capitalize">
                  {item.name} — {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
