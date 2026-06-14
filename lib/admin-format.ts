import { formatINR } from "@/lib/pricing";
import type { OrderItemSnapshot } from "@/lib/types/orders";

export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatOrderMethod(method: string): string {
  return method === "online" ? "Online" : "WhatsApp";
}

export function formatPaymentStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatCustomizationLine(
  item: OrderItemSnapshot,
): string {
  if (item.customizations.length === 0) return "Standard";

  return item.customizations
    .map((c) => {
      if (c.type === "fat") {
        return c.value === "ghee" ? "Ghee" : "Oil";
      }
      if (c.type === "sweetener") {
        return c.value === "jaggery" ? "Jaggery" : "Sugar";
      }
      return c.label.replace(/\s*\(default\)\s*/i, "");
    })
    .join(" · ");
}

export { formatINR };
