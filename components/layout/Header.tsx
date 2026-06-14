"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";
import { Logo } from "@/components/brand";
import { CartIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { NAV_LINKS, SITE } from "@/lib/site";
import { AmbientSoundToggle } from "./AmbientSoundToggle";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="on-brand-dark sticky top-0 z-40 border-b border-brand-gold/25 bg-brand-green shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-offset-4"
          aria-label={`${SITE.name} — home`}
        >
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-gold sm:h-12 sm:w-12">
            <Logo
              size={48}
              priority
              className="h-11 w-11 sm:h-12 sm:w-12"
            />
          </span>
          <span className="hidden min-[380px]:block">
            <span className="font-display block text-lg leading-tight text-brand-cream sm:text-xl">
              Saathvika
            </span>
            <span className="font-serif text-[0.65rem] tracking-wide text-brand-gold/90 sm:text-xs">
              Home Foods
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-2 font-sans text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-brand-gold/15 text-brand-gold"
                    : "text-brand-cream/90 hover:bg-brand-green-light hover:text-brand-gold"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <AmbientSoundToggle variant="header" />

          <UserMenu />

          <Link
            href="/cart"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-brand-cream transition-all duration-200 hover:bg-brand-green-light hover:text-brand-gold active:scale-95"
            aria-label={`Cart, ${itemCount} items`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[0.65rem] font-semibold text-brand-cream">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-brand-cream transition-all duration-200 hover:bg-brand-green-light hover:text-brand-gold active:scale-95 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-brand-gold/20 bg-brand-green-deep px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-lg px-3 py-2.5 font-sans text-base ${
                      active
                        ? "bg-brand-gold/15 font-medium text-brand-gold"
                        : "text-brand-cream hover:bg-brand-green-light hover:text-brand-gold"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            {user ? (
              <>
                <li>
                  <Link
                    href="/account"
                    className="block rounded-lg px-3 py-2.5 font-sans text-base text-brand-cream hover:bg-brand-green-light hover:text-brand-gold"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/orders"
                    className="block rounded-lg px-3 py-2.5 font-sans text-base text-brand-cream hover:bg-brand-green-light hover:text-brand-gold"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/auth/sign-in"
                  className="block rounded-lg px-3 py-2.5 font-sans text-base text-brand-cream hover:bg-brand-green-light hover:text-brand-gold"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
