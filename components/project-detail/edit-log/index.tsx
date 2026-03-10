"use client";

import type { EditLog } from "@/types";
import { formatRelativeDate } from "@/lib/formatters";

interface EditLogPanelProps {
  logs: EditLog[];
}

export default function EditLogPanel({ logs }: EditLogPanelProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
      <h2 className="mb-4 text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
        Edit Log
      </h2>

      {logs.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
          No edits recorded
        </p>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border-b border-[var(--color-border-subtle)] pb-3 last:border-0"
            >
              <p className="text-xs text-[var(--color-text-primary)] font-[var(--font-mono)]">
                <span className="text-[var(--color-accent-cyan)]">
                  {log.edited_by}
                </span>{" "}
                changed{" "}
                <span className="text-[var(--color-accent-gold)]">
                  {log.field_changed}
                </span>
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
                {log.old_value || "—"} → {log.new_value || "—"}
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
                {formatRelativeDate(log.edited_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
