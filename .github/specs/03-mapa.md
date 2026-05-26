# [SPEC 03] Mapa
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/3
> Estado: ✅ Implementado

## Descripción
Vista de mapa (`/mapa`). Muestra todos los locales activos como pines sobre OpenStreetMap vía Leaflet. Pines terracota = abierto, crema opaco = cerrado.

## Archivos
| Archivo | Rol |
|---|---|
| `app/mapa/page.tsx` | Server component, fetch de lugares |
| `components/LocalMap.tsx` | Mapa Leaflet full-screen con pines SVG |
| `components/MiniMapa.tsx` | Mapa embebido en ficha del local |

## Comportamiento
- **Pines**: SVG custom 28×36px
  - Abierto: fill `#D67849` (terracota)
  - Cerrado: fill `rgba(244,237,225,0.3)` (crema neutro)
  - Centro: circle `#1B1612`
- **Sin GPS**: centrado en Catamarca capital `(-28.4696, -65.7852)`
- **Tap en pin**: popup con nombre, dot status, distancia y botón → ficha
- **Header overlay**: "Mapa." + contador de locales con gradiente dark sobre el mapa

## Criterios de aceptación
- [x] Pines diferencian visualmente abierto vs cerrado
- [x] Sin GPS muestra todos los locales igualmente
- [x] Tap en pin abre popup con info básica
- [x] Popup navega a `/local/[slug]`
- [x] Header superpuesto con degradado
- [x] MiniMapa en ficha muestra solo el pin del local
