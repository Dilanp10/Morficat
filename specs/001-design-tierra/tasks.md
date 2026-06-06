# Tasks: Design System Tierra

**Input**: Design documents from `specs/001-design-tierra/`
**Branch**: `001-design-tierra`
**Prerequisites**: spec.md ✅ · plan.md ✅

---

## Phase 1: Foundation

- [x] T001 Configurar 3 fuentes via `next/font/google` (`Instrument_Serif`, `Inter`, `JetBrains_Mono`) — `app/layout.tsx`
- [x] T002 Definir CSS variables Tierra dark en `:root` y light en `.dark` — `app/globals.css`
- [x] T003 [P] Extender `tailwind.config.ts` con los tokens como Tailwind colors

## Phase 2: Componentes base

- [x] T004 `BadgeEstado`: dot + mono text (sin pill) — `components/BadgeEstado.tsx`
- [x] T005 [P] `BottomNav`: 80px alto, serif italic labels, dot indicador terracota — `components/BottomNav.tsx`
- [x] T006 [P] `HorariosTable`: mono font, "cerrado" lowercase — `components/HorariosTable.tsx`
- [x] T007 [P] `FiltrosChips`: serif italic con underline en active (no pill) — `components/FiltrosChips.tsx`
- [x] T008 [P] `SearchBar`: input oscuro con `--card-2` — `components/SearchBar.tsx`

## Phase 3: Theme system

- [x] T009 `ThemeProvider` con `localStorage("haku-theme")` — `components/ThemeProvider.tsx`
- [x] T010 `ThemeToggle` claro/oscuro — `components/ThemeToggle.tsx`
- [x] T011 Script inline en `<head>` para evitar FOUC — `app/layout.tsx`

## Phase 4: Polish

- [x] T012 Utility class `.text-section` para section labels — `app/globals.css`
- [x] T013 Verificar contraste WCAG AA en ambos modos
