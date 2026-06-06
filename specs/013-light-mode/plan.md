# Implementation Plan: Light Mode

**Status**: Implemented

## Files

| Archivo | Cambio |
|---|---|
| `app/globals.css` | Tokens light en `:root`, tokens dark movidos a `.dark` |
| `app/layout.tsx` | Quitar `dark` hardcodeado del className |
| `components/ThemeProvider.tsx` | Ya estaba bien, no requiere cambios |

## Paleta light

| Token | Valor light |
|---|---|
| `--bg` | `#F4EDE1` |
| `--bg-deep` | `#EDE2D0` |
| `--card-bg` | `#FAF6EE` |
| `--card-2` | `#F0E8D8` |
| `--fg` | `#1B1612` |
| `--fg-70` | rgba(27,22,18,0.70) |
| `--fg-50` | rgba(27,22,18,0.50) |
| `--fg-30` | rgba(27,22,18,0.30) |

## Acentos (sin cambio)
`--terra`, `--moss`, `--rust`, `--ochre`: mismos hex en ambos modos.

## Key Decisions

- **KD-1** — Light como default (`:root`), dark como override (`.dark`). Convención estándar.
- **KD-2** — Transición de 200ms en `html/body`. Sutil sin ser molesto.
- **KD-3** — Acentos no cambian. La identidad cálida terracota se mantiene.
