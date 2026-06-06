# Feature Specification: Mapa

**Feature Branch**: `004-mapa`
**Created**: 2026-05-01
**Status**: Implemented
**Requirements**: REQ-MAP-001 a REQ-MAP-003

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Explorar locales abiertos en el mapa (Priority: P2)

El usuario quiere ver geográficamente qué locales hay alrededor, diferenciados visualmente entre abiertos y cerrados.

**Why this priority**: P2 porque el flujo principal es la lista. El mapa es complementario para exploración.

**Independent Test**: Ir a `/mapa`. Verificar: (a) mapa centrado en Catamarca capital sin GPS, (b) pines terracota = abiertos, pines crema-30 = cerrados, (c) tap en pin abre popup.

**Acceptance Scenarios**:

1. **Given** sin GPS, **When** entra a `/mapa`, **Then** el mapa se centra en `(-28.4696, -65.7852)` con zoom 14.
2. **Given** pines visibles, **When** toca uno abierto, **Then** popup muestra nombre + dot moss + "Abierto" + botón "Ver ficha".
3. **Given** popup abierto, **When** toca "Ver ficha", **Then** navega a `/local/[slug]`.
4. **Given** GPS activo, **When** entra a `/mapa`, **Then** ve un círculo azul en su posición.

## Edge Cases

- Local con `(lat, lng) = (0, 0)`: filtrar como dato corrupto.
- Sin internet: tiles de OpenStreetMap no cargan → el contenedor queda gris.

## Non-Functional Requirements

- **Performance**: Leaflet se carga vía `next/dynamic` (sin SSR) para no bloquear el LCP.
- **Bundle**: el mapa no se descarga si el usuario no visita `/mapa`.

## Out of Scope

- Mapa offline (tiles cacheados).
- Clustering de pines (innecesario con < 100 locales).
- Mapa con filtros: usar `/buscar` para eso.
