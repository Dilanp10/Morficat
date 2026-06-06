# Feature Specification: Favoritos

**Feature Branch**: `016-favoritos`
**Created**: 2026-06-06
**Status**: Draft
**Requirements**: REQ-FAV-001 a REQ-FAV-005

## Resumen

El usuario puede guardar locales como favoritos con un ♥ y volver a verlos
rápido filtrando la lista del Home. Funciona **sin cuenta** (guardado en el
dispositivo) y, al crear cuenta o iniciar sesión, los favoritos del dispositivo
se **migran** a su cuenta y quedan sincronizados entre dispositivos.

Respeta el ADN de Haku: *"cuenta opcional — sin login podés ver todo"*.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Guardar / quitar un favorito (Priority: P1)

Desde la card del Home/Buscar o desde la ficha del local, el usuario toca un ♥
para guardar el lugar. Vuelve a tocarlo para quitarlo.

**Why this priority**: Es el núcleo de la feature; sin esto no hay nada.

**Independent Test**: Tocar el ♥ en una card y verificar que cambia de estado y
persiste tras recargar.

**Acceptance Scenarios**:

1. **Given** un invitado en el Home, **When** toca el ♥ de un local, **Then** el
   ♥ se rellena y el local queda guardado tras recargar la página.
2. **Given** un local ya guardado, **When** toca el ♥ otra vez, **Then** se vacía
   y el local deja de estar en favoritos.
3. **Given** un usuario logueado, **When** toca el ♥, **Then** el favorito se
   persiste en su cuenta (visible en otro dispositivo logueado).

---

### User Story 2 — Ver solo mis favoritos (Priority: P1)

En el Home aparece un chip "♥ Favoritos" junto a "Abierto ahora". Al activarlo,
la lista muestra únicamente los locales guardados.

**Why this priority**: Guardar sin poder reencontrar no sirve. Reusa la lista
existente, costo bajo.

**Independent Test**: Guardar 2 locales, activar el chip, verificar que la lista
muestra exactamente esos 2.

**Acceptance Scenarios**:

1. **Given** 3 locales guardados, **When** activo el chip "♥ Favoritos", **Then**
   la lista muestra solo esos 3 (combinable con "Abierto ahora" y categorías).
2. **Given** ningún local guardado, **When** activo el chip, **Then** veo un
   empty state que invita a guardar tocando el ♥.

---

### User Story 3 — Migración invitado → cuenta (Priority: P2)

Un invitado que guardó favoritos y luego crea cuenta / inicia sesión no pierde
nada: sus favoritos del dispositivo pasan a su cuenta automáticamente.

**Why this priority**: Sin esto, el híbrido frustra (perdés lo guardado al
loguearte). Pero la feature ya aporta valor sin esto.

**Independent Test**: Como invitado guardar 2 locales, crear cuenta, verificar
que siguen guardados y que se borraron del almacenamiento local.

**Acceptance Scenarios**:

1. **Given** un invitado con 2 favoritos locales, **When** inicia sesión, **Then**
   esos 2 quedan en su cuenta y el almacenamiento local queda limpio.
2. **Given** un favorito que ya existía en la cuenta y también localmente, **When**
   se migra, **Then** no se duplica (idempotente).

## Edge Cases

- **Invitado, primer render**: el servidor no puede leer el almacenamiento local,
  así que el ♥ se hidrata en el cliente tras montar (puede haber un parpadeo
  breve). Aceptable.
- **Local borrado / desactivado** que estaba en favoritos: se ignora al listar
  (no rompe). Para invitados, se limpia del almacenamiento cuando no matchea.
- **Doble toque rápido** en el ♥: la UI es optimista; si la escritura falla,
  revierte el estado y no se cae.
- **Sin conexión** (PWA): invitado funciona normal (local). Logueado: el toggle
  optimista revierte si falla la server action.

## Non-Functional Requirements

- **Performance**: el filtro de favoritos es client-side sobre la lista ya
  cargada; sin round-trips extra al filtrar.
- **Accesibilidad**: el botón ♥ tiene `aria-pressed` y `aria-label`
  ("Guardar en favoritos" / "Quitar de favoritos"); tap target ≥ 40px.
- **Tokens Tierra**: estado activo usa `var(--terra)`; nada hardcodeado.
- **Mobile first**: el ♥ no interfiere con el tap a la card (área propia).

## Out of Scope

- Colecciones / listas múltiples ("Para ir con amigos", etc.) → v2.
- Compartir una lista de favoritos → v2.
- Notificaciones cuando un favorito abre / cambia horario → v2.
- Orden manual de favoritos → v2.
