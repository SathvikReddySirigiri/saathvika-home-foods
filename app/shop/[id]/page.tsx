import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { formatINR, getStartingPrice } from "@/lib/pricing";
import { getProductById, PRODUCT_ID_ALIASES, products } from "@/lib/products";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return [
    ...products.map((product) => ({ id: product.id })),
    ...Object.keys(PRODUCT_ID_ALIASES).map((id) => ({ id })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };

  const title =
    product.id === "avakaya"
      ? "Homemade Avakaya (Mango Pickle)"
      : product.name;

  return createPageMetadata({
    title,
    description: `${product.shortDescription} Order fresh with your choice of preparation — ${product.nameTelugu ? `${product.nameTelugu}. ` : ""}Andhra homemade, made to order.`,
    path: `/shop/${product.id}`,
    image: product.image,
    imageAlt: `${product.name} — ${product.shortDescription}`,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  return (
    <div className="flex-1 bg-brand-cream">
      <ProductDetail product={product} />
      <p className="sr-only">
        Starting from {formatINR(getStartingPrice(product))}
      </p>
    </div>
  );
}
