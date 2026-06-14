import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-context";
import { createOrderInDatabase } from "@/lib/orders/insert-order";
import { getCurrentUser } from "@/lib/supabase/server";
import { getOrderTotal, validateDeliveryDetails } from "@/lib/order-message";
import type { DeliveryDetails } from "@/lib/order-message";
import type { OrderMethod } from "@/lib/types/orders";

export type CreateOrderRequestBody = {
  items: CartItem[];
  delivery: DeliveryDetails;
  total_amount: number;
  order_method: OrderMethod;
};

export async function POST(request: Request) {
  let body: CreateOrderRequestBody;

  try {
    body = (await request.json()) as CreateOrderRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { items, delivery, total_amount, order_method } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  if (order_method !== "whatsapp" && order_method !== "online") {
    return NextResponse.json({ error: "Invalid order method." }, { status: 400 });
  }

  const deliveryError = validateDeliveryDetails(delivery);
  if (deliveryError) {
    return NextResponse.json({ error: deliveryError }, { status: 400 });
  }

  const expectedTotal = getOrderTotal(items);
  if (
    typeof total_amount !== "number" ||
    total_amount !== expectedTotal ||
    total_amount < 1
  ) {
    return NextResponse.json(
      { error: "Order total mismatch. Please refresh and try again." },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();

  const result = await createOrderInDatabase({
    items,
    delivery,
    totalAmount: total_amount,
    orderMethod: order_method,
    customerId: user?.id ?? null,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ orderId: result.orderId });
}
