# Feature Specification: Reseñas

**Feature Branch**: `009-resenas`
**Status**: Implemented
**Requirements**: REQ-RES-001 a REQ-RES-004

## User Stories

### User Story 1 — Dejar una reseña con estrellas + texto (P2)
**Acceptance Scenarios**:
1. **Given** usuario autenticado, **When** en la ficha selecciona 5 estrellas y escribe texto, **Then** submit crea su reseña.
2. **Given** usuario con reseña existente, **When** la edita y guarda, **Then** se hace upsert (no se duplica).

### User Story 2 — Ver promedio del local (P1)
**Acceptance Scenarios**:
1. **Given** local con 3 reseñas (5, 4, 5), **When** entra a la ficha, **Then** ve "4.7" + estrellas + "(3)".
2. **Given** local sin reseñas, **When** entra a la ficha, **Then** no ve sección de promedio.

## Edge Cases
- Usuario elimina su reseña → promedio se recalcula sin recargar (revalidatePath).
- Puntuación fuera de 1-5: rechazada por constraint en DB.

## Out of Scope
- Respuestas del dueño a las reseñas (v2).
- Reportar reseña abusiva (v2).
- Subir fotos en la reseña (v2).
