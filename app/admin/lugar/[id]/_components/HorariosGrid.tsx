"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

type Turno = {
  hora_apertura: string;
  hora_cierre: string;
  cruza_medianoche: boolean;
};

type DiaState = {
  cerrado: boolean;
  turnos: Turno[];
};

type HorarioRow = {
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  cerrado: boolean;
  cruza_medianoche: boolean;
};

const ETIQUETAS_EN_ORDEN: Array<{ label: string; dia: number }> = [
  { label: "Lunes", dia: 1 },
  { label: "Martes", dia: 2 },
  { label: "Miércoles", dia: 3 },
  { label: "Jueves", dia: 4 },
  { label: "Viernes", dia: 5 },
  { label: "Sábado", dia: 6 },
  { label: "Domingo", dia: 0 },
];

function buildInitial(initial: HorarioRow[]): Record<number, DiaState> {
  const map: Record<number, DiaState> = {};
  for (const { dia } of ETIQUETAS_EN_ORDEN) {
    map[dia] = { cerrado: true, turnos: [] };
  }
  for (const row of initial) {
    const d = map[row.dia_semana];
    if (!d) continue;
    if (row.cerrado) continue;
    d.cerrado = false;
    d.turnos.push({
      hora_apertura: row.hora_apertura.slice(0, 5),
      hora_cierre: row.hora_cierre.slice(0, 5),
      cruza_medianoche: row.cruza_medianoche,
    });
  }
  return map;
}

function serialize(state: Record<number, DiaState>): HorarioRow[] {
  const out: HorarioRow[] = [];
  for (const dia of Object.keys(state)) {
    const d = state[Number(dia)];
    if (d.cerrado) continue;
    for (const t of d.turnos) {
      out.push({
        dia_semana: Number(dia),
        hora_apertura: t.hora_apertura,
        hora_cierre: t.hora_cierre,
        cerrado: false,
        cruza_medianoche: t.cruza_medianoche,
      });
    }
  }
  return out;
}

export function HorariosGrid({ initial }: { initial: HorarioRow[] }) {
  const [state, setState] = useState<Record<number, DiaState>>(() =>
    buildInitial(initial),
  );

  const serialized = useMemo(() => JSON.stringify(serialize(state)), [state]);

  const update = (dia: number, fn: (d: DiaState) => DiaState) => {
    setState((prev) => ({ ...prev, [dia]: fn(prev[dia]) }));
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name="horarios_json" value={serialized} />

      {ETIQUETAS_EN_ORDEN.map(({ label, dia }) => {
        const d = state[dia];
        return (
          <div
            key={dia}
            className="rounded-card border border-white/10 bg-bg-tertiary p-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">{label}</span>
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  checked={d.cerrado}
                  onChange={(e) =>
                    update(dia, (cur) => ({
                      cerrado: e.target.checked,
                      turnos:
                        e.target.checked || cur.turnos.length > 0
                          ? cur.turnos
                          : [
                              {
                                hora_apertura: "09:00",
                                hora_cierre: "22:00",
                                cruza_medianoche: false,
                              },
                            ],
                    }))
                  }
                  className="accent-terracota"
                />
                Cerrado
              </label>
            </div>

            {!d.cerrado && (
              <div className="mt-3 space-y-2">
                {d.turnos.length === 0 && (
                  <div className="text-xs text-white/35">
                    Sin turnos. Agregá uno.
                  </div>
                )}
                {d.turnos.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-2 text-sm"
                  >
                    <input
                      type="time"
                      value={t.hora_apertura}
                      onChange={(e) =>
                        update(dia, (cur) => ({
                          ...cur,
                          turnos: cur.turnos.map((x, i) =>
                            i === idx
                              ? { ...x, hora_apertura: e.target.value }
                              : x,
                          ),
                        }))
                      }
                      className="rounded-button bg-bg-base px-2 py-1 ring-1 ring-white/10"
                    />
                    <span className="text-white/35">→</span>
                    <input
                      type="time"
                      value={t.hora_cierre}
                      onChange={(e) =>
                        update(dia, (cur) => ({
                          ...cur,
                          turnos: cur.turnos.map((x, i) =>
                            i === idx
                              ? { ...x, hora_cierre: e.target.value }
                              : x,
                          ),
                        }))
                      }
                      className="rounded-button bg-bg-base px-2 py-1 ring-1 ring-white/10"
                    />
                    <label className="flex items-center gap-1.5 text-white/60">
                      <input
                        type="checkbox"
                        checked={t.cruza_medianoche}
                        onChange={(e) =>
                          update(dia, (cur) => ({
                            ...cur,
                            turnos: cur.turnos.map((x, i) =>
                              i === idx
                                ? { ...x, cruza_medianoche: e.target.checked }
                                : x,
                            ),
                          }))
                        }
                        className="accent-terracota"
                      />
                      cruza medianoche
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        update(dia, (cur) => ({
                          ...cur,
                          turnos: cur.turnos.filter((_, i) => i !== idx),
                        }))
                      }
                      aria-label="Eliminar turno"
                      className="ml-auto text-white/35 hover:text-danger transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update(dia, (cur) => ({
                      ...cur,
                      turnos: [
                        ...cur.turnos,
                        {
                          hora_apertura: "09:00",
                          hora_cierre: "22:00",
                          cruza_medianoche: false,
                        },
                      ],
                    }))
                  }
                  className="inline-flex items-center gap-1 text-sm text-terracota hover:text-terracota-soft"
                >
                  <Plus size={14} />
                  Agregar turno
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
