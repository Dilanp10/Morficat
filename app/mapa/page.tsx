import nextDynamic from "next/dynamic";
import { listarLugaresActivos } from "@/lib/lugares-public";

export const dynamic = "force-dynamic";

const LocalMap = nextDynamic(() => import("@/components/LocalMap"), {
  ssr: false,
  loading: () => <MapaSkeleton />,
});

function MapaSkeleton() {
  return (
    <div
      className="h-[calc(100vh-80px)] w-full animate-pulse"
      style={{ background: "var(--card-2)" }}
    />
  );
}

export default async function MapaPage() {
  const lugares = await listarLugaresActivos();

  return (
    <main className="relative" style={{ height: "calc(100vh - 80px)" }}>
      {/* Overlay header */}
      <div
        className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-4 pb-3 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(27,22,18,0.85) 0%, transparent 100%)" }}
      >
        <div className="pointer-events-auto">
          <p className="text-section">Mapa.</p>
          <p
            className="font-mono text-[11px] mt-0.5"
            style={{ color: "var(--moss)" }}
          >
            {lugares.length} lugar{lugares.length === 1 ? "" : "es"} cargados
          </p>
        </div>
      </div>

      <LocalMap lugares={lugares} />
    </main>
  );
}
