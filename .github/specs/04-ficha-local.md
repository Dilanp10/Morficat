# [SPEC 04] Ficha del local (Detalle)
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/4
> Estado: ✅ Implementado

## Descripción
Pantalla de detalle (`/local/[slug]`). Información completa del local con hero, horarios, contacto, atributos, mini-mapa y reseñas.

## Archivos
| Archivo | Rol |
|---|---|
| `app/local/[slug]/page.tsx` | SSR, generateMetadata para SEO |
| `components/HorariosTable.tsx` | Tabla 7 días, "hoy" en terracota, mono |
| `components/EstadoBadgeLive.tsx` | Badge abierto/cerrado en tiempo real |
| `components/MiniMapa.tsx` | Leaflet embebido (sin navegación externa) |
| `components/ShareButton.tsx` | Web Share API / clipboard fallback |
| `app/local/[slug]/_components/ResenasSeccion.tsx` | Reseñas |

## Secciones (en orden)
1. **Hero**: foto 16:9 o monograma (1ª letra) con gradiente `--terra-deep → --card-bg`
2. **Top bar**: botón ‹ volver (dark blur) + botón Compartir
3. **Cabecera**: `CATEGORÍA · BARRIO` en mono caps + nombre en serif italic + estado
4. **Acciones**: WhatsApp (primario terracota) | Instagram (ghost) | Teléfono
5. **Descripción**: texto libre si existe
6. **Horarios**: sección label mono + tabla 7 días
7. **Ubicación**: dirección + mini-mapa
8. **Atributos**: chips mono uppercase con borde `--line-2`
9. **Contacto extra**: teléfono / Facebook con borde hairline
10. **Reseñas**: promedio + formulario (requiere auth) + listado

## Edge cases
| Caso | Comportamiento |
|---|---|
| Sin foto | Monograma (1ª letra del nombre) sobre gradiente terracota |
| Sin WhatsApp | Instagram o Teléfono como botón primario |
| Sin WhatsApp ni Instagram | Solo teléfono |
| Local sin horarios | Badge "Cerrado" siempre |
| Slug no encontrado | `notFound()` → 404 |

## Criterios de aceptación
- [x] Hero con monograma cuando no hay foto
- [x] Nombre en serif italic con "." al final
- [x] Horarios en mono, "hoy" en terracota con label "HOY"
- [x] Atributos como chips mono uppercase
- [x] Badge en tiempo real (se actualiza cada 60s)
- [x] SEO: `generateMetadata` con título y description dinámica
- [x] Botón compartir con Web Share API + fallback clipboard
