"use client";

import { X } from "lucide-react";
import { ATRIBUTOS_LABELS } from "@/lib/constants";

export function FiltrosAvanzados({
  open,
  atributosOn,
  onChange,
  onClose,
}: {
  open: boolean;
  atributosOn: Set<string>;
  onChange: (set: Set<string>) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const toggle = (key: string) => {
    const next = new Set(atributosOn);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(next);
  };

  return (
    <div className="rounded-card border border-foreground/10 bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Filtros avanzados</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar filtros"
          className="text-foreground/35 hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Object.entries(ATRIBUTOS_LABELS).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={atributosOn.has(key)}
              onChange={() => toggle(key)}
              className="accent-terracota"
            />
            {label}
          </label>
        ))}
      </div>

      {atributosOn.size > 0 && (
        <button
          type="button"
          onClick={() => onChange(new Set())}
          className="mt-3 text-xs text-foreground/60 hover:text-foreground"
        >
          Limpiar atributos
        </button>
      )}
    </div>
  );
}
