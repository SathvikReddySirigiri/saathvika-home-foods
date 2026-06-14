"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { KolamDivider } from "@/components/brand";
import {
  DeliveryDetailsForm,
  type DeliveryDetailsFormHandle,
} from "@/components/cart/DeliveryDetailsForm";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { OrderConfirmation } from "./OrderConfirmation";
import { CONFIG, getWhatsAppUrl, isOnlinePaymentAvailable } from "@/lib/config";
import {
  normalizeDeliveryForSubmit,
} from "@/lib/delivery-form";
import {
  buildOrderMessage,
  emptyDeliveryDetails,
  formatLineCustomizations,
  getOrderTotal,
  getOrderTotalPaise,
  validateDeliveryDetails,
  type DeliveryDetails,
} from "@/lib/order-message";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { formatINR } from "@/lib/pricing";
import { placeOrder } from "@/lib/api/place-order";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import type {
  CreateRazorpayOrderResponse,
  VerifyRazorpayPaymentResponse,
} from "@/lib/razorpay-types";

const emptyDelivery: DeliveryDetails = emptyDeliveryDetails;

type PaymentConfirmation = {
  paymentId?: string;
  orderId: string;
};

function CheckoutAction({
  disabled,
  blockedByDelivery,
  onBlockedClick,
  children,
  className,
}: {
  disabled: boolean;
  blockedByDelivery: boolean;
  onBlockedClick: () => void;
  children: ReactNode;
  className: string;
}) {
  return (
    <div className="relative mt-4">
      <button type="button" disabled={disabled} className={className}>
        {children}
      </button>
      {blockedByDelivery && (
        <button
          type="button"
          title="Please fill in your delivery details first"
          aria-label="Please fill in your delivery details first"
          onClick={onBlockedClick}
          className="absolute inset-0 cursor-not-allowed rounded-full"
        />
      )}
    </div>
  );
}

