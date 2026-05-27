"use client";

import { Copy, Plus, X } from "lucide-react";

export type Turno = { apertura: string; cierre: string };
export type DiaHorario = { cerrado: boolean; turnos: Turno[] };
export type HorarioSemana = {
  lunes: DiaHorario;
  martes: DiaHorario;
  miercoles: DiaHorario;
  jueves: DiaHorario;
  viernes: DiaHorario;
  sabado: DiaHorario;
  domingo: DiaHorario;
};
export type FeriadosOption = "normal" | "cerrado" | "consultar";

export const DIAS_KEYS: (keyof HorarioSemana)[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const DIAS_LABEL: Record<keyof HorarioSemana, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

export const HORARIO_INICIAL: HorarioSemana = {
  lunes: { cerrado: false, turnos: [{ apertura: "09:00", cierre: "22:00" }] },
  martes: { cerrado: false, turnos: [{ apertura: "09:00", cierre: "22:00" }] },
  miercoles: { cerrado: false, turnos: [{ apertura: "09:00", cierre: "22:00" }] },
  jueves: { cerrado: false, turnos: [{ apertura: "09:00", cierre: "22:00" }] },
  viernes: { cerrado: false, turnos: [{ apertura: "09:00", cierre: "22:00" }] },
  sabado: { cerrado: false, turnos: [{ apertura: "09:00", cierre: "22:00" }] },
  domingo: { cerrado: true, turnos: [{ apertura: "09:00", cierre: "22:00" }] },
};

// Genera opciones de hora cada 30 min
const HORAS_OPCIONES: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of ["00", "30"]) {
      out.push(`${h.toString().padStart(2, "0")}:${m}`);
    }
  }
  return out;
})();

