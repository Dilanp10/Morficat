# [SPEC 13] Roadmap v2+ (Post-MVP)
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/13
> Estado: 📋 Backlog — NO implementar en MVP

## Descripción
Features planificados para después del lanzamiento público. La arquitectura actual los soporta sin cambios de esquema de base de datos.

## ⚠️ Regla
**No implementar NINGÚN feature de esta lista en el MVP. Crear un Issue con spec detallado antes de arrancar cualquiera.**

## Features v2
| Feature | Tablas necesarias | Notas |
|---|---|---|
| Favoritos | `favoritos (usuario_id, lugar_id)` | Requiere auth |
| Recomendaciones personalizadas | historial implícito | ML sobre comportamiento |
| Promociones para locales | `promociones (lugar_id, descripcion, fecha_inicio, fecha_fin)` | Monetización |
| Reservas | `reservas (usuario_id, lugar_id, fecha, personas)` | |
| Delivery | integración externa | |
| Panel para dueños de locales | roles en `profiles` | |
| Analytics para comercios | eventos + dashboard | |
| Ranking de lugares | calculado desde reseñas | |
| Eventos gastronómicos | `eventos (lugar_id, nombre, fecha)` | |
| Notificaciones push | Web Push API | |
| Modo offline | Service Worker avanzado | |
| Expansión a otras ciudades | campo `ciudad_id` en `lugares` | |
| Light mode | toggle + CSS vars | Solo dark en MVP |

## Tablas ya planificadas (crear cuando llegue el momento)
```sql
-- favoritos
CREATE TABLE favoritos (
  usuario_id UUID REFERENCES auth.users(id),
  lugar_id   UUID REFERENCES lugares(id),
  PRIMARY KEY (usuario_id, lugar_id)
);

-- promociones
CREATE TABLE promociones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lugar_id    UUID REFERENCES lugares(id),
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin    DATE,
  activo       BOOLEAN DEFAULT true
);

-- eventos
CREATE TABLE eventos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lugar_id    UUID REFERENCES lugares(id),
  nombre      TEXT NOT NULL,
  fecha       TIMESTAMPTZ,
  descripcion TEXT
);
```
