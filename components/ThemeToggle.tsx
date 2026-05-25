"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "./ThemeProvider";

const OPTIONS: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Tema visual"
      className="inline-flex rounded-pill p-1 gap-1"
      style={{ border: "1px solid var(--line-2)", background: "var(--card-2)" }}
    >
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(o.value)}
            className="inline-flex items-center gap-1.5 rounded-pill px-4 py-1.5 text-sm font-serif italic transition-all"
            style={{
              background: active ? "var(--terra)" : "transparent",
              color: active ? "var(--bg)" : "var(--fg-50)",
            }}
          >
            <Icon size={14} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
