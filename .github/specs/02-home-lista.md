# [SPEC 02] Home — Lista de locales
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/2
> Estado: ✅ Implementado

## Descripción
Pantalla principal (`/`). Lista locales activos filtrados por "abierto ahora" por defecto, ordenados por cercanía. Es el flujo core de la app.

## Archivos
| Archivo | Rol |
|---|---|
| `app/page.tsx` | Server component, fetch de lugares y categorías |
| `components/HomeListClient.tsx` | Client: lógica de filtros, orden, GPS |
| `components/LocalCard.tsx` | Fila editorial por local |
| `components/FiltrosChips.tsx` | Chips scrolleables (serif italic + underline) |
| `components/FiltrosAvanzados.tsx` | Panel de atributos desplegable |
| `components/SearchBar.tsx` | Input de búsqueda en tiempo real |
| `lib/horarios.ts` | `estadoConHorario()` |
| `lib/distancia.ts` | `calcularDistanciaKm()` Haversine |

## Flujos core (deben resolverse en los tiempos indicados)
| # | Escenario | Tiempo esperado |
|---|---|---|
| 1 | "Quiero un café ahora" | ~15 segundos |
| 2 | "Sábado a la noche, ¿dónde tomamos algo?" | ~30-45 segundos |
| 3 | "Es feriado, ¿qué está abierto?" | ~20-30 segundos |

## Reglas de negocio
- Filtro **"Abierto ahora" activo por defecto**
- Orden por distancia (Haversine calculado en frontend)
- Sin GPS → muestra zona/barrio en lugar de metros, todos los locales visibles
- 4am sin abiertos → mensaje + botón "Limpiar filtros"
- Búsqueda ILIKE: nombre + categoría + tipos de comida

## Layout
```
CATAMARCA · AHORA          ← mono section label
Haku.                      ← serif italic terracota
¿Qué está abierto ahora?  ← sans fg-50

[Buscar lugar, categoría…] ← SearchBar

• Abierto ahora  Cafetería  Restaurante  Bar  →  ← FiltrosChips

2 RESULTADOS    2 ABIERTOS · 5 TOTAL  ← mono stats

[Thumb] Café del Centro        Centro  ›
        Cafetería · Centro
        • Abierto · cierra a las 22:00
```

## Criterios de aceptación
- [x] Lista carga en < 3s en 4G
- [x] Filtro "Abierto ahora" activo al entrar
- [x] Chips de categoría funcionan (serif italic, underline active)
- [x] Búsqueda en tiempo real sin submit
- [x] Filtros avanzados desplegables
- [x] Estado vacío con mensaje + botón reset
- [x] Distancia numérica con GPS, barrio sin GPS
- [x] Ordena por distancia cuando hay GPS
