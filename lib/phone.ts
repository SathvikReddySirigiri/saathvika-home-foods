const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const PHONE_VALIDATION_ERROR =
  "Please enter a valid Indian mobile number";

export const PHONE_HELPER_TEXT =
  "We'll use this if we need to reach you about your order. Format: +91 XXXXX XXXXX or just 10 digits.";

/** Remove spaces, hyphens, parentheses, and dots. */
function stripSeparators(value: string): string {
  return value.replace(/[\s\-().]/g, "");
}

/** True if input contains characters other than digits, +, and common separators. */
function hasInvalidPhoneCharacters(input: string): boolean {
  return /[^0-9+\s\-().]/.test(input.trim());
}

/**
 * Normalize to 10-digit Indian mobile (no country code).
 * Strips +91 / 91 prefix and leading 0 from 11-digit local numbers.
 */
export function normalizeIndianMobileDigits(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  let working = stripSeparators(trimmed);

  if (working.startsWith("+91")) {
    working = working.slice(3);
  } else if (working.startsWith("+")) {
    working = working.slice(1);
  }

  let digits = working.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

/** Validate Indian mobile. Empty passes when optional is true. */
export function isValidIndianMobile(
  input: string,
  optional = false,
): boolean {
  const trimmed = input.trim();
  if (!trimmed) return optional;
  if (hasInvalidPhoneCharacters(trimmed)) return false;

  const digits = normalizeIndianMobileDigits(trimmed);
  return INDIAN_MOBILE_REGEX.test(digits);
}

/** Canonical storage format: +91XXXXXXXXXX (no spaces). */
export function normalizePhoneForStorage(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const digits = normalizeIndianMobileDigits(trimmed);
  if (!INDIAN_MOBILE_REGEX.test(digits)) {
    return trimmed;
  }

  return `+91${digits}`;
}

/** Display format while typing: +91 XXXXX XXXXX */
export function formatPhoneInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (hasInvalidPhoneCharacters(trimmed)) {
    return trimmed;
  }

  const stripped = stripSeparators(trimmed);

  if (stripped === "+") return "+";
  if (stripped === "+91") return "+91 ";

  let mobileDigits = "";

  if (stripped.startsWith("+91")) {
    mobileDigits = stripped.slice(3).replace(/\D/g, "");
  } else if (stripped.startsWith("+")) {
    const afterPlus = stripped.slice(1).replace(/\D/g, "");
    mobileDigits = afterPlus.startsWith("91")
      ? afterPlus.slice(2)
      : afterPlus;
  } else {
    mobileDigits = stripped.replace(/\D/g, "");
    if (mobileDigits.startsWith("91") && mobileDigits.length > 10) {
      mobileDigits = mobileDigits.slice(2);
    }
  }

  if (mobileDigits.length === 11 && mobileDigits.startsWith("0")) {
    mobileDigits = mobileDigits.slice(1);
  }

  mobileDigits = mobileDigits.slice(0, 10);

  if (mobileDigits.length === 0) {
    if (stripped.startsWith("+91")) return "+91 ";
    if (stripped.startsWith("+")) return "+";
    return "";
  }

  const prefix = "+91 ";
  if (mobileDigits.length <= 5) return prefix + mobileDigits;
  return `${prefix}${mobileDigits.slice(0, 5)} ${mobileDigits.slice(5)}`;
}

export function countPhoneDigits(value: string): number {
  return normalizeIndianMobileDigits(value).length;
}

/** @deprecated Use isValidIndianMobile — kept for call-site compatibility. */
export function isPhoneValid(value: string): boolean {
  return isValidIndianMobile(value, false);
}
