# Implementation Plan: Horarios y Distancia

**Branch**: `002-horarios-distancia`
**Spec**: [spec.md](./spec.md)
**Status**: Implemented

## Technical Context

**Stack**: TypeScript puro. Sin dependencias externas. Toda la lógica corre en frontend.

## Files

| Archivo | Rol |
|---|---|
| `lib/horarios.ts` | `estaAbierto()`, `estadoConHorario()`, `diaActualEnArgentina()`, `horariosDelDia()` |
| `lib/distancia.ts` | `calcularDistanciaKm()` (Haversine), `formatearDistancia()` |
| `lib/constants.ts` | `DIAS_SEMANA`, `TIMEZONE`, coordenadas default de Catamarca |

## Key Decisions (KD)

- **KD-1** — Timezone UTC-3 hardcodeado. Argentina no cambia horario.
- **KD-2** — Cálculo en frontend, no en SQL. Con 30-50 locales es instantáneo y evita el costo de mantener funciones en PostgreSQL.
- **KD-3** — Haversine en lugar de PostGIS. Suficiente precisión, cero dependencias.
- **KD-4** — `cruza_medianoche` como flag explícito en la fila de horario, no inferido del rango.

## Algoritmo `estaAbierto`

```
1. Obtener hora actual en AR (UTC-3)
2. Obtener día actual (0=Domingo .. 6=Sábado)
3. Para cada horario del día:
   - Si cerrado=true → skip
   - Si cruza_medianoche → comparar con día anterior también
   - Si hora_actual entre apertura y cierre → return true
4. Return false
```

## Risks

- **Cambio de DST en otros países**: irrelevante porque hardcodeamos UTC-3.
- **Reloj del cliente desincronizado**: aceptable, el desfase es de segundos.
