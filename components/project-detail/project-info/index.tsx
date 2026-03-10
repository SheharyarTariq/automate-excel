"use client";

import { useState } from "react";
import { Input, Select, Textarea, Button, Badge } from "@/components/common";
import { formatDate } from "@/lib/formatters";
import type { Project } from "@/types";

interface ProjectInfoProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => Promise<Project | null>;
}

export default function ProjectInfo({ project, onUpdate }: ProjectInfoProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: project.name,
    client_name: project.client_name,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date || "",
    fee_type: project.fee_type,
    fee_amount: project.fee_amount,
    team_size: project.team_size,
    platform: project.platform,
    status: project.status,
    currency: project.currency,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await onUpdate(form as Partial<Project>);
    setLoading(false);
    if (result) setEditing(false);
  };

  const statusVariant = {
    active: "active" as const,
    paused: "paused" as const,
    completed: "completed" as const,
    cancelled: "cancelled" as const,
  };

  if (!editing) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
            Project Info
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>

        <div className="space-y-3">
          <InfoRow label="Name" value={project.name} />
          <InfoRow label="Client" value={project.client_name} />
          <InfoRow label="Description" value={project.description || "—"} />
          <InfoRow label="Platform" value={project.platform} />
          <InfoRow label="Start" value={formatDate(project.start_date)} />
          <InfoRow label="End" value={project.end_date ? formatDate(project.end_date) : "—"} />
          <InfoRow label="Fee" value={`${project.fee_type} — ${project.currency} ${project.fee_amount}`} />
          <InfoRow label="Team Size" value={String(project.team_size)} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
              Status
            </span>
            <Badge variant={statusVariant[project.status]}>
              {project.status}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
          Edit Project
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" loading={loading} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Client"
          value={form.client_name}
          onChange={(e) => setForm({ ...form, client_name: e.target.value })}
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Fee Type"
            options={[
              { label: "Fixed", value: "fixed" },
              { label: "Hourly", value: "hourly" },
              { label: "Retainer", value: "retainer" },
            ]}
            value={form.fee_type}
            onChange={(e) => setForm({ ...form, fee_type: e.target.value as Project["fee_type"] })}
          />
          <Input
            label="Fee Amount"
            type="number"
            value={String(form.fee_amount)}
            onChange={(e) => setForm({ ...form, fee_amount: Number(e.target.value) })}
          />
        </div>
        <Input
          label="Team Size"
          type="number"
          value={String(form.team_size)}
          onChange={(e) => setForm({ ...form, team_size: Number(e.target.value) })}
        />
        <Select
          label="Status"
          options={[
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
        {label}
      </span>
      <span className="text-xs text-[var(--color-text-primary)] font-[var(--font-mono)]">
        {value}
      </span>
    </div>
  );
}
