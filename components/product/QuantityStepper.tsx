type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-serif text-base font-semibold text-brand-green">
        Quantity
      </span>
      <div className="inline-flex items-center rounded-full border border-brand-gold/40 bg-white/70">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-l-full font-sans text-lg text-brand-green transition-all duration-200 hover:bg-brand-gold/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span
          className="min-w-[2.5rem] text-center font-sans text-base font-semibold text-brand-green"
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-11 w-11 items-center justify-center rounded-r-full font-sans text-lg text-brand-green transition-all duration-200 hover:bg-brand-gold/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
