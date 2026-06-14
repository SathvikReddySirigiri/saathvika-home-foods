import type { CartItem } from "@/lib/cart-context";
import type { DeliveryDetails } from "@/lib/order-message";

export type CreateRazorpayOrderRequest = {
  /** Cart total in paise (INR × 100) */
  amount: number;
  delivery: DeliveryDetails;
  items: CartItem[];
  /** Supabase orders.id — created via POST /api/orders first */
  dbOrderId: string;
};

export type CreateRazorpayOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
};

export type VerifyRazorpayPaymentRequest = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  /** Supabase orders.id to update after payment */
  dbOrderId: string;
};

export type VerifyRazorpayPaymentResponse = {
  verified: true;
  paymentId: string;
  dbOrderId: string;
};

export type RazorpayPaymentSuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutPrefill = {
  name: string;
  contact: string;
};

export type RazorpayCheckoutOptions = {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill: RazorpayCheckoutPrefill;
  onSuccess: (response: RazorpayPaymentSuccess) => void | Promise<void>;
  onDismiss?: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (
        event: string,
        handler: (response: { error?: { description?: string } }) => void,
      ) => void;
    };
  }
}
