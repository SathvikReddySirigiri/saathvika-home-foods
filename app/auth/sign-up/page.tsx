"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  AuthField,
  AuthLink,
  AuthShell,
  AuthSubmitButton,
} from "@/components/auth/AuthShell";
import {
  getPasswordStrengthHint,
  isValidEmail,
  isValidOptionalPhone,
} from "@/lib/auth-validation";
import { formatPhoneInput } from "@/lib/delivery-form";
import {
  normalizePhoneForStorage,
  PHONE_HELPER_TEXT,
  PHONE_VALIDATION_ERROR,
} from "@/lib/phone";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrengthHint(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidOptionalPhone(phone)) {
      setError(PHONE_VALIDATION_ERROR);
      return;
    }
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
      const canonicalPhone = phone.trim()
        ? normalizePhoneForStorage(phone)
        : null;
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: canonicalPhone,
            marketing_opt_in: marketingOptIn,
          },
        },
      });

      if (signUpError) {
        const message = signUpError.message.toLowerCase();
        if (message.includes("registered") || message.includes("exists")) {
          setError("This email is already registered.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(email.trim())}`,
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Optional — save your details for faster checkout and order history."
      footer={
        <p className="text-center font-sans text-sm text-brand-green/70">
          Already have an account?{" "}
          <AuthLink
            href={`/auth/sign-in${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          >
            Sign in
          </AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="sign-up-name"
          label="Name"
          value={name}
          onChange={setName}
          autoComplete="name"
          placeholder="e.g. Sahithi Reddy"
          required
        />
        <AuthField
          id="sign-up-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          inputMode="email"
          required
        />
        <AuthField
          id="sign-up-phone"
          label="Phone"
          type="tel"
          value={phone}
          onChange={(value) => setPhone(formatPhoneInput(value))}
          autoComplete="tel"
          inputMode="tel"
          placeholder="76718 98163"
          helper={PHONE_HELPER_TEXT}
        />
        <div>
          <AuthField
            id="sign-up-password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
          />
          <p
            className={`mt-1 font-sans text-xs ${
              strength.tone === "good"
                ? "text-brand-green/70"
                : strength.tone === "warn"
                  ? "text-brand-red/80"
                  : "text-brand-green/55"
            }`}
          >
            {strength.label}
          </p>
        </div>
        <AuthField
          id="sign-up-confirm"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />
        <label className="flex items-start gap-2.5 font-sans text-sm text-brand-green/75">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-brand-gold/40 text-brand-gold focus:ring-brand-gold/30"
          />
          <span>I agree to receive order updates and occasional offers</span>
        </label>
        {error && (
          <div className="font-sans text-sm text-brand-red" role="alert">
            <p>{error}</p>
            {error.includes("already registered") && (
              <p className="mt-2">
                <AuthLink href="/auth/sign-in">Sign in instead?</AuthLink>
              </p>
            )}
          </div>
        )}
        <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
      </form>
    </AuthShell>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Create your account">
          <p className="font-sans text-sm text-brand-green/60">Loading…</p>
        </AuthShell>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
