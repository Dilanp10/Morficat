import { listarCategoriasPublic, listarLugaresActivos } from "@/lib/lugares-public";
import { HomeListClient } from "@/components/HomeListClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [lugares, categorias] = await Promise.all([
    listarLugaresActivos(),
    listarCategoriasPublic(),
  ]);

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

      <HomeListClient lugares={lugares} categorias={categorias} />
    </main>
  );
}
