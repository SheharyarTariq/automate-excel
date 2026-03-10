"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-md border bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] font-[var(--font-mono)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors",
            error
              ? "border-[var(--color-accent-red)] focus:ring-1 focus:ring-[var(--color-accent-red)]"
              : "border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-accent-green)] focus:border-[var(--color-accent-green)]",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--color-accent-red)] font-[var(--font-mono)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
