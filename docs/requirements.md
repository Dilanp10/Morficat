# Requirements

> Lista completa de requisitos funcionales del MVP, agrupados por módulo. Cada requisito tiene un ID estable usado en specs y tests.

## REQ-CORE-* — Core (todos los flujos)

- **REQ-CORE-001** — La app carga en menos de 3 segundos en 4G.
- **REQ-CORE-002** — La app es instalable como PWA en Android e iOS.
- **REQ-CORE-003** — La app funciona correctamente sin GPS (fallback a Catamarca capital).
- **REQ-CORE-004** — La app se ve correctamente en pantallas de 360px a 430px.
- **REQ-CORE-005** — Timezone hardcodeado a UTC-3 (Argentina).
- **REQ-CORE-006** — Dark mode y light mode funcionales con persistencia en localStorage.

## REQ-HOME-* — Home / Lista

- **REQ-HOME-001** — La lista muestra todos los locales activos.
- **REQ-HOME-002** — Filtro "Abierto ahora" activo por defecto.
- **REQ-HOME-003** — Ordenamiento por distancia cuando hay GPS.
- **REQ-HOME-004** — Sin GPS: muestra zona/barrio en lugar de metros.
- **REQ-HOME-005** — Estado vacío: mensaje + botón "Limpiar filtros".

## REQ-SRCH-* — Búsqueda y Filtros

- **REQ-SRCH-001** — Búsqueda ILIKE por nombre + categoría + tipo de comida.
- **REQ-SRCH-002** — Filtros combinables: categoría + atributos + estado.
- **REQ-SRCH-003** — Resultados actualizados sin submit (en tiempo real).

## REQ-MAP-* — Mapa

- **REQ-MAP-001** — Mapa muestra todos los locales como pines diferenciados (abierto/cerrado).
- **REQ-MAP-002** — Tap en pin abre popup con info básica.
- **REQ-MAP-003** — Popup permite navegar a `/local/[slug]`.

## REQ-DET-* — Ficha del local

- **REQ-DET-001** — Hero con foto 16:9 o monograma con gradiente.
- **REQ-DET-002** — Horarios visibles para los 7 días, "hoy" destacado.
- **REQ-DET-003** — Botones de acción: WhatsApp, Instagram, Teléfono.
- **REQ-DET-004** — Mini-mapa Leaflet sin navegación externa.
- **REQ-DET-005** — Estado abierto/cerrado en tiempo real (se actualiza cada 60s).

## REQ-HOR-* — Lógica de Horarios

- **REQ-HOR-001** — Manejar horario normal (un solo rango).
- **REQ-HOR-002** — Manejar horario cortado (múltiples rangos por día).
- **REQ-HOR-003** — Manejar cruce de medianoche (cierre al día siguiente).
- **REQ-HOR-004** — Día sin horario cargado = cerrado.
- **REQ-HOR-005** — Retornar detalle: "cierra a las HH:MM" o "abre a las HH:MM".

## REQ-ADM-* — Admin

- **REQ-ADM-001** — Ruta `/admin` protegida por contraseña.
- **REQ-ADM-002** — CRUD completo de lugares.
- **REQ-ADM-003** — Gestión de horarios por día.
- **REQ-ADM-004** — Upload de imagen a Supabase Storage.
- **REQ-ADM-005** — Toggle activo/inactivo (soft delete).
- **REQ-ADM-006** — Vista de sugerencias con marcar revisado.

## REQ-SUG-* — Sugerencias

- **REQ-SUG-001** — Wizard de 7 pasos sin auth requerida.
- **REQ-SUG-002** — Capturar tipo, nombre, categoría, dirección, horarios, fotos, audio, email.
- **REQ-SUG-003** — Soporte de hasta 3 fotos por sugerencia.
- **REQ-SUG-004** — GPS con reverse geocoding via Nominatim.
- **REQ-SUG-005** — Horarios serializados al campo `contenido` de la tabla.

## REQ-AUTH-* — Auth

- **REQ-AUTH-001** — Signup con email + password + display_name.
- **REQ-AUTH-002** — Login funcional.
- **REQ-AUTH-003** — WelcomeOverlay solo en el primer uso (localStorage).
- **REQ-AUTH-004** — App funciona 100% sin auth (modo invitado).

## REQ-RES-* — Reseñas

- **REQ-RES-001** — Solo usuarios autenticados pueden dejar reseña.
- **REQ-RES-002** — Una reseña por usuario por local (upsert).
- **REQ-RES-003** — Puntuación de 1 a 5 estrellas.
- **REQ-RES-004** — Promedio visible en ficha del local.

## REQ-SEC-* — Seguridad

- **REQ-SEC-001** — RLS activo en todas las tablas de Supabase.
- **REQ-SEC-002** — `service_role` key nunca expuesta al cliente.
- **REQ-SEC-003** — Admin auth via cookie firmada HMAC-SHA256.
- **REQ-SEC-004** — HTTPS obligatorio (Vercel automático).
