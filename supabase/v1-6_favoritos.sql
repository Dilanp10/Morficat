-- Haku v1.6 — Favoritos (persistencia por cuenta)
-- Ejecutar en SQL Editor de Supabase (después de v1-5_auth.sql).
--
-- Spec: 016-favoritos (Fase B). Guarda los locales favoritos de cada usuario.
-- Para invitados, los favoritos viven en localStorage del dispositivo y se
-- migran a esta tabla cuando crean cuenta / inician sesión.

-- =============================================================================
-- favoritos: 1 fila por (usuario, lugar). PK compuesta → idempotente.
-- =============================================================================

create table if not exists favoritos (
  user_id    uuid not null references auth.users(id) on delete cascade,
  lugar_id   uuid not null references lugares(id)    on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, lugar_id)
);

create index if not exists favoritos_user_idx on favoritos (user_id);

alter table favoritos enable row level security;

-- A diferencia de `resenas` (lectura pública), los favoritos son PRIVADOS:
-- cada usuario ve y gestiona únicamente los suyos. auth.uid() es null para
-- anónimos → quedan bloqueados (los invitados usan localStorage).

drop policy if exists "read_own_fav" on favoritos;
create policy "read_own_fav" on favoritos
  for select using (auth.uid() = user_id);

drop policy if exists "insert_own_fav" on favoritos;
create policy "insert_own_fav" on favoritos
  for insert with check (auth.uid() = user_id);

drop policy if exists "delete_own_fav" on favoritos;
create policy "delete_own_fav" on favoritos
  for delete using (auth.uid() = user_id);
