import { describe, expect, it } from "vitest";
import { estaAbierto, estadoConHorario, proximidadHorario } from "./horarios";

function arg(
  year: number,
  month: number,
  day: number,
  hour: number,
  min: number = 0,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour + 3, min));
}

const lunes = (h: number, m: number = 0) => arg(2024, 1, 1, h, m);
const martes = (h: number, m: number = 0) => arg(2024, 1, 2, h, m);
const viernes = (h: number, m: number = 0) => arg(2024, 1, 5, h, m);
const sabado = (h: number, m: number = 0) => arg(2024, 1, 6, h, m);

describe("estaAbierto", () => {
  it("horario normal — dentro del rango: abierto", () => {
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "08:00",
        hora_cierre: "22:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, lunes(14))).toBe(true);
  });

  it("horario normal — antes de abrir: cerrado", () => {
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "08:00",
        hora_cierre: "22:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, lunes(7, 59))).toBe(false);
  });

  it("horario normal — exactamente la hora de cierre: cerrado", () => {
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "08:00",
        hora_cierre: "22:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, lunes(22, 0))).toBe(false);
  });

  it("horario cortado — durante el corte: cerrado", () => {
    const horarios = [
      {
        dia_semana: 2,
        hora_apertura: "12:00",
        hora_cierre: "15:00",
        cerrado: false,
        cruza_medianoche: false,
      },
      {
        dia_semana: 2,
        hora_apertura: "20:00",
        hora_cierre: "23:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, martes(16))).toBe(false);
  });

  it("horario cortado — dentro del segundo turno: abierto", () => {
    const horarios = [
      {
        dia_semana: 2,
        hora_apertura: "12:00",
        hora_cierre: "15:00",
        cerrado: false,
        cruza_medianoche: false,
      },
      {
        dia_semana: 2,
        hora_apertura: "20:00",
        hora_cierre: "23:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, martes(21))).toBe(true);
  });

  it("cruza medianoche — antes de medianoche, mismo día: abierto", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "20:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: true,
      },
    ];
    expect(estaAbierto(horarios, viernes(23))).toBe(true);
  });

  it("cruza medianoche — madrugada del día siguiente, dentro del rango: abierto", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "20:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: true,
      },
    ];
    expect(estaAbierto(horarios, sabado(1, 30))).toBe(true);
  });

  it("cruza medianoche — pasada la hora de cierre: cerrado", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "20:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: true,
      },
    ];
    expect(estaAbierto(horarios, sabado(2, 30))).toBe(false);
  });

  it("día marcado cerrado: cerrado a cualquier hora", () => {
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "00:00",
        hora_cierre: "00:00",
        cerrado: true,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, lunes(14))).toBe(false);
  });

  it("sin registro para el día: cerrado", () => {
    const horarios = [
      {
        dia_semana: 2,
        hora_apertura: "08:00",
        hora_cierre: "22:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, lunes(14))).toBe(false);
  });

  it("conversión de timezone — instante UTC traducido a wall-clock de Argentina", () => {
    // 2024-01-01 03:00 UTC == 2024-01-01 00:00 ART (Argentina UTC-3) == lunes 00:00
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "00:00",
        hora_cierre: "01:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    const instante = new Date(Date.UTC(2024, 0, 1, 3, 0));
    expect(estaAbierto(horarios, instante)).toBe(true);
  });
});

describe("estadoConHorario", () => {
  it("abierto: muestra hora de cierre", () => {
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "09:00",
        hora_cierre: "22:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estadoConHorario(horarios, lunes(14))).toEqual({
      abierto: true,
      detalle: "cierra a las 22:00",
    });
  });

  it("cerrado pero abre más tarde hoy: muestra próxima apertura", () => {
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "09:00",
        hora_cierre: "12:00",
        cerrado: false,
        cruza_medianoche: false,
      },
      {
        dia_semana: 1,
        hora_apertura: "20:00",
        hora_cierre: "23:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estadoConHorario(horarios, lunes(14))).toEqual({
      abierto: false,
      detalle: "abre a las 20:00",
    });
  });

  it("cerrado, hoy ya no abre, mañana sí: muestra 'abre mañana'", () => {
    const horarios = [
      {
        dia_semana: 2,
        hora_apertura: "09:00",
        hora_cierre: "22:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    // lunes 23:00 — hoy (lunes) no hay más; mañana es martes con 09:00
    expect(estadoConHorario(horarios, lunes(23))).toEqual({
      abierto: false,
      detalle: "abre mañana 09:00",
    });
  });

  it("cerrado, próximo turno es en días: usa nombre del día", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "20:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: true,
      },
    ];
    // lunes 14:00 — próximo viernes (4 días después)
    expect(estadoConHorario(horarios, lunes(14))).toEqual({
      abierto: false,
      detalle: "abre vie. 20:00",
    });
  });

  it("sin horarios cargados: detalle null", () => {
    expect(estadoConHorario([], lunes(14))).toEqual({
      abierto: false,
      detalle: null,
    });
  });

  it("abierto cruzando medianoche: cierre del turno anterior", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "20:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: true,
      },
    ];
    expect(estadoConHorario(horarios, sabado(1, 30))).toEqual({
      abierto: true,
      detalle: "cierra a las 02:00",
    });
  });
});

