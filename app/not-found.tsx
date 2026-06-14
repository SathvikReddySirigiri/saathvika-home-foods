import Link from "next/link";
import { KolamDivider } from "@/components/brand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <header className="on-brand-dark bg-brand-green">
        <div className="mx-auto max-w-lg px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="font-display text-6xl text-brand-gold sm:text-7xl">404</p>
          <h1 className="mt-4 font-display text-2xl text-brand-cream sm:text-3xl">
            Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-sm font-sans text-brand-cream/85">
            This page may have moved — but our pickles and sweets are still
            here, freshly made to order.
          </p>
        </div>
        <KolamDivider className="text-brand-gold/80" />
      </header>
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
        <div className="flex w-full max-w-xs flex-col gap-3">
          <ButtonLink href="/" variant="primary" className="w-full">
            Back to Home
          </ButtonLink>
          <ButtonLink
            href="/shop"
            variant="secondary"
            className="w-full !border-brand-gold !text-brand-green hover:!bg-brand-gold/10"
          >
            Browse Shop
          </ButtonLink>
        </div>
        <p className="mt-8 font-sans text-sm text-brand-green/60">
          Need help?{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-gold underline-offset-2 hover:underline"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
