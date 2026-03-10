"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-8 py-16",
        className
      )}
    >
      <div className="text-[var(--color-text-muted)] mb-4">
        {icon || <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
        {title}
      </h3>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)] text-center max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
