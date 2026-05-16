import { TZ_OFFSET_HOURS } from "./constants";
import type { Horario } from "./types";

type HorarioInput = Pick<
  Horario,
  "dia_semana" | "hora_apertura" | "hora_cierre" | "cerrado" | "cruza_medianoche"
>;

const NOMBRE_DIA_CORTO = ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."];

/**
 * El horario cruza medianoche si:
 * - el usuario marcó el flag explícito, O
 * - la hora de cierre es menor que la de apertura (inferencia automática).
 *   Ej: apertura 21:00 / cierre 02:00 → cruza implícitamente.
 *   Ej: apertura 20:30 / cierre 00:00 → cruza (00:00 = midnight del siguiente día).
 */
export function cruzaMedianoche(
  hora_apertura: string,
  hora_cierre: string,
  flag: boolean,
): boolean {
  if (flag) return true;
  return parseHora(hora_cierre) < parseHora(hora_apertura);
}

export function estaAbierto(
  horarios: HorarioInput[],
  now: Date = new Date(),
): boolean {
  const arg = toArgentina(now);
  const dia = arg.getUTCDay();
  const minutosActuales = arg.getUTCHours() * 60 + arg.getUTCMinutes();

  for (const h of horarios) {
    if (h.cerrado) continue;
    if (h.dia_semana !== dia) continue;
    const apertura = parseHora(h.hora_apertura);
    const cierre = parseHora(h.hora_cierre);
    const cruza = cruzaMedianoche(h.hora_apertura, h.hora_cierre, h.cruza_medianoche);
    if (cruza) {
      if (minutosActuales >= apertura) return true;
    } else if (minutosActuales >= apertura && minutosActuales < cierre) {
      return true;
    }
  }

  const diaAnterior = (dia + 6) % 7;
  for (const h of horarios) {
    if (h.cerrado) continue;
    if (h.dia_semana !== diaAnterior) continue;
    const cruza = cruzaMedianoche(h.hora_apertura, h.hora_cierre, h.cruza_medianoche);
    if (!cruza) continue;
    const cierre = parseHora(h.hora_cierre);
    if (minutosActuales < cierre) return true;
  }

  return false;
}

export function horariosDelDia(
  horarios: HorarioInput[],
  diaSemana: number,
): HorarioInput[] {
  return horarios
    .filter((h) => h.dia_semana === diaSemana)
    .sort((a, b) => parseHora(a.hora_apertura) - parseHora(b.hora_apertura));
}

export function diaActualEnArgentina(now: Date = new Date()): number {
  return toArgentina(now).getUTCDay();
}

export type EstadoLocal = {
  abierto: boolean;
  detalle: string | null;
};

export function estadoConHorario(
  horarios: HorarioInput[],
  now: Date = new Date(),
): EstadoLocal {
  const arg = toArgentina(now);
  const dia = arg.getUTCDay();
  const minutosActuales = arg.getUTCHours() * 60 + arg.getUTCMinutes();

  for (const h of horarios) {
    if (h.cerrado) continue;
    if (h.dia_semana !== dia) continue;
    const apertura = parseHora(h.hora_apertura);
    const cierre = parseHora(h.hora_cierre);
    const cruza = cruzaMedianoche(h.hora_apertura, h.hora_cierre, h.cruza_medianoche);
    if (cruza) {
      if (minutosActuales >= apertura) {
        return { abierto: true, detalle: `cierra a las ${formatHora(h.hora_cierre)}` };
      }
    } else if (minutosActuales >= apertura && minutosActuales < cierre) {
      return { abierto: true, detalle: `cierra a las ${formatHora(h.hora_cierre)}` };
    }
  }

  const diaAnterior = (dia + 6) % 7;
  for (const h of horarios) {
    if (h.cerrado) continue;
    if (h.dia_semana !== diaAnterior) continue;
    const cruza = cruzaMedianoche(h.hora_apertura, h.hora_cierre, h.cruza_medianoche);
    if (!cruza) continue;
    const cierre = parseHora(h.hora_cierre);
    if (minutosActuales < cierre) {
      return { abierto: true, detalle: `cierra a las ${formatHora(h.hora_cierre)}` };
    }
  }

  const turnosHoyRestantes = horarios
    .filter((h) => !h.cerrado && h.dia_semana === dia && parseHora(h.hora_apertura) > minutosActuales)
    .sort((a, b) => parseHora(a.hora_apertura) - parseHora(b.hora_apertura));
  if (turnosHoyRestantes.length > 0) {
    return {
      abierto: false,
      detalle: `abre a las ${formatHora(turnosHoyRestantes[0].hora_apertura)}`,
    };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const d = (dia + offset) % 7;
    const turnos = horarios
      .filter((h) => !h.cerrado && h.dia_semana === d)
      .sort((a, b) => parseHora(a.hora_apertura) - parseHora(b.hora_apertura));
    if (turnos.length > 0) {
      const label = offset === 1 ? "mañana" : NOMBRE_DIA_CORTO[d];
      return {
        abierto: false,
        detalle: `abre ${label} ${formatHora(turnos[0].hora_apertura)}`,
      };
    }
  }

  return { abierto: false, detalle: null };
}

function formatHora(hora: string): string {
  return hora.slice(0, 5);
}

function parseHora(hora: string): number {
  const [h, m] = hora.split(":");
  return parseInt(h, 10) * 60 + parseInt(m, 10);
}

function toArgentina(now: Date): Date {
  return new Date(now.getTime() + TZ_OFFSET_HOURS * 60 * 60 * 1000);
}
