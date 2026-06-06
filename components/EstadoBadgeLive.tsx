"use client";

import { useEffect, useState } from "react";
import { BadgeEstado } from "./BadgeEstado";
import { estadoConHorario, proximidadHorario } from "@/lib/horarios";
import type { Horario } from "@/lib/types";

type HorarioInput = Pick<
  Horario,
  "dia_semana" | "hora_apertura" | "hora_cierre" | "cerrado" | "cruza_medianoche"
>;

export function EstadoBadgeLive({ horarios }: { horarios: HorarioInput[] }) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const estado = estadoConHorario(horarios, now);
  const prox = proximidadHorario(horarios, now);
  const minutos = prox.cierraPronto
    ? prox.minutosParaCierre
    : prox.abrePronto
      ? prox.minutosParaApertura
      : null;

  return (
    <BadgeEstado
      abierto={estado.abierto}
      detalleHorario={estado.detalle}
      cierraPronto={prox.cierraPronto}
      abrePronto={prox.abrePronto}
      minutos={minutos}
    />
  );
}
