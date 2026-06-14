import type { Config } from "tailwindcss";

/**
 * Saathvika Home Foods — brand palette (logo-matched).
 * Use utilities: bg-brand-green, text-brand-gold, etc.
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        "brand-green": "#1C3A2E",
        "brand-gold": "#C9A227",
        "brand-cream": "#F7F1E1",
        "brand-red": "#C0392B",
        "brand-green-light": "#2A5240",
        "brand-green-deep": "#152A21",
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 0 1px #C9A22740, 0 4px 14px #1C3A2E18",
        "gold-sm": "0 0 0 1px #C9A22760",
      },
      borderRadius: {
        arch: "2rem 2rem 0.5rem 0.5rem",
      },
    },
  },
};

export default config;
