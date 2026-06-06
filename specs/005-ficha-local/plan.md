# Implementation Plan: Ficha del Local

**Branch**: `005-ficha-local` · **Spec**: [spec.md](./spec.md) · **Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/local/[slug]/page.tsx` | SSR + `generateMetadata` |
| `app/local/[slug]/_components/ResenasSeccion.tsx` | Sección reseñas con upsert |
| `components/EstadoBadgeLive.tsx` | Badge actualizado cada 60s |
| `components/HorariosTable.tsx` | Tabla 7 días en mono |
| `components/MiniMapa.tsx` | Leaflet embebido |
| `components/ShareButton.tsx` | Web Share API + clipboard fallback |
| `lib/lugares-public.ts` | `obtenerLugarPorSlug(slug)` |

## Key Decisions

- **KD-1** — Slug en URL (`/local/cafe-del-centro`) no UUID. Mejor SEO y shareability.
- **KD-2** — Monograma como fallback de foto. Mantiene la identidad incluso sin imagen.
- **KD-3** — Mini-mapa embebido (sin "Cómo llegar" a Google Maps). Mantiene al usuario en la app.
- **KD-4** — Botones de acción en orden: WhatsApp (primario) → Instagram → Teléfono. WhatsApp es el canal preferido en Argentina.

## Layout (orden de secciones)

1. Hero (foto o monograma)
2. Top bar (back + share)
3. Cabecera (categoría · barrio + nombre serif italic + badge estado)
4. Acciones (WhatsApp / Instagram / Teléfono)
5. Descripción
6. Horarios
7. Ubicación + mini-mapa
8. Atributos (chips mono uppercase)
9. Contacto extra
10. Reseñas
