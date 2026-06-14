import type { CartItem } from "@/lib/cart-context";
import { CONFIG } from "@/lib/config";
import { formatINR, type SelectedCustomization } from "@/lib/pricing";
import { isValidIndianState } from "@/lib/india-states";
import { isValidIndianMobile, PHONE_VALIDATION_ERROR } from "@/lib/phone";

export type DeliveryDetails = {
  name: string;
  phone: string;
  addressFlat: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPincode: string;
};

/** Single-line address for delivery_address column and legacy display. */
export function formatDeliveryAddressLine(details: DeliveryDetails): string {
  return `${details.addressFlat.trim()}, ${details.addressStreet.trim()}, ${details.addressCity.trim()}, ${details.addressState.trim()} - ${details.addressPincode.trim()}`;
}

/** Multi-line block for WhatsApp messages. */
export function formatDeliveryAddressBlock(details: DeliveryDetails): string {
  return [
    "Delivery Address:",
    details.addressFlat.trim(),
    details.addressStreet.trim(),
    `${details.addressCity.trim()}, ${details.addressState.trim()} - ${details.addressPincode.trim()}`,
  ].join("\n");
}

export function validateDeliveryDetails(
  details: DeliveryDetails,
): string | null {
  if (!details.name.trim()) return "Please enter your name.";
  if (!isValidIndianMobile(details.phone, false)) {
    return PHONE_VALIDATION_ERROR;
  }
  if (!details.addressFlat.trim()) return "Please enter your flat or house number.";
  if (!details.addressStreet.trim()) return "Please enter your street or area.";
  if (!details.addressCity.trim()) return "Please enter your city.";
  if (!details.addressState.trim() || !isValidIndianState(details.addressState)) {
    return "Please select your state.";
  }
  if (!/^\d{6}$/.test(details.addressPincode.trim())) {
    return "Pincode must be 6 digits.";
  }
  return null;
}

function formatCustomizationShort(
  customization: SelectedCustomization,
): string {
  if (customization.type === "sweetener") {
    return customization.value === "jaggery" ? "Jaggery" : "Sugar";
  }
  if (customization.type === "spice") {
    return customization.label.replace(/\s*\(default\)\s*/i, "");
  }
  if (customization.type === "flour") {
    return customization.value === "ragi" ? "Ragi" : "Rice flour";
  }
  if (customization.type === "fat") {
    return customization.value === "ghee" ? "Ghee" : "Oil";
  }
  return customization.label.replace(/\s*\(default\)\s*/i, "");
}

function formatCartLine(item: CartItem, index: number): string {
  const customParts = item.customizations.map(formatCustomizationShort);
  const configSegment =
    customParts.length > 0 ? ` — ${customParts.join(" — ")}` : "";
  const lineTotal = item.unitPrice * item.quantity;

  return `${index + 1}. ${item.productName} — ${item.packSize.label}${configSegment} — Qty ${item.quantity} — ${formatINR(lineTotal)}`;
}

export function getOrderTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getOrderTotalPaise(items: CartItem[]): number {
  return getOrderTotal(items) * 100;
}

export function buildOrderMessage(
  items: CartItem[],
  delivery: DeliveryDetails,
): string {
  const lines = items.map((item, index) => formatCartLine(item, index));
  const total = getOrderTotal(items);

  return [
    `Hello! I'd like to order from ${CONFIG.businessName}:`,
    "",
    ...lines,
    "",
    `Total: ${formatINR(total)}`,
    `Name: ${delivery.name.trim()}`,
    `Phone: ${delivery.phone.trim()}`,
    "",
    formatDeliveryAddressBlock(delivery),
  ].join("\n");
}

export function formatLineCustomizations(item: CartItem): string {
  if (item.customizations.length === 0) return "Standard preparation";
  return item.customizations.map(formatCustomizationShort).join(" · ");
}

export const emptyDeliveryDetails: DeliveryDetails = {
  name: "",
  phone: "",
  addressFlat: "",
  addressStreet: "",
  addressCity: "",
  addressState: "",
  addressPincode: "",
};
