# Implementation Plan: Lanzamiento Público

**Status**: Pending

## No es desarrollo

Esta spec es operativa, no de código. El "plan" es el orden de ejecución del checklist.

## Orden sugerido

1. **Mes -2**: Empezar a contactar locales (es lo más lento)
2. **Mes -1**: Cargar página `/privacidad` y `/terminos`
3. **Semana -2**: QA completo en dispositivos reales
4. **Semana -1**: Lighthouse audit + ajustes finales
5. **Día D**: Anuncio público + monitoreo

## Páginas legales nuevas

| Ruta | Contenido |
|---|---|
| `/privacidad` | Política de Privacidad — qué datos se recolectan, cómo se usan, derechos del usuario |
| `/terminos` | Términos de Uso — responsabilidad, propiedad intelectual, uso aceptable |

## Auditoría SQL

```sql
-- Locales con datos temporales activos
SELECT nombre, direccion, created_at
FROM lugares
WHERE data_temporal = true AND activo = true
ORDER BY created_at DESC;

-- Confirmar lugar verificado
UPDATE lugares
SET data_temporal = false, verificado = true
WHERE id = '<uuid>';
```
