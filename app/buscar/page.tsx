import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft size={16} />
        Volver
      </Link>

      <h1 className="text-2xl font-bold text-terracota mb-5">Buscar</h1>

      <HomeListClient
        lugares={lugares}
        categorias={categorias}
        autoFocusSearch
      />
    </main>
  );
}