export function CartView() {
  const { items, removeItem, updateQuantity, itemCount, clearCart } = useCart();
  const { profile } = useAuth();
  const [delivery, setDelivery] = useState<DeliveryDetails>(emptyDelivery);
  const [deliveryValid, setDeliveryValid] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copyNote, setCopyNote] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [waLoading, setWaLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<PaymentConfirmation | null>(
    null,
  );
  const deliveryFormRef = useRef<DeliveryDetailsFormHandle>(null);

  const onlinePayAvailable = isOnlinePaymentAvailable();
  const orderTotal = useMemo(() => getOrderTotal(items), [items]);
  const checkoutBlockedByDelivery = !deliveryValid;

  const getValidatedDelivery = (): DeliveryDetails | null => {
    const normalized = normalizeDeliveryForSubmit(delivery);
    const error = validateDeliveryDetails(normalized);
    if (error) {
      deliveryFormRef.current?.scrollToFirstInvalid();
      setFormError(error);
      return null;
    }
    if (items.length === 0) {
      setFormError("Your cart is empty.");
      return null;
    }
    setFormError(null);
    return normalized;
  };

  const clearDeliveryAfterOrder = () => {
    deliveryFormRef.current?.clearSaved();
    setDelivery(emptyDelivery);
  };

  const handleWhatsAppOrder = async () => {
    const valid = getValidatedDelivery();
    if (!valid) return;

    setWaLoading(true);
    setFormError(null);

    try {
      const placed = await placeOrder(
        items,
        valid,
        orderTotal,
        "whatsapp",
      );

      if ("error" in placed) {
        setFormError(placed.error);
        return;
      }

      clearDeliveryAfterOrder();
      const message = buildOrderMessage(items, valid);
      window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    } catch {
      setFormError(
        "Could not save your order. Please try again or contact us on WhatsApp.",
      );
    } finally {
      setWaLoading(false);
    }
  };

  const handlePayOnline = async () => {
    if (!onlinePayAvailable) return;
    const valid = getValidatedDelivery();
    if (!valid) return;

    setPayLoading(true);
    setPayError(null);

    try {
      const placed = await placeOrder(items, valid, orderTotal, "online");

      if ("error" in placed) {
        throw new Error(placed.error);
      }

      const dbOrderId = placed.orderId;
      const amountPaise = getOrderTotalPaise(items);

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          delivery: valid,
          items,
          dbOrderId,
        }),
      });

      const orderData = (await orderRes.json()) as
        | CreateRazorpayOrderResponse
        | { error?: string };

      if (!orderRes.ok || !("orderId" in orderData)) {
        throw new Error(
          "error" in orderData
            ? orderData.error
            : "Could not start payment. Please try again or order on WhatsApp.",
        );
      }

      await openRazorpayCheckout({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: CONFIG.businessName,
        description: "Fresh Andhra food — made to your order",
        prefill: {
          name: valid.name,
          contact: valid.phone,
        },
        onSuccess: async (paymentResponse) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...paymentResponse,
              dbOrderId,
            }),
          });

          const verifyData = (await verifyRes.json()) as
            | VerifyRazorpayPaymentResponse
            | { error?: string };

          if (!verifyRes.ok || !("verified" in verifyData)) {
            throw new Error(
              "error" in verifyData
                ? verifyData.error
                : "Payment could not be verified. Please contact us on WhatsApp with your payment details.",
            );
          }

          clearCart();
          clearDeliveryAfterOrder();
          setConfirmation({
            paymentId: verifyData.paymentId,
            orderId: verifyData.dbOrderId,
          });
        },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or order on WhatsApp.";
      if (message === "Payment cancelled.") {
        setPayError(
          "Payment cancelled. You can try again or order on WhatsApp instead.",
        );
      } else {
        setPayError(
          message.endsWith("WhatsApp.")
            ? message
            : `${message} You can also order on WhatsApp instead.`,
        );
      }
    } finally {
      setPayLoading(false);
    }
  };

  const handleCopyOrder = async () => {
    const valid = getValidatedDelivery();
    if (!valid) return;

    const message = buildOrderMessage(items, valid);
    try {
      await navigator.clipboard.writeText(message);
      setCopyNote("Order details copied to clipboard.");
    } catch {
      setCopyNote("Could not copy — please select and copy manually.");
    }
    window.setTimeout(() => setCopyNote(null), 3000);
  };

  const scrollToDeliveryIfBlocked = () => {
    deliveryFormRef.current?.scrollToFirstInvalid();
  };

  if (confirmation) {
    return (
      <OrderConfirmation
        paymentId={confirmation.paymentId}
        orderId={confirmation.orderId}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col bg-brand-cream">
        <header className="on-brand-dark bg-brand-green">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
            <h1 className="font-display text-3xl text-brand-cream sm:text-4xl">
              Your Cart
            </h1>
          </div>
          <KolamDivider className="text-brand-gold/80" />
        </header>
        <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <p className="font-serif text-xl text-brand-green">
            Your cart is empty
          </p>
          <p className="mt-2 font-sans text-sm text-brand-green/70">
            Browse our pickles, sweets, and snacks — made fresh to your order.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 py-2.5 font-sans text-sm font-semibold text-brand-green-deep transition-colors hover:bg-brand-gold/90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const waDisabled = checkoutBlockedByDelivery || waLoading || payLoading;
  const payDisabled =
    checkoutBlockedByDelivery ||
    !onlinePayAvailable ||
    payLoading ||
    waLoading;

  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <header className="on-brand-dark bg-brand-green">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
          <h1 className="font-display text-3xl text-brand-cream sm:text-4xl">
            Your Cart
          </h1>
          <p className="mt-2 font-sans text-brand-cream/85">
            {itemCount} {itemCount === 1 ? "item" : "items"} · customize and
            order fresh
          </p>
        </div>
        <KolamDivider className="text-brand-gold/80" />
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <ul className="space-y-4">
          {items.map((item) => {
            const lineTotal = item.unitPrice * item.quantity;
            return (
              <li
                key={item.lineId}
                className="rounded-2xl border border-brand-gold/25 bg-white/60 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-lg font-semibold text-brand-green">
                      {item.productName}
                    </h2>
                    <dl className="mt-2 space-y-1 font-sans text-sm text-brand-green/75">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-brand-green/55">Pack:</dt>
                        <dd>{item.packSize.label}</dd>
                      </div>
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-brand-green/55">Preparation:</dt>
                        <dd>{formatLineCustomizations(item)}</dd>
                      </div>
                    </dl>
                    <div className="mt-4">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.lineId, qty)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="font-serif text-xl font-semibold text-brand-green">
                      {formatINR(lineTotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.lineId)}
                      className="font-sans text-sm text-brand-green/60 underline-offset-2 transition-colors hover:text-brand-red hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex items-center justify-between border-t border-brand-gold/25 pt-6">
          <span className="font-serif text-lg font-semibold text-brand-green">
            Order total
          </span>
          <span className="font-serif text-2xl font-semibold text-brand-green">
            {formatINR(orderTotal)}
          </span>
        </div>

        <DeliveryDetailsForm
          ref={deliveryFormRef}
          value={delivery}
          onChange={setDelivery}
          onValidityChange={setDeliveryValid}
          profilePrefill={
            profile
              ? { name: profile.name, phone: profile.phone }
              : undefined
          }
        />

        {formError && (
          <p
            className="mt-3 font-sans text-sm text-brand-red"
            role="alert"
          >
            {formError}
          </p>
        )}

        <section className="mt-8" aria-labelledby="checkout-heading">
          <h2 id="checkout-heading" className="sr-only">
            Choose how to order
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-brand-gold/30 bg-white/50 p-5">
              <h3 className="font-serif text-lg font-semibold text-brand-green">
                Option A
              </h3>
              <p className="mt-1 font-sans text-sm text-brand-green/70">
                Send your order on WhatsApp — we&apos;ll confirm and start
                preparing fresh.
              </p>
              <CheckoutAction
                disabled={waDisabled}
                blockedByDelivery={checkoutBlockedByDelivery}
                onBlockedClick={scrollToDeliveryIfBlocked}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-brand-gold px-4 py-3 font-sans text-sm font-semibold text-brand-green-deep transition-all duration-200 hover:bg-brand-gold/90 active:scale-[0.98] focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-gold disabled:active:scale-100"
              >
                {waLoading ? "Saving order…" : "Order on WhatsApp"}
              </CheckoutAction>
            </div>

            <div className="flex flex-col rounded-2xl border border-brand-gold/30 bg-white/50 p-5">
              <h3 className="font-serif text-lg font-semibold text-brand-green">
                Option B
              </h3>
              <p className="mt-1 font-sans text-sm text-brand-green/70">
                Pay securely online with UPI, card, or net banking.
              </p>
              <CheckoutAction
                disabled={payDisabled}
                blockedByDelivery={checkoutBlockedByDelivery}
                onBlockedClick={scrollToDeliveryIfBlocked}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-brand-green px-4 py-3 font-sans text-sm font-semibold text-brand-cream transition-all duration-200 hover:bg-brand-green-light active:scale-[0.98] focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-green disabled:active:scale-100"
              >
                {payLoading ? "Opening payment…" : "Pay Online"}
              </CheckoutAction>
              {onlinePayAvailable ? (
                <p
                  id="pay-online-secure"
                  className="mt-2 text-center font-sans text-xs text-brand-green/60"
                >
                  Secure online payment via Razorpay
                </p>
              ) : (
                <p
                  id="pay-online-note"
                  className="mt-2 text-center font-sans text-xs text-brand-green/60"
                >
                  Online payment coming soon — please order on WhatsApp
                </p>
              )}
              {payError && (
                <p
                  className="mt-2 text-center font-sans text-xs text-brand-red"
                  role="alert"
                >
                  {payError}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleCopyOrder}
              className="font-sans text-sm text-brand-green/70 underline-offset-2 transition-colors hover:text-brand-gold hover:underline"
            >
              Copy order details
            </button>
            {copyNote && (
              <p className="font-sans text-xs text-brand-green/65" role="status">
                {copyNote}
              </p>
            )}
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="font-sans text-sm text-brand-green/70 transition-colors hover:text-brand-gold"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
