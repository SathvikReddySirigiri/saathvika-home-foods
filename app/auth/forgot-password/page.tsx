"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthField,
  AuthLink,
  AuthShell,
  AuthSubmitButton,
} from "@/components/auth/AuthShell";
import { isValidEmail } from "@/lib/auth-validation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const trimmedEmail = email.trim();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: { shouldCreateUser: false },
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(trimmedEmail)}&intent=reset`,
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send a 6-digit code."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="forgot-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          inputMode="email"
          required
        />
        {error && (
          <p className="font-sans text-sm text-brand-red" role="alert">
            {error}
          </p>
        )}
        <AuthSubmitButton loading={loading}>Send reset code</AuthSubmitButton>
        <p className="text-center">
          <AuthLink href="/auth/sign-in">Back to sign in</AuthLink>
        </p>
      </form>
    </AuthShell>
  );
}
