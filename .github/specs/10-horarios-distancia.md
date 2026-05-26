# [SPEC 10] Lógica de Horarios y Distancia
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/10
> Estado: ✅ Implementado

## Descripción
Módulo crítico en TypeScript. `horarios.ts` determina si un local está abierto ahora mismo. `distancia.ts` calcula kilómetros entre dos coordenadas (Haversine).

## Archivos
| Archivo | Rol |
|---|---|
| `lib/horarios.ts` | `estaAbierto()`, `estadoConHorario()`, `diaActualEnArgentina()` |
| `lib/distancia.ts` | `calcularDistanciaKm()`, `formatearDistancia()` |
| `lib/constants.ts` | `DIAS_SEMANA`, `ATRIBUTOS_LABELS`, coordenadas default |

## Casos que debe manejar `estaAbierto()`
| Caso | Ejemplo | Implementación |
|---|---|---|
| Normal | 08:00–22:00 | Compara hora actual con rango |
| Horario cortado | 12:00–15:00 y 20:00–23:00 | Múltiples registros por día, OR |
| Cruza medianoche | 20:00–02:00 | `cruza_medianoche=true`, evalúa día anterior también |
| Día cerrado | `cerrado=true` | Retorna false directamente |
| Sin horario | No hay registro para ese día | Retorna false |

## Timezone
```ts
// Argentina = UTC-3, sin cambio de horario
const AR_OFFSET = -3 * 60; // minutos
function ahoraEnArgentina(): Date { ... }
```
**Nunca usar `new Date()` directamente sin ajustar a AR.**

## `estadoConHorario()` → `{ abierto: boolean, detalle: string | null }`
- `abierto: true` → `detalle: "cierra a las 22:00"`
- `abierto: false` → `detalle: "abre a las 09:00"` (próxima apertura)

## Haversine
```ts
function calcularDistanciaKm(lat1, lng1, lat2, lng2): number
// Radio terrestre: 6371 km
// Resultado en km con 1 decimal
```

## Criterios de aceptación
- [x] Horario cortado: evalúa ambos rangos
- [x] Cruza medianoche: correcto a las 01:00
- [x] Día sin horario = cerrado
- [x] Badge correcto a cualquier hora del día
- [x] `detalle`: "cierra a las HH:MM" o "abre a las HH:MM"
- [x] Haversine retorna km con 1 decimal
