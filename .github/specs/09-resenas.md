# [SPEC 09] Reseñas y Puntuaciones
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/9
> Estado: ✅ Implementado

## Descripción
Sistema de reseñas en la ficha del local. Usuarios autenticados dejan puntuación 1-5 estrellas + texto opcional. Un usuario = una reseña por local (upsert).

## Archivos
| Archivo | Rol |
|---|---|
| `app/local/[slug]/_components/ResenasSeccion.tsx` | UI completa de reseñas |
| `app/local/[slug]/_actions.ts` | `crearResena`, `editarResena`, `eliminarResena` |
| `lib/resenas.ts` | `listarResenasPorLugar`, `calcularPromedio` |
| `components/EstrellasDisplay.tsx` | Estrellas solo lectura |
| `components/EstrellasInput.tsx` | Selector interactivo 1-5 |

## Tabla resenas
```sql
CREATE TABLE resenas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lugar_id    UUID REFERENCES lugares(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id),
  puntuacion  INT CHECK (puntuacion BETWEEN 1 AND 5),
  texto       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lugar_id, user_id)  -- una reseña por usuario por local
);
```

## Visualización en ficha
- Promedio: número `4.8` en mono ocre + estrellas
- Sin auth: "Iniciá sesión para dejar reseña" + botones login/signup
- Con auth, sin reseña propia: formulario de estrellas + texto
- Con auth, con reseña propia: muestra su reseña con opciones editar/eliminar

## Criterios de aceptación
- [x] Promedio visible en cabecera de ficha (mono ocre)
- [x] Sin auth: mensaje + botones (no formulario)
- [x] Con auth: formulario funcional
- [x] Submit hace upsert (crea o actualiza)
- [x] Puede eliminar su propia reseña
- [x] Promedio se recalcula sin recargar (revalidatePath)
