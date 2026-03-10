"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { loginSchema } from "@/lib/validations/auth";
import { routes } from "@/lib/routes";
import { asyncHandler } from "@/lib/utils/async-handler";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const [validated, validationErr] = await asyncHandler(() =>
      loginSchema.validate({ email, password }, { abortEarly: false })
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
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      toast.success("Welcome back");
      router.push(routes.ui.dashboard);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-4">
      <div className="w-full max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-green)]" />
          <span className="text-lg font-medium text-[var(--color-text-primary)] font-[var(--font-mono)] tracking-wider">
            FlowTrack
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@agency.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-[10px] text-[var(--color-text-muted)] font-[var(--font-mono)]">
          Project tracking for small teams
        </p>
      </div>
    </div>
  );
}
