# Implementation Plan: Auth + Usuarios

**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/login/page.tsx` | Form login |
| `app/signup/page.tsx` | Form signup |
| `app/signup/exito/page.tsx` | Confirmación post-signup |
| `app/auth/callback/route.ts` | Callback de Supabase Auth (email confirm) |
| `lib/auth-actions.ts` | `signInAction`, `signUpAction`, `signOutAction` |
| `lib/supabase/server.ts` | `getCurrentUser()`, `getCurrentProfile()` |
| `components/WelcomeOverlay.tsx` | Primer acceso |

## DB

```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

## Key Decisions

- **KD-1** — Auth opcional. Filosofía: no fricción innecesaria.
- **KD-2** — Supabase Auth (no NextAuth ni Clerk). Ya está la DB ahí.
- **KD-3** — WelcomeOverlay solo primer acceso (`localStorage.haku_welcomed`).
