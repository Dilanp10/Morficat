import nextDynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { listarLugaresActivos } from "@/lib/lugares-public";

export const dynamic = "force-dynamic";

const LocalMap = nextDynamic(() => import("@/components/LocalMap"), {
  ssr: false,
  loading: () => <MapaSkeleton />,
});

function MapaSkeleton() {
  return (
    <div className="h-[calc(100vh-9rem)] w-full rounded-card bg-card animate-pulse" />
  );
}

export default async function MapaPage() {
  const lugares = await listarLugaresActivos();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
        >
          <ChevronLeft size={16} />
          Volver
        </Link>
        <span className="text-xs text-foreground/35">
          {lugares.length} lugar{lugares.length === 1 ? "" : "es"}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-terracota mb-4">Mapa</h1>

      <LocalMap lugares={lugares} />
    </main>
  );
}
