import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Fallback de Suspense de la ficha del local (ver spec 019). Se muestra mientras
 * `page.tsx` trae lugar + reseñas + usuario. Replica la forma de la ficha (hero,
 * título, badge, botones, secciones) para minimizar el salto al llegar el
 * contenido. El botón de volver es real (es un Link estático).
 */
export default function LocalLoading() {
  return (
    <main className="min-h-screen pb-16" aria-busy aria-label="Cargando local">
      {/* Top bar — botón volver real */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-3">
        <Link
          href="/"
          aria-label="Volver"
          className="inline-flex items-center justify-center size-9 rounded-full backdrop-blur-sm transition-opacity hover:opacity-80"
          style={{ background: "rgba(20,16,13,0.7)", color: "var(--fg)" }}
        >
          <ChevronLeft size={20} />
        </Link>
      </div>

      {/* Hero fantasma — misma proporción que la imagen real */}
      <div
        className="relative w-full skeleton-block"
        style={{ aspectRatio: "16/9", maxHeight: "260px" }}
      />

      <div className="px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Head */}
        <div className="pt-5 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="h-3 w-32 rounded skeleton-block" />
          <div className="mt-3 h-9 w-3/4 rounded skeleton-block" />
          <div className="mt-3 h-4 w-40 rounded skeleton-block" />
        </div>

        {/* Botones de acción fantasma */}
        <div className="flex gap-2 pt-4 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="flex-1 h-11 rounded-button skeleton-block" />
          <div className="flex-1 h-11 rounded-button skeleton-block" />
        </div>

        {/* Secciones fantasma */}
        <SeccionSkeleton lineas={3} />
        <SeccionSkeleton lineas={2} />
      </div>
    </main>
  );
}

function SeccionSkeleton({ lineas }: { lineas: number }) {
  return (
    <section className="pt-5 pb-4 mt-1" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="h-3 w-24 rounded skeleton-block mb-4" />
      <div className="space-y-2">
        {Array.from({ length: lineas }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded skeleton-block" />
        ))}
      </div>
    </section>
  );
}
