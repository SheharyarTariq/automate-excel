"use client";

import { StatCard, ProgressBar } from "@/components/common";
import { formatCurrency } from "@/lib/formatters";
import type { Project, ProjectCost } from "@/types";

interface FinancialSummaryProps {
  project: Project;
  costs: ProjectCost[];
}

export default function FinancialSummary({
  project,
  costs,
}: FinancialSummaryProps) {
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const netProfit = project.total_received - totalCosts;
  const perHead =
    project.team_size > 0 ? Math.round(netProfit / project.team_size) : 0;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
      <h2 className="mb-4 text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
        Financial Summary
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          label="Fee Amount"
          value={formatCurrency(project.fee_amount, project.currency)}
          accent="green"
        />
        <StatCard
          label="Total Received"
          value={formatCurrency(project.total_received, project.currency)}
          accent="green"
        />
        <StatCard
          label="Total Costs"
          value={formatCurrency(totalCosts, project.currency)}
          accent="red"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(netProfit, project.currency)}
          accent="cyan"
        />
        <StatCard
          label="Per Head"
          value={formatCurrency(perHead, project.currency)}
          accent="gold"
          className="col-span-2"
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
          Payment Progress
        </p>
        <ProgressBar
          received={project.total_received}
          total={project.fee_amount}
        />
      </div>
    </div>
  );
}
