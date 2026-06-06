# Feature Specification: Lanzamiento Público

**Feature Branch**: `014-lanzamiento-publico`
**Status**: Pending — checklist operativo, NO desarrollo
**Requirements**: REQ-SEC-001 a REQ-SEC-004

## Descripción

Esta spec NO es una feature de código. Es un checklist obligatorio antes de hacer la URL pública.

## ⚠️ Política

**Nunca distribuir la URL públicamente hasta completar TODOS los ítems.**

## Pre-requisitos

Estado actual: MVP en producción Vercel, URL solo compartida con familia/amigos. Datos cargados con `data_temporal=true` desde fuentes públicas.

## Checklist

### 🔴 Datos
- [ ] Auditoría: `SELECT * FROM lugares WHERE data_temporal=true AND activo=true`
- [ ] Contactar a cada local con `data_temporal=true` (WhatsApp/llamada/visita)
- [ ] Confirmar nombre, dirección, horarios, contacto
- [ ] Marcar `data_temporal=false` + `verificado=true` cuando esté confirmado
- [ ] Al menos 30 locales verificados al momento del lanzamiento

### 🔴 Fotos
- [ ] Pedir permiso al local para usar su foto (Instagram/Facebook) O usar foto propia
- [ ] Reemplazar fotos sin permiso por placeholder genérico o foto autorizada
- [ ] Cero scraping automático activo

### 🔴 Legales
- [ ] Publicar página `/privacidad` (Política de Privacidad)
- [ ] Publicar página `/terminos` (Términos de Uso)
- [ ] Link a `/privacidad` desde el wizard de signup
- [ ] Link a `/terminos` desde el wizard de signup

### 🟡 QA
- [ ] Testing manual completo en Android Chrome real
- [ ] Testing manual completo en iOS Safari real
- [ ] Los 3 escenarios core resueltos en los tiempos esperados (ver spec 003)
- [ ] Lighthouse audit ≥ 90 (performance)
- [ ] Lighthouse audit ≥ 95 (accessibility)
- [ ] PWA instala correctamente en ambas plataformas

### 🟢 Distribución
- [ ] Comunicación de lanzamiento preparada (Instagram, WhatsApp)
- [ ] Plan de soporte para feedback (canal donde reportar)
- [ ] Monitoreo básico (Vercel Analytics activado)

## Out of Scope

- Marketing pago (orgánico al principio).
- Apps en stores (la PWA cubre).
- Multi-idioma (solo español).
