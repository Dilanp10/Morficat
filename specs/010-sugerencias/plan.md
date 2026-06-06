# Implementation Plan: Wizard de Sugerencias

**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/sugerir/page.tsx` | Página contenedora |
| `app/sugerir/_components/SugerirWizard.tsx` | Wizard multi-step |
| `app/sugerir/_components/PhotoPicker.tsx` | Selector con galería + cámara, hasta 3 fotos |
| `app/sugerir/_components/AudioRecorder.tsx` | Grabador opcional |
| `app/sugerir/_actions.ts` | `enviarSugerencia` server action |

## DB

```sql
sugerencias (
  id UUID PRIMARY KEY,
  tipo TEXT,            -- nuevo_local | error_horario | local_cerrado | otro
  contenido TEXT,
  email TEXT,
  foto_url TEXT,        -- URLs separadas por |
  audio_url TEXT,
  revisado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

## Key Decisions

- **KD-1** — Wizard multi-step en lugar de form único. Menos abrumador en mobile.
- **KD-2** — Anónimo (sin auth). Email opcional para seguimiento.
- **KD-3** — Múltiples URLs de fotos en una columna separadas por `|`. Evita sumar columna `foto_url[]`.
- **KD-4** — GPS via Nominatim (gratis) en lugar de Google Maps API.
