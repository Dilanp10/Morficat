# [SPEC 08] Auth + Usuarios
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/8
> Estado: ✅ Implementado

## Descripción
Autenticación opcional basada en Supabase Auth. Login, signup, perfil. La app funciona completamente sin cuenta — la auth solo se requiere para dejar reseñas.

## Archivos
| Archivo | Rol |
|---|---|
| `app/login/page.tsx` | Formulario de login |
| `app/signup/page.tsx` | Formulario de registro |
| `app/signup/exito/page.tsx` | Confirmación post-signup |
| `lib/auth-actions.ts` | `signIn`, `signUp`, `signOut` server actions |
| `lib/supabase/server.ts` | `getCurrentUser()`, `getCurrentProfile()` |
| `components/WelcomeOverlay.tsx` | Primer acceso: crear cuenta / invitado |

## Tabla profiles (Supabase)
```sql
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  email        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

## Flujo
```
Primera apertura → WelcomeOverlay
  → Crear cuenta → /signup → email confirmation → login → home
  → Ya tengo cuenta → /login → home
  → Continuar como invitado → home (sin auth)

/mas con cuenta → muestra display_name + email + cerrar sesión
/mas sin cuenta → botones Entrar / Crear cuenta
```

## Criterios de aceptación
- [x] `WelcomeOverlay` solo aparece la primera vez (`localStorage`)
- [x] Signup crea usuario en Supabase Auth + registro en `profiles`
- [x] Login redirige al home con usuario activo
- [x] Cerrar sesión desde `/mas`
- [x] Usuario autenticado ve su nombre en `/mas`
- [x] Sin auth: toda la app funciona igualmente
