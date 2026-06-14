"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import {
  buildConfigurationSummary,
  computeUnitPrice,
  formatINR,
  getOptionPriceDelta,
  type SelectedCustomization,
} from "@/lib/pricing";
import type { PackSize, Product } from "@/lib/products";
import { categoryLabels } from "@/lib/products";
import { OptionButtonGroup } from "./OptionButtonGroup";
import { ProductImage } from "./ProductImage";
import { QuantityStepper } from "./QuantityStepper";

type ProductDetailProps = {
  product: Product;
};

function getDefaultCustomizations(
  product: Product,
  packSize: PackSize,
): SelectedCustomization[] {
  if (!product.customizations) return [];
  return product.customizations.map((c) => {
    const option = c.options[0];
    return {
      type: c.type,
      value: option.value,
      label: option.label,
      priceDelta: getOptionPriceDelta(option, packSize.grams),
    };
  });
}

function getDefaultPackSize(product: Product): PackSize {
  return product.packSizes.reduce((min, p) =>
    p.grams < min.grams ? p : min,
  );
}

/** Last matching option image wins; otherwise product.image */
function resolveDisplayImage(
  product: Product,
  customizations: SelectedCustomization[],
): string {
  let image = product.image;
  for (const group of product.customizations ?? []) {
    const selected = customizations.find((c) => c.type === group.type);
    if (!selected) continue;
    const option = group.options.find((o) => o.value === selected.value);
    if (option?.image) image = option.image;
  }
  return image;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, itemCount } = useCart();
  const [packSize, setPackSize] = useState(() => getDefaultPackSize(product));
  const [customizations, setCustomizations] = useState<SelectedCustomization[]>(
    () => getDefaultCustomizations(product, getDefaultPackSize(product)),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const displayImage = useMemo(
    () => resolveDisplayImage(product, customizations),
    [product, customizations],
  );
  const [imageVisible, setImageVisible] = useState(true);
  const prevImageRef = useRef(displayImage);

  useEffect(() => {
    if (prevImageRef.current === displayImage) return;
    prevImageRef.current = displayImage;
    setImageVisible(false);
    const id = window.setTimeout(() => setImageVisible(true), 200);
    return () => window.clearTimeout(id);
  }, [displayImage]);

  const unitPrice = useMemo(
    () => computeUnitPrice(product, packSize, customizations),
    [product, packSize, customizations],
  );

  const lineTotal = unitPrice * quantity;

  const summary = useMemo(
    () => buildConfigurationSummary(product, packSize, customizations),
    [product, packSize, customizations],
  );

  const maxPackGrams = Math.max(...product.packSizes.map((p) => p.grams));
  const packSizeOptions = product.packSizes.map((p) => ({
    value: String(p.grams),
    label: p.label,
    hint:
      p.grams < maxPackGrams
        ? formatINR(computeUnitPrice(product, p, []))
        : undefined,
  }));

  const handlePackSizeChange = (gramsKey: string) => {
    const next = product.packSizes.find((p) => String(p.grams) === gramsKey);
    if (next) setPackSize(next);
  };

  const handleCustomizationChange = (
    type: SelectedCustomization["type"],
    value: string,
  ) => {
    const group = product.customizations?.find((c) => c.type === type);
    const option = group?.options.find((o) => o.value === value);
    if (!option) return;

    setCustomizations((prev) => {
      const rest = prev.filter((c) => c.type !== type);
      return [
        ...rest,
        {
          type,
          value: option.value,
          label: option.label,
          priceDelta: getOptionPriceDelta(option, packSize.grams),
        },
      ];
    });
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      packSize,
      customizations,
      quantity,
      unitPrice,
      summary,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <nav className="mb-6 font-sans text-sm text-brand-green/65">
        <Link href="/shop" className="hover:text-brand-gold transition-colors">
          Shop
        </Link>
        <span aria-hidden> / </span>
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-brand-gold transition-colors"
        >
          {categoryLabels[product.category]}
        </Link>
        <span aria-hidden> / </span>
        <span className="text-brand-green">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-gold/25 bg-brand-green/5 shadow-gold">
            <div
              className={`relative h-full w-full transition-opacity duration-200 ${
                imageVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <ProductImage
                key={displayImage}
                src={displayImage}
                alt={`${product.name}${product.nameTelugu ? ` — ${product.nameTelugu}` : ""}, freshly made Andhra homemade food`}
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            {product.isFreshlyMade && (
              <span className="inline-block rounded-full bg-brand-red px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-brand-cream">
                Freshly made to order
              </span>
            )}
            <h1 className="mt-3 font-serif text-3xl font-semibold text-brand-green sm:text-4xl">
              {product.name}
            </h1>
            {product.nameTelugu && (
              <p className="mt-1 font-sans text-lg text-brand-green/65">
                {product.nameTelugu}
              </p>
            )}
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-green/80">
              {product.longDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-brand-gold/30 bg-white/60 p-5 sm:p-6">
            <h2 className="font-serif text-xl font-semibold text-brand-green">
              {product.customizations?.length
                ? "Customize your order"
                : "Choose your pack"}
            </h2>

            <div className="mt-6 space-y-6">
              <OptionButtonGroup
                label="Pack size"
                name={`${product.id}-pack`}
                options={packSizeOptions}
                value={String(packSize.grams)}
                onChange={handlePackSizeChange}
              />

              {product.customizations?.map((group) => {
                const selected =
                  customizations.find((c) => c.type === group.type)?.value ??
                  group.options[0].value;

                return (
                  <OptionButtonGroup
                    key={group.type}
                    label={group.label}
                    name={`${product.id}-${group.type}`}
                    options={group.options.map((o) => {
                      const delta = getOptionPriceDelta(o, packSize.grams);
                      return {
                        value: o.value,
                        label: o.label,
                        hint: delta > 0 ? `(+${formatINR(delta)})` : undefined,
                      };
                    })}
                    value={selected}
                    onChange={(v) =>
                      handleCustomizationChange(group.type, v)
                    }
                  />
                );
              })}

              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>

            <div className="mt-6 border-t border-brand-gold/20 pt-5">
              <p className="font-sans text-sm text-brand-green/70">Your order</p>
              <p
                className="mt-1 font-sans text-base font-medium text-brand-green"
                aria-live="polite"
              >
                {summary}
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-serif text-3xl font-semibold text-brand-green">
                  {formatINR(lineTotal)}
                </p>
                {quantity > 1 && (
                  <p className="font-sans text-sm text-brand-green/65">
                    {formatINR(unitPrice)} each
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-6 flex w-full min-h-12 items-center justify-center rounded-full bg-brand-gold px-6 py-3 font-sans text-base font-semibold text-brand-green-deep transition-all duration-200 hover:bg-brand-gold/90 active:scale-[0.98] focus-visible:outline-offset-4"
            >
              {added ? "Added to cart ✓" : "Add to Cart"}
            </button>
            {added && (
              <Link
                href="/cart"
                className="mt-3 flex w-full min-h-10 items-center justify-center rounded-full border border-brand-gold/50 font-sans text-sm font-medium text-brand-green transition-colors hover:bg-brand-gold/10"
              >
                View cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
