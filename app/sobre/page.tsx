import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SobrePage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <Link
        href="/mas"
        className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-4"
      >
        <ChevronLeft size={16} />
        Volver
      </Link>

      <h1 className="text-2xl font-bold text-terracota mb-5">Sobre MorfiCat</h1>

      <div className="prose prose-invert max-w-none space-y-4 text-foreground/80">
        <p>
          <strong className="text-foreground">MorfiCat</strong> es una app
          hiperlocal de descubrimiento gastronómico para Catamarca. La hicimos
          para responder rápido a la pregunta más común cuando salís a comer o
          tomar algo: <em>¿qué está abierto ahora?</em>
        </p>

        <p>
          A diferencia de Google Maps, MorfiCat se enfoca exclusivamente en
          gastronomía catamarqueña, con información curada y verificada, y una
          experiencia móvil simple. Incluye locales chicos que muchas veces no
          tienen presencia digital.
        </p>

        <h2 className="text-lg font-semibold text-foreground pt-2">
          Estado actual
        </h2>
        <p>
          Esta es una versión de pruebas (MVP). Algunos datos provienen de
          fuentes públicas y todavía no fueron verificados directamente con los
          locales. Antes del lanzamiento público vamos a reemplazarlos por
          datos confirmados.
        </p>

        <h2 className="text-lg font-semibold text-foreground pt-2">Sumate</h2>
        <p>
          Si conocés un lugar que falta o ves información incorrecta, usá{" "}
          <Link href="/sugerir" className="text-terracota underline">
            Sugerir un local
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
