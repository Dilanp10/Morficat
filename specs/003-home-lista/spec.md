# Feature Specification: Home — Lista de locales

**Feature Branch**: `003-home-lista`
**Created**: 2026-04-25
**Status**: Implemented
**Requirements**: REQ-CORE-001, REQ-CORE-003, REQ-HOME-001 a REQ-HOME-005

## User Scenarios & Testing *(mandatory)*

### User Story 1 — "Quiero un café AHORA, ¿dónde es el más cercano?" (Priority: P1)

El usuario abre Haku queriendo tomar un café ya. Espera ver una lista de locales abiertos ordenados por cercanía. Toca el primero y resuelve la decisión en menos de 15 segundos.

**Why this priority**: Escenario core #1 del producto.

**Independent Test**: Con GPS, abrir `/`. Verificar: el primer item está abierto + es el más cercano + tiene badge verde + tiene distancia en metros.

**Acceptance Scenarios**:

1. **Given** el usuario abre la app con GPS, **When** la lista carga, **Then** ve solo locales abiertos, ordenados por distancia.
2. **Given** son las 4am (todos cerrados), **When** la lista carga, **Then** ve "No hay locales abiertos ahora" + botón "Ver todos".
3. **Given** sin GPS, **When** la lista carga, **Then** cada card muestra el barrio en vez de los metros.

### User Story 2 — "Es sábado a la noche, ¿dónde tomamos algo?" (Priority: P1)

Filtra por categoría "Bar" sin perder el filtro de "Abierto ahora".

**Independent Test**: Tocar chip "Bar". Resultado: solo bares abiertos.

**Acceptance Scenarios**:

1. **Given** lista con filtro "Abierto" activo, **When** toca chip "Bar", **Then** ve solo bares abiertos.
2. **Given** chip activo, **When** lo toca de nuevo, **Then** se desactiva.

### User Story 3 — "Es feriado, ¿qué está abierto?" (Priority: P1)

El filtro "Abierto ahora" arranca activado. El usuario no necesita configurar nada.

## Edge Cases

- Lista vacía (sin locales en DB): mensaje "Todavía no hay lugares cargados".
- Búsqueda sin matches: mensaje "No encontramos lugares con ese nombre".
- GPS denegado a mitad de uso: la lista se reorganiza por nombre alfabético.

## Non-Functional Requirements

- **REQ-CORE-001**: Tiempo a primera tarjeta visible < 3 segundos en 4G.
- **Performance**: filtros y orden corren en frontend con < 30ms para 100 locales.

## Out of Scope

- Paginación (con < 500 locales no aplica).
- Infinite scroll.
- Vista en grilla (solo lista vertical).
