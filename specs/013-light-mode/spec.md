# Feature Specification: Light Mode (Tierra claro)

**Feature Branch**: `013-light-mode`
**Status**: Implemented
**Requirements**: REQ-CORE-006
**Extends**: [Spec 001 — Design System Tierra](../001-design-tierra/spec.md)

## User Stories

### User Story 1 — Usar Haku en modo claro durante el día (P2)
**Acceptance Scenarios**:
1. **Given** `/mas` con tema dark, **When** toca "☀ Claro", **Then** la app cambia a fondo cream cálido con transición de 200ms.
2. **Given** recarga la página después de elegir light, **When** carga, **Then** sigue en light (sin flash de dark).
3. **Given** light mode, **When** mira los acentos (terra, moss), **Then** se mantienen iguales que en dark.

## Edge Cases
- Usuario sin preferencia guardada: arranca con el tema del sistema (`prefers-color-scheme`).
- Cambio de tema en mitad de un mapa abierto: el mapa Leaflet se rerenderiza correctamente.

## Out of Scope
- Temas personalizados (rojo, azul).
- Theme color del navegador dinámico (queda en `#1B1612`).
