"use client";

import { Table, Badge, type Column } from "@/components/common";
import type { Project } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  onRowClick: (project: Project) => void;
  onStatusChange: (id: string, status: Project["status"]) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}

const statusVariantMap: Record<Project["status"], "active" | "completed" | "paused" | "cancelled"> = {
  active: "active",
  completed: "completed",
  paused: "paused",
  cancelled: "cancelled",
};

export default function ProjectsTable({
  projects,
  loading,
  onRowClick,
  onStatusChange,
  sortColumn,
  sortDirection,
  onSort,
}: ProjectsTableProps) {
  const columns: Column<Project>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (p) => (
        <span className="text-[var(--color-accent-cyan)]">{p.name}</span>
      ),
    },
    { key: "client_name", header: "Client", sortable: true },
    {
      key: "platform",
      header: "Platform",
      render: (p) => (
        <span className="capitalize">{p.platform}</span>
      ),
    },
    {
      key: "start_date",
      header: "Start",
      sortable: true,
      render: (p) => formatDate(p.start_date, "MMM dd"),
    },
    {
      key: "fee_type",
      header: "Fee Type",
      render: (p) => (
        <Badge variant="fee-type">{p.fee_type}</Badge>
      ),
    },
    {
      key: "fee_amount",
      header: "Amount",
      sortable: true,
      render: (p) => formatCurrency(p.fee_amount, p.currency),
    },
    {
      key: "total_received",
      header: "Received",
      sortable: true,
      render: (p) => (
        <span className="text-[var(--color-accent-green)]">
          {formatCurrency(p.total_received, p.currency)}
        </span>
      ),
    },
    {
      key: "last_edited_by",
      header: "Edited By",
      render: (p) => p.last_edited_by || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative"
        >
          <select
            value={p.status}
            onChange={(e) =>
              onStatusChange(p.id, e.target.value as Project["status"])
            }
            className="appearance-none bg-transparent text-xs font-[var(--font-mono)] cursor-pointer outline-none"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Badge variant={statusVariantMap[p.status]} className="pointer-events-none absolute inset-0">
            {p.status}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <Table<Project>
      columns={columns}
      data={projects}
      loading={loading}
      onRowClick={onRowClick}
      keyExtractor={(p) => p.id}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      emptyTitle="No projects yet"
      emptyDescription="Create your first project to get started."
    />
  );
}
