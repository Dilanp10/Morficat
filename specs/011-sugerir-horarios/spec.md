# Feature Specification: Sugerir — Horarios completos

**Feature Branch**: `011-sugerir-horarios`
**Status**: Implemented
**Requirements**: REQ-SUG-005
**Extends**: [Spec 010 — Wizard de Sugerencias](../010-sugerencias/spec.md)

## User Stories

### User Story 1 — Capturar horarios completos en el wizard (P2)
El usuario que sugiere un local quiere indicar horarios de los 7 días con interfaz amigable.

**Acceptance Scenarios**:
1. **Given** paso "Horarios" del wizard, **When** toca el botón "CERRADO" de un día, **Then** el día queda marcado como cerrado y los selectores de hora se ocultan.
2. **Given** día abierto, **When** toca "+ segundo turno", **Then** se agrega un segundo rango de hora (horario cortado).
3. **Given** lunes con horario `09:00-22:00`, **When** toca "Lun-Vie iguales", **Then** martes-viernes copian el horario del lunes.
4. **Given** wizard enviado con horarios, **When** el admin abre la sugerencia, **Then** ve el horario formateado como texto en el campo `contenido`.

### User Story 2 — Indicar comportamiento en feriados (P2)
**Acceptance Scenarios**:
1. **Given** sección "Feriados", **When** selecciona "Sí, abre como día normal", **Then** se incluye en el texto serializado.

## Edge Cases
- Usuario salta el paso sin tocar nada: no se incluye sección de horarios en el texto.
- Usuario marca todos los días cerrados: se serializan todos como "cerrado".

## Out of Scope
- Validación de coherencia (ej: cierre < apertura sin cruza-medianoche).
- Auto-cargar horarios al lugar cuando se aprueba (admin lo copia manual).
