import { SITE } from "@/lib/site";

const cards = [
  {
    title: "Freshly Made to Order",
    description:
      "Nothing sits on a shelf. We prepare your order after you confirm — pickles, podis, sweets, and snacks at their freshest.",
    icon: FreshIcon,
  },
  {
    title: "Your Way — Oil or Ghee, Sugar or Jaggery",
    description:
      "Every product that allows it can be customized: preparation fat, sweetener, and spice level — priced clearly upfront.",
    icon: CustomizeIcon,
  },
  {
    title: "Traditional Andhra Recipes",
    description:
      "Time-tested family recipes from Andhra kitchens — bold avakaya, gongura, ariselu, and festival snacks done right.",
    icon: RecipeIcon,
  },
  {
    title: "Organic Oil · Organic Groceries · Home Made",
    description:
      "Our three pillars: quality ingredients, mindful sourcing, and the warmth of food made at home.",
    icon: PillarIcon,
  },
] as const;

export function WhyUsSection() {
  return (
    <section className="bg-brand-cream py-12 sm:py-16" aria-labelledby="why-us-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="why-us-heading"
          className="text-center font-serif text-2xl font-semibold text-brand-green sm:text-3xl"
        >
          Why {SITE.name}
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, description, icon: Icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-brand-gold/25 bg-white/50 p-5 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold">
                <Icon />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-brand-green">
                {title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-brand-green/75">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FreshIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 3v3M8 8c-2 2-3 5-3 8a7 7 0 1014 0c0-3-1-6-3-8" strokeLinecap="round" />
      <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CustomizeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round" />
      <circle cx="18" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function RecipeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 4h12v16H6z" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

function PillarIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 2l3 6 6 1-4 5 1 7-6-3-6 3 1-7-4-5 6-1 3-6z" strokeLinejoin="round" />
    </svg>
  );
}
