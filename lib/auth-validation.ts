import { isValidIndianMobile } from "@/lib/phone";

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidOptionalPhone(value: string): boolean {
  return isValidIndianMobile(value, true);
}

export function getPasswordStrengthHint(password: string): {
  label: string;
  tone: "muted" | "warn" | "good";
} {
  if (password.length === 0) {
    return { label: "At least 8 characters", tone: "muted" };
  }
  if (password.length < 8) {
    return { label: "Too short — need 8+ characters", tone: "warn" };
  }
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  if (hasNumber && hasLetter) {
    return { label: "Good strength", tone: "good" };
  }
  return { label: "Add letters and numbers for a stronger password", tone: "warn" };
}
