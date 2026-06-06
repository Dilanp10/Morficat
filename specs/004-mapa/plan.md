# Implementation Plan: Mapa

**Branch**: `004-mapa` · **Spec**: [spec.md](./spec.md) · **Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/mapa/page.tsx` | Server component, fetch lugares + header overlay |
| `components/LocalMap.tsx` | Mapa Leaflet full-screen con pines SVG custom |
| `components/MiniMapa.tsx` | Versión embebida en ficha del local |

## Key Decisions

- **KD-1** — Leaflet + OpenStreetMap (Mapbox/Google: pagos). Cero costos.
- **KD-2** — Pines SVG inline en `divIcon`, no PNG: cambian de color sin reload.
- **KD-3** — Carga del mapa via `next/dynamic({ ssr: false })`: Leaflet requiere `window`.

## Estilo de pines

| Estado | Fill |
|---|---|
| Abierto | `#D67849` (terra) |
| Cerrado | `rgba(244,237,225,0.3)` |
| Centro | `#1B1612` |
