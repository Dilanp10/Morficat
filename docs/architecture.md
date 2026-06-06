# Architecture

> Vista de alto nivel de cómo está armado Haku.

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 14 |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS + tokens Tierra | 3.x |
| UI base | shadcn/ui + lucide-react | — |
| Fuentes | Instrument Serif, Inter, JetBrains Mono | via `next/font/google` |
| Backend / DB | Supabase (PostgreSQL + Storage + Auth) | — |
| Mapas | Leaflet + OpenStreetMap | — |
| Geocoding | Nominatim (OSM) | — |
| Hosting | Vercel (free tier) | — |
| Package manager | pnpm | — |

## Flujo de datos

```
Frontend (Next.js) → Supabase JS SDK → PostgreSQL (Supabase)
```

- **Sin backend propio**. Todo el trabajo de query corre desde el frontend con la `anon key`.
- **Sin API Routes** en el MVP (excepto auth/admin middleware).
- **Distancia**: calculada en frontend (Haversine).
- **"Abierto ahora"**: calculado en frontend (lógica JS vs hora local AR).

## Justificación

Con 30-50 locales, traer todos los datos en una sola query (~2KB) y procesar en el dispositivo es instantáneo. No justifica server-side filtering ni PostGIS.
Cuando el catálogo supere ~500 locales se migra a queries selectivas + PostGIS.

## Capas lógicas

```
app/                  ← rutas (Next.js App Router)
  page.tsx            ← server components fetch
  [feature]/_actions  ← server actions (write paths)
  [feature]/_components ← componentes específicos de ruta

components/           ← componentes reutilizables UI

lib/                  ← lógica de negocio pura (TypeScript)
  horarios.ts         ← "está abierto ahora"
  distancia.ts        ← Haversine
  supabase/           ← clientes (anon + service_role)
  *-actions.ts        ← server actions globales
```

## Seguridad

- **RLS (Row Level Security)** activo en todas las tablas de Supabase
- `anon` key: solo SELECT en tablas públicas, INSERT en `sugerencias`
- `service_role` key: NUNCA en el cliente. Solo en server actions de admin.
- Admin protegido por contraseña (`ADMIN_PASSWORD` env var) + cookie firmada (HMAC-SHA256)

## Timezone

Argentina UTC-3 hardcodeado. Sin cambio de horario.
