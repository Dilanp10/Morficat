# Feature Specification: Design System Tierra

**Feature Branch**: `001-design-tierra`
**Created**: 2026-05-15
**Status**: Implemented
**Requirements**: REQ-CORE-006

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Identidad visual coherente en toda la app (Priority: P1)

Cualquier usuario que abra Haku debe percibir una identidad visual consistente y cálida en todas las pantallas. La paleta, tipografía y componentes base se aplican uniformemente.

**Why this priority**: La identidad visual diferencia Haku de Google Maps y refuerza el contexto gastronómico catamarqueño. Sin un sistema coherente, cada pantalla parecería de un producto distinto.

**Independent Test**: Navegar entre Home, Mapa, Ficha y Más. Verificar que: (a) el fondo `#1B1612` se mantiene, (b) los títulos de pantalla están en serif italic terracota, (c) los datos (horarios, distancias) en mono.

**Acceptance Scenarios**:

1. **Given** el usuario abre cualquier pantalla, **When** observa el fondo, **Then** ve el color cálido `#1B1612` (dark) o `#F4EDE1` (light).
2. **Given** un título de pantalla ("Haku.", "Mapa.", "Más."), **When** se renderiza, **Then** está en Instrument Serif italic terracota.
3. **Given** un dato (horario, distancia, contador), **When** se renderiza, **Then** está en JetBrains Mono con color ocre.
4. **Given** un badge de estado de un local, **When** se renderiza, **Then** es un dot + texto mono (no una pill colored).

---

## Edge Cases

- **Sin foto del local**: hero muestra monograma (1ª letra del nombre) sobre gradiente terracota.
- **Sin GPS**: distancia se reemplaza por nombre del barrio en mono color crema-50%.
- **Modo claro**: todos los tokens (`--bg`, `--fg`, etc.) cambian, pero los acentos (`--terra`, `--moss`) se mantienen.

## Non-Functional Requirements

- **Performance**: las 3 fuentes cargan vía `next/font/google` con `display: swap` para evitar FOUC.
- **Accesibilidad**: contraste mínimo WCAG AA en todos los textos.

## Out of Scope

- Múltiples themes adicionales (rojo, azul) — solo Tierra dark/light.
- Personalización por usuario.
