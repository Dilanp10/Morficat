# Implementation Plan: Admin Panel

**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/admin/page.tsx` | Lista de lugares + contador de sugerencias pendientes |
| `app/admin/lugar/[id]/page.tsx` | Formulario crear/editar |
| `app/admin/login/page.tsx` | Login con contraseña |
| `app/admin/logout/route.ts` | Logout (limpia cookie) |
| `app/admin/sugerencias/page.tsx` | Listado de sugerencias |
| `app/admin/sugerencias/_actions.ts` | `toggleRevisadaAction` |
| `lib/admin-auth.ts` | Firma/verifica cookie `haku_admin` con HMAC-SHA256 |
| `lib/admin-data.ts` | Queries y mutations con `service_role` |
| `middleware.ts` | Protege `/admin/*` excepto `/admin/login` |

## Key Decisions

- **KD-1** — Una sola contraseña para todo el equipo. Multi-usuario con roles es v2.
- **KD-2** — Cookie firmada HMAC-SHA256 (no JWT). Más simple y suficiente.
- **KD-3** — `service_role` key SOLO en server actions. El cliente nunca la ve.
- **KD-4** — Categorías y tipos de comida se cargan en Supabase Dashboard. CRUD en la UI es overkill.
