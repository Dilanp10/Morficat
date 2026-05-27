# [SPEC 14] Sugerir — Horarios completos en el wizard
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/14
> Estado: 🚧 En desarrollo

## Descripción
Agregar un paso interactivo en el wizard `/sugerir` para capturar los horarios completos del local sugerido: 7 días + horario cortado opcional + comportamiento en feriados.

## Archivos
| Archivo | Rol |
|---|---|
| `app/sugerir/_components/SugerirWizard.tsx` | Agregar nuevo paso, ahora 7 steps total |
| `app/sugerir/_components/HorariosInput.tsx` | **NUEVO** — componente interactivo de horarios |
| `app/sugerir/_actions.ts` | Recibir y serializar el horario en `contenido` |

## UX del paso
Para cada día de la semana (Lunes → Domingo):
- Toggle visible: **Abre / Cerrado**
- Si abre:
  - Selector hora apertura (HH:MM cada 30 min)
  - Selector hora cierre
  - Botón `+ segundo turno` para horario cortado
  - Botón ✕ para eliminar segundo turno

Acciones rápidas (arriba del listado):
- **Lun-Vie iguales** → copia el horario del lunes a martes-viernes
- **Todos iguales** → copia el horario del lunes a todos

Sección Feriados (radio buttons):
- ☑ Sí, abre como un día normal
- ☐ No, cierra los feriados
- ☐ A veces, consultar

## Serialización
Los horarios se concatenan al campo `contenido` de la tabla `sugerencias` como texto legible. **No se cambia el schema.**

Ejemplo de output guardado:
```
[Comentario libre del usuario, si lo escribió]

📅 Horarios sugeridos:
• Lunes:     09:00 – 13:00, 17:00 – 22:00
• Martes:    09:00 – 22:00
• Miércoles: 09:00 – 22:00
• Jueves:    09:00 – 22:00
• Viernes:   09:00 – 00:00
• Sábado:    11:00 – 02:00
• Domingo:   cerrado

🎉 Feriados: abre como un día normal
```

## Tipos
```ts
type Turno = { apertura: string; cierre: string };

type DiaHorario = {
  cerrado: boolean;
  turnos: Turno[];  // 1 o 2 turnos
};

type HorarioSemana = {
  lunes: DiaHorario;
  martes: DiaHorario;
  miercoles: DiaHorario;
  jueves: DiaHorario;
  viernes: DiaHorario;
  sabado: DiaHorario;
  domingo: DiaHorario;
};

type FeriadosOption = "normal" | "cerrado" | "consultar";
```

## Criterios de aceptación
- [ ] Paso de horarios en el wizard (ahora son 7 steps)
- [ ] Toggle abierto/cerrado por día con feedback visual
- [ ] Selector de hora apertura/cierre (intervalos de 30 min)
- [ ] Opción de agregar/quitar segundo turno (horario cortado)
- [ ] Quick action: "Lun-Vie iguales"
- [ ] Quick action: "Todos iguales"
- [ ] Pregunta de feriados con 3 opciones (radio)
- [ ] Paso opcional — se puede saltar sin completar
- [ ] Sugerencia recibida en admin muestra horarios formateados
- [ ] Estilo Tierra coherente con el resto del wizard
