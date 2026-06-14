import type { CartItem } from "@/lib/cart-context";
import type { DeliveryDetails } from "@/lib/order-message";
import type { OrderMethod } from "@/lib/types/orders";

export type PlaceOrderResponse =
  | { orderId: string }
  | { error: string };

export async function placeOrder(
  items: CartItem[],
  delivery: DeliveryDetails,
  totalAmount: number,
  orderMethod: OrderMethod,
): Promise<PlaceOrderResponse> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      delivery,
      total_amount: totalAmount,
      order_method: orderMethod,
    }),
  });

  const data = (await res.json()) as PlaceOrderResponse;

  if (!res.ok || !("orderId" in data)) {
    return {
      error:
        "error" in data
          ? data.error
          : "Could not place your order. Please try again or contact us on WhatsApp.",
    };
  }

  return data;
}
