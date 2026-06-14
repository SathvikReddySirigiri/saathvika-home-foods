"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AuthField,
  AuthLink,
  AuthShell,
  AuthSubmitButton,
} from "@/components/auth/AuthShell";
import { setAuthFlash } from "@/lib/auth-flash";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(Boolean(session));
      if (!session) {
        setError("Your session has expired. Please request a new reset code.");
      }
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setAuthFlash("Password updated. Please sign in with your new password.");
      router.push("/auth/sign-in");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set new password" subtitle="Choose a strong password for your account.">
      {!ready && !error ? (
        <p className="font-sans text-sm text-brand-green/60">Checking your session…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField
            id="reset-password"
            label="New password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
          />
          <AuthField
            id="reset-confirm"
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
          />
          {error && (
            <p className="font-sans text-sm text-brand-red" role="alert">
              {error}
              {error.includes("expired") && (
                <>
                  {" "}
                  <AuthLink href="/auth/forgot-password">Request a new code</AuthLink>
                </>
              )}
            </p>
          )}
          <AuthSubmitButton loading={loading} disabled={!ready}>
            Update password
          </AuthSubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
