"use client";

import { ChevronLeft, ChevronRight, Loader2, MailCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { AudioRecorder } from "./AudioRecorder";
import { PhotoPicker } from "./PhotoPicker";
import {
  HorariosInput,
  HORARIO_INICIAL,
  serializarHorarios,
  type FeriadosOption,
  type HorarioSemana,
} from "./HorariosInput";
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
  horario: HorarioSemana;
  feriados: FeriadosOption;
  horarioCompletado: boolean;
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
  horario: HORARIO_INICIAL,
  feriados: "consultar",
  horarioCompletado: false,
  comentario: "",
  email: "",
  fotos: [],
  audio: null,
};

const STEPS_COUNT = 7;
const inputCls =
  "w-full rounded-button px-3 py-2.5 outline-none transition-colors";
const inputStyle = {
  background: "var(--card-2)",
  color: "var(--fg)",
  border: "1px solid var(--line)",
};

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

      // Concatena horarios al comentario si el usuario los completó
      let contenido = data.comentario.trim();
      if (data.horarioCompletado) {
        const horariosTxt = serializarHorarios(data.horario, data.feriados);
        contenido = contenido
          ? `${contenido}\n\n${horariosTxt}`
          : horariosTxt;
      }
      fd.set("comentario", contenido);

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
      <div
        className="rounded-card p-6 text-center animate-fade-in-up"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--moss)",
        }}
      >
        <div
          className="mx-auto mb-3 inline-flex items-center justify-center size-14 rounded-pill"
          style={{ background: "rgba(138,162,101,0.15)", color: "var(--moss)" }}
        >
          <MailCheck size={24} />
        </div>
        <p className="font-serif italic text-2xl" style={{ color: "var(--fg)" }}>
          ¡Gracias!
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--fg-70)" }}>
          Tu sugerencia llegó bien. La revisamos lo antes posible.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setData(INITIAL);
              setStep(0);
              setDone(false);
            }}
            className="rounded-button px-4 py-2 text-sm transition-opacity hover:opacity-80"
            style={{ border: "1px solid var(--line-2)", color: "var(--fg-70)" }}
          >
            Mandar otra
          </button>
          <Link
            href="/"
            className="rounded-button px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--terra)", color: "var(--bg)" }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Progress
  const progress = ((step + 1) / STEPS_COUNT) * 100;
  const canAdvance = step !== 0 || data.nombre.trim().length >= 2;

  return (
    <div className="space-y-5">
      {/* progress */}
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: "var(--card-2)" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, var(--terra), var(--terra-deep))",
          }}
        />
      </div>
      <p
        className="font-mono text-[11px] tracking-widest uppercase text-right"
        style={{ color: "var(--fg-50)" }}
      >
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
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdvance) {
                  e.preventDefault();
                  next();
                }
              }}
            />
            <p className="text-xs mt-2" style={{ color: "var(--fg-30)" }}>
              Mínimo 2 caracteres.
            </p>
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
                  className="rounded-pill px-3 py-1.5 text-sm transition-all"
                  style={{
                    background:
                      data.categoria === c ? "var(--terra)" : "var(--card-bg)",
                    color: data.categoria === c ? "var(--bg)" : "var(--fg-70)",
                    border: `1px solid ${data.categoria === c ? "var(--terra)" : "var(--line)"}`,
                  }}
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
                style={inputStyle}
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
              style={inputStyle}
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
              className="mt-2 inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                background: "var(--card-bg)",
                color: "var(--fg-70)",
                border: "1px solid var(--line-2)",
              }}
            >
              {gpsLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <MapPin size={14} />
              )}
              {gpsLoading ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
            </button>
            {gpsError && (
              <p className="text-xs mt-1" style={{ color: "var(--rust)" }}>
                {gpsError}
              </p>
            )}
          </Step>
        )}

        {step === 3 && (
          <Step
            titulo="¿Cuáles son los horarios?"
            sub="Ajustá lo que sepas. Si no estás seguro de algo, podés saltar este paso."
          >
            <HorariosInput
              horario={data.horario}
              onChange={(h) =>
                setData((d) => ({ ...d, horario: h, horarioCompletado: true }))
              }
              feriados={data.feriados}
              onFeriadosChange={(f) =>
                setData((d) => ({ ...d, feriados: f, horarioCompletado: true }))
              }
            />
          </Step>
        )}

        {step === 4 && (
          <Step
            titulo="¿Tenés fotos?"
            sub="Una imagen del frente o el ambiente nos ayuda un montón. Podés mandar hasta 3."
          >
            <PhotoPicker
              onChange={(files) => setData((d) => ({ ...d, fotos: files }))}
            />
          </Step>
        )}

        {step === 5 && (
          <Step
            titulo="¿Querés mandar un audio?"
            sub="Más rápido que escribir. Contale al equipo lo que sepas."
          >
            <AudioRecorder
              onChange={(f) => setData((d) => ({ ...d, audio: f }))}
            />
          </Step>
        )}

        {step === 6 && (
          <Step
            titulo="¿Algo más para sumar?"
            sub="Cualquier dato extra: mejores platos, datos de contacto, lo que sea."
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
              style={inputStyle}
            />
            <label className="block mt-4">
              <span
                className="block text-sm mb-1"
                style={{ color: "var(--fg-50)" }}
              >
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
                style={inputStyle}
              />
            </label>
          </Step>
        )}
      </div>

      {serverError && (
        <div
          className="rounded-card px-4 py-3 text-sm"
          style={{
            background: "rgba(192,102,78,0.1)",
            color: "var(--rust)",
            border: "1px solid var(--rust)",
          }}
        >
          {serverError}
        </div>
      )}

      {/* botones de navegación */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-button px-3 py-2 text-sm transition-colors disabled:opacity-30"
          style={{ color: "var(--fg-50)" }}
        >
          <ChevronLeft size={16} />
          Atrás
        </button>

        {step < STEPS_COUNT - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            className="inline-flex items-center gap-1 rounded-button px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--terra)", color: "var(--bg)" }}
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="rounded-button px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--terra)", color: "var(--bg)" }}
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
    <div className="space-y-4">
      <div>
        <h2 className="font-serif italic text-2xl" style={{ color: "var(--fg)" }}>
          {titulo}
        </h2>
        {sub && (
          <p className="text-sm mt-1.5" style={{ color: "var(--fg-50)" }}>
            {sub}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
