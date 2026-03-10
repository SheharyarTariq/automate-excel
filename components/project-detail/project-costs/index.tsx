"use client";

import { useState } from "react";
import { Button, Input, Select, Modal } from "@/components/common";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { asyncHandler } from "@/lib/utils/async-handler";
import { costSchema } from "@/lib/validations/cost";
import { Plus, Trash2 } from "lucide-react";
import type { ProjectCost } from "@/types";

interface ProjectCostsProps {
  costs: ProjectCost[];
  projectId: string;
  onAdd: (data: Partial<ProjectCost>) => Promise<ProjectCost | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export default function ProjectCosts({
  costs,
  projectId,
  onAdd,
  onDelete,
}: ProjectCostsProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "",
    amount: 0,
    cost_date: "",
    cost_type: "other" as ProjectCost["cost_type"],
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setErrors({});
    const [validated, validationErr] = await asyncHandler(() =>
      costSchema.validate({ ...form, project_id: projectId }, { abortEarly: false })
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

    setLoading(true);
    const result = await onAdd(form);
    setLoading(false);
    if (result) {
      setShowForm(false);
      setForm({ label: "", amount: 0, cost_date: "", cost_type: "other", note: "" });
    }
  };

  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
          Costs{" "}
          <span className="text-[var(--color-accent-red)]">
            ({formatCurrency(totalCosts)})
          </span>
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {costs.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
          No costs recorded
        </p>
      ) : (
        <div className="space-y-2">
          {costs.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2"
            >
              <div>
                <p className="text-xs text-[var(--color-accent-red)] font-[var(--font-mono)]">
                  {formatCurrency(c.amount)} — {c.label}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
                  {formatDate(c.cost_date, "MMM dd")} — {c.cost_type.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={() => onDelete(c.id)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-red)] transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        header="Add Cost"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={loading} onClick={handleAdd}>
              Add
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
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
            onChange={(e) =>
              setForm({ ...form, cost_type: e.target.value as ProjectCost["cost_type"] })
            }
            error={errors.cost_type}
          />
          <Input
            label="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
