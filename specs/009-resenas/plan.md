# Implementation Plan: Reseñas

**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/local/[slug]/_components/ResenasSeccion.tsx` | UI + estado |
| `app/local/[slug]/_actions.ts` | `crearResena`, `editarResena`, `eliminarResena` |
| `lib/resenas.ts` | `listarResenasPorLugar`, `obtenerResenaUsuario`, `calcularPromedio` |
| `components/EstrellasDisplay.tsx` | Estrellas readonly |
| `components/EstrellasInput.tsx` | Estrellas interactivas 1-5 |

## DB

```sql
resenas (
  id UUID PRIMARY KEY,
  lugar_id UUID REFERENCES lugares(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
  texto TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lugar_id, user_id)
)
```

## Key Decisions

- **KD-1** — UNIQUE(lugar_id, user_id) en DB. Una reseña por usuario por local.
- **KD-2** — Promedio en frontend (no campo cacheado). Con < 100 reseñas por local es trivial.
