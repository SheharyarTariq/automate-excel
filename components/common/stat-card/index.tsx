"use client";

import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  accent?: "green" | "cyan" | "red" | "gold";
  className?: string;
}

const accentColors: Record<string, string> = {
  green: "border-t-[var(--color-accent-green)]",
  cyan: "border-t-[var(--color-accent-cyan)]",
  red: "border-t-[var(--color-accent-red)]",
  gold: "border-t-[var(--color-accent-gold)]",
};

export default function StatCard({
  label,
  value,
  subtext,
  accent = "green",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 border-t-2",
        accentColors[accent],
        className
      )}
    >
      <p className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-2 text-xl font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)]">
          {subtext}
        </p>
      )}
    </div>
  );
}
