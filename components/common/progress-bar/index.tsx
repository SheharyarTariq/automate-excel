"use client";

import { cn } from "@/lib/utils/cn";
import { formatPercent } from "@/lib/formatters";

interface ProgressBarProps {
  received: number;
  total: number;
  className?: string;
}

export default function ProgressBar({
  received,
  total,
  className,
}: ProgressBarProps) {
  const percent = formatPercent(received, total);
  const clampedPercent = Math.min(percent, 100);

  const getColor = () => {
    if (percent >= 100) return "bg-[var(--color-accent-cyan)]";
    if (percent >= 80) return "bg-[var(--color-accent-gold)]";
    return "bg-[var(--color-accent-green)]";
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor())}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      <span className="text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)] min-w-[3ch] text-right">
        {percent}%
      </span>
    </div>
  );
}
