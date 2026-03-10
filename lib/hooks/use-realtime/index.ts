"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UseRealtimeOptions {
  table: string;
  onInsert?: (payload: Record<string, unknown>) => void;
  onUpdate?: (payload: Record<string, unknown>) => void;
  onDelete?: (payload: Record<string, unknown>) => void;
}

export function useRealtime({
  table,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table },
        (payload) => onInsert?.(payload.new as Record<string, unknown>)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table },
        (payload) => onUpdate?.(payload.new as Record<string, unknown>)
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table },
        (payload) => onDelete?.(payload.old as Record<string, unknown>)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onInsert, onUpdate, onDelete]);
}
