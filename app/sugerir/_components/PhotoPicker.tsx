"use client";

import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const MAX_FOTOS = 3;

type Preview = { url: string; file: File };

export function PhotoPicker({
  onChange,
}: {
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setPreviews((prev) => {
      const slots = MAX_FOTOS - prev.length;
      const nuevas = files.slice(0, slots).map((f) => ({
        url: URL.createObjectURL(f),
        file: f,
      }));
      const next = [...prev, ...nuevas];
      onChange(next.map((p) => p.file));
      return next;
    });

    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (idx: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      const next = prev.filter((_, i) => i !== idx);
      onChange(next.map((p) => p.file));
      return next;
    });
  };

  const puedeAgregar = previews.length < MAX_FOTOS;

  return (
    <div className="space-y-3">
      {/* Grid de previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((p, i) => (
            <div key={p.url} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover rounded-button"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 inline-flex items-center justify-center size-6 rounded-full bg-background/80 backdrop-blur text-danger hover:bg-background transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botones de acción */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="sr-only"
      />

      {previews.length === 0 ? (
        <div className="rounded-card border border-foreground/10 bg-card p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.removeAttribute("capture");
                  inputRef.current.click();
                }
              }}
              className="inline-flex items-center gap-2 rounded-pill bg-card ring-1 ring-foreground/15 px-4 py-2.5 text-sm text-foreground hover:ring-terracota/50 transition-all"
            >
              <ImagePlus size={16} />
              Elegir de galería
            </button>
            <button
              type="button"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.setAttribute("capture", "environment");
                  inputRef.current.click();
                }
              }}
              className="inline-flex items-center gap-2 rounded-pill bg-terracota px-4 py-2.5 text-sm font-medium text-white hover:bg-terracota-deep transition-colors"
            >
              <Camera size={16} />
              Tomar foto
            </button>
          </div>
          <p className="text-xs text-foreground/40 mt-3">Hasta {MAX_FOTOS} fotos</p>
        </div>
      ) : puedeAgregar ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.removeAttribute("capture");
                inputRef.current.click();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-pill bg-card ring-1 ring-foreground/15 px-3 py-2 text-sm text-foreground hover:ring-terracota/50 transition-all"
          >
            <ImagePlus size={14} />
            Galería
          </button>
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.setAttribute("capture", "environment");
                inputRef.current.click();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-pill bg-card ring-1 ring-foreground/15 px-3 py-2 text-sm text-foreground hover:ring-terracota/50 transition-all"
          >
            <Camera size={14} />
            Cámara
          </button>
          <span className="text-xs text-foreground/40 ml-auto">
            {previews.length}/{MAX_FOTOS}
          </span>
        </div>
      ) : (
        <p className="text-xs text-foreground/40 text-center">
          Máximo {MAX_FOTOS} fotos alcanzado
        </p>
      )}
    </div>
  );
}
