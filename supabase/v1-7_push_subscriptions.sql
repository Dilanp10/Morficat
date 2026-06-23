-- Spec 018: Notificaciones Push
-- Ejecutar en Supabase SQL Editor

-- Subscripciones push por usuario/dispositivo
create table if not exists push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);

alter table push_subscriptions enable row level security;

create policy "push_subscriptions_own"
  on push_subscriptions for all
  using (auth.uid() = user_id);

-- Log de notificaciones enviadas (dedup: 1 por local por usuario por día)
create table if not exists push_notif_log (
  user_id    uuid not null references auth.users(id)  on delete cascade,
  lugar_id   uuid not null references lugares(id)     on delete cascade,
  sent_date  date not null,
  primary key (user_id, lugar_id, sent_date)
);

alter table push_notif_log enable row level security;
-- Solo service_role puede leer/escribir (el cron usa service_role key)

-- ─── pg_cron: llamar a la Edge Function cada 5 min ───────────────────────────
-- IMPORTANTE: Reemplazá <SUPABASE_URL> y <SERVICE_ROLE_KEY> con tus valores
-- reales antes de ejecutar. Encontrás ambos en:
--   Supabase Dashboard → Project Settings → API
--
-- enable pg_net si no está activo (la mayoría de los proyectos ya lo tienen)
create extension if not exists pg_net;

-- para ver crons existentes: select * from cron.job;
-- para eliminar: select cron.unschedule('push-abre-pronto');

select cron.schedule(
  'push-abre-pronto',
  '*/5 * * * *',
  $$
  select net.http_post(
    url     := '<SUPABASE_URL>/functions/v1/push-cron',
    headers := '{"Authorization":"Bearer <SERVICE_ROLE_KEY>","Content-Type":"application/json"}'::jsonb,
    body    := '{}'::jsonb
  )
  $$
);
