import type { CartItem } from "@/lib/cart-context";
import type { OrderItemSnapshot } from "@/lib/types/orders";

export function cartItemsToSnapshots(items: CartItem[]): OrderItemSnapshot[] {
  return items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    packSize: {
      label: item.packSize.label,
      grams: item.packSize.grams,
    },
    customizations: item.customizations.map((c) => ({
      type: c.type,
      value: c.value,
      label: c.label,
    })),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.unitPrice * item.quantity,
    summary: item.summary,
  }));
}
