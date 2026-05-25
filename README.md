# Haku

*Haku* significa "vamos" en quechua — app hiperlocal de descubrimiento gastronómico para Catamarca. **Spec-Driven Development** — la fuente de verdad es [`CLAUDE.md`](./CLAUDE.md).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Lucide
- Supabase (PostgreSQL + Storage)
- Leaflet + OpenStreetMap
- PWA (vía manifest)

## Setup local

```bash
pnpm install
cp .env.local.example .env.local
# completar credenciales de Supabase y ADMIN_PASSWORD
pnpm dev
```

## Variables de entorno

Ver `.env.local.example`. Todas requeridas para correr la app.

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Levanta el dev server en `http://localhost:3000` |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve el build de producción |
| `pnpm test` | Corre los tests (Vitest) |
| `pnpm test:watch` | Tests en modo watch |
| `pnpm lint` | ESLint |

## Base de datos

- Schema completo: [`supabase/schema.sql`](./supabase/schema.sql)
- Seed inicial (categorías + tipos de comida): [`supabase/seed.sql`](./supabase/seed.sql)

Ejecutar ambos en el SQL Editor de Supabase Dashboard (en orden).

## Estructura

Ver §13 del [`CLAUDE.md`](./CLAUDE.md).

## Fases

Ver §15 del [`CLAUDE.md`](./CLAUDE.md). Estado actual: **Fase 0 — Setup completado**.
