import {
  listarCategoriasPublic,
  listarLugaresActivos,
} from "@/lib/lugares-public";
import { HomeListClient } from "@/components/HomeListClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [lugares, categorias] = await Promise.all([
    listarLugaresActivos(),
    listarCategoriasPublic(),
  ]);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-terracota">MorfiCat</h1>
        <p className="text-white/60 text-sm">
          ¿Qué está abierto ahora en Catamarca?
        </p>
      </header>

      <HomeListClient lugares={lugares} categorias={categorias} />
    </main>
  );
}
