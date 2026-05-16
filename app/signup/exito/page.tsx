import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function SignupExitoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm rounded-card border border-foreground/10 bg-card p-6 text-center">
        <div className="mx-auto mb-3 inline-flex items-center justify-center size-14 rounded-pill bg-success/15 text-success">
          <MailCheck size={24} />
        </div>
        <h1 className="text-xl font-bold text-foreground">¡Casi listo!</h1>
        <p className="text-foreground/70 text-sm mt-2">
          Te mandamos un email para confirmar tu cuenta. Tocá el link del email
          y vas a poder reseñar lugares.
        </p>
        <p className="text-foreground/35 text-xs mt-3">
          Revisá también la carpeta de spam si no lo ves en bandeja de entrada.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-button border border-foreground/10 px-4 py-2 text-sm text-foreground/80 hover:bg-muted transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
