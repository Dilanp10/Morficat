# Requirements Checklist: Design System Tierra

## Functional Requirements

- [x] REQ-CORE-006 — Dark mode y light mode funcionales con persistencia en localStorage

## Acceptance Criteria

- [x] Las 3 fuentes cargan via `next/font/google`
- [x] Tokens Tierra definidos como CSS variables en `:root` y `.dark`
- [x] `BadgeEstado` usa dot + mono (no pill colored)
- [x] `BottomNav` tiene 80px de alto con dot indicator terracota
- [x] Section labels en mono `--ochre`, no `--fg-30`
- [x] Sin sombras — solo bordes hairline
- [x] Contraste WCAG AA cumplido en ambos modos
- [x] Sin FOUC al cambiar tema
