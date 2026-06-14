import type {

  CustomizationOption,

  CustomizationType,

  PackSize,

  Product,

} from "./products";

import { getOptionPriceDelta } from "./products";



export type SelectedCustomization = {

  type: CustomizationType;

  value: string;

  label: string;

  priceDelta: number;

};



function customizationDelta(

  product: Product,

  packSize: PackSize,

  customizations: SelectedCustomization[],

): number {

  return customizations.reduce((sum, sel) => {

    const group = product.customizations?.find((c) => c.type === sel.type);

    const option = group?.options.find((o) => o.value === sel.value);

    if (!option) return sum;

    return sum + getOptionPriceDelta(option, packSize.grams);

  }, 0);

}



export function getStartingPrice(product: Product): number {

  const smallest = product.packSizes.reduce((min, p) =>

    p.grams < min.grams ? p : min,

  );

  return computeUnitPrice(product, smallest, []);

}



export function computeUnitPrice(

  product: Product,

  packSize: PackSize,

  customizations: SelectedCustomization[],

): number {

  const base =

    packSize.fixedPrice !== undefined

      ? packSize.fixedPrice

      : product.basePrice * packSize.priceMultiplier;

  return Math.round(base + customizationDelta(product, packSize, customizations));

}



export function buildConfigurationSummary(

  product: Product,

  packSize: PackSize,

  customizations: SelectedCustomization[],

): string {

  const parts: string[] = [product.name, packSize.label];



  for (const { type, value, label } of customizations) {

    if (type === "sweetener") {

      parts.push(

        value === "jaggery" ? "with Jaggery" : "with Sugar",

      );

    } else if (type === "spice") {

      parts.push(label.replace(/\s*\(default\)\s*/i, ""));

    } else if (type === "flour") {

      parts.push(

        value === "ragi" ? "Ragi (finger millet)" : "Rice flour",

      );

    } else if (type === "fat") {

      parts.push(value === "ghee" ? "made with Ghee" : "made with Oil");

    }

  }



  return parts.join(" · ");

}



export function formatINR(amount: number): string {

  return new Intl.NumberFormat("en-IN", {

    style: "currency",

    currency: "INR",

    maximumFractionDigits: 0,

  }).format(amount);

}



export function buildCartLineId(

  productId: string,

  packSize: PackSize,

  customizations: SelectedCustomization[],

): string {

  const custKey = [...customizations]

    .sort((a, b) => a.type.localeCompare(b.type))

    .map((c) => `${c.type}:${c.value}`)

    .join("|");

  return `${productId}-${packSize.grams}-${custKey}`;

}



export { getOptionPriceDelta };

export type { CustomizationOption };


