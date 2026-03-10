import type { Metadata } from "next";
import "./globals.css";
import Toaster from "@/components/common/toaster";

export const metadata: Metadata = {
  title: "FlowTrack — Project Tracking",
  description: "Project tracking for small digital agencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-[var(--font-mono)]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
