// lib/products.ts
// Saathvika Home Foods — product catalogue.
// Pricing model: PER KILOGRAM, matching the printed menu.
//   - basePrice is the price for 1 kg, in INR.
//   - packSizes scale that price (250g, 500g, 1kg).
//   - All prices already include the +₹100/kg increase.
// Everything is made fresh after order confirmation
// ("ఆర్డర్లపై తాజాగా తయారు చేసి ఇవ్వబడతాయి").

export const PRODUCT_CATEGORIES = ["pickles", "sweets", "snacks"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CUSTOMIZATION_TYPES = ["sweetener", "spice", "flour", "fat"] as const;
export type CustomizationType = (typeof CUSTOMIZATION_TYPES)[number];

export type PackSize = {
  label: string;
  grams: number;
  /** Fraction of 1 kg — used to scale basePrice (per-kg). */
  priceMultiplier: number;
  /** If set, overrides basePrice * priceMultiplier (e.g. pickle menu prices). */
  fixedPrice?: number;
};

export type CustomizationOption = {
  value: string;
  label: string;
  /** Flat INR added on top of pack price (when priceDeltaByPack is not set) */
  priceDelta?: number;
  /** Per-pack INR delta keyed by grams (250, 500, 1000) */
  priceDeltaByPack?: Record<number, number>;
  /** Optional product image when this option is selected */
  image?: string;
};

export type ProductCustomization = {
  type: CustomizationType;
  label: string;
  options: CustomizationOption[];
};

export type Product = {
  id: string;
  name: string;
  nameTelugu?: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string;
  image: string;
  /** Base price in INR for 1 kg. */
  basePrice: number;
  packSizes: PackSize[];
  customizations?: ProductCustomization[];
  /** Made fresh after order confirmation */
  isFreshlyMade: boolean;
  featured?: boolean;
};

// ---- Customization presets ----

const SWEETENER_SUGAR_JAGGERY: ProductCustomization = {
  type: "sweetener",
  label: "Sweetener",
  options: [
    { value: "jaggery", label: "Bellam (jaggery)", priceDelta: 0 },
    { value: "sugar", label: "Sugar", priceDelta: 0 },
  ],
};

const SPICE_LEVEL: ProductCustomization = {
  type: "spice",
  label: "Spice level",
  options: [
    { value: "medium", label: "Medium", priceDelta: 0 },
    { value: "hot", label: "Hot", priceDelta: 0 },
    { value: "extra-hot", label: "Extra hot", priceDelta: 0 },
  ],
};

const SWEETENER_KAJJIKAYALU: ProductCustomization = {
  type: "sweetener",
  label: "Sweetener",
  options: [
    { value: "sugar", label: "Sugar", priceDelta: 0 },
    {
      value: "jaggery",
      label: "Bellam (jaggery)",
      priceDeltaByPack: { 250: 30, 500: 50, 1000: 100 },
    },
  ],
};

const FAT_OIL_GHEE_ATHIRASA: ProductCustomization = {
  type: "fat",
  label: "Preparation",
  options: [
    { value: "oil", label: "Cold-pressed oil (default)", priceDelta: 0 },
    {
      value: "ghee",
      label: "Pure ghee",
      priceDeltaByPack: { 250: 50, 500: 90, 1000: 170 },
    },
  ],
};

const FLOUR_TYPE: ProductCustomization = {
  type: "flour",
  label: "Flour",
  options: [
    {
      value: "rice",
      label: "Rice flour (default)",
      priceDelta: 0,
      image: "/products/pappu-chekkalu.jpg",
    },
    {
      value: "ragi",
      label: "Ragi (finger millet)",
      priceDelta: 0,
      image: "/products/pappu-chekkalu-ragi.jpg",
    },
  ],
};

// ---- Pack sizes (per-kg model) ----
// 250g / 500g / 1kg, priced exactly proportionally.
// e.g. ₹600/kg  ->  ₹300 per 500g  ->  ₹150 per 250g.

const PACKS: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0.25 },
  { label: "500 g", grams: 500, priceMultiplier: 0.5 },
  { label: "1 kg", grams: 1000, priceMultiplier: 1 },
];

const PICKLE_PACKS_VEG: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 189 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 349 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 649 },
];

const PICKLE_PACKS_CHICKEN_BONE: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 299 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 579 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 1099 },
];

