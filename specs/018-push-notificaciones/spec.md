# Feature Specification: Notificaciones Push

**Feature Branch**: `018-push-notificaciones`
**Created**: 2026-06-23
**Status**: Draft
**Requirements**: REQ-PUSH-001 a REQ-PUSH-003

## Resumen

Haku manda una notificación push real (funciona con la app cerrada) cuando un local guardado como favorito está por abrir (≤30 min). El usuario activa las notificaciones desde `/mas`.

Solo para usuarios autenticados con favoritos guardados.

## User Stories

### US1 — Activar notificaciones (P1)

**Given** el usuario está logueado y tiene favoritos,
**When** va a `/mas` y toca "Activar notificaciones",
**Then** el browser pide permiso y, si se otorga, la subscripción queda guardada.

### US2 — Recibir aviso de apertura (P1)

**Given** el usuario tiene un favorito que abre en ≤30 min,
**When** el cron (cada 5 min, Supabase Edge Function) lo detecta,
**Then** llega una notificación push: *"[nombre] abre en N min"*,
      que al tocarla abre la ficha del local en Haku.

### US3 — Solo 1 notificación por local por día (P1)

**Given** el cron corre cada 5 min,
**Then** el mismo local no genera más de 1 notificación por usuario por día (tabla `push_notif_log`).

## Out of Scope

- "Cierra pronto" por push (ya está en la app en tiempo real)
- Push para usuarios anónimos (sin favoritos no tiene sentido)
- Múltiples devices por usuario (la subscripción es por device, se guardan todas)
- Configuración del umbral por el usuario
