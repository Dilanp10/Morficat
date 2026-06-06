# Tasks: Horarios y Distancia

**Branch**: `002-horarios-distancia`
**Prerequisites**: spec.md ✅ · plan.md ✅

---

## Phase 1: Constantes y types

- [x] T001 Definir `DIAS_SEMANA` (0=Dom, 6=Sáb) y `TIMEZONE_AR` — `lib/constants.ts`
- [x] T002 Tipo `Horario` (id, lugar_id, dia_semana, hora_apertura, hora_cierre, cerrado, cruza_medianoche) — `lib/types.ts`

## Phase 2: Lógica de horarios

- [x] T003 [US1] Función `diaActualEnArgentina(): 0-6` — `lib/horarios.ts`
- [x] T004 [US1] Función `horariosDelDia(horarios, dia): Horario[]` — `lib/horarios.ts`
- [x] T005 [US1] Función `estaAbierto(horarios, now): boolean` con soporte cruza_medianoche — `lib/horarios.ts`
- [x] T006 [US1] Función `estadoConHorario(horarios, now): { abierto, detalle }` — `lib/horarios.ts`

## Phase 3: Lógica de distancia

- [x] T007 [US2] Función `calcularDistanciaKm(lat1, lng1, lat2, lng2): number` (Haversine) — `lib/distancia.ts`
- [x] T008 [US2] Función `formatearDistancia(km): string` (180m / 2.4 km) — `lib/distancia.ts`

## Phase 4: Polish

- [x] T009 Testing manual de horario cortado a 14:00 / 17:00 / 21:00
- [x] T010 Testing manual de cruce medianoche a 01:30 del día siguiente
