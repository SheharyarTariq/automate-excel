"use client";

import { useAnalytics } from "@/lib/hooks/use-analytics";
import { Skeleton } from "@/components/common";
import StatsRow from "./stats-row";
import EarningsChart from "./earnings-chart";
import FeeDonut from "./fee-donut";
import ProjectsPerMonth from "./projects-per-month";
import ActivityFeed from "./activity-feed";

export default function DashboardPage() {
  const {
    monthlyData,
    editLogs,
    loading,
    totalRevenue,
    totalCosts,
    netProfit,
    activeProjects,
    avgPerHead,
    feeTypeBreakdown,
  } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton variant="card" className="h-72" />
          <Skeleton variant="card" className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsRow
        totalRevenue={totalRevenue}
        netProfit={netProfit}
        totalCosts={totalCosts}
        avgPerHead={avgPerHead}
        activeProjects={activeProjects}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <EarningsChart data={monthlyData} />
        <FeeDonut breakdown={feeTypeBreakdown} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectsPerMonth data={monthlyData} />
        <ActivityFeed logs={editLogs} />
      </div>
    </div>
  );
}
