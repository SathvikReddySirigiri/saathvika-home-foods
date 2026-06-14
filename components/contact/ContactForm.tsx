"use client";

import { useState } from "react";
import { CONFIG, getWhatsAppUrl } from "@/lib/config";
import { formatPhoneInput } from "@/lib/delivery-form";
import {
  isValidIndianMobile,
  normalizePhoneForStorage,
  PHONE_HELPER_TEXT,
  PHONE_VALIDATION_ERROR,
} from "@/lib/phone";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidIndianMobile(phone, false)) {
      setError(PHONE_VALIDATION_ERROR);
      return;
    }
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    const text = [
      `Hello ${CONFIG.businessName}!`,
      "",
      `I'd like to get in touch:`,
      "",
      `Name: ${name.trim()}`,
      `Phone: ${normalizePhoneForStorage(phone)}`,
      "",
      message.trim(),
    ].join("\n");

    window.open(getWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3 py-2.5 font-sans text-brand-green outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/25";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <label className="block">
        <span className="font-sans text-sm font-medium text-brand-green">
          Name <span className="text-brand-red">*</span>
        </span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-medium text-brand-green">
          Phone <span className="text-brand-red">*</span>
        </span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          className={inputClass}
        />
        <p className="mt-1 font-sans text-xs text-brand-green/60">
          {PHONE_HELPER_TEXT}
        </p>
      </label>
      <label className="block">
        <span className="font-sans text-sm font-medium text-brand-green">
          Message <span className="text-brand-red">*</span>
        </span>
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </label>
      {error && (
        <p className="font-sans text-sm text-brand-red" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="flex w-full min-h-12 items-center justify-center rounded-full bg-brand-gold px-6 py-3 font-sans text-base font-semibold text-brand-green-deep transition-colors hover:bg-brand-gold/90 focus-visible:outline-offset-4"
      >
        Send via WhatsApp
      </button>
      <p className="text-center font-sans text-xs text-brand-green/60">
        Submitting opens WhatsApp with your message ready to send — no account
        login required on this site.
      </p>
    </form>
  );
}
