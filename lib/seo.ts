import type { Metadata } from "next";
import { LOGO_PATH } from "@/components/brand";
import { SITE } from "@/lib/site";

/** Shared search phrases for Andhra homemade food */
export const SEO_KEYWORDS = [
  "Andhra pickles online",
  "homemade avakaya",
  "Telugu sweets made to order",
  "Andhra food online",
  "gongura pachadi",
  "homemade pickles India",
  "Andhra podi",
  "fresh pickles order",
  "oil or ghee pickle",
  "jaggery sweets Andhra",
  "Saathvika Home Foods",
] as const;

const defaultDescription =
  "Saathvika Home Foods — authentic Andhra homemade sweets and snacks, freshly made after you order. Pickles, podis, and Telugu treats — oil or ghee, sugar or jaggery. Tastes like Grandma's.";

type PageMetaOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description = defaultDescription,
  path = "",
  image = LOGO_PATH,
  imageAlt,
  keywords = [...SEO_KEYWORDS],
  noIndex = false,
}: PageMetaOptions): Metadata {
  const url = path ? new URL(path, SITE.url).toString() : SITE.url;
  const ogAlt = imageAlt ?? `${SITE.name} — ${SITE.tagline}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE.name,
      title: `${title} · ${SITE.name}`,
      description,
      url,
      images: [
        {
          url: image,
          width: 512,
          height: 512,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${title} · ${SITE.name}`,
      description,
      images: [image],
    },
  };
}

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: defaultDescription,
  keywords: SEO_KEYWORDS.join(", "),
  icons: {
    icon: [{ url: LOGO_PATH, type: "image/png" }],
    apple: [{ url: LOGO_PATH, type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    title: SITE.name,
    description: defaultDescription,
    images: [
      {
        url: LOGO_PATH,
        width: 512,
        height: 512,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: defaultDescription,
    images: [LOGO_PATH],
  },
};
