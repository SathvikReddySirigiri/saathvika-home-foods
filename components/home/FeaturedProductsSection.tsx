import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getFeaturedProducts } from "@/lib/products";

export function FeaturedProductsSection() {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <section
      className="border-t border-brand-gold/15 bg-brand-cream py-12 sm:py-16"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2
              id="featured-heading"
              className="font-serif text-2xl font-semibold text-brand-green sm:text-3xl"
            >
              Featured Products
            </h2>
            <p className="mt-2 font-sans text-sm text-brand-green/70 sm:text-base">
              Customer favourites — customize and add to your cart.
            </p>
          </div>
          <ButtonLink href="/shop" variant="primary" className="shrink-0">
            View All
          </ButtonLink>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
