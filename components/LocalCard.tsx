import Image from "next/image";
import Link from "next/link";
import { BadgeEstado } from "./BadgeEstado";
import { formatearDistancia } from "@/lib/distancia";

export type LocalCardData = {
  slug: string;
  nombre: string;
  imagen_principal: string | null;
  categoria_nombre: string | null;
  categoria_emoji: string | null;
  barrio: string | null;
  abierto: boolean;
  detalleHorario: string | null;
  distanciaKm: number | null;
  ratingPromedio: number | null;
  ratingCount: number;
};

export function LocalCard({
  data,
  priority,
}: {
  data: LocalCardData;
  priority?: boolean;
}) {
  const distLabel =
    data.distanciaKm !== null
      ? formatearDistancia(data.distanciaKm)
      : data.barrio ?? null;

  return (
    <Link
      href={`/local/${data.slug}`}
      className="group flex items-center gap-4 py-4 row-sep transition-opacity active:opacity-70 animate-fade-in-up"
    >
      {/* Thumb */}
      <div className="relative shrink-0 size-16 rounded-[10px] overflow-hidden bg-card-2">
        {data.imagen_principal ? (
          <Image
            src={data.imagen_principal}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-xl font-serif italic"
            style={{ color: "var(--fg-30)" }}
          >
            {data.nombre.charAt(0)}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className="font-serif italic text-[19px] leading-tight truncate"
            style={{ color: "var(--fg)" }}
          >
            {data.nombre}
          </h3>
          {distLabel && (
            <span
              className="font-mono text-[11px] shrink-0"
              style={{ color: "var(--fg-30)" }}
            >
              {distLabel}
            </span>
          )}
        </div>
        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: "var(--fg-50)" }}
        >
          {[data.categoria_nombre, data.barrio].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-1.5">
          <BadgeEstado abierto={data.abierto} detalleHorario={data.detalleHorario} />
        </div>
      </div>

      {/* Chevron */}
      <span className="text-xl shrink-0" style={{ color: "var(--fg-30)" }}>
        ›
      </span>
    </Link>
  );
}
