"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function SearchBar({
  value,
  onChange,
  autoFocus = false,
  placeholder = "Buscar lugar, categoría…",
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
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2"
        style={{ color: "var(--fg-30)" }}
      />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        className="w-full rounded-button pl-9 pr-9 py-3 text-sm outline-none transition-all"
        style={{
          background: "var(--card-2)",
          color: "var(--fg)",
          border: "1px solid var(--line)",
          fontFamily: "var(--font-sans)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "rgba(214,120,73,0.5)")
        }
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-opacity hover:opacity-80"
          style={{ color: "var(--fg-30)" }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
