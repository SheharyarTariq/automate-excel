"use client";

import { StatCard } from "@/components/common";
import { formatCurrency } from "@/lib/formatters";

interface StatsRowProps {
  totalRevenue: number;
  netProfit: number;
  totalCosts: number;
  avgPerHead: number;
  activeProjects: number;
}

export default function StatsRow({
  totalRevenue,
  netProfit,
  totalCosts,
  avgPerHead,
  activeProjects,
}: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <StatCard
        label="Total Revenue"
        value={formatCurrency(totalRevenue)}
        accent="green"
      />
      <StatCard
        label="Net Profit"
        value={formatCurrency(netProfit)}
        accent="cyan"
      />
      <StatCard
        label="Platform Costs"
        value={formatCurrency(totalCosts)}
        subtext="this month"
        accent="red"
      />
      <StatCard
        label="Avg Per Head"
        value={formatCurrency(avgPerHead)}
        accent="gold"
      />
      <StatCard
        label="Active Projects"
        value={String(activeProjects)}
        accent="green"
      />
    </div>
  );
}
