"use client";

import { useState } from "react";
import { Button, Input, Select, Modal } from "@/components/common";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { asyncHandler } from "@/lib/utils/async-handler";
import { paymentSchema } from "@/lib/validations/payment";
import { Plus, Trash2 } from "lucide-react";
import type { Payment } from "@/types";

interface PaymentsProps {
  payments: Payment[];
  onAdd: (data: Partial<Payment>) => Promise<Payment | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export default function Payments({ payments, onAdd, onDelete }: PaymentsProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    amount: 0,
    payment_date: "",
    payment_type: "partial" as Payment["payment_type"],
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setErrors({});
    const [validated, validationErr] = await asyncHandler(() =>
      paymentSchema.validate(form, { abortEarly: false })
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
      setForm({ amount: 0, payment_date: "", payment_type: "partial", note: "" });
    }
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
          Payments
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {payments.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
          No payments recorded
        </p>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2"
            >
              <div>
                <p className="text-xs text-[var(--color-accent-green)] font-[var(--font-mono)]">
                  {formatCurrency(p.amount)}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
                  {formatDate(p.payment_date, "MMM dd")} — {p.payment_type}
                  {p.note && ` — ${p.note}`}
                </p>
              </div>
              <button
                onClick={() => onDelete(p.id)}
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
        header="Add Payment"
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
            label="Amount"
            type="number"
            value={String(form.amount)}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            error={errors.amount}
          />
          <Input
            label="Payment Date"
            type="date"
            value={form.payment_date}
            onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
            error={errors.payment_date}
          />
          <Select
            label="Payment Type"
            options={[
              { label: "Advance", value: "advance" },
              { label: "Milestone", value: "milestone" },
              { label: "Partial", value: "partial" },
              { label: "Final", value: "final" },
            ]}
            value={form.payment_type}
            onChange={(e) =>
              setForm({ ...form, payment_type: e.target.value as Payment["payment_type"] })
            }
            error={errors.payment_type}
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
