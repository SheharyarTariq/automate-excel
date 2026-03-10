"use client";

import { useState } from "react";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { Skeleton } from "@/components/common";
import { cn } from "@/lib/utils/cn";
import MonthlyOverview from "./monthly-overview";
import YearlySummary from "./yearly-summary";
import ProjectRankings from "./project-rankings";
import PaymentFlow from "./payment-flow";

const tabs = [
  { key: "monthly", label: "Monthly Overview" },
  { key: "yearly", label: "Yearly Summary" },
  { key: "rankings", label: "Project Rankings" },
  { key: "payments", label: "Payment Flow" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("monthly");
  const { monthlyData, projects, costs, payments, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="row" className="w-96" />
        <Skeleton variant="card" className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 border-b border-[var(--color-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-xs font-[var(--font-mono)] transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-[var(--color-accent-green)] text-[var(--color-accent-green)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "monthly" && <MonthlyOverview data={monthlyData} />}
      {activeTab === "yearly" && <YearlySummary data={monthlyData} />}
      {activeTab === "rankings" && (
        <ProjectRankings projects={projects} costs={costs} />
      )}
      {activeTab === "payments" && (
        <PaymentFlow projects={projects} payments={payments} />
      )}
    </div>
  );
}
