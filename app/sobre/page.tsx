import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SobrePage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <Link
        href="/mas"
        className="inline-flex items-center gap-1 text-sm mb-4 transition-opacity hover:opacity-80"
        style={{ color: "var(--fg-50)" }}
      >
        <ChevronLeft size={16} />
        Volver
      </Link>

      <p className="text-section mb-2">Catamarca · gastronomía</p>
      <h1
        className="font-serif italic leading-none mb-1"
        style={{ fontSize: "clamp(2rem,8vw,2.75rem)", color: "var(--terra)" }}
      >
        Sobre Haku.
      </h1>
      <p
        className="font-mono text-[11px] tracking-widest uppercase mb-6"
        style={{ color: "var(--fg-30)" }}
      >
        VAMOS · QUECHUA
      </p>

      <div
        className="space-y-4 text-sm leading-relaxed"
        style={{ color: "var(--fg-70)" }}
      >
        <p>
          <strong style={{ color: "var(--fg)" }}>Haku</strong> es una app
          hiperlocal de descubrimiento gastronómico para Catamarca. La hicimos
          para responder rápido a la pregunta más común cuando salís a comer o
          tomar algo: <em>¿qué está abierto ahora?</em>
        </p>

        <p>
          El nombre viene del quechua, la lengua que se habló en estas tierras
          antes de que Catamarca fuera Catamarca. <em>Haku</em> significa
          &ldquo;vamos&rdquo; — porque eso es exactamente lo que hace la app: te
          ayuda a decidir adónde ir.
        </p>

        <p>
          A diferencia de Google Maps, Haku se enfoca exclusivamente en
          gastronomía catamarqueña, con información curada y verificada, y una
          experiencia móvil simple. Incluye locales chicos que muchas veces no
          tienen presencia digital.
        </p>

        <h2 className="text-section pt-4">— Estado actual —</h2>
        <p>
          Esta es una versión de pruebas (MVP). Algunos datos provienen de
          fuentes públicas y todavía no fueron verificados directamente con los
          locales. Antes del lanzamiento público vamos a reemplazarlos por
          datos confirmados.
        </p>

        <h2 className="text-section pt-4">— Sumate —</h2>
        <p>
          Si conocés un lugar que falta o ves información incorrecta, usá{" "}
          <Link
            href="/sugerir"
            className="underline transition-opacity hover:opacity-80"
            style={{ color: "var(--terra)" }}
          >
            Sugerir un local
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
