import { DIAS_SEMANA } from "@/lib/constants";
import { diaActualEnArgentina, horariosDelDia } from "@/lib/horarios";
import type { Horario } from "@/lib/types";

const ORDEN_DIAS = [1, 2, 3, 4, 5, 6, 0];

type HorarioInput = Pick<
  Horario,
  "dia_semana" | "hora_apertura" | "hora_cierre" | "cerrado" | "cruza_medianoche"
>;

function format(hora: string): string {
  return hora.slice(0, 5);
}

export function HorariosTable({ horarios }: { horarios: HorarioInput[] }) {
  const hoy = diaActualEnArgentina();

  return (
    <table className="w-full">
      <tbody>
        {ORDEN_DIAS.map((d) => {
          const turnos = horariosDelDia(horarios, d).filter((h) => !h.cerrado);
          const esHoy = d === hoy;
          return (
            <tr
              key={d}
              className="row-sep last:border-b-0"
            >
              <td
                className="py-2.5 pr-4 align-top text-sm"
                style={{ color: esHoy ? "var(--terra)" : "var(--fg-70)" }}
              >
                {DIAS_SEMANA[d]}
                {esHoy && (
                  <span
                    className="ml-2 font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: "var(--terra)" }}
                  >
                    hoy
                  </span>
                )}
              </td>
              <td
                className="py-2.5 text-right font-mono text-xs"
                style={{ color: turnos.length === 0 ? "var(--fg-30)" : "var(--fg-70)" }}
              >
                {turnos.length === 0 ? (
                  "cerrado"
                ) : (
                  <div className="space-y-0.5">
                    {turnos.map((t, i) => (
                      <div key={i}>
                        {format(t.hora_apertura)}–{format(t.hora_cierre)}
                        {t.cruza_medianoche && (
                          <span
                            className="ml-1 text-[10px]"
                            style={{ color: "var(--fg-30)" }}
                          >
                            +1
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
