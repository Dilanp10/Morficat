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
    <div
      className="rounded-card p-4 animate-fade-in-up"
      style={{ background: "var(--card-bg)", border: "1px solid var(--line-2)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-section">Filtros</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar filtros"
          className="transition-opacity hover:opacity-70"
          style={{ color: "var(--fg-30)" }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 sm:grid-cols-3">
        {Object.entries(ATRIBUTOS_LABELS).map(([key, label]) => {
          const checked = atributosOn.has(key);
          return (
            <label
              key={key}
              className="flex items-center gap-2 text-sm cursor-pointer"
              style={{ color: checked ? "var(--terra)" : "var(--fg-50)" }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(key)}
                className="accent-terra"
                style={{ accentColor: "var(--terra)" }}
              />
              {label}
            </label>
          );
        })}
      </div>

      {atributosOn.size > 0 && (
        <button
          type="button"
          onClick={() => onChange(new Set())}
          className="mt-3 text-xs font-serif italic transition-opacity hover:opacity-80"
          style={{ color: "var(--fg-30)" }}
        >
          Limpiar atributos
        </button>
      )}
    </div>
  );
}
