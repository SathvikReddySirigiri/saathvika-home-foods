export const CONFIG = {
  businessName: "Saathvika Home Foods",
  tagline: "Tastes like Grandma's",
  /** Digits only — country code + number, e.g. 919876543210 */
  whatsappNumber: "910000000000",
  paymentsEnabled: false,
} as const;

export function getWhatsAppUrl(text?: string): string {
  const base = `https://wa.me/${CONFIG.whatsappNumber}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

/** True when online pay is enabled and the public Razorpay key is present */
export function isOnlinePaymentAvailable(): boolean {
  return (
    CONFIG.paymentsEnabled &&
    Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
  );
}
