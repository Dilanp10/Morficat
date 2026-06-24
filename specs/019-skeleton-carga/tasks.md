# Tasks: Skeletons de carga

## Componente reutilizable
- [x] T001 `components/LocalCardSkeleton.tsx`: bloque fantasma con la misma grilla
  que `LocalCard` (thumb `size-16`, 2 barras de texto, barra de badge), usando
  `var(--card-2)` + `animate-pulse`. Acepta opcionalmente `count` o se compone afuera.

## Fallbacks (loading.tsx)
- [x] T002 `app/loading.tsx`: encabezado estático real del Home + searchbar
  fantasma + lista de ~6 `LocalCardSkeleton`, dentro del mismo `max-w-2xl`.
- [x] T003 `app/local/[slug]/loading.tsx`: top bar (Link volver real) + hero
  fantasma (misma `aspectRatio`/`maxHeight`) + barras de título + fila badge +
  botones de acción fantasma + 2 secciones skeleton.

## Accesibilidad
- [x] T004 `app/globals.css`: bajo `@media (prefers-reduced-motion: reduce)`,
  neutralizar `animate-pulse` (o equivalente) para los skeletons.

## Verificación
- [x] T005 `pnpm lint` + `tsc --noEmit` limpios.
- [x] T006 Preview con throttling (375px, light+dark): el skeleton del Home y de
  la ficha aparece y se reemplaza sin layout shift evidente.
- [x] T007 `pnpm build` ok.

## Cierre
- [ ] T008 Actualizar `docs/backlog.md`: marcar skeleton como hecho y las otras 2
  mejoras (URL legible / próxima apertura) como ya implementadas. Actualizar tabla
  de specs en `CLAUDE.md` (019). Issue label "spec" + PR.
