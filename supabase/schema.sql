-- MorfiCat — Schema completo
-- Ver §7.3 y §12.2 del CLAUDE.md
-- Ejecutar en SQL Editor de Supabase Dashboard

-- =============================================================================
-- Tablas
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists categorias (
  id      uuid primary key default gen_random_uuid(),
  nombre  text not null,
  slug    text unique not null,
  emoji   text,
  orden   int default 0,
  activo  boolean default true
);

create table if not exists tipos_comida (
  id      uuid primary key default gen_random_uuid(),
  nombre  text not null,
  slug    text unique not null,
  activo  boolean default true
);

create table if not exists lugares (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null,
  slug              text unique not null,
  descripcion       text,
  categoria_id      uuid references categorias(id) on delete set null,
  direccion         text not null,
  barrio            text,
  lat               decimal(10, 8) not null,
  lng               decimal(11, 8) not null,
  telefono          text,
  whatsapp          text,
  instagram         text,
  facebook          text,
  imagen_principal  text,
  imagenes          text[] default '{}',
  atributos         jsonb default '{}'::jsonb,
  activo            boolean default true,
  verificado        boolean default false,
  data_temporal     boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create table if not exists horarios (
  id                uuid primary key default gen_random_uuid(),
  lugar_id          uuid references lugares(id) on delete cascade,
  dia_semana        int not null check (dia_semana between 0 and 6),
  hora_apertura     time not null,
  hora_cierre       time not null,
  cerrado           boolean default false,
  cruza_medianoche  boolean default false
);

create table if not exists lugar_tipos_comida (
  lugar_id        uuid references lugares(id) on delete cascade,
  tipo_comida_id  uuid references tipos_comida(id) on delete cascade,
  primary key (lugar_id, tipo_comida_id)
);

create table if not exists sugerencias (
  id          uuid primary key default gen_random_uuid(),
  tipo        text not null check (tipo in ('nuevo_local','error_horario','local_cerrado','otro')),
  lugar_id    uuid references lugares(id) on delete set null,
  contenido   text not null,
  email       text,
  revisado    boolean default false,
  created_at  timestamptz default now()
);

-- =============================================================================
-- Índices
-- =============================================================================

create index if not exists lugares_activo_idx on lugares (activo);
create index if not exists lugares_categoria_idx on lugares (categoria_id);
create index if not exists lugares_slug_idx on lugares (slug);
create index if not exists horarios_lugar_idx on horarios (lugar_id);
create index if not exists horarios_lugar_dia_idx on horarios (lugar_id, dia_semana);

-- =============================================================================
-- Trigger updated_at
-- =============================================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists lugares_set_updated_at on lugares;
create trigger lugares_set_updated_at
  before update on lugares
  for each row execute function set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table categorias          enable row level security;
alter table tipos_comida        enable row level security;
alter table lugares             enable row level security;
alter table horarios            enable row level security;
alter table lugar_tipos_comida  enable row level security;
alter table sugerencias         enable row level security;

-- Lectura pública (anon + authenticated)
drop policy if exists "read_categorias" on categorias;
create policy "read_categorias" on categorias
  for select using (true);

drop policy if exists "read_tipos_comida" on tipos_comida;
create policy "read_tipos_comida" on tipos_comida
  for select using (true);

drop policy if exists "read_lugares" on lugares;
create policy "read_lugares" on lugares
  for select using (true);

drop policy if exists "read_horarios" on horarios;
create policy "read_horarios" on horarios
  for select using (true);

drop policy if exists "read_lugar_tipos_comida" on lugar_tipos_comida;
create policy "read_lugar_tipos_comida" on lugar_tipos_comida
  for select using (true);

-- Sugerencias: anon puede insertar, NO leer.
drop policy if exists "insert_sugerencias" on sugerencias;
create policy "insert_sugerencias" on sugerencias
  for insert with check (true);

-- service_role bypassea RLS por defecto; no se necesitan policies adicionales
-- para que el admin (que usa service_role) pueda escribir.
