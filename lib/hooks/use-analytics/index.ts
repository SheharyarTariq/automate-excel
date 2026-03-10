"use client";

import { useState, useEffect, useCallback } from "react";
import { asyncHandler } from "@/lib/utils/async-handler";
import { supabase } from "@/lib/supabase";
import type { Project, ProjectCost, Payment, EditLog, MonthlyAnalytics } from "@/types";
import { format, parseISO, startOfMonth } from "date-fns";
import toast from "react-hot-toast";

export function useAnalytics() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [costs, setCosts] = useState<ProjectCost[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [editLogs, setEditLogs] = useState<EditLog[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);

    const [projectsRes] = await asyncHandler(() =>
      supabase.from("projects").select("*").order("created_at", { ascending: false })
    );
    const projectsList = (projectsRes?.data as Project[]) ?? [];
    setProjects(projectsList);

    const [costsRes] = await asyncHandler(() =>
      supabase.from("project_costs").select("*").order("cost_date", { ascending: false })
    );
    const costsList = (costsRes?.data as ProjectCost[]) ?? [];
    setCosts(costsList);

    const [paymentsRes] = await asyncHandler(() =>
      supabase.from("payments").select("*").order("payment_date", { ascending: false })
    );
    const paymentsList = (paymentsRes?.data as Payment[]) ?? [];
    setPayments(paymentsList);

    const [logsRes] = await asyncHandler(() =>
      supabase.from("edit_logs").select("*").order("edited_at", { ascending: false }).limit(8)
    );
    setEditLogs((logsRes?.data as EditLog[]) ?? []);

    const monthly = buildMonthlyAnalytics(projectsList, paymentsList, costsList);
    setMonthlyData(monthly);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const totalRevenue = projects.reduce((sum, p) => sum + p.total_received, 0);
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const netProfit = totalRevenue - totalCosts;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalTeamSize = projects.reduce((sum, p) => sum + p.team_size, 0);
  const avgPerHead = totalTeamSize > 0 ? Math.round(netProfit / totalTeamSize) : 0;

  const feeTypeBreakdown = {
    fixed: projects.filter((p) => p.fee_type === "fixed").length,
    hourly: projects.filter((p) => p.fee_type === "hourly").length,
    retainer: projects.filter((p) => p.fee_type === "retainer").length,
  };

  return {
    projects,
    costs,
    payments,
    editLogs,
    monthlyData,
    loading,
    totalRevenue,
    totalCosts,
    netProfit,
    activeProjects,
    avgPerHead,
    feeTypeBreakdown,
    refetch: fetchAll,
  };
}

function buildMonthlyAnalytics(
  projects: Project[],
  payments: Payment[],
  costs: ProjectCost[]
): MonthlyAnalytics[] {
  const monthMap = new Map<string, MonthlyAnalytics>();

  const ensureMonth = (dateStr: string) => {
    if (!dateStr) return;
    const monthKey = format(startOfMonth(parseISO(dateStr)), "yyyy-MM");
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        month: monthKey,
        earnings: 0,
        costs: 0,
        profit: 0,
        projects_added: 0,
      });
    }
    return monthKey;
  };

  projects.forEach((p) => {
    const key = ensureMonth(p.created_at);
    if (key) {
      const entry = monthMap.get(key);
      if (entry) entry.projects_added += 1;
    }
  });

  payments.forEach((p) => {
    const key = ensureMonth(p.payment_date);
    if (key) {
      const entry = monthMap.get(key);
      if (entry) entry.earnings += p.amount;
    }
  });

  costs.forEach((c) => {
    const key = ensureMonth(c.cost_date);
    if (key) {
      const entry = monthMap.get(key);
      if (entry) entry.costs += c.amount;
    }
  });

  monthMap.forEach((entry) => {
    entry.profit = entry.earnings - entry.costs;
  });

  return Array.from(monthMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
}
