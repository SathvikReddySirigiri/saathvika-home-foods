import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description: `Contact ${SITE.name} — WhatsApp, phone, email, or Instagram. Questions about Andhra pickles, orders, and customization.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <PageHeader
        title="Contact Us"
        subtitle="Questions about your order, customization, or bulk requests — we are happy to hear from you."
      />

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <section aria-labelledby="reach-heading">
          <h2
            id="reach-heading"
            className="font-serif text-xl font-semibold text-brand-green"
          >
            Reach us directly
          </h2>
          <ul className="mt-5 space-y-4">
            <li>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-brand-gold/30 bg-white/60 p-4 transition-colors hover:border-brand-gold hover:bg-white"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-brand-cream">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-sans text-sm font-medium text-brand-green/60">
                    WhatsApp (fastest)
                  </span>
                  <span className="font-sans text-base font-semibold text-brand-green">
                    {SITE.phone}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-4 rounded-2xl border border-brand-gold/30 bg-white/60 p-4 transition-colors hover:border-brand-gold hover:bg-white"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 font-serif text-lg text-brand-gold">
                  @
                </span>
                <span>
                  <span className="block font-sans text-sm font-medium text-brand-green/60">
                    Email
                  </span>
                  <span className="font-sans text-base font-semibold text-brand-green">
                    {SITE.email}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-brand-gold/30 bg-white/60 p-4 transition-colors hover:border-brand-gold hover:bg-white"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold">
                  <InstagramIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-sans text-sm font-medium text-brand-green/60">
                    Instagram
                  </span>
                  <span className="font-sans text-base font-semibold text-brand-green">
                    Follow {SITE.name}
                  </span>
                </span>
              </a>
            </li>
          </ul>
          <p className="mt-4 font-sans text-sm text-brand-green/65">
            {SITE.address}
          </p>
        </section>

        <section
          className="mt-12 rounded-2xl border border-brand-gold/30 bg-white/60 p-5 sm:p-6"
          aria-labelledby="form-heading"
        >
          <h2
            id="form-heading"
            className="font-serif text-xl font-semibold text-brand-green"
          >
            Send a message
          </h2>
          <p className="mt-2 font-sans text-sm text-brand-green/70">
            Fill in the form below — we will open WhatsApp with your message
            ready to send. No login or backend storage on this site.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        <p className="mt-10 text-center font-sans text-sm text-brand-green/65">
          Prefer to browse first?{" "}
          <Link
            href="/shop"
            className="font-medium text-brand-gold underline-offset-2 hover:underline"
          >
            Visit the shop
          </Link>
        </p>
      </div>
    </div>
  );
}
