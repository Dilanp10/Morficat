"use client";

import { useState } from "react";
import { enviarSugerencia } from "../_actions";

const TIPOS = [
  { value: "nuevo_local", label: "Nuevo local que falta" },
  { value: "error_horario", label: "Horario incorrecto" },
  { value: "local_cerrado", label: "Local cerrado para siempre" },
  { value: "otro", label: "Otro" },
];

export function SugerenciaForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <div className="rounded-card border border-success/40 bg-success/10 p-6 text-center">
        <p className="text-foreground font-medium">¡Gracias!</p>
        <p className="text-foreground/60 text-sm mt-1">
          Tu sugerencia llegó bien. La revisamos lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setError(null);
          }}
          className="mt-4 text-sm text-terracota hover:text-terracota-soft"
        >
          Enviar otra
        </button>
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setError(null);
        const r = await enviarSugerencia(fd);
        setPending(false);
        if (r.ok) setDone(true);
        else setError(r.error);
      }}
      className="space-y-4"
    >
      <Field label="¿De qué se trata?">
        <select
          name="tipo"
          defaultValue="nuevo_local"
          required
          className={inputCls}
        >
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Contanos">
        <textarea
          name="contenido"
          rows={5}
          required
          minLength={5}
          maxLength={2000}
          placeholder="Nombre del lugar, dirección, qué te pasó, etc."
          className={inputCls}
        />
      </Field>

      <Field label="Email (opcional)">
        <input
          name="email"
          type="email"
          placeholder="Para que te avisemos cuando lo carguemos"
          className={inputCls}
        />
      </Field>

      {error && (
        <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-button bg-terracota px-4 py-2.5 font-medium text-white hover:bg-terracota-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Enviando..." : "Enviar sugerencia"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-button bg-muted px-3 py-2 text-foreground outline-none ring-1 ring-foreground/10 focus:ring-terracota";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-foreground/60 mb-1">{label}</span>
      {children}
    </label>
  );
}
