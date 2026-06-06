# Implementation Plan: Cierra pronto / Abre pronto

**Status**: Draft

## Estrategia

`estadoConHorario` ya devuelve `{ abierto, detalle }` y tiene tests con `toEqual`
(estricto). Para **no romper ese contrato**, se agrega una función nueva y pura
`proximidadHorario(horarios, now)` que deriva los minutos restantes y los flags
`cierraPronto` / `abrePronto`. Los consumidores llaman ambas.

```ts
export type ProximidadHorario = {
  cierraPronto: boolean;
  minutosParaCierre: number | null;
  abrePronto: boolean;
  minutosParaApertura: number | null;
};
```

`proximidadHorario` reusa exactamente la misma detección de "turno activo" que
`estadoConHorario` (mismo día / cruza medianoche / turno del día anterior) vía un
helper interno `minutosHastaCierre`.

## Files

| Archivo | Rol | ¿Nuevo? |
|---|---|---|
| `lib/constants.ts` | `MINUTOS_CIERRA_PRONTO`, `MINUTOS_ABRE_PRONTO` (= 30) | ✏️ |
| `lib/horarios.ts` | `proximidadHorario()` + helper `minutosHastaCierre()` + tipo | ✏️ |
| `lib/horarios.test.ts` | casos de `proximidadHorario` (normal, umbral, cruza, abre pronto) | ✏️ |
| `components/BadgeEstado.tsx` | estados "pronto" en ámbar con countdown | ✏️ |
| `components/EstadoBadgeLive.tsx` | calcula `proximidadHorario` y lo pasa al badge | ✏️ |
| `components/LocalCard.tsx` | nuevos campos en `LocalCardData`, pasar al badge | ✏️ |
| `components/HomeListClient.tsx` | calcular proximidad en `enriquecidos` | ✏️ |
| `components/LocalMap.tsx` | línea ámbar "Cierra en N min" en el popup | ✏️ |

## UI (BadgeEstado, tri-estado)

- **Abierto + cierra pronto** → punto `bg-ochre` + texto `text-ochre`
  *"Cierra en N min"*.
- **Cerrado + abre pronto** → punto `bg-ochre` + *"Abre en N min"*.
- **Resto** → idéntico a hoy (moss "Abierto · …" / rust "Cerrado · …").

El punto ámbar es sólido (sin `soft-pulse`, que es verde) para diferenciarse
claramente del verde pulsante de "Abierto".

## Key Decisions

- **KD-1 — Función nueva, no mutar `estadoConHorario`.** Evita romper los tests
  `toEqual` existentes y mantiene estable el contrato para los consumidores.
- **KD-2 — Umbral fijo 30 min, inclusivo.** Constante en `lib/constants.ts`.
- **KD-3 — "Cierra pronto" NO cambia `abierto`.** El local sigue contando como
  abierto (no se filtra), solo cambia la presentación.
- **KD-4 — Countdown reusa el `now` existente** (interval 60s ya presente en
  Home/ficha/mapa). Cero timers nuevos.

## Constitución / convenciones

- Refuerza el core "qué está abierto ahora" (misión del proyecto).
- Tokens Tierra (`--ochre`), mobile-first, lógica testeada (vitest).
- Simple sobre complejo: una función pura + un tri-estado de badge.
