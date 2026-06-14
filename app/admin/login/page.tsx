"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CONFIG } from "@/lib/config";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }

      const from = searchParams.get("from") ?? "/admin";
      router.push(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-gold/30 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-serif text-2xl font-semibold text-brand-green">
          Admin login
        </h1>
        <p className="mt-2 font-sans text-sm text-brand-green/70">
          {CONFIG.businessName} order dashboard
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="font-sans text-sm font-medium text-brand-green">
              Password
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3 py-2.5 font-sans text-brand-green outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/25"
            />
          </label>
          {error && (
            <p className="font-sans text-sm text-brand-red" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full min-h-11 items-center justify-center rounded-full bg-brand-gold font-sans text-sm font-semibold text-brand-green-deep transition-colors hover:bg-brand-gold/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-cream font-sans text-brand-green/70">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
