# [SPEC 07] Wizard de Sugerencias
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/7
> Estado: ✅ Implementado

## Descripción
Wizard de 4 pasos (`/sugerir`). Permite enviar nuevos locales o correcciones con fotos (hasta 3), GPS y audio opcionales. Sin auth requerida.

## Archivos
| Archivo | Rol |
|---|---|
| `app/sugerir/page.tsx` | Página contenedora |
| `app/sugerir/_components/SugerirWizard.tsx` | Wizard 4 pasos |
| `app/sugerir/_components/PhotoPicker.tsx` | Selector de hasta 3 fotos |
| `app/sugerir/_actions.ts` | Server action: sube fotos + inserta sugerencia |

## Pasos del wizard
| Paso | Contenido |
|---|---|
| 1 | Tipo: nuevo local / error horario / local cerrado / otro |
| 2 | Descripción + ubicación (texto manual o GPS) |
| 3 | Fotos opcionales (hasta 3, galería o cámara) |
| 4 | Email opcional + confirmación + envío |

## GPS
- Usa `navigator.geolocation`
- Reverse geocoding: Nominatim (`https://nominatim.openstreetmap.org/reverse`)
- Header `Accept-Language: es` para nombres en español
- Fallback: coordenadas en texto si Nominatim falla

## Almacenamiento
```
sugerencias tabla:
  id, tipo, contenido, email, revisado, created_at
  foto_url  TEXT  → URLs separadas por | (hasta 3)
  audio_url TEXT  → URL de audio en Storage

Storage buckets:
  sugerencias/fotos/
  sugerencias/audios/
```

## Criterios de aceptación
- [x] Wizard 4 pasos con navegación adelante/atrás
- [x] GPS obtiene dirección legible via Nominatim
- [x] Hasta 3 fotos con preview individual y delete
- [x] Botones separados galería / cámara
- [x] Fotos suben a Supabase Storage
- [x] Inserción pública sin auth (RLS anon INSERT)
- [x] Admin puede ver y marcar como revisadas
