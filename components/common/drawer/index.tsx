"use client";

import { ReactNode, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  width?: string;
}

export default function Drawer({
  isOpen,
  onClose,
  header,
  footer,
  children,
  width = "max-w-lg",
}: DrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full border-l border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-2xl transition-transform duration-300 ease-in-out",
          width,
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {header && (
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <div className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
              {header}
            </div>
            <button
              onClick={onClose}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="border-t border-[var(--color-border)] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
