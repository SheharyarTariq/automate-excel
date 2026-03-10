"use client";

import { useState } from "react";
import { Drawer, Button, Input, Select, Textarea } from "@/components/common";
import { projectSchema } from "@/lib/validations/project";
import { asyncHandler } from "@/lib/utils/async-handler";
import type { Project } from "@/types";

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Project>) => Promise<Project | null>;
  initialData?: Partial<Project>;
}

export default function ProjectDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProjectDrawerProps) {
  const [form, setForm] = useState<Record<string, string | number>>({
    name: initialData?.name || "",
    client_name: initialData?.client_name || "",
    description: initialData?.description || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    fee_type: initialData?.fee_type || "fixed",
    fee_amount: initialData?.fee_amount || 0,
    team_size: initialData?.team_size || 1,
    platform: initialData?.platform || "direct",
    status: initialData?.status || "active",
    currency: initialData?.currency || "USD",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async () => {
    setErrors({});

    const [validated, validationErr] = await asyncHandler(() =>
      projectSchema.validate(form, { abortEarly: false })
    );

    if (validationErr || !validated) {
      const yupErr = validationErr as { inner?: Array<{ path?: string; message: string }> };
      const fieldErrors: Record<string, string> = {};
      if (yupErr.inner) {
        yupErr.inner.forEach((err) => {
          if (err.path) fieldErrors[err.path] = err.message;
        });
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const result = await onSubmit(form as unknown as Partial<Project>);
    setLoading(false);

    if (result) {
      onClose();
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      header={initialData ? "Edit Project" : "New Project"}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            {initialData ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Project Name"
          value={String(form.name)}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label="Client Name"
          value={String(form.client_name)}
          onChange={(e) => handleChange("client_name", e.target.value)}
          error={errors.client_name}
        />
        <Textarea
          label="Description"
          value={String(form.description)}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={String(form.start_date)}
            onChange={(e) => handleChange("start_date", e.target.value)}
            error={errors.start_date}
          />
          <Input
            label="End Date"
            type="date"
            value={String(form.end_date)}
            onChange={(e) => handleChange("end_date", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Fee Type"
            options={[
              { label: "Fixed", value: "fixed" },
              { label: "Hourly", value: "hourly" },
              { label: "Retainer", value: "retainer" },
            ]}
            value={String(form.fee_type)}
            onChange={(e) => handleChange("fee_type", e.target.value)}
            error={errors.fee_type}
          />
          <Input
            label="Fee Amount"
            type="number"
            value={String(form.fee_amount)}
            onChange={(e) => handleChange("fee_amount", Number(e.target.value))}
            error={errors.fee_amount}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Team Size"
            type="number"
            value={String(form.team_size)}
            onChange={(e) => handleChange("team_size", Number(e.target.value))}
            error={errors.team_size}
          />
          <Select
            label="Currency"
            options={[
              { label: "USD", value: "USD" },
              { label: "EUR", value: "EUR" },
              { label: "GBP", value: "GBP" },
            ]}
            value={String(form.currency)}
            onChange={(e) => handleChange("currency", e.target.value)}
          />
        </div>
        <Select
          label="Platform"
          options={[
            { label: "Upwork", value: "upwork" },
            { label: "Direct", value: "direct" },
            { label: "Fiverr", value: "fiverr" },
            { label: "Toptal", value: "toptal" },
            { label: "Other", value: "other" },
          ]}
          value={String(form.platform)}
          onChange={(e) => handleChange("platform", e.target.value)}
          error={errors.platform}
        />
        <Select
          label="Status"
          options={[
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          value={String(form.status)}
          onChange={(e) => handleChange("status", e.target.value)}
          error={errors.status}
        />
      </div>
    </Drawer>
  );
}