export function HorariosInput({
  horario,
  onChange,
  feriados,
  onFeriadosChange,
}: {
  horario: HorarioSemana;
  onChange: (h: HorarioSemana) => void;
  feriados: FeriadosOption;
  onFeriadosChange: (f: FeriadosOption) => void;
}) {
  const updateDia = (key: keyof HorarioSemana, dia: DiaHorario) => {
    onChange({ ...horario, [key]: dia });
  };

  const copiarLunesALaboral = () => {
    const lunes = horario.lunes;
    onChange({
      ...horario,
      martes: clone(lunes),
      miercoles: clone(lunes),
      jueves: clone(lunes),
      viernes: clone(lunes),
    });
  };

  const copiarLunesATodos = () => {
    const lunes = horario.lunes;
    onChange({
      lunes: clone(lunes),
      martes: clone(lunes),
      miercoles: clone(lunes),
      jueves: clone(lunes),
      viernes: clone(lunes),
      sabado: clone(lunes),
      domingo: clone(lunes),
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <QuickButton onClick={copiarLunesALaboral}>
          <Copy size={12} /> Lun-Vie iguales
        </QuickButton>
        <QuickButton onClick={copiarLunesATodos}>
          <Copy size={12} /> Todos iguales
        </QuickButton>
      </div>

      {/* Días */}
      <ul className="space-y-2">
        {DIAS_KEYS.map((key) => (
          <li key={key}>
            <DiaRow
              label={DIAS_LABEL[key]}
              dia={horario[key]}
              onChange={(d) => updateDia(key, d)}
            />
          </li>
        ))}
      </ul>

      {/* Feriados */}
      <div
        className="pt-4 mt-2"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <p
          className="font-mono text-[11px] tracking-widest uppercase mb-3 font-medium"
          style={{ color: "var(--ochre)" }}
        >
          🎉 Feriados
        </p>
        <div className="space-y-2">
          <FeriadoOption
            value="normal"
            current={feriados}
            onChange={onFeriadosChange}
            label="Sí, abre como un día normal"
          />
          <FeriadoOption
            value="cerrado"
            current={feriados}
            onChange={onFeriadosChange}
            label="No abre los feriados"
          />
          <FeriadoOption
            value="consultar"
            current={feriados}
            onChange={onFeriadosChange}
            label="A veces, consultar"
          />
        </div>
      </div>
    </div>
  );
}

function DiaRow({
  label,
  dia,
  onChange,
}: {
  label: string;
  dia: DiaHorario;
  onChange: (d: DiaHorario) => void;
}) {
  const toggleCerrado = () => {
    onChange({ ...dia, cerrado: !dia.cerrado });
  };

  const updateTurno = (idx: number, t: Partial<Turno>) => {
    const turnos = [...dia.turnos];
    turnos[idx] = { ...turnos[idx], ...t };
    onChange({ ...dia, turnos });
  };

  const addTurno = () => {
    if (dia.turnos.length >= 2) return;
    onChange({
      ...dia,
      turnos: [...dia.turnos, { apertura: "17:00", cierre: "22:00" }],
    });
  };

  const removeTurno = (idx: number) => {
    if (dia.turnos.length <= 1) return;
    onChange({ ...dia, turnos: dia.turnos.filter((_, i) => i !== idx) });
  };

  return (
    <div
      className="rounded-button p-3 transition-colors"
      style={{
        background: dia.cerrado ? "var(--card-2)" : "var(--card-bg)",
        border: "1px solid var(--line)",
        opacity: dia.cerrado ? 0.6 : 1,
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span
          className="font-serif italic text-base"
          style={{ color: "var(--fg)" }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={toggleCerrado}
          className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-pill transition-colors"
          style={{
            background: dia.cerrado ? "transparent" : "var(--terra)",
            color: dia.cerrado ? "var(--fg-50)" : "var(--bg)",
            border: dia.cerrado ? "1px solid var(--line-2)" : "none",
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              background: dia.cerrado ? "var(--rust)" : "var(--moss)",
            }}
          />
          {dia.cerrado ? "CERRADO" : "ABIERTO"}
        </button>
      </div>

      {!dia.cerrado && (
        <div className="space-y-2">
          {dia.turnos.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <HoraSelect
                value={t.apertura}
                onChange={(v) => updateTurno(idx, { apertura: v })}
                aria-label={`Hora de apertura ${label} turno ${idx + 1}`}
              />
              <span
                className="font-mono text-sm"
                style={{ color: "var(--fg-50)" }}
              >
                –
              </span>
              <HoraSelect
                value={t.cierre}
                onChange={(v) => updateTurno(idx, { cierre: v })}
                aria-label={`Hora de cierre ${label} turno ${idx + 1}`}
              />
              {dia.turnos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTurno(idx)}
                  className="ml-auto p-1.5 rounded-button transition-opacity hover:opacity-80"
                  style={{ color: "var(--rust)" }}
                  aria-label="Quitar este turno"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}

          {dia.turnos.length < 2 && (
            <button
              type="button"
              onClick={addTurno}
              className="inline-flex items-center gap-1 text-xs font-serif italic transition-opacity hover:opacity-80"
              style={{ color: "var(--terra)" }}
            >
              <Plus size={12} /> segundo turno
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function HoraSelect({
  value,
  onChange,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  "aria-label"?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-button px-3 py-2 text-sm font-mono outline-none transition-colors"
      style={{
        background: "var(--card-2)",
        color: "var(--fg)",
        border: "1px solid var(--line-2)",
      }}
      {...rest}
    >
      {HORAS_OPCIONES.map((h) => (
        <option key={h} value={h}>
          {h}
        </option>
      ))}
    </select>
  );
}

function FeriadoOption({
  value,
  current,
  onChange,
  label,
}: {
  value: FeriadosOption;
  current: FeriadosOption;
  onChange: (v: FeriadosOption) => void;
  label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className="w-full flex items-center gap-3 rounded-button px-3 py-2.5 text-left transition-colors"
      style={{
        background: active ? "var(--terra-wash)" : "var(--card-bg)",
        border: `1px solid ${active ? "var(--terra)" : "var(--line)"}`,
      }}
    >
      <span
        className="inline-flex items-center justify-center size-4 rounded-full shrink-0"
        style={{
          border: `1.5px solid ${active ? "var(--terra)" : "var(--fg-30)"}`,
        }}
      >
        {active && (
          <span
            className="size-2 rounded-full"
            style={{ background: "var(--terra)" }}
          />
        )}
      </span>
      <span
        className="text-sm"
        style={{ color: active ? "var(--fg)" : "var(--fg-70)" }}
      >
        {label}
      </span>
    </button>
  );
}

function QuickButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-serif italic transition-opacity hover:opacity-80"
      style={{
        background: "var(--card-2)",
        color: "var(--terra)",
        border: "1px solid var(--line-2)",
      }}
    >
      {children}
    </button>
  );
}

function clone(d: DiaHorario): DiaHorario {
  return { cerrado: d.cerrado, turnos: d.turnos.map((t) => ({ ...t })) };
}

// Serializa el horario a texto legible para el contenido de la sugerencia
export function serializarHorarios(
  horario: HorarioSemana,
  feriados: FeriadosOption,
): string {
  const lines: string[] = ["📅 Horarios sugeridos:"];
  for (const key of DIAS_KEYS) {
    const label = DIAS_LABEL[key].padEnd(10);
    const dia = horario[key];
    if (dia.cerrado) {
      lines.push(`• ${label}: cerrado`);
    } else {
      const turnos = dia.turnos
        .map((t) => `${t.apertura} – ${t.cierre}`)
        .join(", ");
      lines.push(`• ${label}: ${turnos}`);
    }
  }
  const feriadoLabel = {
    normal: "abre como un día normal",
    cerrado: "no abre los feriados",
    consultar: "a veces, consultar",
  }[feriados];
  lines.push("");
  lines.push(`🎉 Feriados: ${feriadoLabel}`);
  return lines.join("\n");
}
