"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { asyncHandler } from "@/lib/utils/async-handler";
import { supabase } from "@/lib/supabase";
import { Button, Input, Skeleton } from "@/components/common";
import type { Profile } from "@/types";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { profile, loading, changePassword, refetch } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setUsername(profile.username);
    }
  }, [profile]);

  useEffect(() => {
    const fetchTeam = async () => {
      const [data] = await asyncHandler(() =>
        supabase.from("profiles").select("*").order("created_at", { ascending: true })
      );
      if (data?.data) {
        setTeamMembers(data.data as Profile[]);
      }
    };
    fetchTeam();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setSaving(true);

    const [, err] = await asyncHandler(() =>
      supabase
        .from("profiles")
        .update({ full_name: fullName, username })
        .eq("id", profile.id)
    );

    setSaving(false);

    if (err) {
      toast.error("Failed to update profile");
      return;
    }

    toast.success("Profile updated");
    await refetch();
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    await changePassword(newPassword);
    setChangingPassword(false);
    setNewPassword("");
  };

  if (loading) {
    return (
      <div className="max-w-xl space-y-6">
        <Skeleton variant="card" className="h-48" />
        <Skeleton variant="card" className="h-32" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
        <h2 className="mb-4 text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
          Profile
        </h2>
        <div className="space-y-3">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            onClick={handleUpdateProfile}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
        <h2 className="mb-4 text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
          Change Password
        </h2>
        <div className="space-y-3">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
          />
          <Button
            variant="secondary"
            size="sm"
            loading={changingPassword}
            onClick={handleChangePassword}
          >
            Update Password
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
        <h2 className="mb-4 text-sm font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">
          Team Members
        </h2>
        {teamMembers.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
            No team members found
          </p>
        ) : (
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-md bg-[var(--color-bg-elevated)] px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-green-bg)] text-xs text-[var(--color-accent-green)] font-[var(--font-mono)]">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-primary)] font-[var(--font-mono)]">
                      {member.full_name}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
                      @{member.username}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)] capitalize">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
