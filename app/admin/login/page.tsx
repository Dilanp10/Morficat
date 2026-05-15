import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  getAdminSessionMaxAgeSeconds,
  issueAdminToken,
} from "@/lib/admin-auth";

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");
  const secret = process.env.ADMIN_PASSWORD;

  if (!secret) {
    redirect("/admin/login?error=config");
  }

  if (password !== secret) {
    redirect("/admin/login?error=invalid");
  }

  const token = await issueAdminToken(secret!);
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminSessionMaxAgeSeconds(),
  });

  const safeRedirect = redirectTo.startsWith("/admin") ? redirectTo : "/admin";
  redirect(safeRedirect);
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  const errorMessage =
    searchParams.error === "invalid"
      ? "Contraseña incorrecta."
      : searchParams.error === "config"
        ? "El servidor no tiene ADMIN_PASSWORD configurado."
        : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <Link
        href="/"
        className="self-start inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"
      >
        <ChevronLeft size={16} />
        Volver a MorfiCat
      </Link>

      <form
        action={loginAction}
        className="w-full max-w-sm rounded-card border border-white/10 bg-bg-elevated p-6"
      >
        <h1 className="text-2xl font-bold text-terracota">MorfiCat · Admin</h1>
        <p className="text-white/60 text-sm mt-1">
          Ingresá la contraseña para administrar lugares.
        </p>

        <label
          htmlFor="password"
          className="mt-6 block text-sm text-white/60"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-button bg-bg-tertiary px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-terracota"
        />

        <input
          type="hidden"
          name="redirect"
          value={searchParams.redirect ?? "/admin"}
        />

        {errorMessage && (
          <p className="mt-3 text-sm text-danger">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-button bg-terracota px-4 py-2 font-medium text-white hover:bg-terracota-deep transition-colors"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
