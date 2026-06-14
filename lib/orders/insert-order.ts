import type { CartItem } from "@/lib/cart-context";
import type { DeliveryDetails } from "@/lib/order-message";
import { formatDeliveryAddressLine } from "@/lib/order-message";
import { getOrderTotal } from "@/lib/order-message";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import type { OrderMethod } from "@/lib/types/orders";
import { cartItemsToSnapshots } from "./cart-to-snapshot";
import { sendOrderNotificationEmail } from "./notify-email";

export type CreateOrderParams = {
  items: CartItem[];
  delivery: DeliveryDetails;
  totalAmount: number;
  orderMethod: OrderMethod;
  customerId?: string | null;
};

export type CreateOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function createOrderInDatabase(
  params: CreateOrderParams,
): Promise<CreateOrderResult> {
  const { items, delivery, totalAmount, orderMethod, customerId } = params;

  const expectedTotal = getOrderTotal(items);
  if (totalAmount !== expectedTotal) {
    return { success: false, error: "Order total does not match cart." };
  }

  const snapshots = cartItemsToSnapshots(items);

  try {
    const supabase = createServerSupabaseAdmin();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: delivery.name.trim(),
        customer_phone: delivery.phone.trim(),
        delivery_address: formatDeliveryAddressLine(delivery),
        address_flat: delivery.addressFlat.trim(),
        address_street: delivery.addressStreet.trim(),
        address_city: delivery.addressCity.trim(),
        address_state: delivery.addressState.trim(),
        address_pincode: delivery.addressPincode.trim(),
        customer_id: customerId ?? null,
        items: snapshots,
        total_amount: totalAmount,
        order_method: orderMethod,
        payment_status: "pending",
        fulfillment_status: "new",
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      console.error("[orders] Supabase insert failed:", error);
      return {
        success: false,
        error: "Could not save your order. Please try again or contact us on WhatsApp.",
      };
    }

    await sendOrderNotificationEmail({
      orderId: data.id,
      customerName: delivery.name.trim(),
      customerPhone: delivery.phone.trim(),
      deliveryAddress: formatDeliveryAddressLine(delivery),
      items: snapshots,
      totalAmount,
      orderMethod,
      paymentStatus: "pending",
    });

    return { success: true, orderId: data.id };
  } catch (err) {
    console.error("[orders] Unexpected error:", err);
    return {
      success: false,
      error: "Could not save your order. Please try again or contact us on WhatsApp.",
    };
  }
}

export async function markOrderPaid(
  dbOrderId: string,
  razorpayPaymentId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseAdmin();

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_id: razorpayPaymentId,
      })
      .eq("id", dbOrderId);

    if (error) {
      console.error("[orders] Failed to mark order paid:", error);
      return { success: false, error: "Could not update order status." };
    }

    return { success: true };
  } catch (err) {
    console.error("[orders] markOrderPaid error:", err);
    return { success: false, error: "Could not update order status." };
  }
}
