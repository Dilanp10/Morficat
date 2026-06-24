<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read:
- `docs/architecture.md`
- `docs/conventions.md`
- `.specify/memory/constitution.md`
- The current feature being worked on at `specs/NNN-feature-slug/`
<!-- SPECKIT END -->

# Project: Haku — Hyperlocal Gastronomy Discovery for Catamarca

## Overview

**Haku** ("vamos" en quechua) es una app web hiperlocal que ayuda a habitantes y visitantes de Catamarca a descubrir rápidamente dónde comer y tomar algo, con foco principal en saber qué locales están abiertos en ese momento.

El proyecto está construido con **Spec-Driven Development (SDD)** usando el formato Spec Kit + Claude Code.

## Architecture

**Next.js 14 App Router + Supabase**. La app funciona como SPA + SSR sin backend propio: todas las queries van directo del frontend al PostgreSQL de Supabase con la `anon key`, protegidas por Row Level Security. Las mutaciones del admin pasan por server actions con la `service_role key`.

Detalle: ver [`docs/architecture.md`](docs/architecture.md).

## Stack

- **Lenguaje**: TypeScript
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Diseño**: Sistema "Tierra" (warm dark editorial, ver spec 001)
- **Backend / DB**: Supabase (PostgreSQL + Storage + Auth)
- **Mapas**: Leaflet + OpenStreetMap
- **Geocoding**: Nominatim (OSM)
- **Hosting**: Vercel (free tier)
- **Package manager**: pnpm

## Repository structure

```
haku/
├── app/                       # Rutas Next.js App Router
├── components/                # UI reutilizable
├── lib/                       # Lógica de negocio + clientes Supabase
├── public/                    # Assets estáticos + manifest PWA
├── supabase/                  # Schema SQL
├── specs/                     # Specs por feature (Spec Kit format)
│   ├── 001-design-tierra/
│   ├── 002-horarios-distancia/
│   ├── 003-home-lista/
│   └── ...
├── docs/                      # Documentación transversal
│   ├── architecture.md
│   ├── decisions.md
│   ├── glossary.md
│   ├── conventions.md
│   ├── requirements.md
│   ├── roadmap.md
│   └── backlog.md
├── .specify/
│   ├── memory/constitution.md
│   └── templates/             # spec/plan/tasks/checklist templates
├── AGENTS.md
├── BACKLOG.md
└── CLAUDE.md                  # este archivo
```

## Specs (módulos del proyecto)

| # | Feature | Estado | Issue |
|---|---|---|---|
| 001 | [Design System Tierra](specs/001-design-tierra/spec.md) | ✅ | [#1](https://github.com/Dilanp10/Morficat/issues/1) |
| 002 | [Horarios y Distancia](specs/002-horarios-distancia/spec.md) | ✅ | [#10](https://github.com/Dilanp10/Morficat/issues/10) |
| 003 | [Home — Lista de locales](specs/003-home-lista/spec.md) | ✅ | [#2](https://github.com/Dilanp10/Morficat/issues/2) |
| 004 | [Mapa](specs/004-mapa/spec.md) | ✅ | [#3](https://github.com/Dilanp10/Morficat/issues/3) |
| 005 | [Ficha del local](specs/005-ficha-local/spec.md) | ✅ | [#4](https://github.com/Dilanp10/Morficat/issues/4) |
| 006 | [Búsqueda y Filtros](specs/006-busqueda-filtros/spec.md) | ✅ | [#5](https://github.com/Dilanp10/Morficat/issues/5) |
| 007 | [Admin Panel](specs/007-admin/spec.md) | ✅ | [#6](https://github.com/Dilanp10/Morficat/issues/6) |
| 008 | [Auth + Usuarios](specs/008-auth/spec.md) | ✅ | [#8](https://github.com/Dilanp10/Morficat/issues/8) |
| 009 | [Reseñas](specs/009-resenas/spec.md) | ✅ | [#9](https://github.com/Dilanp10/Morficat/issues/9) |
| 010 | [Sugerencias Wizard](specs/010-sugerencias/spec.md) | ✅ | [#7](https://github.com/Dilanp10/Morficat/issues/7) |
| 011 | [Sugerir — Horarios completos](specs/011-sugerir-horarios/spec.md) | ✅ | [#14](https://github.com/Dilanp10/Morficat/issues/14) |
| 012 | [PWA Instalable](specs/012-pwa/spec.md) | ✅ | [#11](https://github.com/Dilanp10/Morficat/issues/11) |
| 013 | [Light Mode (Tierra claro)](specs/013-light-mode/spec.md) | ✅ | [#15](https://github.com/Dilanp10/Morficat/issues/15) |
| 014 | [Lanzamiento Público](specs/014-lanzamiento-publico/spec.md) | ⏳ | [#12](https://github.com/Dilanp10/Morficat/issues/12) |
| 015 | [Roadmap v2+](specs/015-roadmap-v2/spec.md) | 📋 | [#13](https://github.com/Dilanp10/Morficat/issues/13) |
| 016 | [Favoritos](specs/016-favoritos/spec.md) | ✅ | [#17](https://github.com/Dilanp10/Morficat/issues/17) |
| 017 | [Cierra pronto / Abre pronto](specs/017-cierra-pronto/spec.md) | ✅ | [#18](https://github.com/Dilanp10/Morficat/issues/18) |
| 018 | [Notificaciones Push](specs/018-push-notificaciones/spec.md) | ⏳ | — |
| 019 | [Skeletons de carga](specs/019-skeleton-carga/spec.md) | ✅ | — |

## Workflow para features nuevas

```
1. Crear Issue de GitHub con label "spec"
2. Crear specs/NNN-feature-slug/spec.md  (qué hace)
3. Crear specs/NNN-feature-slug/plan.md  (cómo se implementa)
4. Crear specs/NNN-feature-slug/tasks.md (tareas paso a paso)
5. Codear
6. Cerrar Issue con "Closes #N" en el commit
```

## Reglas resumidas (constitución completa en `.specify/memory/constitution.md`)

1. **No code without spec**
2. **MVP scope locked** — features v2 no se tocan
3. **No empty features** en UI
4. **Mobile first** (375px primero)
5. **Tokens Tierra** — usar CSS variables, no hardcodear colores
6. **Datos temporales** marcados con `data_temporal=true`
7. **Cero scraping automático** en producción pública
8. **Simple sobre complejo**

## Comandos

```bash
pnpm dev              # dev server (puerto 3000)
pnpm build            # build de producción (NO con dev activo)
pnpm lint             # ESLint
```

## Paths

- Proyecto: `C:\Users\cabre\dev\morficat`
- Repo: https://github.com/Dilanp10/Morficat
