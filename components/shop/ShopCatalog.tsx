"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import {
  PRODUCT_CATEGORIES,
  categoryLabels,
  products,
  type ProductCategory,
} from "@/lib/products";

const ALL = "all" as const;

type FilterValue = typeof ALL | ProductCategory;

function isValidCategory(value: string | null): value is ProductCategory {
  return (
    value !== null &&
    (PRODUCT_CATEGORIES as readonly string[]).includes(value)
  );
}

export function ShopCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("category");

  const activeFilter: FilterValue =
    param === null || param === ALL
      ? ALL
      : isValidCategory(param)
        ? param
        : ALL;

  const filteredProducts = useMemo(() => {
    if (activeFilter === ALL) return products;
    return products.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const setFilter = useCallback(
    (filter: FilterValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (filter === ALL) {
        params.delete("category");
      } else {
        params.set("category", filter);
      }
      const query = params.toString();
      router.push(query ? `/shop?${query}` : "/shop", { scroll: false });
    },
    [router, searchParams],
  );

  const chips: { value: FilterValue; label: string }[] = [
    { value: ALL, label: "All" },
    ...PRODUCT_CATEGORIES.map((cat) => ({
      value: cat,
      label: categoryLabels[cat],
    })),
  ];

  return (
    <div>
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        role="tablist"
        aria-label="Filter by category"
      >
        {chips.map(({ value, label }) => {
          const selected = activeFilter === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(value)}
              className={`shrink-0 rounded-full px-4 py-2.5 font-sans text-sm font-medium transition-all duration-200 focus-visible:outline-offset-4 active:scale-95 ${
                selected
                  ? "bg-brand-gold text-brand-green-deep shadow-gold-sm"
                  : "border border-brand-gold/40 bg-white/70 text-brand-green hover:border-brand-gold hover:bg-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-sans text-sm text-brand-green/65">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"}
        {activeFilter !== ALL && (
          <>
            {" "}
            in{" "}
            <span className="font-medium text-brand-green">
              {categoryLabels[activeFilter]}
            </span>
          </>
        )}
      </p>

      {filteredProducts.length === 0 ? (
        <p className="mt-12 text-center font-serif text-lg text-brand-green/70">
          No products in this category yet.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
