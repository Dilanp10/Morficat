# [SPEC 11] PWA — Instalación
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/11
> Estado: ✅ Implementado

## Descripción
Configuración PWA. Permite instalar Haku en el home screen de Android e iOS con splash screen nativo, modo standalone y sin barra del navegador.

## Archivos
| Archivo | Rol |
|---|---|
| `public/manifest.json` | Web App Manifest |
| `public/icons/` | Iconos 192×192 y 512×512 |
| `next.config.js` | Integración next-pwa |
| `app/layout.tsx` | Meta tags appleWebApp, themeColor |
| `components/SplashScreen.tsx` | Splash animado en JS (complementa el nativo) |

## manifest.json
```json
{
  "name": "Haku",
  "short_name": "Haku",
  "description": "Gastronomía en Catamarca",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1B1612",
  "background_color": "#1B1612",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192" },
    { "src": "/icons/icon-512.png", "sizes": "512x512" }
  ]
}
```

## Criterios de aceptación
- [x] Instalable en Android Chrome (botón "Agregar a inicio")
- [x] Instalable en iOS Safari (Add to Home Screen)
- [x] Sin barra del navegador en modo instalado
- [x] Status bar con color `#1B1612`
- [x] Splash screen nativo con color de marca
