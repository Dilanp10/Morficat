# Feature Specification: Búsqueda y Filtros

**Feature Branch**: `006-busqueda-filtros`
**Status**: Implemented
**Requirements**: REQ-SRCH-001, REQ-SRCH-002, REQ-SRCH-003

## User Stories

### User Story 1 — Buscar un lugar por nombre (P1)
**Independent Test**: Escribir "café" → ver solo locales con "café" en nombre, categoría o tipo de comida.

**Acceptance Scenarios**:
1. **Given** input vacío, **When** escribe "café", **Then** resultados se actualizan sin submit.
2. **Given** búsqueda activa, **When** combina con chip "Bar", **Then** muestra solo bares que contienen "café".

### User Story 2 — Filtrar por atributos físicos (P2)
**Independent Test**: Activar filtro "Terraza" → solo locales con `atributos.terraza = true`.

## Edge Cases
- Sin resultados: "No encontramos lugares con ese nombre".
- Categoría sin lugares activos: el chip sigue clickeable pero el resultado es vacío.

## Out of Scope
- Búsqueda por descripción (puede agregar ruido).
- Filtros geo (radio en km) — el orden por distancia ya cubre eso.
