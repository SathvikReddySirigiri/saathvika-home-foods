"use client";

import { TempleBellIcon } from "@/components/icons/TempleBellIcon";
import { useAmbientSound } from "@/context/AmbientSoundContext";

type AmbientSoundToggleProps = {
  variant?: "header" | "floating";
};

export function AmbientSoundToggle({ variant = "header" }: AmbientSoundToggleProps) {
  const { playing, loading, available, toggle } = useAmbientSound();

  const label = playing
    ? "Pause temple ambience"
    : "Play temple ambience";

  const isFloating = variant === "floating";

  return (
    <div className={isFloating ? "group relative" : "group relative hidden md:block"}>
      <button
        type="button"
        onClick={toggle}
        disabled={!available || loading}
        aria-pressed={playing}
        aria-busy={loading}
        aria-label={available ? label : "Temple ambience unavailable"}
        title={available ? (playing ? "Pause temple ambience" : "Play temple ambience") : undefined}
        className={
          isFloating
            ? "flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/50 bg-brand-green text-brand-gold shadow-gold transition-colors hover:bg-brand-green-light focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
            : `relative flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-40 ${
                playing
                  ? "bg-brand-gold/20 text-brand-gold ring-1 ring-brand-gold/50"
                  : "text-brand-cream hover:bg-brand-green-light hover:text-brand-gold"
              }`
        }
      >
        <TempleBellIcon className={isFloating ? "h-5 w-5" : "h-5 w-5"} />
        {playing && (
          <span
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-gold"
            aria-hidden
          />
        )}
      </button>
      {available && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-brand-green-deep px-2 py-1 font-sans text-xs text-brand-cream opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${
            isFloating
              ? "bottom-full right-0 mb-2"
              : "top-full left-1/2 mt-2 -translate-x-1/2"
          }`}
        >
          {playing ? "Pause temple ambience" : "Play temple ambience"}
        </span>
      )}
    </div>
  );
}

export function AmbientSoundFloatingToggle() {
  return (
    <div className="fixed bottom-[5.25rem] right-5 z-50 md:hidden sm:bottom-[5.5rem] sm:right-6">
      <AmbientSoundToggle variant="floating" />
    </div>
  );
}
