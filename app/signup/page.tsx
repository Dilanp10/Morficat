import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { signUpAction } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  name: "El nombre debe tener entre 2 y 40 caracteres.",
  email: "Ese email no parece válido.",
  password: "La contraseña tiene que tener al menos 8 caracteres.",
  exists: "Ya existe una cuenta con ese email. Probá iniciar sesión.",
  unknown: "No pudimos crear tu cuenta. Probá de nuevo en un rato.",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessage = ERRORS[searchParams.error ?? ""] ?? null;

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
        action={signUpAction}
        className="w-full max-w-sm rounded-card border border-foreground/10 bg-card p-6"
      >
        <h1 className="text-2xl font-bold text-terracota">Crear cuenta</h1>
        <p className="text-foreground/60 text-sm mt-1">
          Necesario para dejar reseñas. Te mandamos un email para confirmar.
        </p>

        <label
          htmlFor="display_name"
          className="mt-6 block text-sm text-foreground/60"
        >
          Nombre (cómo te van a ver los demás)
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={40}
          className="mt-2 w-full rounded-button bg-muted px-3 py-2 text-foreground outline-none ring-1 ring-foreground/10 focus:ring-terracota"
        />

        <label htmlFor="email" className="mt-4 block text-sm text-foreground/60">
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
          Contraseña{" "}
          <span className="text-foreground/35">(mínimo 8 caracteres)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-2 w-full rounded-button bg-muted px-3 py-2 text-foreground outline-none ring-1 ring-foreground/10 focus:ring-terracota"
        />

        {errorMessage && (
          <p className="mt-3 text-sm text-danger">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-button bg-terracota px-4 py-2.5 font-medium text-white hover:bg-terracota-deep transition-colors"
        >
          Crear cuenta
        </button>

        <p className="mt-4 text-center text-sm text-foreground/60">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-terracota hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
