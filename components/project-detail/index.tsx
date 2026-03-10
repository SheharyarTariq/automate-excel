"use client";

import { useParams } from "next/navigation";
import { useProjectDetail } from "@/lib/hooks/use-projects";
import { useAuth } from "@/lib/hooks/use-auth";
import { Skeleton } from "@/components/common";
import { supabase } from "@/lib/supabase";
import { asyncHandler } from "@/lib/utils/async-handler";
import ProjectInfo from "./project-info";
import FinancialSummary from "./financial-summary";
import Milestones from "./milestones";
import Payments from "./payments";
import ProjectCosts from "./project-costs";
import EditLogPanel from "./edit-log";
import type { Project } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { profile } = useAuth();
  const {
    project,
    milestones,
    payments,
    costs,
    editLogs,
    loading,
    refetch,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addPayment,
    deletePayment,
    addCost,
    deleteCost,
  } = useProjectDetail(projectId);

  const handleUpdateProject = async (updates: Partial<Project>) => {
    const editedBy = profile?.full_name || "Unknown";

    const [existing] = await asyncHandler(() =>
      supabase.from("projects").select("*").eq("id", projectId).single()
    );

    const [data, err] = await asyncHandler(() =>
      supabase
        .from("projects")
        .update({
          ...updates,
          last_edited_by: editedBy,
          last_edited_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single()
    );

    if (err || data?.error) return null;

    if (existing?.data) {
      const old = existing.data as Record<string, unknown>;
      for (const key of Object.keys(updates)) {
        if (
          old[key] !== undefined &&
          String(old[key]) !== String((updates as Record<string, unknown>)[key])
        ) {
          await asyncHandler(() =>
            supabase.from("edit_logs").insert({
              project_id: projectId,
              edited_by: editedBy,
              field_changed: key,
              old_value: String(old[key]),
              new_value: String((updates as Record<string, unknown>)[key]),
            })
          );
        }
      }
    }

    await refetch();
    return data?.data as Project;
  };

  if (loading || !project) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
        </div>
        <div>
          <Skeleton variant="card" className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <ProjectInfo project={project} onUpdate={handleUpdateProject} />
        <FinancialSummary project={project} costs={costs} />
        <Milestones
          milestones={milestones}
          onAdd={addMilestone}
          onUpdate={updateMilestone}
          onDelete={deleteMilestone}
        />
        <Payments
          payments={payments}
          onAdd={addPayment}
          onDelete={deletePayment}
        />
        <ProjectCosts
          costs={costs}
          projectId={projectId}
          onAdd={addCost}
          onDelete={deleteCost}
        />
      </div>
      <div>
        <EditLogPanel logs={editLogs} />
      </div>
    </div>
  );
}
