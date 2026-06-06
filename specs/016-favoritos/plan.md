# Implementation Plan: Favoritos

**Status**: Draft

## Estrategia: híbrido invitado + cuenta

| Estado | Fuente de verdad | Escritura |
|---|---|---|
| Invitado | `localStorage["haku_favoritos"]` (array de `lugar_id`) | localStorage |
| Logueado | tabla `favoritos` en Supabase (RLS por dueño) | server action |
| Al loguear | se migran los del dispositivo y se limpia localStorage | server action `migrarFavoritos` |

Se usa **`lugar_id` (uuid)** como identificador en ambos lados → migración
trivial (sin mapear slug→id). El `id` ya viene en `LugarPublic`.

## Files

| Archivo | Rol | Nuevo? |
|---|---|---|
| `supabase/v1-6_favoritos.sql` | Tabla `favoritos` + RLS + índices | ✅ |
| `lib/favoritos.ts` | `listarFavoritosIds()` (server, lee favoritos del user) | ✅ |
| `app/_actions/favoritos.ts` | `setFavorito(lugarId, favorito)`, `migrarFavoritos(ids)` | ✅ |
| `components/FavoritosProvider.tsx` | Context client: estado `Set<string>`, hidratación, toggle optimista, migración | ✅ |
| `components/BotonFavorito.tsx` | Botón ♥ reutilizable (card + ficha) | ✅ |
| `app/layout.tsx` | Envolver con `FavoritosProvider`, pasar `initialFavoritos` + `isAuthenticated` | ✏️ |
| `components/LocalCard.tsx` | Montar `BotonFavorito` (recibir `lugarId`) | ✏️ |
| `components/HomeListClient.tsx` | Estado `soloFavoritos` + filtro + empty state; pasar `id` a la card | ✏️ |
| `components/FiltrosChips.tsx` | Chip "♥ Favoritos" | ✏️ |
| `app/local/[slug]/page.tsx` | `BotonFavorito` en la top bar (junto a Share) | ✏️ |

## DB

```sql
-- supabase/v1-6_favoritos.sql
create table if not exists favoritos (
  user_id    uuid not null references auth.users(id) on delete cascade,
  lugar_id   uuid not null references lugares(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, lugar_id)
);

create index if not exists favoritos_user_idx on favoritos (user_id);

alter table favoritos enable row level security;

-- Cada quien ve/gestiona SOLO los suyos (a diferencia de resenas, no son públicos).
create policy "read_own_fav"   on favoritos for select using (auth.uid() = user_id);
create policy "insert_own_fav" on favoritos for insert with check (auth.uid() = user_id);
create policy "delete_own_fav" on favoritos for delete using (auth.uid() = user_id);
```

## Flujo del Provider (cliente)

```
montar:
  si isAuthenticated:
    estado = initialFavoritos (del server)
    si localStorage tiene items:
      migrarFavoritos(localItems)   // server action, upsert idempotente
      estado = union(estado, localItems)
      limpiar localStorage
  si invitado:
    estado = leer(localStorage)

toggle(lugarId):
  willBeFav = !esFavorito(lugarId)
  optimista: actualizar Set local de inmediato
  si isAuthenticated: setFavorito(lugarId, willBeFav)  → si falla, revertir
  si invitado: escribir localStorage
```

## Key Decisions

- **KD-1 — `lugar_id` como clave en ambos lados.** Evita mapear slug→id en la
  migración. La card pasa a recibir `lugarId` además de `slug`.
- **KD-2 — Favoritos privados (RLS solo dueño).** A diferencia de `resenas`
  (lectura pública), nadie ve los favoritos de otro.
- **KD-3 — Filtro client-side.** El chip "♥ Favoritos" filtra la lista ya
  cargada en `HomeListClient`; sin queries nuevas. Coherente con cómo ya
  funcionan "Abierto ahora" y categorías.
- **KD-4 — UI optimista con rollback.** El ♥ responde al instante; si la
  escritura server falla, revierte. Consistente con la sensación de la app.
- **KD-4b — `setFavorito(id, favorito)` con estado deseado**, no un toggle
  ciego: a prueba de clics rápidos (idempotente) y alineado con la UI optimista.
  Sin `revalidatePath` — el provider es la fuente de verdad en memoria durante
  la sesión; `initialFavoritos` solo siembra en la carga inicial.
- **KD-5 — PK compuesta (user_id, lugar_id).** Idempotencia natural: re-guardar
  no duplica; la migración usa upsert/`on conflict do nothing`.

## Constitución / convenciones

- Tokens Tierra (`var(--terra)`), nada hardcodeado (regla 5).
- Mobile first 375px (regla 4).
- "No empty features" — el chip de favoritos siempre tiene empty state (regla 3).
- Simple sobre complejo — se reusa `HomeListClient` en vez de ruta nueva (regla 8).
