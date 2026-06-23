# Tasks: Notificaciones Push

## Setup
- [ ] T001 Generar VAPID keys y agregar a `.env.local`
- [ ] T002 `supabase/v1-7_push_subscriptions.sql` — tablas + RLS

## Service Worker
- [ ] T003 `public/sw.js` — push event + notificationclick
- [ ] T004 `components/ServiceWorkerInit.tsx` — registrar SW
- [ ] T005 `app/layout.tsx` — montar `<ServiceWorkerInit />`

## Backend
- [ ] T006 `app/_actions/push.ts` — `subscribePush` / `unsubscribePush`
- [ ] T007 `supabase/functions/push-cron/index.ts` — Edge Function

## UI
- [ ] T008 `components/PushToggle.tsx` — toggle con estado
- [ ] T009 `app/mas/page.tsx` — sección "Notificaciones"

## Cierre
- [ ] T010 Agregar VAPID keys en Vercel env vars
- [ ] T011 Deploy Edge Function: `supabase functions deploy push-cron`
- [ ] T012 Configurar pg_cron en Supabase SQL Editor
- [ ] T013 Actualizar `CLAUDE.md` + índice de specs
