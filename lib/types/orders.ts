/** Snapshot of one cart line stored in orders.items (jsonb) */
export type OrderItemSnapshot = {
  productId: string;
  productName: string;
  packSize: { label: string; grams: number };
  customizations: { type: string; value: string; label: string }[];
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  summary?: string;
};

export type OrderMethod = "whatsapp" | "online";
export type PaymentStatus = "pending" | "paid" | "failed";
export type FulfillmentStatus =
  | "new"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered";

export type OrderRow = {
  id: string;
  created_at: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  address_flat: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_pincode: string | null;
  items: OrderItemSnapshot[];
  total_amount: number;
  order_method: OrderMethod;
  payment_status: PaymentStatus;
  payment_id: string | null;
  fulfillment_status: FulfillmentStatus;
};

export type InsertOrder = Omit<
  OrderRow,
  "id" | "created_at" | "payment_status" | "fulfillment_status"
> & {
  payment_status?: PaymentStatus;
  fulfillment_status?: FulfillmentStatus;
};
