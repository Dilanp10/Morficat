import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
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
};

export function LocalCard({
  data,
  priority,
}: {
  data: LocalCardData;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/local/${data.slug}`}
      className="group flex gap-3 rounded-card border border-foreground/10 bg-card p-3 transition-all duration-200 hover:bg-muted hover:border-terracota/40 active:scale-[0.99] animate-fade-in-up"
    >
      <div className="relative shrink-0 size-20 sm:size-24 overflow-hidden rounded-button bg-muted group-hover:ring-1 group-hover:ring-terracota/30 transition-shadow">
        {data.imagen_principal ? (
          <Image
            src={data.imagen_principal}
            alt=""
            fill
            sizes="(min-width: 640px) 96px, 80px"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-foreground/35">
            {data.categoria_emoji ?? "🍽️"}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate group-hover:text-terracota-soft transition-colors">
          {data.nombre}
        </h3>
        <p className="text-xs text-foreground/60 mt-0.5 truncate">
          {[data.categoria_nombre, data.barrio].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <BadgeEstado abierto={data.abierto} />
          {data.detalleHorario && (
            <span className="text-xs text-foreground/60">{data.detalleHorario}</span>
          )}
          {(data.distanciaKm !== null || data.barrio) && (
            <span className="inline-flex items-center gap-1 text-xs text-foreground/60">
              <MapPin size={12} />
              {data.distanciaKm !== null
                ? formatearDistancia(data.distanciaKm)
                : data.barrio}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
