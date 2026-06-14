"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type HeroSlide = {
  productId: string;
  image: string;
  title: string;
  subtitle: string;
};

type HeroSliderProps = {
  slides: HeroSlide[];
};

const ROTATE_MS = 5000;
const FADE_MS = 400;

export function HeroSlider({ slides }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onVisibility = () => {
      setTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (count <= 1 || hovered || !tabVisible) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, hovered, tabVisible]);

  if (count === 0) return null;

  const active = slides[index];

  return (
    <div
      className="group relative h-full w-full outline-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goPrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goNext();
        }
      }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {index + 1} of {count}: {active.title}. {active.subtitle}
      </p>

      {slides.map((slide, i) => {
        const isActive = i === index;
        return (
          <Link
            key={slide.productId}
            href={`/shop/${slide.productId}`}
            className={`absolute inset-0 block transition-opacity ease-in-out ${
              isActive
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            tabIndex={isActive ? 0 : -1}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={`${slide.title} — ${slide.subtitle}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={i === 0}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-brand-green/80 px-4 py-3 pb-10 sm:pb-11"
              aria-hidden
            >
              <p className="font-serif text-base font-semibold text-brand-cream sm:text-lg">
                {slide.title}
              </p>
              <p className="mt-0.5 font-sans text-xs text-brand-gold sm:text-sm">
                {slide.subtitle}
              </p>
            </div>
          </Link>
        );
      })}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/60 bg-brand-green/85 text-brand-gold shadow-md transition-opacity hover:bg-brand-green focus-visible:outline-offset-2 max-md:opacity-100 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/60 bg-brand-green/85 text-brand-gold shadow-md transition-opacity hover:bg-brand-green focus-visible:outline-offset-2 max-md:opacity-100 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronIcon direction="right" />
          </button>

          <div
            className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2"
            role="tablist"
            aria-label="Choose slide"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.productId}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to ${slide.title}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }}
                className={`h-2.5 w-2.5 rounded-full border-2 border-brand-gold transition-colors focus-visible:outline-offset-2 ${
                  i === index ? "bg-brand-gold" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}
