"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  type Ref,
  type ReactNode,
} from "react";
import {
  clearSavedDeliveryDetails,
  DELIVERY_FIELD_ORDER,
  formatPhoneInput,
  formatPincodeInput,
  getDeliveryFieldErrors,
  isDeliveryFormValid,
  loadSavedDeliveryDetails,
  saveDeliveryDetails,
  shouldShowFieldError,
  type DeliveryFieldKey,
} from "@/lib/delivery-form";
import { INDIAN_STATES_AND_UTS } from "@/lib/india-states";
import { PHONE_HELPER_TEXT } from "@/lib/phone";
import { emptyDeliveryDetails, type DeliveryDetails } from "@/lib/order-message";

type TouchedFields = Partial<Record<DeliveryFieldKey, boolean>>;

export type DeliveryDetailsFormHandle = {
  scrollToFirstInvalid: () => void;
  getDetails: () => DeliveryDetails;
  isValid: () => boolean;
  clearSaved: () => void;
};

type DeliveryDetailsFormProps = {
  value: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
  onValidityChange?: (valid: boolean) => void;
  profilePrefill?: { name?: string | null; phone?: string | null };
};

const fieldInputClass =
  "mt-1.5 w-full rounded-xl border bg-brand-cream px-3 py-2.5 font-sans text-brand-green outline-none transition-colors focus:ring-2";

function fieldBorderClass(hasError: boolean): string {
  if (hasError) {
    return `${fieldInputClass} border-brand-red/50 focus:border-brand-red focus:ring-brand-red/20`;
  }
  return `${fieldInputClass} border-brand-gold/35 focus:border-brand-gold focus:ring-brand-gold/25`;
}

function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-sans text-sm font-medium text-brand-green">
      {children}{" "}
      <span className="font-normal text-brand-green/45">Required</span>
    </span>
  );
}

