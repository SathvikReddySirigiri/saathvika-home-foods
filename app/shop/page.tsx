import { Suspense } from "react";
import { KolamDivider } from "@/components/brand";
import { ShopCatalog } from "@/components/shop";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shop Andhra Pickles, Sweets & Snacks",
  description:
    "Browse homemade avakaya, gongura pachadi, Telugu sweets, podis, and vadiyalu — customize oil, ghee, jaggery, and spice. Freshly made to order.",
  path: "/shop",
});

function ShopCatalogFallback() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] animate-shf-pulse rounded-2xl bg-brand-green/10"
          aria-hidden
        />
      ))}
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <header className="on-brand-dark bg-brand-green">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <h1 className="font-display text-3xl text-brand-cream sm:text-4xl">
            Shop
          </h1>
          <p className="mt-2 max-w-xl font-sans text-base text-brand-cream/85 sm:text-lg">
            Pickles, masalas, sweets, snacks, vadiyalu, and podis — customize
            and order fresh.
          </p>
        </div>
        <KolamDivider className="text-brand-gold/80" />
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<ShopCatalogFallback />}>
          <ShopCatalog />
        </Suspense>
      </div>
    </div>
  );
}
