"use client";

import { useEffect, useState } from "react";
import { BadgeEstado } from "./BadgeEstado";
import { estadoConHorario } from "@/lib/horarios";
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

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      <BadgeEstado abierto={estado.abierto} />
      {estado.detalle && (
        <span className="text-sm text-foreground/60">{estado.detalle}</span>
      )}
    </div>
  );
}
