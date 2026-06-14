import { isValidIndianState } from "@/lib/india-states";
import {
  emptyDeliveryDetails,
  formatDeliveryAddressLine,
  type DeliveryDetails,
} from "@/lib/order-message";
import {
  formatPhoneInput,
  isValidIndianMobile,
  normalizePhoneForStorage,
  PHONE_VALIDATION_ERROR,
} from "@/lib/phone";

export {
  formatPhoneInput,
  isPhoneValid,
  normalizePhoneForStorage,
  countPhoneDigits,
} from "@/lib/phone";

export const DELIVERY_STORAGE_KEY = "shf-delivery-details";

export type DeliveryFieldKey =
  | "name"
  | "phone"
  | "addressFlat"
  | "addressStreet"
  | "addressCity"
  | "addressState"
  | "addressPincode";

export type DeliveryFieldErrors = Partial<Record<DeliveryFieldKey, string>>;

export const DELIVERY_FIELD_ORDER: DeliveryFieldKey[] = [
  "name",
  "phone",
  "addressFlat",
  "addressStreet",
  "addressCity",
  "addressState",
  "addressPincode",
];

export function isPincodeValid(value: string): boolean {
  return /^\d{6}$/.test(value.trim());
}

export function formatPincodeInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 6);
}

export type NormalizedDeliveryDetails = DeliveryDetails & {
  /** Concatenated single-line address for delivery_address column. */
  address: string;
};

export function normalizeDeliveryForSubmit(
  details: DeliveryDetails,
): NormalizedDeliveryDetails {
  const normalized: DeliveryDetails = {
    name: details.name.trim(),
    phone: normalizePhoneForStorage(details.phone),
    addressFlat: details.addressFlat.trim(),
    addressStreet: details.addressStreet.trim(),
    addressCity: details.addressCity.trim(),
    addressState: details.addressState.trim(),
    addressPincode: details.addressPincode.trim(),
  };

  return {
    ...normalized,
    address: formatDeliveryAddressLine(normalized),
  };
}

export function getDeliveryFieldErrors(
  details: DeliveryDetails,
): DeliveryFieldErrors {
  const errors: DeliveryFieldErrors = {};

  if (!details.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!isValidIndianMobile(details.phone, false)) {
    errors.phone = PHONE_VALIDATION_ERROR;
  }

  if (!details.addressFlat.trim()) {
    errors.addressFlat = "Please enter your flat or house number.";
  }

  if (!details.addressStreet.trim()) {
    errors.addressStreet = "Please enter your street or area.";
  }

  if (!details.addressCity.trim()) {
    errors.addressCity = "Please enter your city.";
  }

  if (!details.addressState.trim()) {
    errors.addressState = "Please select your state.";
  } else if (!isValidIndianState(details.addressState)) {
    errors.addressState = "Please select your state.";
  }

  if (!details.addressPincode.trim()) {
    errors.addressPincode = "Pincode must be 6 digits";
  } else if (!isPincodeValid(details.addressPincode)) {
    errors.addressPincode = "Pincode must be 6 digits";
  }

  return errors;
}

export function isDeliveryFormValid(details: DeliveryDetails): boolean {
  return Object.keys(getDeliveryFieldErrors(details)).length === 0;
}

function isDeliveryDetailsShape(
  parsed: Partial<DeliveryDetails & { address?: string }>,
): parsed is DeliveryDetails {
  return (
    typeof parsed.name === "string" &&
    typeof parsed.phone === "string" &&
    typeof parsed.addressFlat === "string" &&
    typeof parsed.addressStreet === "string" &&
    typeof parsed.addressCity === "string" &&
    typeof parsed.addressState === "string" &&
    typeof parsed.addressPincode === "string"
  );
}

export function loadSavedDeliveryDetails(): DeliveryDetails | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<
      DeliveryDetails & { address?: string }
    >;

    if (isDeliveryDetailsShape(parsed)) {
      return {
        ...parsed,
        phone: parsed.phone ? formatPhoneInput(parsed.phone) : "",
        addressPincode: formatPincodeInput(parsed.addressPincode),
      };
    }

    if (
      typeof parsed.name === "string" &&
      typeof parsed.phone === "string" &&
      typeof parsed.address === "string"
    ) {
      return {
        ...emptyDeliveryDetails,
        name: parsed.name,
        phone: parsed.phone ? formatPhoneInput(parsed.phone) : "",
        addressFlat: parsed.address,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function saveDeliveryDetails(details: DeliveryDetails): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(details));
}

export function clearSavedDeliveryDetails(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(DELIVERY_STORAGE_KEY);
}

export function shouldShowFieldError(
  field: DeliveryFieldKey,
  errors: DeliveryFieldErrors,
  touched: Partial<Record<DeliveryFieldKey, boolean>>,
  details: DeliveryDetails,
): boolean {
  if (!errors[field]) return false;
  if (touched[field]) return true;

  if (field === "phone" && details.phone.trim().length > 0) {
    return true;
  }

  if (field === "addressPincode" && details.addressPincode.length > 0) {
    return true;
  }

  return false;
}
