import { Sparkles } from "lucide-react";
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
    <main className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-x-4 sm:-inset-x-6 -top-2 h-44 bg-gradient-to-b from-terracota/15 via-terracota/5 to-transparent pointer-events-none"
        />
        <header className="relative pt-6 pb-5">
          <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-terracota-soft mb-2">
            <Sparkles size={11} />
            Catamarca
          </div>
          <h1 className="text-4xl font-black tracking-tight text-terracota leading-none">
            MorfiCat
          </h1>
          <p className="text-white/70 mt-1.5 text-[15px]">
            ¿Qué está abierto ahora?
          </p>
        </header>
      </div>

      <div className="pb-2">
        <HomeListClient lugares={lugares} categorias={categorias} />
      </div>
    </main>
  );
}
