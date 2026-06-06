# Tasks: Home — Lista

**Branch**: `003-home-lista`

---

## Phase 1: Server side

- [x] T001 `listarLugaresActivos()` con `categoria + horarios + resenas` — `lib/lugares-public.ts`
- [x] T002 `listarCategoriasPublic()` — `lib/lugares-public.ts`
- [x] T003 Server component `app/page.tsx` con `Promise.all`

## Phase 2: GPS + cálculos

- [x] T004 [US1] Hook navigator.geolocation con states (loading, granted, denied)
- [x] T005 [US1] Enriquecer cada lugar con `distanciaKm`, `abierto`, `detalleHorario`

## Phase 3: UI

- [x] T006 [US1] `LocalCard` con thumb 1:1, serif italic nombre, dot badge
- [x] T007 [US2] `FiltrosChips` con "Abierto ahora" + categorías + "Filtros"
- [x] T008 [US2] `FiltrosAvanzados` panel desplegable con atributos
- [x] T009 `SearchBar` con autoFocus opcional

## Phase 4: Estados

- [x] T010 Empty state: "No hay locales abiertos ahora"
- [x] T011 No-GPS banner: "Activá la ubicación para ver distancias"
- [x] T012 Stats row en mono ("2 resultados · 2 abiertos · 5 total")
