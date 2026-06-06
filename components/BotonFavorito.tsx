"use client";

import { Heart } from "lucide-react";
import { useFavoritos } from "./FavoritosProvider";

/**
 * Botón ♥ para guardar/quitar un local de favoritos.
 *
 * - `card`: trailing affordance dentro de una LocalCard (sutil).
 * - `floating`: botón flotante sobre el hero de la ficha (estilo ShareButton).
 */
export function BotonFavorito({
  lugarId,
  variant = "card",
}: {
  lugarId: string;
  variant?: "card" | "floating";
}) {
  const { esFavorito, toggle, ready } = useFavoritos();
  const activo = ready && esFavorito(lugarId);

  const handleClick = (e: React.MouseEvent) => {
    // En la card, el botón vive sobre un Link overlay: cortamos la navegación.
    e.preventDefault();
    e.stopPropagation();
    toggle(lugarId);
  };

  const label = activo ? "Quitar de favoritos" : "Guardar en favoritos";

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={activo}
        aria-label={label}
        className="inline-flex items-center justify-center size-9 rounded-full backdrop-blur-sm transition-all active:scale-90"
        style={{
          background: "rgba(20,16,13,0.7)",
          color: activo ? "var(--terra)" : "var(--fg)",
        }}
      >
        <Heart
          size={18}
          style={{ fill: activo ? "currentColor" : "none" }}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={activo}
      aria-label={label}
      className="relative z-20 inline-flex items-center justify-center size-10 -mr-2 shrink-0 transition-transform active:scale-90"
      style={{ color: activo ? "var(--terra)" : "var(--fg-30)" }}
    >
      <Heart
        size={20}
        strokeWidth={activo ? 2 : 1.6}
        style={{ fill: activo ? "currentColor" : "none" }}
      />
    </button>
  );
}
