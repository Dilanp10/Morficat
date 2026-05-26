# [SPEC 06] Panel Admin
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/6
> Estado: ✅ Implementado

## Descripción
Panel de administración (`/admin`). Protegido por contraseña. CRUD de locales, gestión de horarios, upload de imagen y revisión de sugerencias.

## Archivos
| Archivo | Rol |
|---|---|
| `app/admin/page.tsx` | Lista de lugares + badge sugerencias pendientes |
| `app/admin/lugar/[id]/page.tsx` | Formulario crear/editar lugar |
| `app/admin/login/page.tsx` | Formulario de contraseña |
| `app/admin/sugerencias/page.tsx` | Listado de sugerencias |
| `app/admin/sugerencias/_actions.ts` | toggleRevisada server action |
| `lib/admin-auth.ts` | HMAC-SHA256 cookie `haku_admin` |
| `lib/admin-data.ts` | Queries con `service_role` |
| `middleware.ts` | Protege todas las rutas `/admin/*` |

## Seguridad
- Contraseña via `ADMIN_PASSWORD` (env var privada)
- Cookie firmada: `HMAC-SHA256(password + timestamp)`
- Escritura exclusiva via `SUPABASE_SERVICE_ROLE_KEY` (nunca al cliente)
- RLS: tabla `lugares` solo admite INSERT/UPDATE con service_role

## Funcionalidades
- Lista de lugares: nombre, categoría, activo/inactivo, acciones
- Formulario lugar: todos los campos + upload imagen a Supabase Storage
- Grilla horarios: 7 días × apertura / cierre / cerrado / cruza_medianoche
- Toggle activo/inactivo (soft delete, no borra de DB)
- Vista sugerencias: tipo, contenido, email, fotos, audio, estado revisado

## Variables de entorno requeridas
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # solo server-side
ADMIN_PASSWORD=...                  # contraseña del panel
```

## Criterios de aceptación
- [x] Login con contraseña, cookie firmada, redirige a `/admin`
- [x] Lista de lugares paginada implícitamente
- [x] Formulario crear/editar con todos los campos
- [x] Gestión de horarios por día (7 filas)
- [x] Upload de imagen a Supabase Storage
- [x] Toggle activo/inactivo
- [x] Vista sugerencias con marcar revisado
