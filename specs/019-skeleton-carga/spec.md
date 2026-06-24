# Feature Specification: Skeletons de carga

**Feature Branch**: `019-skeleton-carga`
**Created**: 2026-06-24
**Status**: Draft
**Requirements**: REQ-SK-001 a REQ-SK-003

## Resumen

El Home (`/`) y la ficha del local (`/local/[slug]`) son rutas `force-dynamic`:
el servidor espera el fetch a Supabase antes de mandar HTML. En una conexión
lenta (datos móviles en Catamarca) eso se traduce en una pantalla en blanco
mientras carga. Esta feature agrega **skeletons** (placeholders animados con la
forma del contenido real) que aparecen al instante via el `loading.tsx` de
Next.js App Router, reduciendo la percepción de espera y el "salto" cuando llega
el contenido.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Skeleton del Home (Priority: P1)

Al entrar a Haku por primera vez (o navegar al Home) con conexión lenta, el
usuario ve de inmediato el encabezado "Haku." y una lista de cards-fantasma
animadas, en vez de una pantalla vacía.

**Why this priority**: El Home es la puerta de entrada y el caso de uso central
("¿qué está abierto ahora?"). La primera impresión de velocidad importa.

**Independent Test**: Con throttling de red activado, navegar a `/` muestra el
skeleton antes de que aparezcan los locales reales, sin layout shift visible al
cambiar.

**Acceptance Scenarios**:

1. **Given** una carga lenta del Home, **When** el servidor todavía no devolvió
   los locales, **Then** veo el encabezado + ~6 cards skeleton animadas.
2. **Given** que llegan los datos, **When** se renderiza la lista real, **Then**
   las cards reemplazan al skeleton sin salto brusco de layout.
3. **Given** light o dark mode, **Then** el skeleton usa tokens Tierra y se ve
   correcto en ambos temas.

---

### User Story 2 — Skeleton de la ficha (Priority: P2)

Al abrir un local, mientras carga la ficha (que además trae reseñas), el usuario
ve un skeleton con la forma de la ficha: hero, título, badge y secciones.

**Why this priority**: La ficha hace más trabajo (lugar + reseñas + usuario) y se
abre desde una card, así que la transición fantasma → contenido refuerza la
sensación de fluidez.

**Acceptance Scenarios**:

1. **Given** una carga lenta de `/local/[slug]`, **Then** veo un skeleton con
   bloque de hero, líneas de título y secciones, más el botón de volver real.
2. **Given** que llega el contenido, **Then** reemplaza al skeleton sin salto.

## Edge Cases

- **Carga instantánea (caché/red rápida)**: el skeleton puede no llegar a verse;
  es correcto, no debe parpadear molesto.
- **Reduced motion**: respetar `prefers-reduced-motion` (la animación de pulso no
  debe molestar a quien la desactivó).
- **Layout shift**: el skeleton debe replicar las dimensiones reales (thumb 64px,
  alto de filas) para minimizar CLS al intercambiar.

## Non-Functional Requirements

- **Sin JS extra de cliente**: los skeletons son Server Components estáticos
  servidos via `loading.tsx` (Suspense de Next). Cero estado, cero efectos.
- **Tokens Tierra**: usar `--card-2` / `--line` para los bloques; nada hardcodeado.
- **Mobile-first** (375px) y correcto en light + dark.
- **Reutilizable**: el skeleton de card vive en un componente compartido
  (`LocalCardSkeleton`) que replica la estructura de `LocalCard`.

## Out of Scope

- Skeleton para la ruta del mapa (Leaflet) → se evaluará aparte.
- Skeletons granulares dentro de secciones ya cargadas (ej. reseñas que cargan
  después) → no; el `loading.tsx` cubre la carga inicial completa.
- Optimistic UI / streaming parcial por sección → v2.
