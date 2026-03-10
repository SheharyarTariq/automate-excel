"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/formatters";
import type { Project, ProjectCost } from "@/types";

interface ProjectRankingsProps {
  projects: Project[];
  costs: ProjectCost[];
}

export default function ProjectRankings({
  projects,
  costs,
}: ProjectRankingsProps) {
  const rankings = useMemo(() => {
    return projects
      .map((p) => {
        const projectCosts = costs
          .filter((c) => c.project_id === p.id)
          .reduce((sum, c) => sum + c.amount, 0);
        const netProfit = p.total_received - projectCosts;
        const perHead = p.team_size > 0 ? Math.round(netProfit / p.team_size) : 0;
        return { ...p, netProfit, perHead, totalCosts: projectCosts };
      })
      .sort((a, b) => b.netProfit - a.netProfit)
      .slice(0, 10);
  }, [projects, costs]);

  const perHeadRankings = useMemo(() => {
    return [...rankings].sort((a, b) => b.perHead - a.perHead);
  }, [rankings]);

  const platformBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();
    projects.forEach((p) => {
      const existing = map.get(p.platform) || { count: 0, revenue: 0 };
      map.set(p.platform, {
        count: existing.count + 1,
        revenue: existing.revenue + p.total_received,
      });
    });
    return Array.from(map.entries())
      .map(([platform, data]) => ({ platform, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Top 10 by Profit
        </h3>
        <div className="space-y-2">
          {rankings.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md bg-[var(--color-bg-elevated)] px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] w-5">
                  #{i + 1}
                </span>
                <span className="text-xs text-[var(--color-text-primary)] font-[var(--font-mono)]">
                  {p.name}
                </span>
              </div>
              <span className="text-xs text-[var(--color-accent-green)] font-[var(--font-mono)]">
                {formatCurrency(p.netProfit)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Per-Head Leaderboard
        </h3>
        <div className="space-y-2">
          {perHeadRankings.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md bg-[var(--color-bg-elevated)] px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] w-5">
                  #{i + 1}
                </span>
                <span className="text-xs text-[var(--color-text-primary)] font-[var(--font-mono)]">
                  {p.name}
                </span>
              </div>
              <span className="text-xs text-[var(--color-accent-gold)] font-[var(--font-mono)]">
                {formatCurrency(p.perHead)}/head
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Platform Breakdown
        </h3>
        <div className="space-y-2">
          {platformBreakdown.map((p) => (
            <div
              key={p.platform}
              className="flex items-center justify-between rounded-md bg-[var(--color-bg-elevated)] px-3 py-2"
            >
              <span className="text-xs text-[var(--color-text-primary)] font-[var(--font-mono)] capitalize">
                {p.platform}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)]">
                  {p.count} projects
                </span>
                <span className="text-xs text-[var(--color-accent-cyan)] font-[var(--font-mono)]">
                  {formatCurrency(p.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
