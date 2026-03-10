"use client";

import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  | "active"
  | "completed"
  | "paused"
  | "cancelled"
  | "fee-type";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  active: {
    bg: "bg-[var(--color-green-bg)]",
    text: "text-[var(--color-accent-green)]",
    dot: "bg-[var(--color-accent-green)]",
  },
  completed: {
    bg: "bg-[var(--color-cyan-bg)]",
    text: "text-[var(--color-accent-cyan)]",
    dot: "bg-[var(--color-accent-cyan)]",
  },
  paused: {
    bg: "bg-[var(--color-gold-bg)]",
    text: "text-[var(--color-accent-gold)]",
    dot: "bg-[var(--color-accent-gold)]",
  },
  cancelled: {
    bg: "bg-[var(--color-red-bg)]",
    text: "text-[var(--color-accent-red)]",
    dot: "bg-[var(--color-accent-red)]",
  },
  "fee-type": {
    bg: "bg-transparent border border-[var(--color-accent-gold)]",
    text: "text-[var(--color-accent-gold)]",
    dot: "bg-[var(--color-accent-gold)]",
  },
};

export default function Badge({ variant, children, className }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-[var(--font-mono)]",
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      {children}
    </span>
  );
}
