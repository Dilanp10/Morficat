# [SPEC 05] Búsqueda + Filtros
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/5
> Estado: ✅ Implementado

## Descripción
Pantalla de búsqueda (`/buscar`). Reutiliza `HomeListClient` con `autoFocusSearch=true`. Búsqueda ILIKE en tiempo real combinada con filtros de categoría, atributos y estado.

## Archivos
| Archivo | Rol |
|---|---|
| `app/buscar/page.tsx` | Server component, pasa `autoFocusSearch` |
| `components/HomeListClient.tsx` | Lógica compartida con Home |
| `components/SearchBar.tsx` | Input con autoFocus |
| `components/FiltrosChips.tsx` | Chips de categoría |
| `components/FiltrosAvanzados.tsx` | Panel atributos |

## Lógica de búsqueda
```
query → ILIKE en:
  - lugares.nombre
  - categorias.nombre (via join)
  - tipos_comida.nombre (via join)

Combinado con filtros activos:
  - categoria_id
  - atributos JSONB (frontend)
  - abierto ahora (frontend, lógica JS)
```

## Criterios de aceptación
- [x] Input con autoFocus al entrar a `/buscar`
- [x] Resultados actualizados en tiempo real
- [x] Combina con filtro "Abierto ahora"
- [x] Estado vacío con mensaje descriptivo
- [x] Sin resultados: "No encontramos lugares con ese nombre"
