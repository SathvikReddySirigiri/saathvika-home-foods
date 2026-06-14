type OptionButtonGroupProps<T extends string> = {
  label: string;
  name: string;
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function OptionButtonGroup<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: OptionButtonGroupProps<T>) {
  return (
    <fieldset>
      <legend className="font-serif text-base font-semibold text-brand-green">
        {label}
      </legend>
      <div className="mt-3 flex flex-col gap-2 min-[400px]:flex-row min-[400px]:flex-wrap">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border px-4 py-2.5 text-center font-sans text-sm transition-all duration-200 active:scale-[0.98] min-[400px]:w-auto ${
                selected
                  ? "border-brand-gold bg-brand-gold/15 font-medium text-brand-green shadow-gold-sm"
                  : "border-brand-gold/35 bg-white/70 text-brand-green/85 hover:border-brand-gold hover:bg-white"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
              {option.hint && (
                <span className="ml-1 text-brand-green/55">{option.hint}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
