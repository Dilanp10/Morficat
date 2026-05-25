"use client";

import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

export function PhotoPicker({
  onChange,
}: {
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-card border border-foreground/10 bg-card p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleSelect}
        className="sr-only"
      />
      {!preview ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-pill bg-terracota px-5 py-3 font-medium text-white hover:bg-terracota-deep transition-colors"
          >
            <Camera size={18} />
            Sumar foto
          </button>
          <p className="text-xs text-foreground/60 mt-3">
            Desde galería o cámara
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Vista previa"
            className="w-full max-h-64 object-cover rounded-button"
          />
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-danger transition-colors"
          >
            <Trash2 size={14} />
            Borrar y elegir otra
          </button>
        </div>
      )}
    </div>
  );
}
