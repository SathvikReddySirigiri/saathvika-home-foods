import { CONFIG } from "./config";

export const SITE = {
  name: CONFIG.businessName,
  tagline: CONFIG.tagline,
  pillars: ["Organic Oil", "Organic Groceries", "Home Made"] as const,
  phone: "+91 00000 00000",
  email: "hello@saathvikahomefoods.com",
  address: "Andhra Pradesh, India",
  whatsapp: `https://wa.me/${CONFIG.whatsappNumber}`,
  instagram: "https://instagram.com/",
  /** Used for Open Graph absolute URLs */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://saathvikahomefoods.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
