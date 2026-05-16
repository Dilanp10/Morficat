import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { signInAction } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalid: "Email o contraseña incorrectos.",
  unverified: "Tu email todavía no fue verificado. Revisá tu casilla.",
  missing: "Completá email y contraseña.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  const errorMessage = ERRORS[searchParams.error ?? ""] ?? null;
  const redirectTo = searchParams.redirect ?? "/";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <Link
        href="/"
        className="self-start inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-6"
      >
        <ChevronLeft size={16} />
        Volver
      </Link>

      <form
        action={signInAction}
        className="w-full max-w-sm rounded-card border border-foreground/10 bg-card p-6"
      >
        <h1 className="text-2xl font-bold text-terracota">Iniciar sesión</h1>
        <p className="text-foreground/60 text-sm mt-1">
          Entrá para dejar reseñas y puntuar lugares.
        </p>

        <label htmlFor="email" className="mt-6 block text-sm text-foreground/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-button bg-muted px-3 py-2 text-foreground outline-none ring-1 ring-foreground/10 focus:ring-terracota"
        />

        <label
          htmlFor="password"
          className="mt-4 block text-sm text-foreground/60"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-button bg-muted px-3 py-2 text-foreground outline-none ring-1 ring-foreground/10 focus:ring-terracota"
        />

        <input type="hidden" name="redirect" value={redirectTo} />

        {errorMessage && (
          <p className="mt-3 text-sm text-danger">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-button bg-terracota px-4 py-2.5 font-medium text-white hover:bg-terracota-deep transition-colors"
        >
          Entrar
        </button>

        <p className="mt-4 text-center text-sm text-foreground/60">
          ¿No tenés cuenta?{" "}
          <Link href="/signup" className="text-terracota hover:underline">
            Crear una
          </Link>
        </p>
      </form>
    </main>
  );
}
