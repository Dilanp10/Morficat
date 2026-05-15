"use client";

import { Sliders } from "lucide-react";
import type { CategoriaPublic } from "@/lib/lugares-public";

export function FiltrosChips({
  soloAbiertos,
  onToggleAbiertos,
  categoriaSlug,
  onSelectCategoria,
  categorias,
  atributosCount,
  onOpenAvanzados,
}: {
  soloAbiertos: boolean;
  onToggleAbiertos: () => void;
  categoriaSlug: string | null;
  onSelectCategoria: (slug: string | null) => void;
  categorias: CategoriaPublic[];
  atributosCount: number;
  onOpenAvanzados: () => void;
}) {
  return (
    <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max pb-1">
        <Chip
          active={soloAbiertos}
          onClick={onToggleAbiertos}
          activeColor="terracota"
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              soloAbiertos ? "bg-white" : "bg-success"
            }`}
          />
          Abierto ahora
        </Chip>

        {categorias.map((c) => (
          <Chip
            key={c.slug}
            active={categoriaSlug === c.slug}
            onClick={() =>
              onSelectCategoria(categoriaSlug === c.slug ? null : c.slug)
            }
            activeColor="terracota"
          >
            {c.emoji && <span>{c.emoji}</span>}
            {c.nombre}
          </Chip>
        ))}

        <Chip active={atributosCount > 0} onClick={onOpenAvanzados}>
          <Sliders size={12} />
          Más {atributosCount > 0 && `· ${atributosCount}`}
        </Chip>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  activeColor?: "terracota";
  children: React.ReactNode;
}) {
  const cls = active
    ? "bg-gradient-to-br from-terracota to-terracota-deep text-white ring-1 ring-terracota/40"
    : "bg-bg-elevated text-white/60 ring-1 ring-white/10 hover:text-white hover:ring-white/20";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${cls}`}
    >
      {children}
    </button>
  );
}
