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
      <div className="flex items-center gap-4 min-w-max pb-1 pt-1">
        <Chip active={soloAbiertos} onClick={onToggleAbiertos}>
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
              soloAbiertos ? "bg-moss" : "bg-moss/50"
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
          >
            {c.emoji && <span className="text-sm">{c.emoji}</span>}
            {c.nombre}
          </Chip>
        ))}

        <Chip active={atributosCount > 0} onClick={onOpenAvanzados}>
          <Sliders size={12} />
          Filtros {atributosCount > 0 && `· ${atributosCount}`}
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
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-serif italic transition-all duration-200 active:opacity-70"
      style={{
        color: active ? "var(--terra)" : "var(--fg-50)",
        textDecoration: active ? "underline" : "none",
        textUnderlineOffset: "3px",
        paddingBottom: "2px",
        background: "none",
        border: "none",
      }}
    >
      {children}
    </button>
  );
}
