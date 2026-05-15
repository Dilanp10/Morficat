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
    <table className="w-full text-sm">
      <tbody>
        {ORDEN_DIAS.map((d) => {
          const turnos = horariosDelDia(horarios, d).filter((h) => !h.cerrado);
          const esHoy = d === hoy;
          return (
            <tr
              key={d}
              className={`border-b border-foreground/10 last:border-0 ${
                esHoy ? "bg-terracota/10" : ""
              }`}
            >
              <td
                className={`px-3 py-2.5 align-top ${
                  esHoy ? "font-semibold text-terracota" : "text-foreground/80"
                }`}
              >
                {DIAS_SEMANA[d]}
                {esHoy && (
                  <span className="ml-1.5 text-[10px] uppercase tracking-wide">
                    hoy
                  </span>
                )}
              </td>
              <td className="px-3 py-2.5 text-right text-foreground/80">
                {turnos.length === 0 ? (
                  <span className="text-foreground/35">Cerrado</span>
                ) : (
                  <div className="space-y-0.5">
                    {turnos.map((t, i) => (
                      <div key={i}>
                        {format(t.hora_apertura)} – {format(t.hora_cierre)}
                        {t.cruza_medianoche && (
                          <span className="ml-1 text-[10px] text-foreground/35">
                            +1 día
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
