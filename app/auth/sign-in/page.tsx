"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  AuthField,
  AuthLink,
  AuthShell,
  AuthSubmitButton,
} from "@/components/auth/AuthShell";
import { setAuthFlash } from "@/lib/auth-flash";
import { isValidEmail } from "@/lib/auth-validation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    authError ? "Something went wrong. Please try signing in again." : null,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(
          "Email or password didn't match. Try again, or reset your password.",
        );
        return;
      }

      const name =
        (data.user?.user_metadata?.name as string | undefined)?.trim() ||
        email.split("@")[0];
      setAuthFlash(`Welcome back, ${name}!`);
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders and checkout a little faster next time."
      footer={
        <p className="text-center font-sans text-sm text-brand-green/70">
          Don&apos;t have an account?{" "}
          <AuthLink href={`/auth/sign-up${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}>
            Create one
          </AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="sign-in-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          inputMode="email"
          required
        />
        <AuthField
          id="sign-in-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        <p className="text-right">
          <AuthLink href="/auth/forgot-password">Forgot password?</AuthLink>
        </p>
        {error && (
          <p className="font-sans text-sm text-brand-red" role="alert">
            {error}
          </p>
        )}
        <AuthSubmitButton loading={loading}>Sign In</AuthSubmitButton>
      </form>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Welcome back">
          <p className="font-sans text-sm text-brand-green/60">Loading…</p>
        </AuthShell>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