const PICKLE_PACKS_CHICKEN_BONELESS: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 349 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 679 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 1299 },
];

const PICKLE_PACKS_GONGURA_CHICKEN: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 379 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 729 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 1399 },
];

const SNACK_PACKS_STANDARD: PackSize[] = [
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 279 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 549 },
];

const SNACK_PACKS_PREMIUM: PackSize[] = [
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 319 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 599 },
];

const SWEET_PACKS_TIER_A: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 199 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 349 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 669 },
];

const SWEET_PACKS_TIER_B: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 229 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 399 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 769 },
];

const SWEET_PACKS_NETHI_MYSORE_PAK: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 249 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 449 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 799 },
];

const SWEET_PACKS_DRY_FRUIT_LADDU: PackSize[] = [
  { label: "250 g", grams: 250, priceMultiplier: 0, fixedPrice: 399 },
  { label: "500 g", grams: 500, priceMultiplier: 0, fixedPrice: 749 },
  { label: "1 kg", grams: 1000, priceMultiplier: 0, fixedPrice: 1399 },
];

// ---- Products (from the menu, +₹100/kg applied) ----

export const products: Product[] = [
  // ==================== PICKLES ====================
  {
    id: "kakarakaya-pickle",
    name: "Kakarakaya Pickle",
    nameTelugu: "కాకరకాయ పచ్చడి",
    category: "pickles",
    shortDescription:
      "Bitter gourd pickle slow-cooked with chillies and tamarind.",
    longDescription:
      "Tender bitter gourd cut and cooked down with red chilli, tamarind, mustard and fenugreek into a robust, traditional Andhra pickle. Made fresh after your order.",
    image: "/products/kakarakaya-pickle.jpg",
    basePrice: 649,
    packSizes: PICKLE_PACKS_VEG,
    isFreshlyMade: true,
  },
  {
    id: "mango-pickle",
    name: "Mango Pickle",
    nameTelugu: "మామిడికాయ పచ్చడి / ఆవకాయ",
    category: "pickles",
    shortDescription:
      "The iconic Andhra mango pickle — bold mustard, red chilli, fenugreek.",
    longDescription:
      "Firm raw mango cut into chunks and cured with freshly ground mustard, red chilli, fenugreek and salt. The pride of every Andhra household, made fresh to order.",
    image: "/products/mango-pickle.jpg",
    basePrice: 649,
    packSizes: PICKLE_PACKS_VEG,
    isFreshlyMade: true,
  },
  {
    id: "tomato-pickle",
    name: "Tomato Pickle",
    nameTelugu: "టమాటా పచ్చడి",
    category: "pickles",
    shortDescription: "Slow-cooked tomato pickle, tangy and warmly spiced.",
    longDescription:
      "Ripe tomatoes cooked down patiently with red chilli, garlic and a fenugreek-mustard tempering until thick and glossy. A crowd-pleaser that pairs with idli, dosa, curd rice or chapati.",
    image: "/products/tomato-pickle.jpg",
    basePrice: 649,
    packSizes: PICKLE_PACKS_VEG,
    isFreshlyMade: true,
  },
  {
    id: "lemon-pickle",
    name: "Lemon Pickle",
    nameTelugu: "నిమ్మకాయ పచ్చడి",
    category: "pickles",
    shortDescription: "Sun-cured lemon pickle, bright and tangy.",
    longDescription:
      "Fresh lemons cured with salt, red chilli and fenugreek and rested until soft and translucent. Sharp, sunny and excellent with rice and dal.",
    image: "/products/lemon-pickle.jpg",
    basePrice: 649,
    packSizes: PICKLE_PACKS_VEG,
    isFreshlyMade: true,
  },
  {
    id: "ginger-pickle",
    name: "Ginger Pickle",
    nameTelugu: "అల్లం పచ్చడి",
    category: "pickles",
    shortDescription:
      "Fiery ginger pickle with tamarind and chilli — a digestive favourite.",
    longDescription:
      "Fresh ginger ground with tamarind, jaggery and red chilli into a punchy, sweet-sour-spicy pickle. Loved as a side and as a digestive.",
    image: "/products/ginger-pickle.jpg",
    basePrice: 649,
    packSizes: PICKLE_PACKS_VEG,
    isFreshlyMade: true,
  },
  {
    id: "pandu-mirapakaya-pickle",
    name: "Pandu Mirapakaya Pickle",
    nameTelugu: "పండు మిరపకాయ పచ్చడి",
    category: "pickles",
    shortDescription:
      "Bold red-chilli pickle — fiery, oily, and deeply Andhra.",
    longDescription:
      "Fresh red chillies crushed and cured with garlic, mustard, fenugreek and salt into a thick, vibrant pickle. For those who like their rice with serious heat. Made fresh after your order.",
    image: "/products/pandu-mirapakaya-pickle.jpg",
    basePrice: 649,
    packSizes: PICKLE_PACKS_VEG,
    isFreshlyMade: true,
  },
  {
    id: "chicken-bone-pickle",
    name: "Chicken Bone Pickle",
    nameTelugu: "కోడి పచ్చడి",
    category: "pickles",
    shortDescription:
      "Traditional Andhra chicken pickle with bone-in pieces, slow-cooked in oil and spices.",
    longDescription:
      "Bone-in chicken slow-cooked with red chilli, ginger, garlic and a traditional pickle masala in cold-pressed oil. Robust, deeply flavoured, and made fresh after your order.",
    image: "/products/chicken-bone-pickle.jpg",
    basePrice: 1099,
    packSizes: PICKLE_PACKS_CHICKEN_BONE,
    isFreshlyMade: true,
    featured: true,
  },
  {
    id: "chicken-boneless-pickle",
    name: "Chicken Boneless Pickle",
    nameTelugu: "బోన్‌లెస్ కోడి పచ్చడి",
    category: "pickles",
    shortDescription:
      "Boneless chicken pickle — the same Andhra masala, easier to serve.",
    longDescription:
      "Boneless chicken cooked down with the traditional Andhra pickle masala, ginger and garlic in cold-pressed oil. Easier to serve, same bold flavour.",
    image: "/products/chicken-boneless-pickle.png",
    basePrice: 1299,
    packSizes: PICKLE_PACKS_CHICKEN_BONELESS,
    isFreshlyMade: true,
  },
  {
    id: "gongura-chicken-pickle",
    name: "Gongura Chicken Pickle",
    nameTelugu: "గోంగూర కోడి పచ్చడి",
    category: "pickles",
    shortDescription:
      "Chicken pickle with tangy gongura (sorrel) leaves — an Andhra signature.",
    longDescription:
      "Chicken slow-cooked with gongura (sorrel) leaves, red chilli, garlic and the traditional pickle masala. Tangy, spicy, deeply Andhra. Made fresh after your order.",
    image: "/products/gongura-chicken-pickle.jpg",
    basePrice: 1399,
    packSizes: PICKLE_PACKS_GONGURA_CHICKEN,
    isFreshlyMade: true,
    featured: true,
  },

  // ==================== SWEETS ====================
  {
    id: "dry-fruit-laddu",
    name: "Dry Fruit Laddu",
    nameTelugu: "డ్రై ఫ్రూట్ లడ్డు",
    category: "sweets",
    shortDescription: "Sugar-free laddus packed with dates and dry fruits.",
    longDescription:
      "Dates, almonds, cashews and other dry fruits ground and rolled into rich laddus — naturally sweet, no added sugar needed. Our premium sweet.",
    image: "/products/dry-fruit-laddu.jpg",
    basePrice: 1399,
    packSizes: SWEET_PACKS_DRY_FRUIT_LADDU,
    isFreshlyMade: true,
    featured: true,
  },
  {
    id: "nethi-mysore-pak",
    name: "Nethi Mysore Pak",
    nameTelugu: "నేతి మైసూర్ పాక్",
    category: "sweets",
    shortDescription: "Rich ghee Mysore Pak that melts on the tongue.",
    longDescription:
      "Gram flour and generous pure ghee cooked to that signature soft, porous Mysore Pak texture. Indulgent and aromatic, made fresh to order.",
    image: "/products/nethi-mysore-pak.jpg",
    basePrice: 799,
    packSizes: SWEET_PACKS_NETHI_MYSORE_PAK,
    isFreshlyMade: true,
    featured: true,
  },
  {
    id: "kajjikayalu",
    name: "Kajjikayalu",
    nameTelugu: "కజ్జికాయలు",
    category: "sweets",
    shortDescription:
      "Crisp half-moon pastries stuffed with sweet coconut and dry-fruit filling.",
    longDescription:
      "Flaky shells folded around a fragrant filling of coconut, jaggery and dry fruits, then fried golden. A festive favourite, made fresh after you order.",
    image: "/products/kajjikayalu.jpg",
    basePrice: 669,
    packSizes: SWEET_PACKS_TIER_A,
    customizations: [SWEETENER_KAJJIKAYALU],
    isFreshlyMade: true,
    featured: true,
  },
  {
    id: "athirasa",
    name: "Athirasa",
    nameTelugu: "అతిరస",
    category: "sweets",
    shortDescription:
      "Traditional rice-flour and jaggery festival sweet — soft with a crisp lace edge. Also known as ariselu.",
    longDescription:
      "Soaked rice ground fine, mixed with melted jaggery or sugar, and fried to a golden lace — the timeless festival sweet known formally as athirasa (from the Sanskrit 'atirasa', meaning exceedingly delicious), and as ariselu in everyday Telugu homes. A Sankranti classic, made the slow traditional way after your order.",
    image: "/products/athirasa.jpg",
    basePrice: 669,
    packSizes: SWEET_PACKS_TIER_A,
    customizations: [FAT_OIL_GHEE_ATHIRASA],
    isFreshlyMade: true,
  },
  {
    id: "chanikkaya-undalu",
    name: "Chanikkaya Undalu",
    nameTelugu: "చనిక్కాయ ఉండలు",
    category: "sweets",
    shortDescription: "Roasted gram and jaggery laddus — nutty and wholesome.",
    longDescription:
      "Roasted gram (putnalu) ground with jaggery and a little ghee, rolled into firm, nutty laddus. A simple, traditional sweet.",
    image: "/products/chanikkaya-undalu.jpg",
    basePrice: 669,
    packSizes: SWEET_PACKS_TIER_A,
    isFreshlyMade: true,
  },
  {
    id: "sunnundalu",
    name: "Sunnundalu",
    nameTelugu: "సున్నుండలు",
    category: "sweets",
    shortDescription: "Roasted urad-dal laddus with ghee — rich and nourishing.",
    longDescription:
      "Roasted urad dal ground with jaggery and pure ghee into dense, nourishing laddus. A traditional energy sweet loved across Andhra homes.",
    image: "/products/sunnundalu.jpg",
    basePrice: 769,
    packSizes: SWEET_PACKS_TIER_B,
    isFreshlyMade: true,
  },
  {
    id: "rava-laddu",
    name: "Rava Laddu",
    nameTelugu: "రవ్వ లడ్డు",
    category: "sweets",
    shortDescription: "Semolina laddus with ghee, cashew and cardamom.",
    longDescription:
      "Roasted semolina bound with ghee, jaggery, cashews and cardamom into soft laddus. A quick-melting, comforting classic.",
    image: "/products/rava-laddu.jpg",
    basePrice: 669,
    packSizes: SWEET_PACKS_TIER_A,
    isFreshlyMade: true,
  },
  {
    id: "bellam-gavvalu",
    name: "Bellam Gavvalu",
    nameTelugu: "బెల్లం గవ్వలు",
    category: "sweets",
    shortDescription: "Shell-shaped sweets glazed in jaggery syrup.",
    longDescription:
      "Little shells fried crisp and tossed in warm jaggery syrup until glossy. A Sankranti favourite — sweet, crunchy, and made fresh after your order.",
    image: "/products/bellam-gavvalu.jpg",
    basePrice: 669,
    packSizes: SWEET_PACKS_TIER_A,
    isFreshlyMade: true,
  },

  // ==================== SNACKS (savoury) ====================
  {
    id: "karam-boondhi",
    name: "Karam Boondhi",
    nameTelugu: "కారం బూంది",
    category: "snacks",
    shortDescription: "Spicy boondi mixture with nuts and curry leaves.",
    longDescription:
      "Crunchy gram-flour boondi tossed with peanuts, fried curry leaves and spices into a moreish savoury mixture. Great with tea.",
    image: "/products/karam-boondhi.jpg",
    basePrice: 549,
    packSizes: SNACK_PACKS_STANDARD,
    customizations: [SPICE_LEVEL],
    isFreshlyMade: true,
  },
  {
    id: "ribbon-pakkodi",
    name: "Ribbon Pakkodi",
    nameTelugu: "రిబ్బన్ పకోడీ",
    category: "snacks",
    shortDescription: "Crisp, ribbon-shaped savoury strips, lightly spiced.",
    longDescription:
      "Smooth, flat ribbons of spiced rice and gram flour fried to a delicate crunch. A festive favourite with a satisfying snap.",
    image: "/products/ribbon-pakkodi.jpg",
    basePrice: 549,
    packSizes: SNACK_PACKS_STANDARD,
    customizations: [SPICE_LEVEL],
    isFreshlyMade: true,
  },
  {
    id: "kara-gavvalu",
    name: "Karam Guvvalu",
    nameTelugu: "కారం గువ్వలు",
    category: "snacks",
    shortDescription: "Savoury spiced shell-shaped crisps — the spicy gavvalu.",
    longDescription:
      "Shell-shaped crisps seasoned with chilli and spices for a savoury, crunchy snack. The hot counterpart to sweet gavvalu.",
    image: "/products/kara-gavvalu.jpg",
    basePrice: 549,
    packSizes: SNACK_PACKS_STANDARD,
    customizations: [SPICE_LEVEL],
    isFreshlyMade: true,
  },
  {
    id: "pappu-chekkalu",
    name: "Pappu Chekkalu",
    nameTelugu: "పప్పు చెక్కలు",
    category: "snacks",
    shortDescription: "Crisp rice or ragi flour discs studded with chana dal.",
    longDescription:
      "Thin, crisp discs studded with chana dal, sesame and a hint of chilli — fried shatteringly crisp. Choose rice flour for the classic version, or ragi (finger millet) for a wholesome, earthier bite. Made fresh after your order.",
    image: "/products/pappu-chekkalu.jpg",
    basePrice: 549,
    packSizes: SNACK_PACKS_STANDARD,
    customizations: [FLOUR_TYPE],
    isFreshlyMade: true,
  },
  {
    id: "special-mixture",
    name: "Special Mixture",
    nameTelugu: "స్పెషల్ మిక్చర్",
    category: "snacks",
    shortDescription:
      "Our signature savoury mixture — a premium blend of crunch and spice.",
    longDescription:
      "A carefully balanced blend of boondi, sev, fried lentils, peanuts, curry leaves and spices. Our premium mixture, richer than the standard karam boondhi. Made fresh in small batches.",
    image: "/products/special-mixture.jpg",
    basePrice: 599,
    packSizes: SNACK_PACKS_PREMIUM,
    customizations: [SPICE_LEVEL],
    isFreshlyMade: true,
    featured: true,
  },
];

