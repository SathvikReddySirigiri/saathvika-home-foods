import Link from "next/link";
import { KolamDivider, Logo } from "@/components/brand";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { NAV_LINKS, SITE } from "@/lib/site";

const FOOTER_LOGO_SIZE = 64;

export function Footer() {
  return (
    <footer className="on-brand-dark mt-auto bg-brand-green text-brand-cream">
      <KolamDivider className="text-brand-gold/90" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo
              size={FOOTER_LOGO_SIZE}
              className="h-14 w-14 rounded-full ring-2 ring-brand-gold sm:h-16 sm:w-16"
            />
            <p className="mt-4 font-display text-2xl text-brand-cream sm:text-3xl">
              {SITE.name}
            </p>
            <p className="mt-2 font-serif text-sm italic text-brand-gold/90">
              {SITE.tagline}
            </p>
            <div className="mt-4 h-px w-12 bg-brand-gold/60" aria-hidden />
            <p className="mt-4 font-sans text-sm leading-relaxed text-brand-cream/80">
              Authentic Andhra homemade pickles, masalas, sweets, and snacks —
              freshly prepared after your order is confirmed.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 font-sans text-sm text-brand-cream/85">
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-brand-gold"
                >
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-brand-gold"
                >
                  {SITE.email}
                </a>
              </li>
              <li>{SITE.address}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Quick links
            </h2>
            <ul className="mt-4 space-y-2 font-sans text-sm">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-cream/85 transition-colors hover:text-brand-gold"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Connect
            </h2>
            <div className="mt-4 flex gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold transition-colors hover:bg-brand-gold/10"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold transition-colors hover:bg-brand-gold/10"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>

            <h2 className="mt-8 font-serif text-sm font-semibold uppercase tracking-wider text-brand-gold">
              Our pillars
            </h2>
            <ul className="mt-3 space-y-2 font-sans text-sm text-brand-cream/85">
              {SITE.pillars.map((pillar) => (
                <li key={pillar} className="flex items-center gap-2">
                  <span
                    className="h-1 w-1 shrink-0 rounded-full bg-brand-gold"
                    aria-hidden
                  />
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-gold/25 pt-6 text-center">
          <p className="font-display text-lg text-brand-gold sm:text-xl">
            {SITE.tagline}
          </p>
          <p className="mt-2 font-sans text-xs text-brand-cream/60">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
