# Implementation Plan: Skeletons de carga

**Status**: Draft

## Estrategia

Next.js App Router renderiza automáticamente `loading.tsx` como fallback de
Suspense mientras el Server Component hermano (`page.tsx`) hace su fetch. No hace
falta tocar las páginas ni agregar estado de cliente: alcanza con crear los
`loading.tsx` y un componente de skeleton reutilizable que replique la forma del
contenido real para minimizar layout shift.

```
app/loading.tsx              → fallback del Home
app/local/[slug]/loading.tsx → fallback de la ficha
components/LocalCardSkeleton → bloque fantasma con la forma de LocalCard
```

## Files

| Archivo | Rol | ¿Nuevo? |
|---|---|---|
| `components/LocalCardSkeleton.tsx` | Skeleton de una card (thumb + 2 líneas + badge), replica `LocalCard` | 🆕 |
| `app/loading.tsx` | Fallback del Home: encabezado estático + searchbar fantasma + ~6 `LocalCardSkeleton` | 🆕 |
| `app/local/[slug]/loading.tsx` | Fallback de ficha: top bar real + hero fantasma + título + secciones | 🆕 |
| `app/globals.css` | (si hace falta) respetar `prefers-reduced-motion` en `animate-pulse` | ✏️ |

## UI / Diseño

- **Bloque base**: `rounded` con `background: var(--card-2)` + clase `animate-pulse`
  de Tailwind (ya usada en el loading del MiniMapa). Sin shimmer custom.
- **`LocalCardSkeleton`**: misma grilla que `LocalCard`
  (`flex items-center gap-4 py-4 row-sep`): thumb `size-16 rounded-[10px]`, dos
  barras de texto (ancho ~60% y ~40%) y una barra corta para el badge.
- **Home `loading.tsx`**: reproduce el `<header>` estático real (texto "Haku.",
  no depende de datos) para que la transición sea continua, luego barra de
  búsqueda fantasma y la lista de skeletons dentro del mismo `max-w-2xl`.
- **Ficha `loading.tsx`**: botón "volver" real (es un `Link` estático), bloque de
  hero con la misma `aspectRatio`/`maxHeight`, barras de título, fila de badge,
  botones de acción fantasma y un par de secciones.

## Key Decisions

- **KD-1 — Usar `loading.tsx`, no estado de cliente.** Es el mecanismo nativo de
  App Router para Suspense; cero JS extra, cero timers. Simple sobre complejo.
- **KD-2 — Replicar dimensiones reales** (thumb 64px, alto de hero) para minimizar
  CLS al intercambiar fantasma → contenido.
- **KD-3 — Reutilizar `animate-pulse` de Tailwind**, ya presente en el repo
  (loading del MiniMapa). No introducir animaciones nuevas.
- **KD-4 — Respetar `prefers-reduced-motion`**: desactivar el pulso si el usuario
  lo pidió.
- **KD-5 — Reproducir el header estático del Home** en su `loading.tsx` para una
  transición sin salto (el header no depende de datos).

## Constitución / convenciones

- **No empty features**: el skeleton es contenido visible y útil, no una pantalla
  vacía.
- **Mobile-first** (375px), **tokens Tierra** (`--card-2`, `--line`), light + dark.
- **Simple sobre complejo**: 1 componente + 2 archivos `loading.tsx`, sin lógica.
