# [SPEC 15] Light mode (Tierra claro)
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/15
> Estado: 🚧 En desarrollo
> Modifica: [SPEC 01 — Sistema de diseño Tierra](./01-design-tierra.md)

## Descripción
Implementar el modo claro siguiendo la estética Tierra. Mismo lenguaje cálido y editorial, pero invertido: cream warm como fondo, warm dark como texto. Los acentos (terracota, moss, ochre, rust) se mantienen iguales.

## Archivos a modificar
| Archivo | Cambio |
|---|---|
| `app/globals.css` | Mover tokens dark a `.dark`, definir light en `:root` |
| `app/layout.tsx` | Quitar `dark` hardcodeado del className |
| `components/ThemeProvider.tsx` | Ya funciona, no requiere cambios |
| `components/ThemeToggle.tsx` | Ya existe en `/mas` |

## Paleta light (Tierra claro)
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F4EDE1` | Fondo principal (cream cálido) |
| `--bg-deep` | `#EDE2D0` | Bottom nav, modales |
| `--card-bg` | `#FAF6EE` | Cards y paneles |
| `--card-2` | `#F0E8D8` | Inputs, fondos secundarios |
| `--fg` | `#1B1612` | Texto principal (warm dark) |
| `--fg-70` | `rgba(27,22,18,0.70)` | Texto secundario |
| `--fg-50` | `rgba(27,22,18,0.50)` | Texto terciario |
| `--fg-30` | `rgba(27,22,18,0.30)` | Hints |
| `--line` | `rgba(27,22,18,0.08)` | Separadores |
| `--line-2` | `rgba(27,22,18,0.14)` | Bordes de cards |

## Acentos (sin cambio entre temas)
| Token | Valor |
|---|---|
| `--terra` | `#D67849` |
| `--terra-deep` | `#A85A30` |
| `--ochre` | `#C99347` |
| `--moss` | `#8AA265` |
| `--rust` | `#C0664E` |

## Edge cases
- **FOUC**: el script en `<head>` debe aplicar la clase antes del primer paint
- **Welcome overlay**: usa `var(--bg-deep)` que ahora cambia con el tema
- **Splash screen**: idem
- **Theme color del navegador**: queda en `#1B1612` (dark) por simplicidad

## Criterios de aceptación
- [ ] Toggle en `/mas` cambia el tema visualmente
- [ ] Light mode: fondo cream cálido, texto warm dark
- [ ] Acentos terracota se mantienen iguales
- [ ] Estado abierto/cerrado legible en ambos modos
- [ ] Theme persiste en `localStorage` (`haku-theme`)
- [ ] No hay flash de tema incorrecto al cargar
- [ ] Splash y welcome funcionan en ambos modos
