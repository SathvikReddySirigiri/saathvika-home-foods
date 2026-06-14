import Link from "next/link";
import { KolamDivider } from "@/components/brand";
import { CONFIG } from "@/lib/config";

type OrderConfirmationProps = {
  paymentId?: string;
  orderId: string;
};

export function OrderConfirmation({
  paymentId,
  orderId,
}: OrderConfirmationProps) {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <header className="on-brand-dark bg-brand-green">
        <div className="mx-auto max-w-lg px-4 py-10 text-center sm:px-6 sm:py-12">
          <h1 className="font-display text-3xl text-brand-cream sm:text-4xl">
            Thank you!
          </h1>
          <p className="mt-2 font-sans text-brand-cream/85">
            Your payment was successful
          </p>
        </div>
        <KolamDivider className="text-brand-gold/80" />
      </header>

      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center px-4 py-12 text-center sm:px-6">
        <div className="rounded-2xl border border-brand-gold/30 bg-white/60 p-6 sm:p-8">
          <p className="font-serif text-xl text-brand-green">
            Order confirmed
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-brand-green/75">
            We&apos;ve received your payment for {CONFIG.businessName}. Your
            order will be prepared fresh — we may contact you to confirm details.
          </p>
          <dl className="mt-6 space-y-2 text-left font-sans text-sm text-brand-green/70">
            <div className="flex justify-between gap-4">
              <dt>Order reference</dt>
              <dd className="font-mono text-xs text-brand-green">{orderId}</dd>
            </div>
            {paymentId && (
              <div className="flex justify-between gap-4">
                <dt>Payment ID</dt>
                <dd className="font-mono text-xs text-brand-green">{paymentId}</dd>
              </div>
            )}
          </dl>
        </div>
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 py-2.5 font-sans text-sm font-semibold text-brand-green-deep transition-colors hover:bg-brand-gold/90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
