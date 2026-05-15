import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import {
  listarCategoriasPublic,
  listarLugaresActivos,
} from "@/lib/lugares-public";
import { HomeListClient } from "@/components/HomeListClient";

export const dynamic = "force-dynamic";

export default async function BuscarPage() {
  const [lugares, categorias] = await Promise.all([
    listarLugaresActivos(),
    listarCategoriasPublic(),
  ]);

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-x-4 sm:-inset-x-6 -top-2 h-40 bg-gradient-to-b from-terracota/15 via-terracota/5 to-transparent pointer-events-none"
        />
        <div className="relative pt-6 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-3"
          >
            <ChevronLeft size={16} />
            Volver
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-terracota leading-none flex items-center gap-2">
            <Search size={26} />
            Buscar
          </h1>
          <p className="text-white/70 mt-1.5 text-sm">
            Encontrá un lugar por nombre, categoría o tipo de comida.
          </p>
        </div>
      </div>

      <HomeListClient
        lugares={lugares}
        categorias={categorias}
        autoFocusSearch
      />
    </main>
  );
}
