import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand";
import { SITE } from "@/lib/site";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-brand-green px-4 py-10 sm:py-14">
      <Link
        href="/"
        className="mb-8 flex flex-col items-center gap-2 text-center focus-visible:outline-offset-4"
      >
        <Logo size={56} className="h-14 w-14 rounded-full ring-2 ring-brand-gold" />
        <span className="font-display text-2xl text-brand-cream">{SITE.name}</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-brand-gold/30 bg-brand-cream p-6 shadow-lg sm:p-8">
        <h1 className="font-serif text-2xl font-semibold text-brand-green">{title}</h1>
        {subtitle && (
          <p className="mt-2 font-sans text-sm leading-relaxed text-brand-green/70">
            {subtitle}
          </p>
        )}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 border-t border-brand-gold/20 pt-6">{footer}</div>}
      </div>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-brand-gold/35 bg-white px-3 py-2.5 font-sans text-brand-green outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/25";

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  helper,
  error,
  required,
  autoComplete,
  inputMode,
  maxLength,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-sm font-medium text-brand-green">
        {label}
        {required && (
          <span className="font-normal text-brand-green/45"> Required</span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={`${inputClass}${error ? " border-brand-red/50 focus:border-brand-red focus:ring-brand-red/20" : ""}`}
      />
      {helper && !error && (
        <p className="mt-1.5 font-sans text-xs text-brand-green/55">{helper}</p>
      )}
      {error && (
        <p className="mt-1 font-sans text-xs text-brand-red" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthSubmitButton({
  children,
  loading,
  disabled,
}: {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="mt-2 flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-4 py-2.5 font-sans text-sm font-semibold text-brand-green-deep transition-colors hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-sans text-sm text-brand-green/70 underline-offset-2 transition-colors hover:text-brand-gold hover:underline"
    >
      {children}
    </Link>
  );
}
