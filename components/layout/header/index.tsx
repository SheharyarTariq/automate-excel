"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/lib/utils/logout";
import Button from "@/components/common/button";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/analytics": "Analytics",
  "/costs": "Costs",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith("/projects/") && pathname !== "/projects") {
      return "Project Detail";
    }
    return pageTitles[pathname] || "FlowTrack";
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/80 backdrop-blur-sm px-6">
      <h1 className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
        {getTitle()}
      </h1>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </Button>
      </div>
    </header>
  );
}
