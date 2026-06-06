# Feature Specification: Auth + Usuarios

**Feature Branch**: `008-auth`
**Status**: Implemented
**Requirements**: REQ-AUTH-001 a REQ-AUTH-004

## User Stories

### User Story 1 — Usar Haku como invitado (P1)
El usuario no quiere crear cuenta. Toda la app funciona igual.

**Acceptance Scenarios**:
1. **Given** primer acceso, **When** ve WelcomeOverlay, **Then** puede tocar "Continuar como invitado" y usar todo.
2. **Given** invitado, **When** intenta dejar reseña, **Then** ve "Iniciá sesión para dejar reseña" con botones.

### User Story 2 — Crear cuenta y loguearse (P2)
**Independent Test**: Signup con email + password + nombre → confirmar email (Supabase) → login → ver nombre en `/mas`.

## Edge Cases
- Email ya registrado: mensaje "Ya existe una cuenta con este email".
- Email no confirmado: login bloqueado hasta confirmar.

## Out of Scope
- OAuth (Google, Apple) — v2.
- Recuperar contraseña — v2.
- Cambio de email — v2.
