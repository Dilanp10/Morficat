# Haku — Project Constitution

> Reglas inquebrantables del proyecto. Cualquier excepción requiere actualización del spec antes de codear.

## Gate 1 — Spec Before Code

**No se escribe código que no esté respaldado por una spec aprobada en `specs/NNN-feature/spec.md`.**

Si descubrís un cambio necesario durante la implementación:
1. Pausá el código
2. Actualizá la spec
3. Continuá

## Gate 2 — Scope Lock

**El MVP no acepta features de `docs/roadmap.md` (v2+).**

Lista cerrada de features MVP: ver `specs/` (carpetas 001-013).
Cualquier cosa de la 015 (roadmap v2+) requiere terminar el MVP primero.

## Gate 3 — No Empty Features

**No mostrar en UI features que no existan todavía** (botones de delivery, promos, favoritos, etc. están prohibidos hasta que tengan spec implementada).

## Gate 4 — Mobile First

Diseñar siempre para 375px primero. Escalar a desktop después.

## Gate 5 — Tierra Design System

Todos los componentes nuevos respetan los tokens de `specs/001-design-tierra/spec.md`. No introducir colores fuera de la paleta sin actualizar el spec.

## Gate 6 — Datos Temporales

Datos cargados durante el MVP deben llevar `data_temporal = true`. Antes de hacer la app pública, completar el checklist en `specs/014-lanzamiento-publico/`.

## Gate 7 — Privacidad y Permisos

- Cero scraping automático en producción pública.
- Fotos solo con permiso explícito del local.
- RLS de Supabase activo siempre.

## Gate 8 — Simple Sobre Complejo

Si hay duda entre dos implementaciones, elegir la más simple.
Si una feature requiere infraestructura compleja (queue, cache, microservicio), eso es señal de que está fuera del MVP.
