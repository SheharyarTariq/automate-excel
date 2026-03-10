"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-bg-elevated)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
        },
        success: {
          iconTheme: {
            primary: "var(--color-accent-green)",
            secondary: "var(--color-bg-base)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-accent-red)",
            secondary: "var(--color-bg-base)",
          },
        },
      }}
    />
  );
}
