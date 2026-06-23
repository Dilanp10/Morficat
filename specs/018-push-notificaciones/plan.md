# Implementation Plan: Notificaciones Push

## Arquitectura

```
Browser (PWA)                    Supabase
───────────────                  ─────────────────────────────────
sw.js                            push_subscriptions (tabla)
  ↑ register                     push_notif_log (tabla, dedup)
  │                              favoritos (ya existe)
PushToggle.tsx                   horarios (ya existe)
  → subscribePush() action  ──→  INSERT push_subscriptions
  → unsubscribePush() action ──→ DELETE push_subscriptions

                                 push-cron (Edge Function, cada 5 min)
                                   ↓ consulta favoritos + horarios
                                   ↓ filtra abrePronto ≤30 min
                                   ↓ excluye push_notif_log (hoy)
                                   ↓ web-push → endpoint del browser
                                   ↓ INSERT push_notif_log
```

## VAPID

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — expuesta al browser
- `VAPID_PRIVATE_KEY` — solo servidor (Vercel + Supabase env)
- `VAPID_SUBJECT` — `mailto:dilanperea10@gmail.com`

## Files

| Archivo | Rol | ¿Nuevo? |
|---|---|---|
| `supabase/v1-7_push_subscriptions.sql` | Tablas + RLS + pg_cron | ✨ |
| `supabase/functions/push-cron/index.ts` | Deno Edge Function | ✨ |
| `public/sw.js` | Service worker (push + click) | ✨ |
| `components/ServiceWorkerInit.tsx` | Registra SW en el browser | ✨ |
| `app/_actions/push.ts` | subscribe / unsubscribe | ✨ |
| `components/PushToggle.tsx` | UI toggle en /mas | ✨ |
| `app/mas/page.tsx` | Sección "Notificaciones" | ✏️ |
| `app/layout.tsx` | Monta ServiceWorkerInit | ✏️ |
| `.env.local` | VAPID keys locales | ✏️ |

## Scheduling (Supabase pg_cron)

```sql
select cron.schedule(
  'push-abre-pronto',
  '*/5 * * * *',
  $$ select net.http_post(
    url := '<SUPABASE_URL>/functions/v1/push-cron',
    headers := '{"Authorization":"Bearer <SERVICE_ROLE_KEY>","Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb
  ) $$
);
```

El usuario ejecuta este SQL en el SQL Editor de Supabase con sus valores reales.

## Key Decisions

- **KD-1** — Cron en Supabase, no en Vercel. Free tier de Vercel solo permite crons diarios; Supabase Edge Functions son gratis y soportan pg_cron.
- **KD-2** — Dedup por (user_id, lugar_id, date). Evita spam si el cron corre 6 veces en la ventana de 30 min.
- **KD-3** — Solo "abre pronto", no "cierra pronto". "Cierra pronto" ya está visible en la app; push para cierre generaría ansiedad si el usuario no puede actuar.
- **KD-4** — Solo usuarios autenticados. Las subscripciones van ligadas a favoritos, que requieren auth.
- **KD-5** — 410 Gone handling. Si el endpoint ya no existe, se elimina la subscripción automáticamente.
