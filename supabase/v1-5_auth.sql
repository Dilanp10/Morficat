-- MorfiCat v1.5 — Cuentas + Reseñas
-- Ejecutar en SQL Editor de Supabase (después de schema.sql original).

-- =============================================================================
-- profiles: perfil público linkeado 1-1 con auth.users
-- =============================================================================

create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null check (char_length(display_name) between 2 and 40),
  created_at    timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "read_profiles" on profiles;
create policy "read_profiles" on profiles
  for select using (true);

drop policy if exists "insert_own_profile" on profiles;
create policy "insert_own_profile" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "update_own_profile" on profiles;
create policy "update_own_profile" on profiles
  for update using (auth.uid() = id);

-- Auto-crear profile cuando se crea un usuario en auth.users
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================================
-- resenas: 1 reseña por usuario por lugar
-- =============================================================================

create table if not exists resenas (
  id          uuid primary key default gen_random_uuid(),
  lugar_id    uuid not null references lugares(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  puntuacion  smallint not null check (puntuacion between 1 and 5),
  comentario  text check (char_length(comentario) <= 1000),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (lugar_id, user_id)
);

create index if not exists resenas_lugar_idx on resenas (lugar_id);
create index if not exists resenas_user_idx on resenas (user_id);

alter table resenas enable row level security;

drop policy if exists "read_resenas" on resenas;
create policy "read_resenas" on resenas
  for select using (true);

-- INSERT/UPDATE/DELETE: solo el dueño. auth.uid() es null para anon → bloquea invitados.
drop policy if exists "insert_own_resena" on resenas;
create policy "insert_own_resena" on resenas
  for insert with check (auth.uid() = user_id);

drop policy if exists "update_own_resena" on resenas;
create policy "update_own_resena" on resenas
  for update using (auth.uid() = user_id);

drop policy if exists "delete_own_resena" on resenas;
create policy "delete_own_resena" on resenas
  for delete using (auth.uid() = user_id);

-- Trigger updated_at en resenas (reusa la función set_updated_at del schema base)
drop trigger if exists resenas_set_updated_at on resenas;
create trigger resenas_set_updated_at
  before update on resenas
  for each row execute function set_updated_at();
