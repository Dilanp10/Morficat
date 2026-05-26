# [SPEC 01] Sistema de diseño Tierra
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/1
> Estado: ✅ Implementado

## Descripción
Sistema visual "Tierra" — dark cálido, tipografía editorial, paleta terracota. Define los tokens, fuentes y componentes base de toda la app.

## Archivos
| Archivo | Rol |
|---|---|
| `app/globals.css` | CSS variables (`--terra`, `--moss`, `--bg`, `--fg-*`) |
| `tailwind.config.ts` | Extiende paleta y font families |
| `app/layout.tsx` | Importa las 3 fuentes via `next/font/google` |
| `components/BadgeEstado.tsx` | Dot + mono text (sin pill) |
| `components/BottomNav.tsx` | 80px, serif italic, dot indicador |
| `components/HorariosTable.tsx` | Mono font, "cerrado" lowercase |
| `components/FiltrosChips.tsx` | Serif italic, underline en active |

## Tokens de color
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#1B1612` | Fondo principal |
| `--bg-deep` | `#14100D` | Bottom nav, modales, splash |
| `--card-bg` | `#25201A` | Cards y paneles |
| `--card-2` | `#2E2820` | Inputs, fondos secundarios |
| `--terra` | `#D67849` | Acento principal, CTAs |
| `--terra-deep` | `#A85A30` | Hover, gradiente hero |
| `--moss` | `#8AA265` | Estado abierto |
| `--rust` | `#C0664E` | Estado cerrado |
| `--ochre` | `#C99347` | Datos en mono, ratings |
| `--fg` | `#F4EDE1` | Texto principal (crema) |
| `--fg-70` | `rgba(244,237,225,0.70)` | Texto secundario |
| `--fg-50` | `rgba(244,237,225,0.50)` | Texto terciario |
| `--fg-30` | `rgba(244,237,225,0.30)` | Hints, placeholders |
| `--line` | `rgba(244,237,225,0.08)` | Separadores |
| `--line-2` | `rgba(244,237,225,0.14)` | Bordes de cards |

## Tipografía
| Fuente | Uso | Variable |
|---|---|---|
| Instrument Serif italic | Títulos, nombres de locales, bottom nav labels | `--font-serif` |
| Inter | UI body, botones, descripciones | `--font-sans` |
| JetBrains Mono | Horarios, distancias, section labels | `--font-mono` |

## Reglas de diseño
1. Dark mode nativo — sin light mode en MVP
2. Fondos siempre warm dark, nunca negro puro `#000`
3. `BadgeEstado`: dot animado + mono text (no pill colored)
4. Section labels: mono uppercase tracking-wide, color `--fg-30`
5. Sin sombras — solo bordes `--line` para separación
6. Fotos: 1:1 en lista, 16:9 en ficha, monograma si no hay foto
