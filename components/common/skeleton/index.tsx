"use client";

import { cn } from "@/lib/utils/cn";

type SkeletonVariant = "text" | "card" | "row" | "circle";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  card: "h-32 w-full rounded-lg",
  row: "h-12 w-full rounded",
  circle: "h-10 w-10 rounded-full",
};

export default function Skeleton({
  variant = "text",
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--color-bg-elevated)]",
        variantStyles[variant],
        className
      )}
    />
  );
}
