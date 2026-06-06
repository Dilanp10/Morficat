# Implementation Plan: Home — Lista

**Branch**: `003-home-lista`
**Spec**: [spec.md](./spec.md)
**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/page.tsx` | Server component que fetch lugares + categorías |
| `components/HomeListClient.tsx` | Client component con toda la lógica de filtros, orden, GPS |
| `components/LocalCard.tsx` | Card editorial por local |
| `components/SearchBar.tsx` | Input de búsqueda |
| `components/FiltrosChips.tsx` | Chips serif italic con underline |
| `components/FiltrosAvanzados.tsx` | Panel de atributos desplegable |
| `lib/lugares-public.ts` | `listarLugaresActivos()`, `listarCategoriasPublic()` |

## Key Decisions

- **KD-1** — Fetch único de TODOS los lugares activos. Frontend filtra y ordena. No paginación.
- **KD-2** — Filtro "Abierto ahora" activo por defecto.
- **KD-3** — Layout editorial con hairline separators, sin cards con fondo.
- **KD-4** — Estado actualizado cada 60s (intervalo) sin recargar.

## Risks

- **Catálogo > 500 locales**: migrar a paginación + queries selectivas.
- **GPS lento (>8s)**: timeout y fallback a vista sin GPS.
