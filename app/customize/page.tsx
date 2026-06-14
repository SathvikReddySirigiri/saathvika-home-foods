import { KolamDivider } from "@/components/brand";
import { PageHeader } from "@/components/pages/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SITE } from "@/lib/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Customize Your Order",
  description:
    "Why oil vs ghee and sugar vs jaggery matter for Andhra pickles and Telugu sweets. Every batch made fresh within days of your order.",
  path: "/customize",
});

const prepChoices = [
  {
    title: "Oil or Ghee",
    lead: "The same recipe can taste completely different depending on what carries the spice.",
    body: [
      "Sunflower oil is our everyday default — light, familiar, and how many families prepare pickles for daily meals. It lets the mango, gongura, or chilli shine without heaviness.",
      "Desi ghee is for when you want richness and festival flavour — the kind of avakaya or pachadi ammamma made for guests and special Sundays. Ghee deepens aroma and rounds off sharp heat.",
      "We never decide for you. When you order a pickle that allows it, you pick oil or ghee and we prepare exactly that batch after you confirm — not from a mixed tub sitting on a shelf.",
    ],
  },
  {
    title: "Sugar or Jaggery (Bellam)",
    lead: "Andhra sweets carry memory — and the sweetener is part of the story.",
    body: [
      "Refined sugar gives a clean, bright sweetness in gavvalu, ariselu, and similar treats — crisp edges, familiar to children and tea-time trays.",
      "Jaggery (bellam) brings caramel depth, a softer chew, and the colour and warmth of traditional home kitchens. Many customers choose bellam for Sankranti and for gifts because it feels more \"from the village.\"",
      "On sweets that offer both, you choose at checkout. We note your preference on the batch label and prepare accordingly — one order, one way.",
    ],
  },
  {
    title: "Spice level",
    lead: "Andhra heat should be honest, not surprising.",
    body: [
      "For podis and savoury snacks, you can often choose medium, hot, or extra hot. We adjust the chilli profile before grinding or frying your batch — so the karam podi you open is the heat you expected.",
      "If a product does not show spice options, it is because the recipe is balanced as-is (for example, certain festival snacks). We would rather offer fewer choices than fake flexibility.",
    ],
  },
] as const;

export default function CustomizePage() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream">
      <PageHeader
        title="Made Your Way"
        subtitle="Every order is prepared fresh — with the oil, ghee, sweetener, and spice you choose."
      />

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <p className="font-serif text-xl leading-relaxed text-brand-green sm:text-2xl">
          At {SITE.name}, customization is not a gimmick. It is how home food has
          always been made in Andhra kitchens — one family prefers ghee in their
          avakaya, another will only buy bellam ariselu, and nobody is wrong.
        </p>
        <p className="mt-4 font-sans text-base leading-relaxed text-brand-green/80">
          We do not mass-produce and then label. When you place an order, your
          choices are recorded, your batch is prepared, and it is dispatched
          fresh. That is the promise behind {SITE.tagline}.
        </p>

        <div className="my-10">
          <KolamDivider className="text-brand-gold/50" />
        </div>

        <div className="space-y-12">
          {prepChoices.map(({ title, lead, body }) => (
            <section key={title}>
              <h2 className="font-serif text-2xl font-semibold text-brand-green">
                {title}
              </h2>
              <p className="mt-2 font-sans text-base font-medium text-brand-gold">
                {lead}
              </p>
              <div className="mt-4 space-y-3">
                {body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="font-sans text-base leading-relaxed text-brand-green/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-green p-6 sm:p-8">
          <div className="on-brand-dark">
            <h2 className="font-serif text-2xl font-semibold text-brand-gold">
              Fresh preparation timeline
            </h2>
            <ul className="mt-5 space-y-4 font-sans text-base leading-relaxed text-brand-cream/90">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold" aria-hidden />
                <span>
                  <strong className="text-brand-cream">After you confirm</strong>{" "}
                  — we begin preparing your items. Pickles, podis, sweets, and
                  snacks are not pulled from pre-packed stock.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold" aria-hidden />
                <span>
                  <strong className="text-brand-cream">Within 2–3 days</strong>{" "}
                  of your order — most batches are made and packed for dispatch.
                  Complex or large orders may take a day longer; we will tell you
                  on WhatsApp if so.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold" aria-hidden />
                <span>
                  <strong className="text-brand-cream">Dispatched fresh</strong>{" "}
                  — sealed and sent to you with your chosen pack sizes and
                  preparation noted on the order.
                </span>
              </li>
            </ul>
            <p className="mt-5 font-sans text-sm text-brand-cream/75">
              Timelines can vary slightly during festival season when every family
              in Andhra seems to order at once — we would rather delay by a day
              than rush a batch.
            </p>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-brand-gold/25 bg-white/60 p-6 text-center sm:p-8">
          <p className="font-display text-2xl text-brand-green sm:text-3xl">
            Ready to order your way?
          </p>
          <p className="mx-auto mt-3 max-w-md font-sans text-base text-brand-green/75">
            Browse the shop, pick your pack size and preparation, and checkout on
            WhatsApp or online — we will make it fresh for you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/shop" variant="primary">
              Start Shopping
            </ButtonLink>
            <ButtonLink
              href="/shop"
              variant="secondary"
              className="!border-brand-gold !text-brand-green hover:!bg-brand-gold/10"
            >
              View All Products
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
  );
}