export const DeliveryDetailsForm = forwardRef(function DeliveryDetailsForm(
  { value, onChange, onValidityChange, profilePrefill }: DeliveryDetailsFormProps,
  ref: Ref<DeliveryDetailsFormHandle>,
) {
  const [touched, setTouched] = useState<TouchedFields>({});
  const [hydrated, setHydrated] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressFlatRef = useRef<HTMLInputElement>(null);
  const addressStreetRef = useRef<HTMLInputElement>(null);
  const addressCityRef = useRef<HTMLInputElement>(null);
  const addressStateRef = useRef<HTMLSelectElement>(null);
  const addressPincodeRef = useRef<HTMLInputElement>(null);

  const fieldRefs: Record<
    DeliveryFieldKey,
    React.RefObject<HTMLInputElement | HTMLSelectElement | null>
  > = {
    name: nameRef,
    phone: phoneRef,
    addressFlat: addressFlatRef,
    addressStreet: addressStreetRef,
    addressCity: addressCityRef,
    addressState: addressStateRef,
    addressPincode: addressPincodeRef,
  };

  const errors = getDeliveryFieldErrors(value);
  const valid = isDeliveryFormValid(value);

  useEffect(() => {
    onValidityChange?.(valid);
  }, [valid, onValidityChange]);

  useEffect(() => {
    const saved = loadSavedDeliveryDetails();
    let next = saved ?? { ...emptyDeliveryDetails };

    if (profilePrefill) {
      next = {
        ...next,
        name: next.name.trim() ? next.name : profilePrefill.name?.trim() ?? "",
        phone: next.phone.trim()
          ? next.phone
          : profilePrefill.phone
            ? formatPhoneInput(profilePrefill.phone)
            : "",
      };
    }

    if (saved || profilePrefill) {
      onChange(next);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilePrefill?.name, profilePrefill?.phone]);

  useEffect(() => {
    if (!hydrated) return;

    const timer = window.setTimeout(() => {
      saveDeliveryDetails(value);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [value, hydrated]);

  const markTouched = (field: DeliveryFieldKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const scrollToFirstInvalid = useCallback(() => {
    setTouched(
      Object.fromEntries(DELIVERY_FIELD_ORDER.map((key) => [key, true])) as Record<
        DeliveryFieldKey,
        boolean
      >,
    );

    const currentErrors = getDeliveryFieldErrors(value);

    for (const field of DELIVERY_FIELD_ORDER) {
      if (currentErrors[field]) {
        fieldRefs[field].current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        if (
          fieldRefs[field].current instanceof HTMLInputElement ||
          fieldRefs[field].current instanceof HTMLSelectElement
        ) {
          fieldRefs[field].current.focus();
        }
        break;
      }
    }
  }, [value, fieldRefs]);

  useImperativeHandle(ref, () => ({
    scrollToFirstInvalid,
    getDetails: () => value,
    isValid: () => isDeliveryFormValid(value),
    clearSaved: clearSavedDeliveryDetails,
  }));

  const updateField = (field: keyof DeliveryDetails, next: string) => {
    onChange({ ...value, [field]: next });
  };

  const showError = (field: DeliveryFieldKey) =>
    shouldShowFieldError(field, errors, touched, value);

  return (
    <section
      className="mt-10 rounded-2xl border border-brand-gold/30 bg-white/60 p-5 sm:p-6"
      aria-labelledby="delivery-heading"
    >
      <h2
        id="delivery-heading"
        className="font-serif text-xl font-semibold text-brand-green sm:text-2xl"
      >
        Where should we deliver?
      </h2>
      <p className="mt-1.5 font-sans text-sm text-brand-gold/90 sm:text-base">
        We make your order fresh and bring it to you — a few quick details:
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor="delivery-name" className="block">
            <RequiredLabel>Name</RequiredLabel>
            <input
              ref={nameRef}
              id="delivery-name"
              type="text"
              name="name"
              autoComplete="name"
              autoCapitalize="words"
              placeholder="e.g. Sahithi Reddy"
              value={value.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => markTouched("name")}
              aria-invalid={showError("name")}
              aria-describedby="delivery-name-help delivery-name-error"
              className={fieldBorderClass(showError("name"))}
            />
          </label>
          <p
            id="delivery-name-help"
            className="mt-1.5 font-sans text-xs text-brand-green/55"
          >
            Whoever should receive the package
          </p>
          {showError("name") && (
            <p
              id="delivery-name-error"
              className="mt-1 font-sans text-xs text-brand-red"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="delivery-phone" className="block">
            <RequiredLabel>Phone</RequiredLabel>
            <input
              ref={phoneRef}
              id="delivery-phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="76718 98163"
              value={value.phone}
              onChange={(e) =>
                updateField("phone", formatPhoneInput(e.target.value))
              }
              onBlur={() => markTouched("phone")}
              aria-invalid={showError("phone")}
              aria-describedby="delivery-phone-help delivery-phone-error"
              className={fieldBorderClass(showError("phone"))}
            />
          </label>
          <p
            id="delivery-phone-help"
            className="mt-1.5 font-sans text-xs text-brand-green/55"
          >
            {PHONE_HELPER_TEXT}
          </p>
          {showError("phone") && (
            <p
              id="delivery-phone-error"
              className="mt-1 font-sans text-xs text-brand-red"
              role="alert"
            >
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="my-8 border-t border-brand-gold/20 pt-8">
        <h3 className="font-serif text-lg font-semibold text-brand-green">
          Delivery address
        </h3>

        <div className="mt-6 space-y-6 md:grid md:grid-cols-2 md:gap-x-4 md:space-y-0 md:gap-y-6">
          <div className="md:col-span-2">
            <label htmlFor="delivery-flat" className="block">
              <RequiredLabel>Flat / House / Building number</RequiredLabel>
              <input
                ref={addressFlatRef}
                id="delivery-flat"
                type="text"
                name="addressFlat"
                autoComplete="address-line1"
                placeholder="e.g. Plot 23, Sahithi Apartments, Flat 302"
                value={value.addressFlat}
                onChange={(e) => updateField("addressFlat", e.target.value)}
                onBlur={() => markTouched("addressFlat")}
                aria-invalid={showError("addressFlat")}
                aria-describedby="delivery-flat-help delivery-flat-error"
                className={fieldBorderClass(showError("addressFlat"))}
              />
            </label>
            <p
              id="delivery-flat-help"
              className="mt-1.5 font-sans text-xs text-brand-green/55"
            >
              Door number, building, floor — be as specific as possible
            </p>
            {showError("addressFlat") && (
              <p
                id="delivery-flat-error"
                className="mt-1 font-sans text-xs text-brand-red"
                role="alert"
              >
                {errors.addressFlat}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="delivery-street" className="block">
              <RequiredLabel>Street / Area / Locality</RequiredLabel>
              <input
                ref={addressStreetRef}
                id="delivery-street"
                type="text"
                name="addressStreet"
                autoComplete="address-line2"
                placeholder="e.g. Jubilee Hills, Road No. 5"
                value={value.addressStreet}
                onChange={(e) => updateField("addressStreet", e.target.value)}
                onBlur={() => markTouched("addressStreet")}
                aria-invalid={showError("addressStreet")}
                aria-describedby="delivery-street-help delivery-street-error"
                className={fieldBorderClass(showError("addressStreet"))}
              />
            </label>
            <p
              id="delivery-street-help"
              className="mt-1.5 font-sans text-xs text-brand-green/55"
            >
              Street name, landmark, neighborhood
            </p>
            {showError("addressStreet") && (
              <p
                id="delivery-street-error"
                className="mt-1 font-sans text-xs text-brand-red"
                role="alert"
              >
                {errors.addressStreet}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="delivery-city" className="block">
              <RequiredLabel>City</RequiredLabel>
              <input
                ref={addressCityRef}
                id="delivery-city"
                type="text"
                name="addressCity"
                autoComplete="address-level2"
                placeholder="e.g. Hyderabad"
                value={value.addressCity}
                onChange={(e) => updateField("addressCity", e.target.value)}
                onBlur={() => markTouched("addressCity")}
                aria-invalid={showError("addressCity")}
                aria-describedby="delivery-city-error"
                className={fieldBorderClass(showError("addressCity"))}
              />
            </label>
            {showError("addressCity") && (
              <p
                id="delivery-city-error"
                className="mt-1 font-sans text-xs text-brand-red"
                role="alert"
              >
                {errors.addressCity}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="delivery-state" className="block">
              <RequiredLabel>State</RequiredLabel>
              <select
                ref={addressStateRef}
                id="delivery-state"
                name="addressState"
                autoComplete="address-level1"
                value={value.addressState}
                onChange={(e) => updateField("addressState", e.target.value)}
                onBlur={() => markTouched("addressState")}
                aria-invalid={showError("addressState")}
                aria-describedby="delivery-state-error"
                className={fieldBorderClass(showError("addressState"))}
              >
                <option value="">Select state</option>
                {INDIAN_STATES_AND_UTS.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>
            {showError("addressState") && (
              <p
                id="delivery-state-error"
                className="mt-1 font-sans text-xs text-brand-red"
                role="alert"
              >
                {errors.addressState}
              </p>
            )}
          </div>

          <div className="md:col-span-1">
            <label htmlFor="delivery-pincode" className="block">
              <RequiredLabel>Pincode</RequiredLabel>
              <input
                ref={addressPincodeRef}
                id="delivery-pincode"
                type="text"
                name="addressPincode"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="500033"
                maxLength={6}
                value={value.addressPincode}
                onChange={(e) =>
                  updateField(
                    "addressPincode",
                    formatPincodeInput(e.target.value),
                  )
                }
                onBlur={() => markTouched("addressPincode")}
                aria-invalid={showError("addressPincode")}
                aria-describedby="delivery-pincode-help delivery-pincode-error"
                className={fieldBorderClass(showError("addressPincode"))}
              />
            </label>
            <p
              id="delivery-pincode-help"
              className="mt-1.5 font-sans text-xs text-brand-green/55"
            >
              6-digit Indian postal code
            </p>
            {showError("addressPincode") && (
              <p
                id="delivery-pincode-error"
                className="mt-1 font-sans text-xs text-brand-red"
                role="alert"
              >
                {errors.addressPincode}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-start gap-2 font-sans text-xs leading-relaxed text-brand-green/55">
        <svg
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold/80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 118 0v3" strokeLinecap="round" />
        </svg>
        <span>
          We only use these details to deliver your order. We never share or
          sell your information.
        </span>
      </p>
    </section>
  );
});
