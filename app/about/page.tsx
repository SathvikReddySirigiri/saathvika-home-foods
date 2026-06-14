import { KolamDivider } from "@/components/brand";
import { PageHeader } from "@/components/pages/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SITE } from "@/lib/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "The family story behind Saathvika Home Foods — traditional Andhra homemade recipes, organic ingredients, and food made fresh in a home kitchen.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <PageHeader
        title="Our Story"
        subtitle={`${SITE.tagline} — from our home kitchen in Andhra to your table.`}
        showGopuramMotif
      />

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-brand-green">
            A kitchen, not a factory
          </h2>
          <p className="font-sans text-base leading-relaxed text-brand-green/80">
            {/* EDIT: Replace with your family story */}
            {SITE.name} began in a small home kitchen, where Saathvika prepared
            pickles, podis, and festival sweets the way her mother and
            grandmother taught her — by hand, in small batches, with ingredients
            she would serve her own family. What started as sharing with
            neighbours and relatives grew into orders from friends across the
            city, and eventually this shop.
          </p>
          <p className="font-sans text-base leading-relaxed text-brand-green/80">
            We are still that same kitchen at heart. Every jar and every packet
            carries the care of food made at home, not on an industrial line.
          </p>
        </section>

        <div className="my-10">
          <KolamDivider className="text-brand-gold/50" />
        </div>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-brand-green">
            Rooted in Andhra
          </h2>
          <p className="font-sans text-base leading-relaxed text-brand-green/80">
            {/* EDIT: Add your village/city, family region, specialities */}
            Our recipes come from Andhra Pradesh — avakaya that bites back,
            gongura that makes you reach for extra rice, ariselu for Sankranti,
            and the podis that turn a plain lunch into something memorable. We
            do not chase trends; we perfect what our elders passed down.
          </p>
          <p className="font-sans text-base leading-relaxed text-brand-green/80">
            When you order ghee avakaya or bellam gavvalu, you are tasting choices
            that families in our region have argued about pleasantly for
            generations — and we honour both sides by letting you choose.
          </p>
        </section>

        <div className="my-10">
          <KolamDivider className="text-brand-gold/50" />
        </div>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-brand-green">
            {SITE.pillars.join(" · ")}
          </h2>
          <ul className="space-y-3 font-sans text-base leading-relaxed text-brand-green/80">
            <li className="flex gap-3">
              <span className="text-brand-gold" aria-hidden>
                ◆
              </span>
              <span>
                <strong className="text-brand-green">Organic oil</strong> — we
                use quality cold-pressed and cooking oils suitable for pickles
                and frying, chosen for taste and stability, not the cheapest
                bulk option.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-gold" aria-hidden>
                ◆
              </span>
              <span>
                <strong className="text-brand-green">Organic groceries</strong>{" "}
                — spices, lentils, and staples are sourced with care; we grind and
                mix in small batches so nothing sits stale.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-gold" aria-hidden>
                ◆
              </span>
              <span>
                <strong className="text-brand-green">Home made</strong> — every
                order is prepared after you confirm. No mystery stock, no
                months-old batch relabelled as fresh.
              </span>
            </li>
          </ul>
        </section>

        <div className="my-10">
          <KolamDivider className="text-brand-gold/50" />
        </div>

        <section className="rounded-2xl border border-brand-gold/25 bg-white/60 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-brand-green">
            Hygiene & quality promise
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-brand-green/80">
            {/* EDIT: Add certifications, kitchen practices, packaging details */}
            Our workspace is cleaned and organised daily. Utensils for pickles
            and sweets are kept separate, ingredients are stored in airtight
            containers, and packing happens only once your batch is ready — not
            weeks in advance.
          </p>
          <p className="mt-3 font-sans text-base leading-relaxed text-brand-green/80">
            We pack in food-grade jars and pouches, seal carefully, and dispatch
            promptly. If anything arrives damaged or not as ordered, message us
            on WhatsApp — we will make it right because our name is on every
            label.
          </p>
        </section>

        <div className="mt-12 text-center">
          <ButtonLink href="/shop" variant="primary">
            Shop Our Products
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
