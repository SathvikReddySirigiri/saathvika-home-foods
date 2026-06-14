import { HeroArchFrame, KolamDivider } from "@/components/brand";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SITE } from "@/lib/site";

const heroSlides: HeroSlide[] = [
  {
    productId: "gongura-chicken-pickle",
    image: "/products/gongura-chicken-pickle.jpg",
    title: "Gongura Chicken Pickle",
    subtitle:
      "Tangy sorrel leaves, slow-cooked chicken — an Andhra signature",
  },
  {
    productId: "dry-fruit-laddu",
    image: "/products/dry-fruit-laddu.jpg",
    title: "Dry Fruit Laddu",
    subtitle: "Premium dates and dry fruits, no added sugar",
  },
  {
    productId: "special-mixture",
    image: "/products/special-mixture.jpg",
    title: "Special Mixture",
    subtitle: "Our signature savoury mixture — premium crunch and spice",
  },
  {
    productId: "ginger-pickle",
    image: "/products/ginger-pickle.jpg",
    title: "Ginger Pickle",
    subtitle: "Fiery ginger with tamarind and chilli — a digestive favourite",
  },
];

export function HeroSection() {
  return (
    <section className="on-brand-dark relative overflow-hidden bg-brand-green">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20">
        <div className="relative flex flex-col gap-6 text-center lg:text-left">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-gold/90">
            {SITE.pillars.join(" · ")}
          </p>
          <h1 className="font-display text-4xl leading-tight text-brand-cream sm:text-5xl lg:text-6xl">
            {SITE.name}
          </h1>
          <p className="font-display text-xl text-brand-gold sm:text-2xl">
            {SITE.tagline}
          </p>
          <p className="mx-auto max-w-lg font-sans text-base leading-relaxed text-brand-cream/85 sm:text-lg lg:mx-0">
            Authentic Andhra food, freshly made after you order — your choice of
            oil or ghee, sugar or jaggery.
          </p>
          <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:mx-0 lg:justify-start">
            <ButtonLink href="/shop" variant="primary">
              Shop Now
            </ButtonLink>
            <ButtonLink href="#how-customization" variant="secondary">
              How Customization Works
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <HeroArchFrame className="ring-2 ring-brand-gold">
            <div className="relative h-[320px] w-full bg-brand-green-deep md:aspect-[4/5] md:h-auto">
              <HeroSlider slides={heroSlides} />
            </div>
          </HeroArchFrame>
        </div>
      </div>

      <KolamDivider className="relative z-10 text-brand-gold/80" />
    </section>
  );
}
