"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/hooks/use-projects";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { routes } from "@/lib/routes";
import { Button } from "@/components/common";
import { Plus, Download } from "lucide-react";
import ProjectFilters from "./project-filters";
import ProjectsTable from "./projects-table";
import ProjectDrawer from "./project-drawer";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading, refetch, createProject, updateProject } =
    useProjects();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [feeTypeFilter, setFeeTypeFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useRealtime({
    table: "projects",
    onInsert: () => refetch(),
    onUpdate: () => refetch(),
    onDelete: () => refetch(),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setDrawerOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.client_name.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (feeTypeFilter) {
      result = result.filter((p) => p.fee_type === feeTypeFilter);
    }
    if (platformFilter) {
      result = result.filter((p) => p.platform === platformFilter);
    }

    result.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortColumn];
      const bVal = (b as unknown as Record<string, unknown>)[sortColumn];
      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return result;
  }, [projects, search, statusFilter, feeTypeFilter, platformFilter, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = useCallback(
    async (id: string, status: Project["status"]) => {
      await updateProject(id, { status }, "system");
    },
    [updateProject]
  );

  const exportCSV = () => {
    const headers = [
      "Name",
      "Client",
      "Platform",
      "Start Date",
      "Fee Type",
      "Fee Amount",
      "Received",
      "Status",
    ];
    const rows = filteredProjects.map((p) => [
      p.name,
      p.client_name,
      p.platform,
      p.start_date,
      p.fee_type,
      String(p.fee_amount),
      String(p.total_received),
      p.status,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          feeTypeFilter={feeTypeFilter}
          onFeeTypeChange={setFeeTypeFilter}
          platformFilter={platformFilter}
          onPlatformChange={setPlatformFilter}
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={exportCSV}>
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setDrawerOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Project
          </Button>
        </div>
      </div>

      <ProjectsTable
        projects={filteredProjects}
        loading={loading}
        onRowClick={(p) => router.push(routes.ui.projectDetail(p.id))}
        onStatusChange={handleStatusChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <ProjectDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={createProject}
      />
    </div>
  );
}
