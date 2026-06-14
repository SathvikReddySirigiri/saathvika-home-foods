const AUTH_FLASH_KEY = "shf-auth-flash";

export function setAuthFlash(message: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_FLASH_KEY, message);
}

export function consumeAuthFlash(): string | null {
  if (typeof window === "undefined") return null;
  const message = sessionStorage.getItem(AUTH_FLASH_KEY);
  if (message) {
    sessionStorage.removeItem(AUTH_FLASH_KEY);
  }
  return message;
}
