"use client";

import { Input, Select } from "@/components/common";

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  feeTypeFilter: string;
  onFeeTypeChange: (value: string) => void;
  platformFilter: string;
  onPlatformChange: (value: string) => void;
}

export default function ProjectFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  feeTypeFilter,
  onFeeTypeChange,
  platformFilter,
  onPlatformChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-64">
        <Input
          placeholder="Search name or client..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="w-36">
        <Select
          options={[
            { label: "All Status", value: "" },
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        />
      </div>

      <div className="w-36">
        <Select
          options={[
            { label: "All Fees", value: "" },
            { label: "Fixed", value: "fixed" },
            { label: "Hourly", value: "hourly" },
            { label: "Retainer", value: "retainer" },
          ]}
          value={feeTypeFilter}
          onChange={(e) => onFeeTypeChange(e.target.value)}
        />
      </div>

      <div className="w-36">
        <Select
          options={[
            { label: "All Platforms", value: "" },
            { label: "Upwork", value: "upwork" },
            { label: "Direct", value: "direct" },
            { label: "Fiverr", value: "fiverr" },
            { label: "Toptal", value: "toptal" },
            { label: "Other", value: "other" },
          ]}
          value={platformFilter}
          onChange={(e) => onPlatformChange(e.target.value)}
        />
      </div>
    </div>
  );
}
