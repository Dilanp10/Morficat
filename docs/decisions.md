# Architecture Decision Records (ADR)

> Decisiones técnicas importantes y por qué se tomaron. Una entrada por decisión, formato corto.

---

## D-001 — Next.js App Router en lugar de Pages Router

**Fecha**: 2026-04-15
**Estado**: Aceptada

Se usa App Router porque soporta server components, server actions y métadatos SEO modernos sin overhead. Pages Router queda en mantenimiento.

---

## D-002 — Supabase en lugar de backend propio

**Fecha**: 2026-04-15
**Estado**: Aceptada

Supabase ofrece PostgreSQL + Storage + Auth + RLS en un free tier suficiente para el MVP. Eliminar el backend propio reduce tiempo de desarrollo en ~30 horas.

---

## D-003 — Cálculo de distancia y "abierto ahora" en frontend

**Fecha**: 2026-04-20
**Estado**: Aceptada

Con 30-50 locales, traer todo en una query (~2KB) y procesar en JS es instantáneo. Migrar a PostGIS solo si el catálogo supera ~500 locales.

---

## D-004 — Sistema de diseño "Tierra" (warm dark editorial)

**Fecha**: 2026-05-15
**Estado**: Aceptada

Se descartó el dark/light mode iOS estándar (#000 puro, azul system). Se eligió una identidad editorial cálida (#1B1612 + terracota + serif italic) para diferenciar a Haku de Google Maps y reforzar el contexto gastronómico catamarqueño.

---

## D-005 — Auth opcional, sin gating de la app

**Fecha**: 2026-05-20
**Estado**: Aceptada

La app funciona 100% sin login. Solo se requiere auth para dejar reseñas. Esto reduce fricción para usuarios casuales y turistas.

---

## D-006 — Sin scraping automático en producción pública

**Fecha**: 2026-05-25
**Estado**: Aceptada · Política oficial

Durante el MVP privado se permiten fotos temporales con `data_temporal=true`. Antes del lanzamiento público, todas las fotos deben tener permiso explícito del local. Ver `specs/014-lanzamiento-publico/`.

---

## D-007 — Light mode agregado al MVP (cambio del spec original)

**Fecha**: 2026-06-05
**Estado**: Aceptada

El spec original decía "solo dark mode". Se cambió porque el `ThemeToggle` ya existía en la UI y era confuso que no funcionara. Ver `specs/013-light-mode/`.

---

## D-008 — Spec Kit (estructura `specs/NNN-*/`) en lugar de un solo CLAUDE.md

**Fecha**: 2026-06-05
**Estado**: Aceptada

El CLAUDE.md monolítico se volvió inmanejable. Se migra al formato Spec Kit: una carpeta por feature con `spec.md` + `plan.md` + `tasks.md` + `checklists/`.
