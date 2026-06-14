import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

const variants = {
  primary:
    "bg-brand-gold text-brand-green-deep shadow-gold-sm hover:bg-brand-gold/90 active:bg-brand-gold/80",
  secondary:
    "border-2 border-brand-gold text-brand-cream hover:bg-brand-gold/10 active:bg-brand-gold/15",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-full px-6 py-2.5 font-sans text-sm font-semibold transition-all duration-200 focus-visible:outline-offset-4 active:scale-[0.98] sm:w-auto sm:text-base ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
