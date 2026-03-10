"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/common";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { asyncHandler } from "@/lib/utils/async-handler";
import { milestoneSchema } from "@/lib/validations/milestone";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Milestone } from "@/types";

interface MilestonesProps {
  milestones: Milestone[];
  onAdd: (data: Partial<Milestone>) => Promise<Milestone | null>;
  onUpdate: (id: string, updates: Partial<Milestone>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export default function Milestones({
  milestones,
  onAdd,
  onUpdate,
  onDelete,
}: MilestonesProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", due_date: "", amount: 0, notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setErrors({});
    const [validated, validationErr] = await asyncHandler(() =>
      milestoneSchema.validate(form, { abortEarly: false })
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
      setForm({ title: "", due_date: "", amount: 0, notes: "" });
    }
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
          Milestones
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {milestones.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
          No milestones yet
        </p>
      ) : (
        <div className="space-y-2">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdate(m.id, { is_completed: !m.is_completed })}
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                    m.is_completed
                      ? "bg-[var(--color-accent-green)] border-[var(--color-accent-green)]"
                      : "border-[var(--color-border)]"
                  )}
                >
                  {m.is_completed && (
                    <Check className="h-3 w-3 text-[var(--color-bg-base)]" />
                  )}
                </button>
                <div>
                  <p
                    className={cn(
                      "text-xs font-[var(--font-mono)]",
                      m.is_completed
                        ? "text-[var(--color-text-muted)] line-through"
                        : "text-[var(--color-text-primary)]"
                    )}
                  >
                    {m.title}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
                    {formatDate(m.due_date, "MMM dd")} — {formatCurrency(m.amount)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDelete(m.id)}
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
        header="Add Milestone"
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
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
          />
          <Input
            label="Due Date"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            error={errors.due_date}
          />
          <Input
            label="Amount"
            type="number"
            value={String(form.amount)}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            error={errors.amount}
          />
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
