# Feature Specification: Horarios y Distancia (módulo core)

**Feature Branch**: `002-horarios-distancia`
**Created**: 2026-04-20
**Status**: Implemented
**Requirements**: REQ-CORE-005, REQ-HOR-001 a REQ-HOR-005

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Saber si un local está abierto AHORA (Priority: P1)

El usuario abre la app y necesita saber, en milisegundos, qué locales están abiertos en ese exact momento. El cálculo debe contemplar horarios cortados, horarios que cruzan medianoche y días sin atención.

**Why this priority**: Este es el dolor protagonista del MVP. Sin esto, la app no resuelve el problema.

**Independent Test**: Cargar un local con horario `Lun 12:00-15:00 + 20:00-23:00`. A las 13:00 debe figurar "Abierto", a las 16:00 "Cerrado", a las 21:00 "Abierto" otra vez.

**Acceptance Scenarios**:

1. **Given** un local con horario `09:00-22:00` el Lunes, **When** son las 14:00 del Lunes, **Then** estado = "Abierto · cierra a las 22:00".
2. **Given** un local con horario `12:00-15:00 + 20:00-23:00` el Sábado, **When** son las 17:00 del Sábado, **Then** estado = "Cerrado · abre a las 20:00".
3. **Given** un local con horario `20:00-02:00` el Viernes (cruza medianoche), **When** es la 01:30 del Sábado, **Then** estado = "Abierto".
4. **Given** un local sin horario cargado para Domingo, **When** es Domingo, **Then** estado = "Cerrado".

### User Story 2 — Saber qué tan lejos está un local (Priority: P1)

El usuario quiere ver los locales ordenados del más cercano al más lejano y saber cuántos metros/km hay hasta cada uno.

**Why this priority**: El criterio de orden principal es la cercanía. Sin distancia precisa, el listado no tiene sentido.

**Independent Test**: Con GPS en Plaza 25 de Mayo, el local "Café del Centro" (a 200m) debe aparecer antes que "Café Diario" (a 600m).

**Acceptance Scenarios**:

1. **Given** GPS activo en (-28.4696, -65.7852), **When** la lista carga, **Then** los locales se ordenan por distancia Haversine ascendente.
2. **Given** GPS denegado, **When** la lista carga, **Then** las cards muestran el `barrio` en vez de los metros.
3. **Given** un local a 0.18 km, **When** se renderiza, **Then** la card muestra "180 m" (no "0.18 km").

## Edge Cases

- **Horario cargado con `hora_apertura > hora_cierre` sin `cruza_medianoche=true`**: tratar como dato corrupto, retornar "Cerrado".
- **GPS con baja precisión**: aceptar igual y mostrar la distancia calculada.
- **Coordenadas del local en 0,0**: filtrar como dato faltante.

## Non-Functional Requirements

- **Performance**: el cálculo `estadoConHorario` corre en < 1ms por local.
- **Precisión**: Haversine con error < 1% para distancias < 50 km.

## Out of Scope

- Geofencing (notificaciones por proximidad).
- Distancia caminando vs en auto (todo es línea recta).
- Tiempo de viaje estimado.
