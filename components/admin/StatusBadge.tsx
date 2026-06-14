const paymentStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  failed: "bg-red-100 text-brand-red",
};

const fulfillmentStyles: Record<string, string> = {
  new: "bg-brand-gold/20 text-brand-green",
  confirmed: "bg-blue-100 text-blue-900",
  packed: "bg-purple-100 text-purple-900",
  shipped: "bg-indigo-100 text-indigo-900",
  delivered: "bg-emerald-100 text-emerald-900",
};

export function StatusBadge({
  type,
  value,
}: {
  type: "payment" | "fulfillment";
  value: string;
}) {
  const styles =
    type === "payment"
      ? (paymentStyles[value] ?? "bg-gray-100 text-gray-800")
      : (fulfillmentStyles[value] ?? "bg-gray-100 text-gray-800");

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-sans text-xs font-medium capitalize ${styles}`}
    >
      {value}
    </span>
  );
}
