# Backlog

> Lista de tareas pendientes ordenadas por prioridad. Las features de v2 viven en `roadmap.md`.

## 🔴 Bloqueantes para lanzamiento público (spec 014)

- [ ] Verificar horarios de los 30 locales actuales con el dueño
- [ ] Reemplazar fotos temporales (`data_temporal=true`) por fotos con permiso
- [ ] Publicar página `/privacidad`
- [ ] Publicar página `/terminos`
- [ ] Testing final en iOS Safari y Android Chrome reales
- [ ] Lighthouse audit ≥ 90 performance

## 🟡 Mejoras de UX que se vienen pidiendo

- [ ] Compartir un local copia URL legible (`/local/cafe-del-centro`) — verificar Web Share API en iOS
- [ ] Mostrar próxima apertura cuando un local está cerrado (no solo "Cerrado")
- [ ] Skeleton de cards mientras carga la primera vez
- [ ] Aviso si la app está cacheada (offline-ish)

## 🟢 Mejoras técnicas / deuda

- [ ] Migrar `next/font` a `next/font/local` para reducir requests externos
- [ ] Auditar y reducir bundle de Leaflet (es el más pesado de la app)
- [ ] Test de smoke con Playwright para los 3 escenarios core
- [ ] CI: correr `pnpm build` en PRs antes de merge

## 🔵 Ideas a discutir antes de armar spec

- Notificación cuando un nuevo local abre en tu zona
- Compartir lista de "mis lugares favoritos" como link público
- Generar feed RSS de novedades por zona

> Para sumar items al backlog: agregar acá + crear Issue con label `backlog` si requiere discusión.
