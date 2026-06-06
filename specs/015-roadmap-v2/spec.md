# Feature Specification: Roadmap v2+ (Backlog)

**Feature Branch**: `015-roadmap-v2`
**Status**: Backlog — NO implementar en MVP
**Created**: 2026-05-25

## Descripción

Features planificados para después del lanzamiento público. La arquitectura actual los soporta sin cambios de esquema.

## ⚠️ Regla

**No implementar NINGÚN feature de esta lista en el MVP. Crear una spec dedicada (`specs/016-...`, `017-...`) antes de arrancar cualquiera.**

## Features candidatos

### Por orden de impacto

| Feature | Spec futura | Tablas necesarias | Notas |
|---|---|---|---|
| Favoritos | `016-favoritos` | `favoritos (usuario_id, lugar_id)` | Requiere auth |
| Panel para dueños de locales | `017-panel-duenos` | role en `profiles` | Empieza monetización |
| Promociones | `018-promociones` | `promociones` | Modelo de negocio |
| Recomendaciones personalizadas | `019-recomendaciones` | historial implícito | ML simple para empezar |
| Analytics para comercios | `020-analytics-locales` | eventos + dashboard | |
| Reservas | `021-reservas` | `reservas` | Integración WhatsApp Business |
| Eventos gastronómicos | `022-eventos` | `eventos` | |
| Notificaciones push | `023-push` | suscripciones | Web Push API |
| Modo offline | `024-offline` | Service Worker | |
| Expansión a otras ciudades | `025-multi-ciudad` | `ciudad_id` en `lugares` | Cambio arquitectónico mayor |

### Fuera del horizonte previsible
- Apps nativas (la PWA cubre)
- Delivery propio (partnership con apps existentes)
- Marketplace de productos
- Multi-idioma

## Tablas planificadas (NO crear todavía)

```sql
favoritos (
  usuario_id UUID,
  lugar_id UUID,
  PRIMARY KEY(usuario_id, lugar_id)
);

promociones (
  id UUID PRIMARY KEY,
  lugar_id UUID,
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT true
);

eventos (
  id UUID PRIMARY KEY,
  lugar_id UUID,
  nombre TEXT,
  fecha TIMESTAMPTZ,
  descripcion TEXT
);

reservas (
  id UUID PRIMARY KEY,
  usuario_id UUID,
  lugar_id UUID,
  fecha TIMESTAMPTZ,
  personas INT
);
```

## Out of Scope (siempre)

Lo siguiente NO se implementará nunca en Haku:
- Compra/venta de productos no gastronómicos
- Sistema de mensajería entre usuarios
- Red social pública (timeline, follows)
