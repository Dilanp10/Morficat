# [SPEC 12] Datos MVP → Lanzamiento Público
> GitHub Issue: https://github.com/Dilanp10/Morficat/issues/12
> Estado: ⏳ Pendiente — NO lanzar hasta completar

## Descripción
Checklist obligatorio antes de hacer la app pública. Actualmente la app está en modo MVP privado con datos temporales (`data_temporal = true`).

## ⚠️ Política oficial
**Nunca distribuir la URL públicamente sin completar TODOS los ítems de este checklist.**

## Checklist de lanzamiento
- [ ] Auditoría completa: `SELECT * FROM lugares WHERE data_temporal = true`
- [ ] Reemplazar cada local con `data_temporal=true` por datos verificados directamente con el local
- [ ] Fotos propias o con permiso explícito del local (no scraped de Instagram)
- [ ] Verificar horarios con cada local (WhatsApp / llamada / visita presencial)
- [ ] Al menos 30 locales con información completa y verificada
- [ ] Publicar página `/privacidad` (Política de Privacidad)
- [ ] Publicar página `/terminos` (Términos de Uso)
- [ ] Cero scraping automático activo en producción
- [ ] Testing en dispositivos reales: Android + iOS Safari
- [ ] Lighthouse performance score ≥ 90
- [ ] Todos los flujos core testeados (3 escenarios del SPEC 02)

## Consulta de auditoría
```sql
-- Ver qué locales todavía tienen datos temporales
SELECT nombre, direccion, created_at
FROM lugares
WHERE data_temporal = true AND activo = true
ORDER BY created_at DESC;

-- Actualizar cuando un local está verificado
UPDATE lugares
SET data_temporal = false, verificado = true
WHERE id = '...';
```

## Proceso de verificación por local
1. Contactar al local (WhatsApp preferido)
2. Confirmar: nombre, dirección, horarios, teléfono
3. Pedir foto o permiso para usar una existente
4. Actualizar en admin y marcar `data_temporal = false`, `verificado = true`
