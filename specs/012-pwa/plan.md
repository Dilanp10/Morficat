# Implementation Plan: PWA Instalable

**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `public/manifest.json` | Web App Manifest |
| `public/icons/icon-192.png` | Ícono 192×192 |
| `public/icons/icon-512.png` | Ícono 512×512 |
| `app/layout.tsx` | Meta tags `appleWebApp`, `themeColor`, `manifest` |
| `components/SplashScreen.tsx` | Splash en JS (complementa el nativo) |

## manifest.json

```json
{
  "name": "Haku",
  "short_name": "Haku",
  "description": "Gastronomía en Catamarca",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1B1612",
  "background_color": "#1B1612"
}
```

## Key Decisions

- **KD-1** — `display: standalone` (no fullscreen). Mantiene la status bar visible.
- **KD-2** — `theme_color` hardcodeado a `#1B1612` (dark). En iOS no cambia con el toggle.
- **KD-3** — Sin service worker custom (next-pwa estaría pero el MVP no requiere offline real).
