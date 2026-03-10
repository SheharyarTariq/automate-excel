"use client";

import { useState, useMemo, useCallback } from "react";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import {
  StatCard,
  Button,
  Drawer,
  Input,
  Select,
  Skeleton,
  Table,
  type Column,
} from "@/components/common";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { asyncHandler } from "@/lib/utils/async-handler";
import { costSchema } from "@/lib/validations/cost";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Plus } from "lucide-react";
import type { ProjectCost } from "@/types";
import toast from "react-hot-toast";

export default function CostsPage() {
  const { costs, projects, monthlyData, loading, refetch } = useAnalytics();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [form, setForm] = useState({
    label: "",
    amount: 0,
    cost_date: "",
    cost_type: "other",
    note: "",
    project_id: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const filteredCosts = useMemo(() => {
    let result = [...costs];
    if (projectFilter) {
      result = result.filter((c) => c.project_id === projectFilter);
    }
    if (typeFilter) {
      result = result.filter((c) => c.cost_type === typeFilter);
    }
    return result;
  }, [costs, projectFilter, typeFilter]);

  const platformFees = costs
    .filter((c) => c.cost_type === "platform_fee")
    .reduce((sum, c) => sum + c.amount, 0);
  const adSpend = costs
    .filter((c) => c.cost_type === "ad_spend")
    .reduce((sum, c) => sum + c.amount, 0);
  const tools = costs
    .filter((c) => c.cost_type === "tool")
    .reduce((sum, c) => sum + c.amount, 0);
  const other = costs
    .filter((c) => c.cost_type === "other")
    .reduce((sum, c) => sum + c.amount, 0);
  const total = costs.reduce((sum, c) => sum + c.amount, 0);

  const handleAdd = useCallback(async () => {
    setErrors({});
    const [validated, validationErr] = await asyncHandler(() =>
      costSchema.validate(form, { abortEarly: false })
    );

    if (validationErr || !validated) {
      const yupErr = validationErr as { inner?: Array<{ path?: string; message: string }> };
      const fieldErrors: Record<string, string> = {};
      if (yupErr.inner) {
        yupErr.inner.forEach((err) => {
          if (err.path) fieldErrors[err.path] = err.message;
        });
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const [, err] = await asyncHandler(async () => {
      const result = await supabase.from("project_costs").insert(form).select().single();
      return result;
    });
    setSubmitting(false);

    if (err) {
      toast.error("Failed to add cost");
      return;
    }

    toast.success("Cost added");
    setDrawerOpen(false);
    setForm({ label: "", amount: 0, cost_date: "", cost_type: "other", note: "", project_id: "" });
    await refetch();
  }, [form, refetch]);

  const projectName = useCallback(
    (projectId: string) => {
      const p = projects.find((proj) => proj.id === projectId);
      return p?.name || "—";
    },
    [projects]
  );

  const columns: Column<ProjectCost>[] = [
    { key: "label", header: "Label" },
    {
      key: "amount",
      header: "Amount",
      render: (c) => (
        <span className="text-[var(--color-accent-red)]">
          {formatCurrency(c.amount)}
        </span>
      ),
    },
    {
      key: "cost_date",
      header: "Date",
      render: (c) => formatDate(c.cost_date, "MMM dd, yyyy"),
    },
    {
      key: "cost_type",
      header: "Type",
      render: (c) => (
        <span className="capitalize">{c.cost_type.replace("_", " ")}</span>
      ),
    },
    {
      key: "project_id",
      header: "Project",
      render: (c) => projectName(c.project_id),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Platform Fees" value={formatCurrency(platformFees)} accent="red" />
        <StatCard label="Ad Spend" value={formatCurrency(adSpend)} accent="red" />
        <StatCard label="Tools" value={formatCurrency(tools)} accent="gold" />
        <StatCard label="Other" value={formatCurrency(other)} accent="cyan" />
        <StatCard label="Total" value={formatCurrency(total)} accent="red" />
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
          Monthly Cost Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData.slice(-12)}>
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
              dataKey="costs"
              stroke="var(--color-accent-red)"
              strokeWidth={2}
              dot={{ fill: "var(--color-accent-red)", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select
              options={[
                { label: "All Projects", value: "" },
                ...projects.map((p) => ({ label: p.name, value: p.id })),
              ]}
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              options={[
                { label: "All Types", value: "" },
                { label: "Platform Fee", value: "platform_fee" },
                { label: "Ad Spend", value: "ad_spend" },
                { label: "Tool", value: "tool" },
                { label: "Other", value: "other" },
              ]}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Cost
        </Button>
      </div>

      <Table<ProjectCost>
        columns={columns}
        data={filteredCosts}
        keyExtractor={(c) => c.id}
        emptyTitle="No costs"
        emptyDescription="No costs have been recorded yet."
      />

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        header="Add Cost"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleAdd}>
              Add Cost
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Project"
            options={projects.map((p) => ({ label: p.name, value: p.id }))}
            value={form.project_id}
            onChange={(e) => setForm({ ...form, project_id: e.target.value })}
            placeholder="Select project"
            error={errors.project_id}
          />
          <Input
            label="Label"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            error={errors.label}
          />
          <Input
            label="Amount"
            type="number"
            value={String(form.amount)}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            error={errors.amount}
          />
          <Input
            label="Cost Date"
            type="date"
            value={form.cost_date}
            onChange={(e) => setForm({ ...form, cost_date: e.target.value })}
            error={errors.cost_date}
          />
          <Select
            label="Cost Type"
            options={[
              { label: "Platform Fee", value: "platform_fee" },
              { label: "Ad Spend", value: "ad_spend" },
              { label: "Tool", value: "tool" },
              { label: "Other", value: "other" },
            ]}
            value={form.cost_type}
            onChange={(e) => setForm({ ...form, cost_type: e.target.value })}
            error={errors.cost_type}
          />
          <Input
            label="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      </Drawer>
    </div>
  );
}
