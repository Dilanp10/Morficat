# Implementation Plan: Design System Tierra

**Branch**: `001-design-tierra`
**Spec**: [spec.md](./spec.md)
**Status**: Implemented

## Technical Context

**Stack**: Tailwind CSS + CSS variables + `next/font/google`.

## Architecture

Todos los tokens viven como CSS variables en `:root` (modo claro) con overrides en `.dark` (modo oscuro). Tailwind config los expone como utility classes.

### Tokens de color

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--bg` | `#F4EDE1` | `#1B1612` | Fondo principal |
| `--bg-deep` | `#EDE2D0` | `#14100D` | Bottom nav, modales |
| `--card-bg` | `#FAF6EE` | `#25201A` | Cards |
| `--card-2` | `#F0E8D8` | `#2E2820` | Inputs |
| `--fg` | `#1B1612` | `#F4EDE1` | Texto principal |
| `--fg-70` | rgba(27,22,18,0.70) | rgba(244,237,225,0.70) | Texto secundario |
| `--fg-50` | rgba(27,22,18,0.50) | rgba(244,237,225,0.50) | Texto terciario |
| `--fg-30` | rgba(27,22,18,0.30) | rgba(244,237,225,0.30) | Hints |
| `--line` | rgba(27,22,18,0.08) | rgba(244,237,225,0.08) | Separadores |
| `--terra` | `#D67849` | (igual) | Acento principal |
| `--terra-deep` | `#A85A30` | (igual) | Hover, gradiente |
| `--ochre` | `#C99347` | (igual) | Section labels, datos |
| `--moss` | `#8AA265` | (igual) | Abierto |
| `--rust` | `#C0664E` | (igual) | Cerrado |

### Tipografía

| Familia | Variable | Uso |
|---|---|---|
| Instrument Serif italic | `--font-serif` | Títulos, brand moments |
| Inter | `--font-sans` | UI body |
| JetBrains Mono | `--font-mono` | Datos, section labels |

## Files

| Archivo | Rol |
|---|---|
| `app/globals.css` | Definición de CSS variables y utility classes Tierra |
| `tailwind.config.ts` | Mapeo de variables a Tailwind colors |
| `app/layout.tsx` | Carga de las 3 fuentes via `next/font/google` |
| `components/ThemeProvider.tsx` | Context que aplica/quita `.dark` en `<html>` |
| `components/ThemeToggle.tsx` | Botón claro/oscuro |
| `components/BadgeEstado.tsx` | Dot + mono text (sin pill colored) |
| `components/BottomNav.tsx` | 80px tall, serif italic labels |

## Key Decisions (KD)

- **KD-1** — Tokens via CSS variables, no clases Tailwind hardcodeadas. Permite cambiar tema dinámicamente sin recargar.
- **KD-2** — Solo 3 fuentes (no más). Cargar más impacta el LCP.
- **KD-3** — Acentos (`terra`, `moss`, `rust`, `ochre`) no cambian entre modos. La identidad se mantiene.
- **KD-4** — Sin sombras (`box-shadow`). Solo bordes hairline (`--line`). Estética editorial.
- **KD-5** — Badges de estado: dot + mono text, no pill colored. Reduce "alerta visual" para algo cotidiano como un café cerrado.

## Risks

- **FOUC al cambiar tema**: mitigado con script inline en `<head>` que aplica `.dark` antes del primer paint.
- **Contraste insuficiente en light mode**: se subió `--fg-30` → `--ochre` para section labels (ver KD-6 en `docs/decisions.md`).