describe("auto-detect cross-midnight (flag faltante)", () => {
  it("estaAbierto — apertura 20:30, cierre 00:00 sin flag: abierto a las 23:00", () => {
    const horarios = [
      {
        dia_semana: 1,
        hora_apertura: "20:30",
        hora_cierre: "00:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, lunes(23))).toBe(true);
  });

  it("estaAbierto — apertura 21:00, cierre 02:00 sin flag: abierto viernes 22:00", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "21:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, viernes(22))).toBe(true);
  });

  it("estaAbierto — apertura 21:00, cierre 02:00 sin flag: abierto sábado 01:00", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "21:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, sabado(1))).toBe(true);
  });

  it("estaAbierto — apertura 21:00, cierre 02:00 sin flag: cerrado sábado 03:00", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "21:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estaAbierto(horarios, sabado(3))).toBe(false);
  });

  it("estadoConHorario — auto-detect: muestra 'cierra a las 02:00'", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "21:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(estadoConHorario(horarios, viernes(23))).toEqual({
      abierto: true,
      detalle: "cierra a las 02:00",
    });
  });
});

describe("proximidadHorario", () => {
  const normal = [
    {
      dia_semana: 1,
      hora_apertura: "08:00",
      hora_cierre: "22:00",
      cerrado: false,
      cruza_medianoche: false,
    },
  ];

  it("abierto, cierra en 60 min: NO cierra pronto", () => {
    const p = proximidadHorario(normal, lunes(21, 0));
    expect(p.cierraPronto).toBe(false);
    expect(p.minutosParaCierre).toBe(60);
  });

  it("abierto, cierra en 20 min: cierra pronto", () => {
    const p = proximidadHorario(normal, lunes(21, 40));
    expect(p.cierraPronto).toBe(true);
    expect(p.minutosParaCierre).toBe(20);
  });

  it("abierto, cierra justo en 30 min: cierra pronto (umbral inclusivo)", () => {
    const p = proximidadHorario(normal, lunes(21, 30));
    expect(p.minutosParaCierre).toBe(30);
    expect(p.cierraPronto).toBe(true);
  });

  it("cruza medianoche, antes de medianoche: minutos al cierre de madrugada", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "20:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: true,
      },
    ];
    // viernes 23:40 → cierra 02:00 = 140 min
    const p = proximidadHorario(horarios, viernes(23, 40));
    expect(p.minutosParaCierre).toBe(140);
    expect(p.cierraPronto).toBe(false);
  });

  it("cruza medianoche, madrugada: cierra pronto", () => {
    const horarios = [
      {
        dia_semana: 5,
        hora_apertura: "20:00",
        hora_cierre: "02:00",
        cerrado: false,
        cruza_medianoche: true,
      },
    ];
    // sábado 01:45 → 15 min para las 02:00 (turno del día anterior)
    const p = proximidadHorario(horarios, sabado(1, 45));
    expect(p.minutosParaCierre).toBe(15);
    expect(p.cierraPronto).toBe(true);
  });

  it("cerrado, abre en 15 min: abre pronto", () => {
    const p = proximidadHorario(normal, lunes(7, 45));
    expect(p.abrePronto).toBe(true);
    expect(p.minutosParaApertura).toBe(15);
    expect(p.cierraPronto).toBe(false);
  });

  it("cerrado, abre en 2 horas: NO abre pronto", () => {
    const p = proximidadHorario(normal, lunes(6, 0));
    expect(p.abrePronto).toBe(false);
    expect(p.minutosParaApertura).toBe(120);
  });

  it("cerrado todo el día: sin proximidad", () => {
    const horarios = [
      {
        dia_semana: 2,
        hora_apertura: "08:00",
        hora_cierre: "22:00",
        cerrado: false,
        cruza_medianoche: false,
      },
    ];
    expect(proximidadHorario(horarios, lunes(14))).toEqual({
      cierraPronto: false,
      minutosParaCierre: null,
      abrePronto: false,
      minutosParaApertura: null,
    });
  });
});
