# Feature Specification: Admin Panel

**Feature Branch**: `007-admin`
**Status**: Implemented
**Requirements**: REQ-ADM-001 a REQ-ADM-006, REQ-SEC-001, REQ-SEC-003

## User Stories

### User Story 1 — Cargar un local nuevo (P1)
**Independent Test**: Login con `ADMIN_PASSWORD` → `/admin` → "Nuevo lugar" → completar formulario → guardar → ver en listado.

**Acceptance Scenarios**:
1. **Given** sesión admin activa, **When** crea lugar con nombre, categoría, coords y horarios, **Then** se guarda en Supabase y aparece en listado.
2. **Given** lugar existente, **When** edita campos y guarda, **Then** cambios persisten.

### User Story 2 — Desactivar un local sin borrarlo (P1)
**Independent Test**: Toggle "Activo" → ver que desaparece de Home pero sigue en `/admin`.

### User Story 3 — Revisar sugerencias de usuarios (P2)
**Independent Test**: Enviar sugerencia desde `/sugerir` → ir a `/admin/sugerencias` → ver con fotos/audio → marcar como revisada.

## Edge Cases
- Contraseña incorrecta: muestra error sin pista del valor correcto.
- Cookie expira: redirige a `/admin/login`.
- Upload de imagen > 5MB: rechaza con mensaje claro.

## Non-Functional
- **Seguridad**: cookie firmada HMAC-SHA256, `ADMIN_PASSWORD` en env var.
- **RLS**: escritura solo con `service_role` key, nunca expuesta al cliente.

## Out of Scope
- CRUD de categorías y tipos de comida (directo en Supabase Dashboard).
- Dashboard con métricas (v2).
- Multi-usuario admin con roles.
