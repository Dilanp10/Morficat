# Tasks: Cierra pronto / Abre pronto

## Lógica + tests
- [ ] T001 `lib/constants.ts`: `MINUTOS_CIERRA_PRONTO = 30`, `MINUTOS_ABRE_PRONTO = 30`.
- [ ] T002 `lib/horarios.ts`: tipo `ProximidadHorario` + `proximidadHorario()` + helper `minutosHastaCierre()` (reusa la detección de turno activo, incluye cruza medianoche).
- [ ] T003 `lib/horarios.test.ts`: casos — cierra >30 (no), cierra 20 (sí), umbral 30 inclusivo, cruza medianoche (mismo día y madrugada), abre 15 (sí), abre 120 (no), cerrado todo el día (todo null/false).

## UI
- [ ] T004 `components/BadgeEstado.tsx`: props `cierraPronto`/`abrePronto`/`minutos`; tri-estado ámbar con countdown "Cierra/Abre en N min".
- [ ] T005 `components/EstadoBadgeLive.tsx`: calcular `proximidadHorario` y pasar al badge.
- [ ] T006 `components/LocalCard.tsx`: campos `cierraPronto`/`abrePronto`/`minutosEstado` en `LocalCardData`; pasarlos al badge.
- [ ] T007 `components/HomeListClient.tsx`: calcular `proximidadHorario` en `enriquecidos` y completar los campos de la card.
- [ ] T008 `components/LocalMap.tsx`: en el popup, mostrar "Cierra en N min" (ámbar) cuando aplique.

## Verificación
- [ ] T009 `pnpm test` (vitest) verde.
- [ ] T010 `pnpm lint` + `tsc --noEmit` limpios.
- [ ] T011 Verificar en preview (375px, light+dark): card y ficha muestran el estado ámbar correctamente.
- [ ] T012 `pnpm build` ok.

## Cierre
- [ ] T013 Issue label "spec", branch + PR, actualizar tabla de specs en `CLAUDE.md`.
