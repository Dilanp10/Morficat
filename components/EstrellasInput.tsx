"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export function EstrellasInput({
  name,
  defaultValue = 0,
}: {
  name: string;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHover(0)}
    >
      <input type="hidden" name={name} value={value} />
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} estrella${n === 1 ? "" : "s"}`}
          onClick={() => setValue(n)}
          onMouseEnter={() => setHover(n)}
          className="p-1 rounded-button hover:bg-muted transition-colors"
        >
          <Star
            size={26}
            className={
              n <= display
                ? "fill-terracota text-terracota"
                : "text-foreground/25"
            }
            strokeWidth={1.5}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-foreground/60 w-20">
        {value > 0 ? `${value} de 5` : "Tocá una estrella"}
      </span>
    </div>
  );
}
