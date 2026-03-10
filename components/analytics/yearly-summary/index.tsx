"use client";

import { useMemo, useState } from "react";
import { StatCard, Select } from "@/components/common";
import { formatCurrency } from "@/lib/formatters";
import type { MonthlyAnalytics } from "@/types";

interface YearlySummaryProps {
  data: MonthlyAnalytics[];
}

export default function YearlySummary({ data }: YearlySummaryProps) {
  const years = useMemo(() => {
    const set = new Set(data.map((d) => d.month.split("-")[0]));
    return Array.from(set).sort().reverse();
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(years[0] || "");

  const yearData = useMemo(() => {
    return data.filter((d) => d.month.startsWith(selectedYear));
  }, [data, selectedYear]);

  const totalEarnings = yearData.reduce((sum, d) => sum + d.earnings, 0);
  const totalCosts = yearData.reduce((sum, d) => sum + d.costs, 0);
  const totalProfit = totalEarnings - totalCosts;
  const totalProjects = yearData.reduce((sum, d) => sum + d.projects_added, 0);

  return (
    <div className="space-y-4">
      <div className="w-36">
        <Select
          label="Year"
          options={years.map((y) => ({ label: y, value: y }))}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total Earnings"
          value={formatCurrency(totalEarnings)}
          accent="green"
        />
        <StatCard
          label="Total Costs"
          value={formatCurrency(totalCosts)}
          accent="red"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(totalProfit)}
          accent="cyan"
        />
        <StatCard
          label="Projects Added"
          value={String(totalProjects)}
          accent="gold"
        />
      </div>
    </div>
  );
}
