const reviews = [
  {
    quote:
      "The avakaya arrived exactly how my ammamma used to make it — we ordered with ghee and the flavour was incredible. Will order again for Sankranti.",
    name: "Lakshmi R.",
    location: "Hyderabad",
  },
  {
    quote:
      "Love that I could choose jaggery for ariselu. Fresh, not too sweet, and packed carefully. WhatsApp confirmation was quick and friendly.",
    name: "Venkat M.",
    location: "Bengaluru",
  },
  {
    quote:
      "Karam podi extra hot — perfect with ghee idli. You can tell it's ground fresh, not like store powders. Minapa vadiyalu puffed beautifully.",
    name: "Priya K.",
    location: "Vijayawada",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section
      className="bg-brand-cream py-12 sm:py-16"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="reviews-heading"
          className="text-center font-serif text-2xl font-semibold text-brand-green sm:text-3xl"
        >
          What Our Customers Say
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map(({ quote, name, location }) => (
            <li
              key={name}
              className="flex flex-col rounded-2xl border border-brand-gold/20 bg-white/60 p-6"
            >
              <p className="font-serif text-lg leading-relaxed text-brand-green/90">
                &ldquo;{quote}&rdquo;
              </p>
              <footer className="mt-4 border-t border-brand-gold/20 pt-4">
                <cite className="not-italic">
                  <span className="font-sans text-sm font-semibold text-brand-green">
                    {name}
                  </span>
                  <span className="font-sans text-sm text-brand-green/60">
                    {" "}
                    · {location}
                  </span>
                </cite>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
