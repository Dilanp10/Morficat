"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function SearchBar({
  value,
  onChange,
  autoFocus = false,
  placeholder = "Buscar lugar, categoría o tipo de comida",
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/35"
      />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        className="w-full rounded-button bg-card pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-foreground/35 outline-none ring-1 ring-foreground/10 focus:ring-terracota"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-foreground/35 hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
