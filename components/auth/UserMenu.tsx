"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function getInitial(name: string | null | undefined, email: string | null | undefined): string {
  const source = name?.trim() || email?.trim() || "?";
  return source.charAt(0).toUpperCase();
}

export function UserMenu() {
  const { user, profile, isLoading, refresh } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (isLoading) {
    return (
      <span
        className="hidden h-9 w-16 animate-pulse rounded-full bg-brand-green-light/60 sm:block"
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className="hidden rounded-full px-3 py-2 font-sans text-sm font-medium text-brand-cream/90 transition-colors hover:bg-brand-green-light hover:text-brand-gold sm:inline-flex"
      >
        Sign In
      </Link>
    );
  }

  const displayName = profile?.name?.trim() || user.email?.split("@")[0] || "Account";

  const handleSignOut = async () => {
    setOpen(false);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    await refresh();
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-brand-cream transition-colors hover:bg-brand-green-light hover:text-brand-gold"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/20 font-serif text-sm font-semibold text-brand-gold">
          {getInitial(profile?.name, profile?.email ?? user.email)}
        </span>
        <span className="max-w-[7rem] truncate font-sans text-sm">{displayName}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] rounded-xl border border-brand-gold/25 bg-brand-cream py-1 shadow-lg"
        >
          <Link
            href="/account"
            role="menuitem"
            className="block px-4 py-2.5 font-sans text-sm text-brand-green hover:bg-brand-gold/10"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            href="/account/orders"
            role="menuitem"
            className="block px-4 py-2.5 font-sans text-sm text-brand-green hover:bg-brand-gold/10"
            onClick={() => setOpen(false)}
          >
            My Orders
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="block w-full px-4 py-2.5 text-left font-sans text-sm text-brand-green hover:bg-brand-gold/10"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
