# Haku — Índice SDD

> App hiperlocal de descubrimiento gastronómico para Catamarca, Argentina.
> "Haku" = "vamos" en quechua.

## Regla fundamental
**No implementar nada sin un spec en `.github/specs/` y su Issue de GitHub correspondiente.**

---

## Stack
| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS + sistema Tierra |
| Backend | Supabase (PostgreSQL + Storage + Auth) |
| Mapas | Leaflet + OpenStreetMap |
| Hosting | Vercel (free tier) |

## Módulos — Specs

| # | Módulo | Spec | Issue | Estado |
|---|---|---|---|---|
| 01 | Sistema de diseño Tierra | [📄](.github/specs/01-design-tierra.md) | [#1](https://github.com/Dilanp10/Morficat/issues/1) | ✅ |
| 02 | Home — Lista de locales | [📄](.github/specs/02-home-lista.md) | [#2](https://github.com/Dilanp10/Morficat/issues/2) | ✅ |
| 03 | Mapa | [📄](.github/specs/03-mapa.md) | [#3](https://github.com/Dilanp10/Morficat/issues/3) | ✅ |
| 04 | Ficha del local | [📄](.github/specs/04-ficha-local.md) | [#4](https://github.com/Dilanp10/Morficat/issues/4) | ✅ |
| 05 | Búsqueda + Filtros | [📄](.github/specs/05-busqueda-filtros.md) | [#5](https://github.com/Dilanp10/Morficat/issues/5) | ✅ |
| 06 | Panel Admin | [📄](.github/specs/06-admin.md) | [#6](https://github.com/Dilanp10/Morficat/issues/6) | ✅ |
| 07 | Wizard de Sugerencias | [📄](.github/specs/07-sugerencias.md) | [#7](https://github.com/Dilanp10/Morficat/issues/7) | ✅ |
| 08 | Auth + Usuarios | [📄](.github/specs/08-auth.md) | [#8](https://github.com/Dilanp10/Morficat/issues/8) | ✅ |
| 09 | Reseñas y Puntuaciones | [📄](.github/specs/09-resenas.md) | [#9](https://github.com/Dilanp10/Morficat/issues/9) | ✅ |
| 10 | Lógica de Horarios y Distancia | [📄](.github/specs/10-horarios-distancia.md) | [#10](https://github.com/Dilanp10/Morficat/issues/10) | ✅ |
| 11 | PWA — Instalación | [📄](.github/specs/11-pwa.md) | [#11](https://github.com/Dilanp10/Morficat/issues/11) | ✅ |
| 12 | Datos MVP → Lanzamiento público | [📄](.github/specs/12-lanzamiento-publico.md) | [#12](https://github.com/Dilanp10/Morficat/issues/12) | ⏳ |
| 13 | Roadmap v2+ | [📄](.github/specs/13-roadmap-v2.md) | [#13](https://github.com/Dilanp10/Morficat/issues/13) | 📋 |
| 14 | Sugerir — Horarios completos | [📄](.github/specs/14-sugerir-horarios.md) | [#14](https://github.com/Dilanp10/Morficat/issues/14) | 🚧 |

## Cómo agregar un feature nuevo
1. Crear Issue en GitHub con label `spec`
2. Crear `.github/specs/NN-nombre.md` con descripción, archivos, criterios de aceptación
3. Agregar la fila en la tabla de arriba
4. Recién entonces escribir código

## Paths importantes
- Proyecto: `C:\Users\cabre\dev\morficat`
- Dev: `pnpm dev` (puerto 3000)
- Build: `pnpm build` (no correr con dev activo)
