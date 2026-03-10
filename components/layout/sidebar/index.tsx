"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/routes";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  DollarSign,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: routes.ui.dashboard,
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Projects",
    href: routes.ui.projects,
    icon: <FolderKanban className="h-4 w-4" />,
  },
  {
    label: "Analytics",
    href: routes.ui.analytics,
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    label: "Costs",
    href: routes.ui.costs,
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: routes.ui.settings,
    icon: <Settings className="h-4 w-4" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-56 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-4">
        <div className="h-2 w-2 rounded-full bg-[var(--color-accent-green)]" />
        <span className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)] tracking-wider">
          FlowTrack
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-[var(--font-mono)] transition-colors",
                isActive
                  ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-green)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] px-5 py-3">
        <p className="text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
