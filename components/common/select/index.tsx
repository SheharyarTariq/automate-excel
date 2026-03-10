"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-md border bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] font-[var(--font-mono)] outline-none transition-colors appearance-none",
            error
              ? "border-[var(--color-accent-red)] focus:ring-1 focus:ring-[var(--color-accent-red)]"
              : "border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-accent-green)] focus:border-[var(--color-accent-green)]",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-[var(--color-accent-red)] font-[var(--font-mono)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
