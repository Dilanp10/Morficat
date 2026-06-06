# Feature Specification: Cierra pronto / Abre pronto

**Feature Branch**: `017-cierra-pronto`
**Created**: 2026-06-06
**Status**: Draft
**Requirements**: REQ-CP-001 a REQ-CP-003

## Resumen

Haku existe para responder *"¿qué está abierto ahora?"*. El caso más doloroso es
llegar a un local justo cuando está cerrando. Esta feature agrega conciencia del
**tiempo restante**: cuando un local abierto está por cerrar (≤30 min) muestra
un aviso ámbar con la cuenta regresiva, y cuando un local cerrado está por abrir
(≤30 min) lo señala también.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — "Cierra pronto" (Priority: P1)

Un local abierto que cierra dentro de los próximos 30 minutos se muestra con un
indicador **ámbar (ochre)** y la leyenda *"Cierra en N min"*, en vez del verde
normal de "Abierto".

**Why this priority**: Es el núcleo de la propuesta de valor de la app —
evitar el viaje en vano.

**Independent Test**: Con un local cuyo cierre es a las 22:00, a las 21:40 la
card muestra "Cierra en 20 min" en ámbar.

**Acceptance Scenarios**:

1. **Given** un local abierto que cierra en 20 min, **When** lo veo en Home o en
   la ficha, **Then** veo el punto ámbar y *"Cierra en 20 min"*.
2. **Given** un local abierto que cierra en 90 min, **When** lo veo, **Then** veo
   el estado normal verde *"Abierto · cierra a las…"* (sin aviso).
3. **Given** un local que cierra pasada la medianoche (ej. 02:00) y son las 01:45,
   **Then** veo *"Cierra en 15 min"* en ámbar.
4. **Given** un local con "Cierra pronto", **When** sigue dentro del filtro
   "Abierto ahora", **Then** aparece igual (sigue abierto, no se oculta).

---

### User Story 2 — "Abre pronto" (Priority: P2)

Un local cerrado que abre dentro de los próximos 30 minutos se muestra con el
indicador ámbar y *"Abre en N min"*.

**Why this priority**: Útil al planear ("en 15 min abre"), pero secundario al
caso de cierre. Reusa el mismo mecanismo.

**Acceptance Scenarios**:

1. **Given** un local cerrado que abre en 15 min, **When** lo veo, **Then** veo
   *"Abre en 15 min"* en ámbar.
2. **Given** un local cerrado que abre en 2 horas, **Then** veo el estado normal
   *"Cerrado · abre a las…"*.

## Edge Cases

- **Umbral inclusivo**: exactamente 30 min → cuenta como "pronto".
- **Cruza medianoche**: el cálculo de minutos contempla el cierre de madrugada
  (mismo turno y turno del día anterior).
- **Countdown en vivo**: el `now` ya se refresca cada 60s en Home/ficha/mapa, así
  que "en N min" baja solo cada minuto, sin recarga.
- **Sin horarios cargados**: no se muestra ningún aviso (estado normal).
- **Local que abre más tarde hoy pero falta >30 min**: estado normal "Cerrado".

## Non-Functional Requirements

- **Cálculo puro y testeado**: la lógica vive en `lib/horarios.ts` con tests
  (vitest), sin romper el contrato actual de `estadoConHorario`.
- **Tokens Tierra**: el estado "pronto" usa `--ochre` (clase `bg-ochre`/`text-ochre`).
- **Sin cambios de filtro**: "Cierra pronto" sigue contando como abierto.

## Out of Scope

- Notificaciones push "avisame cuando abra/cierre" → v2 (spec 015).
- Umbral configurable por el usuario → no; constante fija (30 min).
- Cambiar el orden de la lista por proximidad de cierre → v2.
