import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "shf_admin_session";
const SESSION_DAYS = 7;

function getAdminPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) return undefined;
  return password;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createAdminSessionToken(): Promise<string> {
  const password = getAdminPassword();
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured or too short.");
  }
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expiresAt);
  const signature = await hmacSha256Hex(password, payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  const password = getAdminPassword();
  if (!password) return false;

  try {
    const [expiresStr, signature] = token.split(".");
    if (!expiresStr || !signature) return false;

    const expiresAt = Number(expiresStr);
    if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const expected = await hmacSha256Hex(password, expiresStr);
    return safeEqual(signature, expected);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  return safeEqual(password, expected);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function adminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
