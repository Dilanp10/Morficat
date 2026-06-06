import {
  MINUTOS_ABRE_PRONTO,
  MINUTOS_CIERRA_PRONTO,
  TZ_OFFSET_HOURS,
} from "./constants";
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

export type ProximidadHorario = {
  cierraPronto: boolean;
  minutosParaCierre: number | null;
  abrePronto: boolean;
  minutosParaApertura: number | null;
};

/**
 * Deriva la "proximidad" de un local respecto a su horario:
 * - si está abierto, cuántos minutos faltan para cerrar (y si es "pronto");
 * - si está cerrado, cuántos minutos faltan para abrir hoy (y si es "pronto").
 *
 * Función aparte de `estadoConHorario` para no romper su contrato (los tests
 * usan `toEqual` estricto). Reusa la misma detección de turno activo.
 */
export function proximidadHorario(
  horarios: HorarioInput[],
  now: Date = new Date(),
): ProximidadHorario {
  const arg = toArgentina(now);
  const dia = arg.getUTCDay();
  const minutosActuales = arg.getUTCHours() * 60 + arg.getUTCMinutes();

  const paraCierre = minutosHastaCierre(horarios, dia, minutosActuales);
  if (paraCierre !== null) {
    return {
      cierraPronto: paraCierre <= MINUTOS_CIERRA_PRONTO,
      minutosParaCierre: paraCierre,
      abrePronto: false,
      minutosParaApertura: null,
    };
  }

  const aperturasRestantes = horarios
    .filter(
      (h) =>
        !h.cerrado &&
        h.dia_semana === dia &&
        parseHora(h.hora_apertura) > minutosActuales,
    )
    .map((h) => parseHora(h.hora_apertura) - minutosActuales)
    .sort((a, b) => a - b);

  const paraApertura = aperturasRestantes.length > 0 ? aperturasRestantes[0] : null;

  return {
    cierraPronto: false,
    minutosParaCierre: null,
    abrePronto: paraApertura !== null && paraApertura <= MINUTOS_ABRE_PRONTO,
    minutosParaApertura: paraApertura,
  };
}

/**
 * Minutos hasta el cierre del turno activo, o null si está cerrado.
 * Mismo orden de chequeo que `estadoConHorario`: turno de hoy (normal o cruzando
 * medianoche) y turno del día anterior que cruza hacia la madrugada de hoy.
 */
function minutosHastaCierre(
  horarios: HorarioInput[],
  dia: number,
  minutosActuales: number,
): number | null {
  for (const h of horarios) {
    if (h.cerrado || h.dia_semana !== dia) continue;
    const apertura = parseHora(h.hora_apertura);
    const cierre = parseHora(h.hora_cierre);
    const cruza = cruzaMedianoche(h.hora_apertura, h.hora_cierre, h.cruza_medianoche);
    if (cruza) {
      if (minutosActuales >= apertura) {
        const cierreAbs = cierre <= apertura ? cierre + 1440 : cierre;
        return cierreAbs - minutosActuales;
      }
    } else if (minutosActuales >= apertura && minutosActuales < cierre) {
      return cierre - minutosActuales;
    }
  }

  const diaAnterior = (dia + 6) % 7;
  for (const h of horarios) {
    if (h.cerrado || h.dia_semana !== diaAnterior) continue;
    const cruza = cruzaMedianoche(h.hora_apertura, h.hora_cierre, h.cruza_medianoche);
    if (!cruza) continue;
    const cierre = parseHora(h.hora_cierre);
    if (minutosActuales < cierre) return cierre - minutosActuales;
  }

  return null;
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
