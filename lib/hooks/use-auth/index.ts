"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { asyncHandler } from "@/lib/utils/async-handler";
import { setTokens, clearTokens } from "@/lib/utils/auth-cookies";
import { routes } from "@/lib/routes";
import type { Profile } from "@/types";
import toast from "react-hot-toast";

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    const [session, sessionErr] = await asyncHandler(() =>
      supabase.auth.getSession()
    );

    if (sessionErr || !session?.data.session) {
      setLoading(false);
      return;
    }

    const userId = session.data.session.user.id;

    const [profileData, profileErr] = await asyncHandler(() =>
      supabase.from("profiles").select("*").eq("id", userId).single()
    );

    if (profileErr) {
      toast.error("Failed to load profile");
    } else if (profileData?.data) {
      setProfile(profileData.data as Profile);
    }

    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const [data, err] = await asyncHandler(() =>
      supabase.auth.signInWithPassword({ email, password })
    );

    if (err || data?.error) {
      const message = data?.error?.message || err?.message || "Login failed";
      toast.error(message);
      return false;
    }

    if (data?.data.session) {
      setTokens(
        data.data.session.access_token,
        data.data.session.refresh_token
      );
    }

    await fetchProfile();
    return true;
  };

  const logout = async () => {
    await asyncHandler(() => supabase.auth.signOut());
    clearTokens();
    setProfile(null);
    window.location.href = routes.ui.login;
  };

  const changePassword = async (newPassword: string) => {
    const [, err] = await asyncHandler(() =>
      supabase.auth.updateUser({ password: newPassword })
    );

    if (err) {
      toast.error("Failed to change password");
      return false;
    }

    toast.success("Password updated");
    return true;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, login, logout, changePassword, refetch: fetchProfile };
}
