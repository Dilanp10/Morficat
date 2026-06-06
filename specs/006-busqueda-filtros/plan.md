# Implementation Plan: Búsqueda y Filtros

**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/buscar/page.tsx` | Reusa `HomeListClient` con `autoFocusSearch=true` |
| `components/HomeListClient.tsx` | Lógica compartida con Home |

## Key Decisions

- **KD-1** — Reusar `HomeListClient` en vez de duplicar. `/buscar` solo activa el autoFocus.
- **KD-2** — Búsqueda ILIKE local (frontend). Con 30-50 locales es instantáneo.
- **KD-3** — Sin debounce. Cada keystroke filtra (es operación local barata).
