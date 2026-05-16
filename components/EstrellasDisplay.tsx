import { Star } from "lucide-react";

export function EstrellasDisplay({
  puntuacion,
  size = 14,
}: {
  puntuacion: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={
            n <= puntuacion
              ? "fill-terracota text-terracota"
              : "text-foreground/20"
          }
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
