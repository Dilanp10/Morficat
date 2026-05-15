// Web Crypto only — runs en Edge runtime (middleware) y Node (server actions).
// Token: `<expEpochSeconds>.<base64url(HMAC-SHA256(secret, expEpochSeconds))>`
// El secret es ADMIN_PASSWORD: si la contraseña rota, todas las sesiones se invalidan.

const SESSION_DAYS = 7;
export const ADMIN_COOKIE_NAME = "morficat_admin";

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64url(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function issueAdminToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 24 * 60 * 60;
  const expStr = String(exp);
  const sig = await hmac(secret, expStr);
  return `${expStr}.${sig}`;
}

export async function verifyAdminToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp)) return false;
  if (Math.floor(Date.now() / 1000) >= exp) return false;
  const expected = await hmac(secret, expStr);
  return timingSafeEqual(sig, expected);
}

export function getAdminSessionMaxAgeSeconds(): number {
  return SESSION_DAYS * 24 * 60 * 60;
}
