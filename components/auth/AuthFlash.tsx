"use client";

import { useEffect, useState } from "react";
import { consumeAuthFlash } from "@/lib/auth-flash";

export function AuthFlash() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const flash = consumeAuthFlash();
    if (flash) {
      setMessage(flash);
      const timer = window.setTimeout(() => setMessage(null), 5000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-full border border-brand-gold/40 bg-brand-green px-5 py-2.5 font-sans text-sm text-brand-cream shadow-lg"
    >
      {message}
    </div>
  );
}
