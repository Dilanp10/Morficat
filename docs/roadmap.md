# Roadmap

## Estado actual: MVP funcional, falta validación de datos

## Hitos

### ✅ MVP Funcional (completado)

Specs 001 → 013. La app tiene todas las features comprometidas en el spec original. Ver `specs/`.

### ⏳ Lanzamiento público (siguiente)

Spec [014](../specs/014-lanzamiento-publico/). Checklist operativo, NO desarrollo:
- Verificar horarios con cada local
- Obtener permisos de fotos
- Cargar ≥ 30 locales verificados
- Publicar política de privacidad y términos

ETA: depende del ritmo de trabajo de campo.

### 📋 v2 (post-lanzamiento)

Spec [015](../specs/015-roadmap-v2/) — backlog completo. Features candidatos:

| Feature | Prioridad | Notas |
|---|---|---|
| Favoritos | Alta | Requiere auth obligatoria |
| Recomendaciones personalizadas | Media | ML sobre historial |
| Promociones (monetización) | Alta | Modelo de negocio v2 |
| Reservas | Media | Integración WhatsApp Business |
| Eventos gastronómicos | Baja | Tabla `eventos` |
| Panel para dueños | Alta | Roles en `profiles` |
| Analytics para comercios | Media | Métricas de tráfico |
| Notificaciones push | Baja | Web Push API |
| Modo offline | Baja | Service Worker avanzado |
| Expansión a otras ciudades | Alta | Campo `ciudad_id` en `lugares` |

### 🚫 Fuera del horizonte

- Apps nativas (iOS/Android) — la PWA cubre el caso
- Delivery propio — partnership con apps existentes
- Marketplace de productos — está fuera del foco gastronómico
