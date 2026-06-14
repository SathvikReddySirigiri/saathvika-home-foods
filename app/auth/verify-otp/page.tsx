"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { OtpInput } from "@/components/auth/OtpInput";
import {
  AuthLink,
  AuthShell,
  AuthSubmitButton,
} from "@/components/auth/AuthShell";
import { isValidEmail } from "@/lib/auth-validation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_VERIFY_ERROR =
  "Code didn't match. Try again, or resend a new code.";

type OtpIntent = "signup" | "reset";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const intentParam = searchParams.get("intent");
  const intent: OtpIntent = intentParam === "reset" ? "reset" : "signup";
  const email = emailParam.trim();

  const subtitle =
    intent === "reset"
      ? `We sent a 6-digit code to ${email || "your email"}. Enter it below to reset your password.`
      : `We sent a 6-digit code to ${email}. Enter it below to activate your account.`;

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const startResendCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  }, []);

  const handleResend = async () => {
    if (!email || !isValidEmail(email) || resendCooldown > 0 || resendLoading) {
      return;
    }

    setResendLoading(true);
    setError(null);
    setResendMessage(null);

    try {
      const supabase = createBrowserSupabaseClient();

      if (intent === "reset") {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false },
        });
        if (otpError) {
          setError(otpError.message);
          return;
        }
      } else {
        const { error: resendError } = await supabase.auth.resend({
          type: "signup",
          email,
        });
        if (resendError) {
          setError(resendError.message);
          return;
        }
      }

      setToken("");
      setResendMessage("A new code has been sent. Check your inbox.");
      startResendCooldown();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResendMessage(null);

    if (!email || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const code = token.replace(/\D/g, "");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const verifyType = intent === "reset" ? "email" : "signup";
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: verifyType,
      });

      if (verifyError) {
        setError(OTP_VERIFY_ERROR);
        return;
      }

      if (intent === "reset") {
        router.push("/auth/reset-password");
        return;
      }

      router.push("/auth/welcome");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email || !isValidEmail(email)) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="We need a valid email address to verify your account."
      >
        <p className="font-sans text-sm text-brand-red" role="alert">
          Missing or invalid email. Please sign up again.
        </p>
        <p className="mt-6 text-center">
          <AuthLink href="/auth/sign-up">Back to sign up</AuthLink>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Check your email"
      subtitle={subtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <OtpInput
          value={token}
          onChange={setToken}
          disabled={loading}
          error={Boolean(error)}
        />
        {error && (
          <p className="text-center font-sans text-sm text-brand-red" role="alert">
            {error}
          </p>
        )}
        {resendMessage && (
          <p className="text-center font-sans text-sm text-brand-green/70">
            {resendMessage}
          </p>
        )}
        <AuthSubmitButton loading={loading} disabled={token.replace(/\D/g, "").length !== 6}>
          Verify
        </AuthSubmitButton>
      </form>

      <p className="mt-6 text-center font-sans text-sm text-brand-green/70">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || resendLoading}
          className="font-sans text-sm text-brand-green/70 underline-offset-2 transition-colors hover:text-brand-gold hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
        >
          {resendLoading
            ? "Sending…"
            : resendCooldown > 0
              ? `Resend (${resendCooldown}s)`
              : "Resend"}
        </button>
      </p>

      <p className="mt-3 text-center font-sans text-sm text-brand-green/70">
        Wrong email?{" "}
        <AuthLink href={intent === "reset" ? "/auth/forgot-password" : "/auth/sign-up"}>
          Change it
        </AuthLink>
      </p>

      <p className="mt-4 text-center font-sans text-xs text-brand-green/55">
        Check spam if you don&apos;t see the email within a minute.
      </p>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Check your email">
          <p className="font-sans text-sm text-brand-green/60">Loading…</p>
        </AuthShell>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
