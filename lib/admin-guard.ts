import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "./admin-auth";

export async function requireAdmin(): Promise<void> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD no configurado");
  }
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifyAdminToken(token, secret);
  if (!ok) {
    throw new Error("No autorizado");
  }
}
