import Link from "next/link";
import {
  PRODUCT_CATEGORIES,
  categoryLabels,
  getProductsByCategory,
  type ProductCategory,
} from "@/lib/products";

function categoryMenuNames(category: ProductCategory): string {
  return getProductsByCategory(category).map((p) => p.name).join(", ");
}

export function ShopByCategorySection() {
  return (
    <section
      className="bg-brand-cream py-12 sm:py-16"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="categories-heading"
          className="text-center font-serif text-2xl font-semibold text-brand-green sm:text-3xl"
        >
          Shop by Category
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center font-sans text-sm text-brand-green/70 sm:text-base">
          Browse our full range — each item made fresh after you order.
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {PRODUCT_CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/shop?category=${category}`}
                className="interactive-card group flex h-full flex-col rounded-2xl border border-brand-gold/30 bg-white/60 p-5 hover:border-brand-gold hover:bg-white hover:shadow-gold sm:p-6"
              >
                <span className="font-serif text-lg font-semibold text-brand-green group-hover:text-brand-gold transition-colors sm:text-xl">
                  {categoryLabels[category]}
                </span>
                <span className="mt-2 flex-1 font-sans text-sm leading-snug text-brand-green/70">
                  {categoryMenuNames(category)}
                </span>
                <span className="mt-4 font-sans text-sm font-medium text-brand-gold">
                  Shop →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
