"use client";

import { ChevronLeft, ChevronRight, Loader2, MailCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { AudioRecorder } from "./AudioRecorder";
import { PhotoPicker } from "./PhotoPicker";
import { enviarSugerencia } from "../_actions";

const CATEGORIAS = [
  "Cafetería",
  "Restaurante",
  "Bar",
  "Heladería",
  "Panadería",
  "Pizzería",
  "Parrilla",
  "Cervecería",
  "Otro",
];


type State = {
  tipo: string;
  nombre: string;
  categoria: string;
  categoriaCustom: string;
  direccion: string;
  comentario: string;
  email: string;
  fotos: File[];
  audio: File | null;
};

const INITIAL: State = {
  tipo: "nuevo_local",
  nombre: "",
  categoria: "",
  categoriaCustom: "",
  direccion: "",
  comentario: "",
  email: "",
  fotos: [],
  audio: null,
};

const STEPS_COUNT = 6;
const inputCls =
  "w-full rounded-button bg-muted px-3 py-2.5 text-foreground outline-none ring-1 ring-foreground/10 focus:ring-terracota";

export function SugerirWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<State>(INITIAL);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, STEPS_COUNT));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("tipo", data.tipo);
      fd.set("nombre", data.nombre.trim());
      fd.set(
        "categoria",
        data.categoria === "Otro" ? data.categoriaCustom.trim() : data.categoria,
      );
      fd.set("direccion", data.direccion.trim());
      fd.set("comentario", data.comentario.trim());
      fd.set("email", data.email.trim());
      data.fotos.forEach((f, i) => fd.set(`foto_${i}`, f));
      if (data.audio) fd.set("audio", data.audio);
      const r = await enviarSugerencia(fd);
      if (r.ok) setDone(true);
      else setServerError(r.error);
    });
  };

  if (done) {
    return (
      <div className="rounded-card border border-success/40 bg-success/10 p-6 text-center animate-fade-in-up">
        <div className="mx-auto mb-3 inline-flex items-center justify-center size-14 rounded-pill bg-success/20 text-success">
          <MailCheck size={24} />
        </div>
        <p className="text-foreground font-semibold text-lg">¡Gracias!</p>
        <p className="text-foreground/70 text-sm mt-1">
          Tu sugerencia llegó bien. La revisamos lo antes posible.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setData(INITIAL);
              setStep(0);
              setDone(false);
            }}
            className="rounded-button border border-foreground/15 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            Mandar otra
          </button>
          <Link
            href="/"
            className="rounded-button bg-terracota px-4 py-2 text-sm font-medium text-white hover:bg-terracota-deep transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Progress
  const progress = (step / STEPS_COUNT) * 100;
  const canAdvance = step !== 0 || data.nombre.trim().length >= 2;

  return (
    <div className="space-y-5">
      {/* progress */}
      <div className="h-1 bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-terracota to-terracota-deep transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-foreground/60 text-right">
        Paso {step + 1} de {STEPS_COUNT}
      </p>

      <div key={step} className="animate-fade-in-up">
        {step === 0 && (
          <Step
            titulo="¿Cómo se llama el lugar?"
            sub="Lo único que necesitamos sí o sí."
          >
            <input
              type="text"
              autoFocus
              value={data.nombre}
              onChange={(e) =>
                setData((d) => ({ ...d, nombre: e.target.value }))
              }
              placeholder="Ej: Café del Centro"
              maxLength={120}
              className={inputCls}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdvance) {
                  e.preventDefault();
                  next();
                }
              }}
            />
            <p className="text-xs text-foreground/35 mt-2">Mínimo 2 caracteres.</p>
          </Step>
        )}

        {step === 1 && (
          <Step
            titulo="¿Qué tipo de lugar es?"
            sub="Tocá la opción que mejor le pegue. Saltá si no sabés."
          >
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      categoria: d.categoria === c ? "" : c,
                      categoriaCustom: d.categoria === c ? "" : d.categoriaCustom,
                    }))
                  }
                  className={`rounded-pill px-3 py-1.5 text-sm transition-all ${
                    data.categoria === c
                      ? "bg-terracota text-white ring-1 ring-terracota/40"
                      : "bg-card text-foreground/70 ring-1 ring-foreground/10 hover:ring-foreground/20"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {data.categoria === "Otro" && (
              <input
                type="text"
                value={data.categoriaCustom}
                onChange={(e) =>
                  setData((d) => ({ ...d, categoriaCustom: e.target.value }))
                }
                placeholder="Especificá qué tipo"
                className={`${inputCls} mt-3`}
              />
            )}
          </Step>
        )}

        {step === 2 && (
          <Step
            titulo="¿Dónde queda?"
            sub="Dirección, barrio o referencia. Lo que sepas."
          >
            <input
              type="text"
              value={data.direccion}
              onChange={(e) =>
                setData((d) => ({ ...d, direccion: e.target.value }))
              }
              placeholder="Ej: Rivadavia 500, Centro"
              className={inputCls}
            />
            <button
              type="button"
              disabled={gpsLoading}
              onClick={() => {
                if (!navigator.geolocation) {
                  setGpsError("Tu dispositivo no soporta GPS.");
                  return;
                }
                setGpsLoading(true);
                setGpsError(null);
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    const { latitude: lat, longitude: lng } = pos.coords;
                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                        { headers: { "Accept-Language": "es" } },
                      );
                      const json = await res.json();
                      const a = json.address ?? {};
                      const partes = [
                        a.road,
                        a.house_number,
                        a.suburb ?? a.neighbourhood ?? a.village ?? a.town,
                      ].filter(Boolean);
                      const legible = partes.length
                        ? partes.join(", ")
                        : json.display_name;
                      setData((d) => ({ ...d, direccion: legible }));
                    } catch {
                      setData((d) => ({
                        ...d,
                        direccion: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                      }));
                    } finally {
                      setGpsLoading(false);
                    }
                  },
                  () => {
                    setGpsError("No pudimos obtener tu ubicación. Activá el GPS.");
                    setGpsLoading(false);
                  },
                  { enableHighAccuracy: false, timeout: 8000 },
                );
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-pill bg-card ring-1 ring-foreground/15 px-4 py-2 text-sm text-foreground hover:ring-terracota/50 disabled:opacity-50 transition-all"
            >
              {gpsLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <MapPin size={14} />
              )}
              {gpsLoading ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
            </button>
            {gpsError && (
              <p className="text-xs text-danger mt-1">{gpsError}</p>
            )}
          </Step>
        )}

        {step === 3 && (
          <Step
            titulo="¿Tenés fotos?"
            sub="Una imagen del frente o el ambiente nos ayuda un montón. Podés mandar hasta 3."
          >
            <PhotoPicker
              onChange={(files) => setData((d) => ({ ...d, fotos: files }))}
            />
          </Step>
        )}

        {step === 4 && (
          <Step
            titulo="¿Querés mandar un audio?"
            sub="Más rápido que escribir. Contale al equipo lo que sepas."
          >
            <AudioRecorder
              onChange={(f) => setData((d) => ({ ...d, audio: f }))}
            />
          </Step>
        )}

        {step === 5 && (
          <Step
            titulo="¿Algo más para sumar?"
            sub="Cualquier dato extra: horarios, mejores platos, lo que sea."
          >
            <textarea
              value={data.comentario}
              onChange={(e) =>
                setData((d) => ({ ...d, comentario: e.target.value }))
              }
              placeholder="Opcional"
              rows={4}
              maxLength={2000}
              className={inputCls}
            />
            <label className="block mt-4">
              <span className="block text-sm text-foreground/60 mb-1">
                Email (opcional)
              </span>
              <input
                type="email"
                value={data.email}
                onChange={(e) =>
                  setData((d) => ({ ...d, email: e.target.value }))
                }
                placeholder="Para avisarte cuando lo carguemos"
                className={inputCls}
              />
            </label>
          </Step>
        )}
      </div>

      {serverError && (
        <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      {/* botones de navegación */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-button px-3 py-2 text-sm text-foreground/60 hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} />
          Atrás
        </button>

        {step < STEPS_COUNT - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            className="inline-flex items-center gap-1 rounded-button bg-terracota px-5 py-2 text-sm font-medium text-white hover:bg-terracota-deep disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {step === 0 ? "Siguiente" : "Siguiente"}
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="rounded-button bg-terracota px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracota-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? "Enviando..." : "Enviar sugerencia"}
          </button>
        )}
      </div>
    </div>
  );
}

function Step({
  titulo,
  sub,
  children,
}: {
  titulo: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">{titulo}</h2>
        {sub && <p className="text-sm text-foreground/60 mt-1">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
