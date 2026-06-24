import { LocalCardSkeletonList } from "@/components/LocalCardSkeleton";

/**
 * Fallback de Suspense del Home (ver spec 019). El servidor lo muestra al
 * instante mientras `page.tsx` hace el fetch a Supabase. Reproduce el encabezado
 * estático real (no depende de datos) para que la transición al contenido sea
 * continua, y abajo una barra de búsqueda fantasma + lista de cards skeleton.
 */
export default function HomeLoading() {
  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6">
      <header className="pt-8 pb-4">
        <p className="text-section mb-2">Catamarca · ahora</p>
        <h1
          className="font-serif italic leading-none"
          style={{ fontSize: "clamp(2.5rem,10vw,3.5rem)", color: "var(--terra)" }}
        >
          Haku.
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--fg-50)", fontFamily: "var(--font-sans)" }}
        >
          ¿Qué está abierto ahora?
        </p>
      </header>

      <div className="space-y-4" aria-busy aria-label="Cargando">
        {/* Barra de búsqueda fantasma */}
        <div className="h-11 w-full rounded-button skeleton-block" />
        {/* Fila de chips de filtro fantasma */}
        <div className="flex gap-2">
          <div className="h-8 w-28 rounded-pill skeleton-block" />
          <div className="h-8 w-20 rounded-pill skeleton-block" />
          <div className="h-8 w-24 rounded-pill skeleton-block" />
        </div>
        <LocalCardSkeletonList count={6} />
      </div>
    </main>
  );
}
