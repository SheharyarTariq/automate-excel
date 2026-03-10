"use client";

import type { EditLog } from "@/types";
import { formatRelativeDate } from "@/lib/formatters";

interface ActivityFeedProps {
  logs: EditLog[];
}

export default function ActivityFeed({ logs }: ActivityFeedProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
      <h3 className="mb-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
        Recent Activity
      </h3>
      {logs.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
          No recent activity
        </p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 border-b border-[var(--color-border-subtle)] pb-3 last:border-0"
            >
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-accent-green)] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--color-text-primary)] font-[var(--font-mono)]">
                  <span className="text-[var(--color-accent-cyan)]">
                    {log.edited_by}
                  </span>{" "}
                  changed{" "}
                  <span className="text-[var(--color-accent-gold)]">
                    {log.field_changed}
                  </span>
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)] truncate">
                  {log.old_value} → {log.new_value}
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
                  {formatRelativeDate(log.edited_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
