import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatINR, getStartingPrice } from "@/lib/pricing";
import { ProductImage } from "./ProductImage";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const startingPrice = getStartingPrice(product);

  return (
    <article className="interactive-card flex flex-col overflow-hidden rounded-2xl border border-brand-gold/20 bg-brand-cream shadow-sm hover:border-brand-gold/40 hover:shadow-gold">
      <Link
        href={`/shop/${product.id}`}
        className="relative aspect-[4/3] overflow-hidden bg-brand-green/5"
      >
        <ProductImage
          src={product.image}
          alt={`${product.name}${product.nameTelugu ? ` (${product.nameTelugu})` : ""} — Andhra homemade food`}
        />
        {product.isFreshlyMade && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-red px-2 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-brand-cream">
            Freshly made
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-brand-green">
            <Link
              href={`/shop/${product.id}`}
              className="hover:text-brand-gold transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          {product.nameTelugu && (
            <p className="mt-0.5 font-sans text-sm text-brand-green/60">
              {product.nameTelugu}
            </p>
          )}
        </div>
        <p className="line-clamp-2 font-sans text-sm leading-snug text-brand-green/70">
          {product.shortDescription}
        </p>
        <p className="font-sans text-sm text-brand-green/75">
          From{" "}
          <span className="font-semibold text-brand-green">
            {formatINR(startingPrice)}
          </span>
        </p>
        <Link
          href={`/shop/${product.id}`}
          className="mt-auto inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-4 py-2.5 font-sans text-sm font-semibold text-brand-green-deep transition-all duration-200 hover:bg-brand-gold/90 active:scale-[0.98] focus-visible:outline-offset-4"
        >
          {product.customizations?.length
            ? "View & Customize"
            : "View & Order"}
        </Link>
      </div>
    </article>
  );
}