// ---- Helpers ----

export const categoryLabels: Record<ProductCategory, string> = {
  pickles: "Pickles",
  sweets: "Sweets",
  snacks: "Snacks",
};

export const categories: { value: ProductCategory; label: string }[] = [
  { value: "pickles", label: "Pickles" },
  { value: "sweets", label: "Sweets" },
  { value: "snacks", label: "Snacks" },
];

/** Legacy product IDs that resolve to a current catalogue id */
export const PRODUCT_ID_ALIASES: Record<string, string> = {
  ariselu: "athirasa",
};

export function resolveProductId(id: string): string {
  return PRODUCT_ID_ALIASES[id] ?? id;
}

export function getProductById(id: string): Product | undefined {
  const resolved = resolveProductId(id);
  return products.find((p) => p.id === resolved);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getOptionPriceDelta(
  option: CustomizationOption,
  packGrams: number,
): number {
  const byPack = option.priceDeltaByPack?.[packGrams];
  if (byPack !== undefined) return byPack;
  return option.priceDelta ?? 0;
}

/** Final price for a configured item: fixed pack price or basePrice * multiplier + option deltas. */
export function computePrice(
  product: Product,
  packIndex: number,
  selectedOptions: Partial<Record<CustomizationType, string>>
): number {
  const pack = product.packSizes[packIndex] ?? product.packSizes[0];
  let price =
    pack.fixedPrice !== undefined
      ? pack.fixedPrice
      : product.basePrice * pack.priceMultiplier;
  for (const c of product.customizations ?? []) {
    const chosen = c.options.find((o) => o.value === selectedOptions[c.type]);
    if (chosen) price += getOptionPriceDelta(chosen, pack.grams);
  }
  return Math.round(price);
}
