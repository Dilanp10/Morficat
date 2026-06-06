# Feature Specification: PWA Instalable

**Feature Branch**: `012-pwa`
**Status**: Implemented
**Requirements**: REQ-CORE-002

## User Stories

### User Story 1 — Instalar Haku como app en el celular (P2)
**Acceptance Scenarios**:
1. **Given** Android Chrome, **When** abre `haku.app` por 2da vez, **Then** ve "Agregar a pantalla principal" como opción.
2. **Given** iOS Safari, **When** toca compartir → "Add to Home Screen", **Then** se agrega con ícono Haku.
3. **Given** Haku instalado, **When** lo abre, **Then** no se ve la barra del navegador.

## Edge Cases
- Navegador sin soporte PWA: la app funciona igual, solo no se instala.

## Out of Scope
- Notificaciones push (v2).
- Modo offline real (v2).
- Custom splash screen iOS (PWA usa el ícono).
