# Feature Specification: Wizard de Sugerencias

**Feature Branch**: `010-sugerencias`
**Status**: Implemented
**Requirements**: REQ-SUG-001 a REQ-SUG-004

## User Stories

### User Story 1 — Sugerir un local nuevo sin crear cuenta (P2)
**Independent Test**: Ir a `/sugerir` sin login → completar wizard → ver "¡Gracias!".

**Acceptance Scenarios**:
1. **Given** wizard paso 1, **When** escribe nombre del lugar, **Then** habilita "Siguiente".
2. **Given** paso "Ubicación", **When** toca "Usar mi ubicación actual", **Then** GPS + Nominatim retornan dirección legible.
3. **Given** paso "Fotos", **When** sube 3 imágenes, **Then** se guardan en bucket `sugerencias`.
4. **Given** wizard completado, **When** envía, **Then** se inserta fila en `sugerencias` y aparece en `/admin/sugerencias`.

## Edge Cases
- GPS rechazado → muestra error y permite escribir manualmente.
- Sin internet al subir foto: error claro, permite reintentar.
- Más de 3 fotos seleccionadas: solo se toman las primeras 3.

## Non-Functional
- Inserción anónima en `sugerencias` (RLS permite `INSERT` para `anon`).
- Fotos: máx 5MB c/u, formatos jpg/png/webp.

## Out of Scope
- Editar una sugerencia ya enviada.
- Notificación al usuario cuando se procesa (email manual por ahora).
