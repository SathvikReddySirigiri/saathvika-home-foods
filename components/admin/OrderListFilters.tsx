"use client";

import { useRouter } from "next/navigation";

type OrderListFiltersProps = {
  cities: string[];
  states: string[];
  selectedCity?: string;
  selectedState?: string;
};

export function OrderListFilters({
  cities,
  states,
  selectedCity,
  selectedState,
}: OrderListFiltersProps) {
  const router = useRouter();

  const updateFilters = (city: string, state: string) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    const query = params.toString();
    router.push(query ? `/admin?${query}` : "/admin");
  };

  if (cities.length === 0 && states.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-brand-gold/20 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[10rem] flex-1">
        <label
          htmlFor="filter-state"
          className="block font-sans text-xs font-medium text-brand-green/60"
        >
          Filter by state
        </label>
        <select
          id="filter-state"
          value={selectedState ?? ""}
          onChange={(e) =>
            updateFilters(selectedCity ?? "", e.target.value)
          }
          className="mt-1 w-full rounded-lg border border-brand-gold/35 bg-brand-cream px-3 py-2 font-sans text-sm text-brand-green outline-none focus:border-brand-gold"
        >
          <option value="">All states</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[10rem] flex-1">
        <label
          htmlFor="filter-city"
          className="block font-sans text-xs font-medium text-brand-green/60"
        >
          Filter by city
        </label>
        <select
          id="filter-city"
          value={selectedCity ?? ""}
          onChange={(e) =>
            updateFilters(e.target.value, selectedState ?? "")
          }
          className="mt-1 w-full rounded-lg border border-brand-gold/35 bg-brand-cream px-3 py-2 font-sans text-sm text-brand-green outline-none focus:border-brand-gold"
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {(selectedCity || selectedState) && (
        <button
          type="button"
          onClick={() => updateFilters("", "")}
          className="font-sans text-sm text-brand-green/70 underline-offset-2 hover:text-brand-gold hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
