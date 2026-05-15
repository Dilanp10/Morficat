"use client";

import Link from "next/link";
import { useState } from "react";
import { slugify } from "@/lib/slug";
import { ATRIBUTOS_LABELS } from "@/lib/constants";
import { saveLugar } from "../_actions";
import { HorariosGrid } from "./HorariosGrid";

type Categoria = { id: string; nombre: string; emoji: string | null };
type TipoComida = { id: string; nombre: string };
type Atributos = Record<string, boolean | undefined>;
type HorarioRow = {
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  cerrado: boolean;
  cruza_medianoche: boolean;
};

type InitialLugar = {
  id: string | null;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoria_id: string | null;
  direccion: string;
  barrio: string | null;
  lat: number | null;
  lng: number | null;
  telefono: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  imagen_principal: string | null;
  atributos: Atributos;
  activo: boolean;
  verificado: boolean;
  data_temporal: boolean;
  horarios: HorarioRow[];
  tipos_comida_ids: string[];
};

export function LugarForm({
  initial,
  categorias,
  tiposComida,
}: {
  initial: InitialLugar;
  categorias: Categoria[];
  tiposComida: TipoComida[];
}) {
  const [nombre, setNombre] = useState(initial.nombre);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(initial.slug !== "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esNuevo = !initial.id;

  function onSubmit() {
    setSubmitting(true);
    setError(null);
  }

  return (
    <form
      action={async (formData) => {
        try {
          onSubmit();
          await saveLugar(formData);
        } catch (e) {
          setSubmitting(false);
          setError(e instanceof Error ? e.message : "Error desconocido");
        }
      }}
      encType="multipart/form-data"
      className="space-y-8"
    >
      <input type="hidden" name="id" value={initial.id ?? "new"} />
      {initial.imagen_principal && (
        <input
          type="hidden"
          name="imagen_principal_existing"
          value={initial.imagen_principal}
        />
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Básico
        </h2>
        <Field label="Nombre" required>
          <input
            name="nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Slug (URL amigable)">
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="cafe-del-centro"
            className={inputCls}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            name="descripcion"
            defaultValue={initial.descripcion ?? ""}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Categoría">
          <select
            name="categoria_id"
            defaultValue={initial.categoria_id ?? ""}
            className={inputCls}
          >
            <option value="">— sin categoría —</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.nombre}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Ubicación
        </h2>
        <Field label="Dirección" required>
          <input
            name="direccion"
            defaultValue={initial.direccion}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Barrio">
          <input
            name="barrio"
            defaultValue={initial.barrio ?? ""}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitud" required>
            <input
              name="lat"
              type="number"
              step="any"
              defaultValue={initial.lat ?? ""}
              required
              placeholder="-28.4685"
              className={inputCls}
            />
          </Field>
          <Field label="Longitud" required>
            <input
              name="lng"
              type="number"
              step="any"
              defaultValue={initial.lng ?? ""}
              required
              placeholder="-65.7795"
              className={inputCls}
            />
          </Field>
        </div>
        <p className="text-xs text-white/35">
          Tip: en Google Maps, click derecho sobre el local → copiá las
          coordenadas.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Contacto
        </h2>
        <Field label="Teléfono">
          <input
            name="telefono"
            defaultValue={initial.telefono ?? ""}
            className={inputCls}
          />
        </Field>
        <Field label="WhatsApp">
          <input
            name="whatsapp"
            defaultValue={initial.whatsapp ?? ""}
            placeholder="+5493834..."
            className={inputCls}
          />
        </Field>
        <Field label="Instagram (usuario o URL)">
          <input
            name="instagram"
            defaultValue={initial.instagram ?? ""}
            className={inputCls}
          />
        </Field>
        <Field label="Facebook (página o URL)">
          <input
            name="facebook"
            defaultValue={initial.facebook ?? ""}
            className={inputCls}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Imagen
        </h2>
        {initial.imagen_principal && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={initial.imagen_principal}
              alt=""
              className="size-20 rounded-card object-cover"
            />
            <span className="text-xs text-white/35">
              Imagen actual. Subí una nueva para reemplazarla.
            </span>
          </div>
        )}
        <input
          name="imagen"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm file:mr-3 file:rounded-button file:border-0 file:bg-bg-tertiary file:px-3 file:py-1.5 file:text-white"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Tipos de comida
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {tiposComida.map((t) => (
            <label
              key={t.id}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <input
                type="checkbox"
                name="tipos_comida"
                value={t.id}
                defaultChecked={initial.tipos_comida_ids.includes(t.id)}
                className="accent-terracota"
              />
              {t.nombre}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Atributos
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries(ATRIBUTOS_LABELS).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <input
                type="checkbox"
                name={`atributos.${key}`}
                defaultChecked={!!initial.atributos[key]}
                className="accent-terracota"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Horarios
        </h2>
        <HorariosGrid initial={initial.horarios} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Estado
        </h2>
        <Toggle
          name="activo"
          label="Activo"
          defaultChecked={initial.activo}
          description="Si está apagado, el lugar no aparece en la app."
        />
        <Toggle
          name="data_temporal"
          label="Datos temporales (pre-lanzamiento)"
          defaultChecked={initial.data_temporal}
          description="Marcalo si los datos vienen de fuentes públicas y aún no fueron verificados con el local."
        />
        <Toggle
          name="verificado"
          label="Verificado"
          defaultChecked={initial.verificado}
          description="Datos confirmados directamente con el local."
        />
      </section>

      {error && (
        <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-button bg-terracota px-5 py-2 font-medium text-white hover:bg-terracota-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Guardando..." : esNuevo ? "Crear lugar" : "Guardar cambios"}
        </button>
        <Link
          href="/admin"
          className="rounded-button border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-bg-tertiary transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-button bg-bg-tertiary px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-terracota";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-white/60 mb-1">
        {label}
        {required && <span className="text-terracota"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
  description,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 accent-terracota"
      />
      <span className="flex-1">
        <span className="block text-white">{label}</span>
        {description && (
          <span className="block text-xs text-white/35">{description}</span>
        )}
      </span>
    </label>
  );
}
