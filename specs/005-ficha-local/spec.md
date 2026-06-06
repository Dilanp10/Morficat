# Feature Specification: Ficha del Local

**Feature Branch**: `005-ficha-local`
**Created**: 2026-05-05
**Status**: Implemented
**Requirements**: REQ-DET-001 a REQ-DET-005

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Ver toda la info de un local de una sola pantalla (Priority: P1)

El usuario toca una card y aterriza en una ficha completa: hero, horarios, contacto, ubicación, atributos y reseñas. Sin paginar, sin tabs.

**Why this priority**: Es el punto donde se decide si ir o no.

**Independent Test**: Abrir `/local/cafe-del-centro`. Scrollear de arriba a abajo. Verificar todas las secciones presentes.

**Acceptance Scenarios**:

1. **Given** un local con foto, **When** carga la ficha, **Then** el hero muestra la foto en aspect 16:9 con back/share buttons sobreimpresos.
2. **Given** un local sin foto, **When** carga la ficha, **Then** el hero muestra la 1ª letra del nombre sobre gradiente terracota.
3. **Given** ficha cargada, **When** ve el badge de estado, **Then** dice "Abierto" o "Cerrado" en tiempo real (se actualiza cada 60s).
4. **Given** local con WhatsApp + Instagram + Teléfono, **When** ve las acciones, **Then** WhatsApp es primario terracota, Instagram es ghost.
5. **Given** lunes hoy, **When** ve la tabla de horarios, **Then** la fila "Lunes" tiene color terracota y label "HOY".

### User Story 2 — Compartir el local con un amigo (Priority: P2)

**Acceptance Scenarios**:

1. **Given** ficha abierta, **When** toca compartir, **Then** abre Web Share API en mobile o copia URL en desktop.
2. **Given** URL copiada, **When** se pega, **Then** abre directo en la ficha (SSR + SEO meta tags).

## Edge Cases

- Slug no existe → `notFound()` → 404.
- Local sin descripción → la sección no se renderiza.
- Local sin atributos activos → la sección "El local tiene" no aparece.

## Non-Functional Requirements

- **SEO**: `generateMetadata` con título dinámico, description, og:image.
- **Tiempo a interactivo**: < 2s con foto cacheada.

## Out of Scope

- Galería de múltiples fotos (solo `imagen_principal`).
- Botón "cómo llegar" externo a Google Maps (mini-mapa embebido en su lugar).
- Comentarios/respuestas a reseñas (v2).
