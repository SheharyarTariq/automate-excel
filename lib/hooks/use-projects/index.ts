"use client";

import { useState, useEffect, useCallback } from "react";
import { asyncHandler } from "@/lib/utils/async-handler";
import { supabase } from "@/lib/supabase";
import type { Project, Milestone, Payment, ProjectCost, EditLog } from "@/types";
import toast from "react-hot-toast";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const [data, err] = await asyncHandler(() =>
      supabase.from("projects").select("*").order("created_at", { ascending: false })
    );

    if (err || data?.error) {
      setError(err || new Error(data?.error?.message));
      toast.error("Failed to load projects");
    } else {
      setProjects((data?.data as Project[]) ?? []);
    }
    setLoading(false);
  }, []);

  const createProject = async (project: Partial<Project>) => {
    const [data, err] = await asyncHandler(() =>
      supabase.from("projects").insert(project).select().single()
    );

    if (err || data?.error) {
      toast.error("Failed to create project");
      return null;
    }

    toast.success("Project created");
    await fetchProjects();
    return data?.data as Project;
  };

  const updateProject = async (
    id: string,
    updates: Partial<Project>,
    editedBy: string
  ) => {
    const [existing] = await asyncHandler(() =>
      supabase.from("projects").select("*").eq("id", id).single()
    );

    const [data, err] = await asyncHandler(() =>
      supabase
        .from("projects")
        .update({
          ...updates,
          last_edited_by: editedBy,
          last_edited_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()
    );

    if (err || data?.error) {
      toast.error("Failed to update project");
      return null;
    }

    if (existing?.data) {
      const old = existing.data as Record<string, unknown>;
      for (const key of Object.keys(updates)) {
        if (old[key] !== undefined && String(old[key]) !== String((updates as Record<string, unknown>)[key])) {
          await asyncHandler(() =>
            supabase.from("edit_logs").insert({
              project_id: id,
              edited_by: editedBy,
              field_changed: key,
              old_value: String(old[key]),
              new_value: String((updates as Record<string, unknown>)[key]),
            })
          );
        }
      }
    }

    toast.success("Project updated");
    await fetchProjects();
    return data?.data as Project;
  };

  const deleteProject = async (id: string) => {
    const [, err] = await asyncHandler(() =>
      supabase.from("projects").delete().eq("id", id)
    );

    if (err) {
      toast.error("Failed to delete project");
      return false;
    }

    toast.success("Project deleted");
    await fetchProjects();
    return true;
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}

export function useProjectDetail(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [costs, setCosts] = useState<ProjectCost[]>([]);
  const [editLogs, setEditLogs] = useState<EditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);

    const [projectData] = await asyncHandler(() =>
      supabase.from("projects").select("*").eq("id", projectId).single()
    );
    if (projectData?.data) setProject(projectData.data as Project);

    const [milestonesData] = await asyncHandler(() =>
      supabase
        .from("milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true })
    );
    if (milestonesData?.data) setMilestones(milestonesData.data as Milestone[]);

    const [paymentsData] = await asyncHandler(() =>
      supabase
        .from("payments")
        .select("*")
        .eq("project_id", projectId)
        .order("payment_date", { ascending: false })
    );
    if (paymentsData?.data) setPayments(paymentsData.data as Payment[]);

    const [costsData] = await asyncHandler(() =>
      supabase
        .from("project_costs")
        .select("*")
        .eq("project_id", projectId)
        .order("cost_date", { ascending: false })
    );
    if (costsData?.data) setCosts(costsData.data as ProjectCost[]);

    const [logsData] = await asyncHandler(() =>
      supabase
        .from("edit_logs")
        .select("*")
        .eq("project_id", projectId)
        .order("edited_at", { ascending: false })
    );
    if (logsData?.data) setEditLogs(logsData.data as EditLog[]);

    setLoading(false);
  }, [projectId]);

  const addMilestone = async (milestone: Partial<Milestone>) => {
    const [data, err] = await asyncHandler(() =>
      supabase
        .from("milestones")
        .insert({ ...milestone, project_id: projectId })
        .select()
        .single()
    );

    if (err || data?.error) {
      toast.error("Failed to add milestone");
      return null;
    }

    toast.success("Milestone added");
    await fetchAll();
    return data?.data as Milestone;
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    const [, err] = await asyncHandler(() =>
      supabase.from("milestones").update(updates).eq("id", id)
    );

    if (err) {
      toast.error("Failed to update milestone");
      return false;
    }

    toast.success("Milestone updated");
    await fetchAll();
    return true;
  };

  const deleteMilestone = async (id: string) => {
    const [, err] = await asyncHandler(() =>
      supabase.from("milestones").delete().eq("id", id)
    );

    if (err) {
      toast.error("Failed to delete milestone");
      return false;
    }

    toast.success("Milestone deleted");
    await fetchAll();
    return true;
  };

  const addPayment = async (payment: Partial<Payment>) => {
    const [data, err] = await asyncHandler(() =>
      supabase
        .from("payments")
        .insert({ ...payment, project_id: projectId })
        .select()
        .single()
    );

    if (err || data?.error) {
      toast.error("Failed to add payment");
      return null;
    }

    const newTotal =
      payments.reduce((sum, p) => sum + p.amount, 0) + (payment.amount || 0);
    await asyncHandler(() =>
      supabase
        .from("projects")
        .update({ total_received: newTotal })
        .eq("id", projectId)
    );

    toast.success("Payment added");
    await fetchAll();
    return data?.data as Payment;
  };

  const deletePayment = async (id: string) => {
    const payment = payments.find((p) => p.id === id);
    const [, err] = await asyncHandler(() =>
      supabase.from("payments").delete().eq("id", id)
    );

    if (err) {
      toast.error("Failed to delete payment");
      return false;
    }

    if (payment) {
      const newTotal =
        payments.reduce((sum, p) => sum + p.amount, 0) - payment.amount;
      await asyncHandler(() =>
        supabase
          .from("projects")
          .update({ total_received: Math.max(0, newTotal) })
          .eq("id", projectId)
      );
    }

    toast.success("Payment deleted");
    await fetchAll();
    return true;
  };

  const addCost = async (cost: Partial<ProjectCost>) => {
    const [data, err] = await asyncHandler(() =>
      supabase
        .from("project_costs")
        .insert({ ...cost, project_id: projectId })
        .select()
        .single()
    );

    if (err || data?.error) {
      toast.error("Failed to add cost");
      return null;
    }

    toast.success("Cost added");
    await fetchAll();
    return data?.data as ProjectCost;
  };

  const deleteCost = async (id: string) => {
    const [, err] = await asyncHandler(() =>
      supabase.from("project_costs").delete().eq("id", id)
    );

    if (err) {
      toast.error("Failed to delete cost");
      return false;
    }

    toast.success("Cost deleted");
    await fetchAll();
    return true;
  };

  useEffect(() => {
    if (projectId) fetchAll();
  }, [projectId, fetchAll]);

  return {
    project,
    milestones,
    payments,
    costs,
    editLogs,
    loading,
    refetch: fetchAll,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addPayment,
    deletePayment,
    addCost,
    deleteCost,
  };
}
