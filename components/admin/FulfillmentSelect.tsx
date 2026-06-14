"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FulfillmentStatus } from "@/lib/types/orders";

const STATUSES: { value: FulfillmentStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

type FulfillmentSelectProps = {
  orderId: string;
  current: FulfillmentStatus;
};

export function FulfillmentSelect({ orderId, current }: FulfillmentSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = async (next: FulfillmentStatus) => {
    setStatus(next);
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillment_status: next }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setStatus(current);
        setMessage(data.error ?? "Update failed.");
        return;
      }

      setMessage("Saved.");
      router.refresh();
    } catch {
      setStatus(current);
      setMessage("Update failed.");
    } finally {
      setSaving(false);
      window.setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="font-sans text-sm font-medium text-brand-green">
        Fulfillment
      </label>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as FulfillmentStatus)}
        className="rounded-lg border border-brand-gold/40 bg-white px-3 py-2 font-sans text-sm text-brand-green focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/25 disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {saving && (
        <span className="font-sans text-xs text-brand-green/60">Saving…</span>
      )}
      {message && (
        <span className="font-sans text-xs text-brand-green" role="status">
          {message}
        </span>
      )}
    </div>
  );
}
