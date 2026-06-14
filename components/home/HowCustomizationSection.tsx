import { ButtonLink } from "@/components/ui/ButtonLink";

const steps = [
  {
    step: "1",
    title: "Pick a product",
    description:
      "Browse pickles, podis, sweets, snacks, vadiyalu, and masalas — each with clear pack sizes and starting prices.",
  },
  {
    step: "2",
    title: "Choose your preparation",
    description:
      "Select oil or ghee, sugar or jaggery, or spice level where the product allows. See price changes before you add to cart.",
  },
  {
    step: "3",
    title: "Order your way",
    description:
      "Pay online or confirm on WhatsApp. We make your order fresh — no pre-packed shelf stock.",
  },
] as const;

export function HowCustomizationSection() {
  return (
    <section
      id="how-customization"
      className="on-brand-dark relative overflow-hidden bg-brand-green py-12 sm:py-16 scroll-mt-20"
      aria-labelledby="how-heading"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="how-heading"
          className="text-center font-serif text-2xl font-semibold text-brand-gold sm:text-3xl"
        >
          How Customization Works
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map(({ step, title, description }) => (
            <li
              key={step}
              className="relative rounded-2xl border border-brand-gold/25 bg-brand-green-light/40 p-6"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold font-sans text-lg font-bold text-brand-green-deep"
                aria-hidden
              >
                {step}
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-brand-cream">
                {title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-brand-cream/80">
                {description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/customize" variant="primary">
            Learn More
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
