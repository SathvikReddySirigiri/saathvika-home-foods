import { CartView } from "@/components/cart";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Your Cart",
  description:
    "Review your customized Andhra order — pickles, sweets, and snacks with your chosen oil, ghee, or jaggery. Checkout on WhatsApp or pay online.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return <CartView />;
}
