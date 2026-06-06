# Implementation Plan: Sugerir — Horarios completos

**Status**: Implemented

## Files

| Archivo | Rol |
|---|---|
| `app/sugerir/_components/HorariosInput.tsx` | **NUEVO** — UI interactiva 7 días + feriados |
| `app/sugerir/_components/SugerirWizard.tsx` | Nuevo paso 4 |

## Tipos

```ts
type Turno = { apertura: string; cierre: string };
type DiaHorario = { cerrado: boolean; turnos: Turno[] };
type HorarioSemana = { lunes: DiaHorario, ..., domingo: DiaHorario };
type FeriadosOption = "normal" | "cerrado" | "consultar";
```

## Serialización

Los horarios se concatenan al campo `contenido` de la sugerencia como texto legible:

```
📅 Horarios sugeridos:
• Lunes:     09:00 – 13:00, 17:00 – 22:00
• Martes:    09:00 – 22:00
...
🎉 Feriados: abre como un día normal
```

**No se cambia el schema de DB.** Solo se aprovecha el campo `contenido`.

## Key Decisions

- **KD-1** — Sin nueva columna JSONB. El admin lee texto plano y carga al lugar manualmente.
- **KD-2** — Horas cada 30 min en `<select>`. UI más simple que time picker.
- **KD-3** — Quick actions ("Lun-Vie iguales", "Todos iguales") para acelerar la carga.
