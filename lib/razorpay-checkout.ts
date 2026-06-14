"use client";

import type {
  RazorpayCheckoutOptions,
  RazorpayPaymentSuccess,
} from "@/lib/razorpay-types";

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const existing = document.querySelector(
        `script[src="${CHECKOUT_SCRIPT}"]`,
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
        existing.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.src = CHECKOUT_SCRIPT;
      script.async = true;
      script.onload = () => resolve(Boolean(window.Razorpay));
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return scriptPromise;
}

export async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions,
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!key) {
    throw new Error("Online payment is not configured yet.");
  }

  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error(
      "Could not load the payment window. Please try again or order on WhatsApp.",
    );
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description ?? "Fresh Andhra food, made to order",
      order_id: options.orderId,
      prefill: {
        name: options.prefill.name,
        contact: options.prefill.contact,
      },
      theme: { color: "#1C3A2E" },
      handler: async (response: RazorpayPaymentSuccess) => {
        try {
          await options.onSuccess(response);
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          options.onDismiss?.();
          reject(new Error("Payment cancelled."));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      const message =
        response.error?.description ??
        "Payment failed. Please try again or order on WhatsApp.";
      reject(new Error(message));
    });

    rzp.open();
  });
}
