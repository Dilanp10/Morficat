# MorfiCat — Spec-Driven Development (SDD)

> **Fuente de verdad** para el desarrollo de MorfiCat.
> Todo lo documentado aquí fue definido mediante entrevista guiada SDD.
> No implementar nada que contradiga este documento sin actualizar primero el spec.

---

## 1. Visión del Producto

### 1.1 Identidad

| Campo | Valor |
|---|---|
| **Nombre** | MorfiCat |
| **Categoría** | App de descubrimiento gastronómico hiperlocal |
| **Ubicación inicial** | Catamarca, Argentina |
| **Plataforma** | Web app responsive (PWA), mobile-first |

### 1.2 Visión

MorfiCat es una app móvil hiperlocal que ayuda a los habitantes y visitantes de Catamarca a descubrir rápidamente dónde comer y tomar algo, con foco principal en saber qué locales están abiertos en este momento. A diferencia de Google Maps, MorfiCat se enfoca exclusivamente en gastronomía catamarqueña con información curada, confiable y con experiencia móvil moderna.

### 1.3 Dolor protagonista del MVP

> **"Saber qué está abierto ahora en Catamarca para comer o tomar algo."**

Dolores secundarios atendidos por el MVP:

- Descubrir lugares nuevos (no repetir siempre los mismos).
- Tener información confiable de horarios y contacto.
- Orientar a turistas y visitantes.

### 1.4 Diferenciación vs Google Maps

- Foco hiperlocal exclusivo en gastronomía de Catamarca.
- Información curada manualmente, no agregada automáticamente.
- Horarios verificados (en lanzamiento público).
- Atributos relevantes que Google no expone (terraza, mesas afuera, etc.).
- Experiencia móvil simple y rápida, sin el ruido de Google Maps.
- Incluye locales chicos sin presencia digital significativa.

### 1.5 Modelo de negocio

- **MVP**: Sin monetización. Foco en awareness y validación.
- **Futuro (v2+)**: Posible monetización vía publicidad de locales, planes premium para dueños, promociones. No es prioridad ahora.

### 1.6 Presupuesto

- **$0 USD/mes** durante el MVP.
- Uso exclusivo de servicios con free tier.

---

## 2. Usuarios Objetivo

### 2.1 Usuario principal

| Campo | Valor |
|---|---|
| **Perfil** | Joven-adulto, 25-40 años, residente en Catamarca |
| **Estilo de vida** | Sale seguido (varias veces al mes), social, valora descubrir |
| **Nivel tecnológico** | Medio-alto (usa Uber, Mercado Libre, apps comunes) |
| **Frecuencia de uso esperada** | 1-4 veces al mes — uso ocasional recurrente |

### 2.2 Usuario secundario

- Turista o visitante en Catamarca.

### 2.3 Anti-usuarios (NO diseñamos para ellos)

- Adolescentes menores de 18 años.
- Adultos mayores (+60) con bajo nivel tecnológico.

### 2.4 Cobertura geográfica

- **MVP**: Capital de Catamarca (San Fernando del Valle) + Valle Viejo + Fray Mamerto Esquiú + alrededores cercanos.
- **Expansión futura**: Arquitectura preparada para otras ciudades/provincias.
- Personas fuera de Catamarca NO son objetivo del MVP.

---

## 3. Funcionalidades del MVP

### 3.1 Lo que SÍ entra

- Ver locales gastronómicos cercanos.
- Descubrir lugares más lejanos (exploración no limitada a cercanía).
- Buscar lugares por nombre, tipo de comida o categoría.
- Filtros: categoría, tipo de comida, abiertos ahora, atributos del local.
- Indicador en tiempo real de abierto/cerrado con badge visual.
- Ver horarios de atención completos.
- Ver información de contacto (teléfono, WhatsApp, Instagram, Facebook).
- Filtros de atributos físicos y de servicio:
  - **Espacio**: terraza, mesas afuera, mesas adentro.
  - **Servicios**: WiFi, aire acondicionado, estacionamiento, acepta tarjetas, acepta reservas, accesible, acepta mascotas.
  - **Música y entretenimiento**: música en vivo, DJ, karaoke, juegos para niños.
- Vista lista (pantalla principal) + vista mapa (en tab separado).
- Compartir local (botón discreto en ficha).
- Panel de admin mínimo para CRUD de locales.
- App instalable como PWA.

### 3.2 Lo que NO entra en el MVP

- Login / cuentas de usuario.
- Favoritos.
- Reseñas / puntuaciones.
- Recomendaciones personalizadas / algoritmos inteligentes.
- Promociones / publicidad.
- Reservas / delivery.
- Panel para dueños de locales.
- Analytics para comercios.
- Eventos gastronómicos.
- Notificaciones push.
- Modo offline.

> **IMPORTANTE**: La arquitectura SÍ se diseña pensando en que estos features se sumen en el futuro sin reescribir.

### 3.3 Visión futura del producto (v2+)

Funcionalidades que la arquitectura debe soportar a futuro:

- Sistema de usuarios, inicio de sesión y perfiles.
- Favoritos.
- Opiniones y reseñas.
- Sistema de puntuación.
- Recomendaciones inteligentes según gustos y comportamiento.
- Promociones.
- Publicidad para locales.
- Reservas.
- Delivery.
- Analytics para comercios.
- Ranking de lugares.
- Eventos gastronómicos.

---

## 4. Fases del Producto

### 4.1 Fase MVP (Privado) — FASE ACTUAL

- App en producción, en hosting público (Vercel).
- **Sin sistema de login** para usuarios finales.
- **URL no compartida ampliamente** — solo accesible a personas elegidas (familia, amigos).
- Datos cargados rápidamente desde fuentes públicas (Instagram de locales, Google como referencia de ubicación).
- Fotos temporales desde Instagram (riesgo controlado dado que la app no está distribuida públicamente).
- Objetivo: validar UX, probar arquitectura, conseguir feedback temprano.

### 4.2 Fase de Lanzamiento Público (Post-MVP)

> **⚠️ POLÍTICA OFICIAL**: Antes de hacer la app pública, se DEBEN completar estos pasos:

1. Reemplazo de datos temporales por datos verificados directamente con los locales.
2. Fotos propias o con permiso explícito del local.
3. Verificación de horarios con los locales (WhatsApp/llamada/visita).
4. Política de privacidad y términos de uso publicados.
5. Cero scraping automático, cero fotos sin permiso.

---

## 5. Casos de Uso

### 5.1 Escenarios CORE (la app debe resolverlos perfectamente)

| # | Escenario | Patrón | Tiempo esperado |
|---|---|---|---|
| 1 | "Es sábado a la noche, ¿dónde vamos a tomar algo?" | Abierto + categoría | ~30-45 seg |
| 2 | "Es feriado/domingo, ¿qué está abierto?" | Abierto ahora | ~20-30 seg |
| 3 | "Quiero un café ahora, ¿dónde es el más cercano?" | Abierto + cerca + ya | ~15 seg |

**Patrón unificador de los 3 escenarios: "Abierto + cerca + ya".**

### 5.2 Escenario soportado (no core)

- "Vienen mis viejos, ¿dónde los llevo a comer?" — Atendido por filtros generales, no por un flujo dedicado.

### 5.3 Flujos detallados

#### Flujo 1: "Quiero un café ahora"

```
Abre la app
  → [HOME] Ve lista de locales abiertos, ordenados por cercanía
  → Scrollea, ve "Café del Centro · 🟢 Abierto · 200m"
  → Toca la tarjeta
  → [FICHA] Ve: foto, horarios hoy, dirección, teléfono, WhatsApp
  → FIN — resuelto en ~15 segundos
```

#### Flujo 2: "Sábado a la noche, ¿dónde tomamos algo?"

```
Abre la app
  → [HOME] Ve locales abiertos cercanos (mezclados)
  → Quiere solo bares → toca chip "Bar"
  → Ve lista filtrada de bares abiertos
  → Toca uno que le interesa
  → [FICHA] Ve info completa, fotos, atributos (terraza ✅)
  → Decide ir o comparte por WhatsApp
  → FIN — resuelto en ~30-45 segundos
```

#### Flujo 3: "Es feriado, ¿qué está abierto?"

```
Abre la app
  → [HOME] Filtro "Abierto ahora" ya activo por default
  → Ve directamente qué locales están abiertos hoy
  → Si quiere explorar más lejos → toca tab "Mapa"
  → [MAPA] Ve pines de locales abiertos en Catamarca
  → Toca un pin → ve mini-preview → toca para abrir ficha
  → [FICHA] Confirma que está abierto, ve horario de hoy
  → FIN — resuelto en ~20-30 segundos
```

---

## 6. Stack Tecnológico

### 6.1 Stack completo

| Capa | Tecnología | Justificación |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR + SEO + PWA + API Routes |
| **Lenguaje** | TypeScript | Seguridad de tipos, escalabilidad |
| **Estilos** | Tailwind CSS | Mobile-first, iteración rápida |
| **Componentes** | shadcn/ui | Accesibles, personalizables, sin dependencia externa |
| **Mapas** | Leaflet + OpenStreetMap | $0, sin límites, personalizable |
| **Iconos** | Lucide React | Consistente con shadcn/ui |
| **Backend/BaaS** | Supabase | PostgreSQL + Storage + Auth futura |
| **Geocoding** | Nominatim (OpenStreetMap) | $0, suficiente para MVP |
| **PWA** | next-pwa | Instalable en home screen |
| **Hosting** | Vercel (free tier) | Deploy automático, $0 |

### 6.2 Costos

| Servicio | Free tier | Límite antes de pagar |
|---|---|---|
| Vercel | Gratis | 100GB bandwidth/mes |
| Supabase | Gratis | 500MB DB, 1GB storage, 2GB bandwidth |
| OpenStreetMap | Gratis | Sin límites (uso justo) |
| Nominatim | Gratis | 1 request/segundo |
| **Total** | **$0/mes** | ✅ |

### 6.3 Entornos

| Entorno | Hosting | Uso |
|---|---|---|
| **Development** | localhost | Desarrollo diario |
| **Production** | Vercel | App en vivo |

### 6.4 Repositorio

- **GitHub** — integrado con Vercel para auto-deploy en cada push a `main`.

---

## 7. Arquitectura de Datos

### 7.1 Estrategia de comunicación

```
Frontend (Next.js) → Supabase SDK (JS) → PostgreSQL (Supabase)
```

- **Sin backend propio**. Todo directo desde el frontend a Supabase.
- **Sin API Routes de Next.js** en el MVP.
- **Distancia**: calculada en frontend (Haversine JS).
- **"Abierto ahora"**: calculado en frontend (JS compara horarios con hora local).
- **Timezone**: UTC-3 hardcodeado (Argentina, sin cambio de horario).

### 7.2 Justificación de "todo en frontend"

Con 30-50 locales, traer todos los datos en una sola query (~2KB) y procesar en el dispositivo es instantáneo. No hay necesidad de lógica server-side, paginación remota ni filtros en SQL complejos. Cuando los locales superen ~500, se migra a queries más selectivas con PostGIS.

### 7.3 Modelo de datos (PostgreSQL via Supabase)

#### Tabla: `lugares`

```sql
CREATE TABLE lugares (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  descripcion     TEXT,
  categoria_id    UUID REFERENCES categorias(id),
  direccion       TEXT NOT NULL,
  barrio          TEXT,
  lat             DECIMAL(10,8) NOT NULL,
  lng             DECIMAL(11,8) NOT NULL,
  telefono        TEXT,
  whatsapp        TEXT,
  instagram       TEXT,
  facebook        TEXT,
  imagen_principal TEXT,
  imagenes        TEXT[],
  atributos       JSONB DEFAULT '{}',
  activo          BOOLEAN DEFAULT true,
  verificado      BOOLEAN DEFAULT false,
  data_temporal   BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

**Campo `atributos` (JSONB)**:

```json
{
  "terraza": false,
  "mesas_afuera": true,
  "mesas_adentro": true,
  "wifi": true,
  "aire_acondicionado": false,
  "estacionamiento": false,
  "tarjetas": true,
  "reservas": false,
  "accesible": true,
  "acepta_mascotas": false,
  "musica_en_vivo": false,
  "dj": false,
  "karaoke": false,
  "juegos_ninos": false
}
```

**Campo `data_temporal`**: Marca datos del MVP que deben reemplazarse antes del lanzamiento público. Query: `SELECT * FROM lugares WHERE data_temporal = true` para auditar.

**Campo `slug`**: Para URLs amigables y SEO (`/local/cafe-del-centro`).

#### Tabla: `categorias`

```sql
CREATE TABLE categorias (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre  TEXT NOT NULL,
  slug    TEXT UNIQUE NOT NULL,
  emoji   TEXT,
  orden   INT DEFAULT 0,
  activo  BOOLEAN DEFAULT true
);
```

Las categorías se cargan directo en Supabase Dashboard (no se administran desde el admin de la app).

#### Tabla: `horarios`

```sql
CREATE TABLE horarios (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lugar_id          UUID REFERENCES lugares(id) ON DELETE CASCADE,
  dia_semana        INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_apertura     TIME NOT NULL,
  hora_cierre       TIME NOT NULL,
  cerrado           BOOLEAN DEFAULT false,
  cruza_medianoche  BOOLEAN DEFAULT false
);
```

- `dia_semana`: 0 = Domingo, 1 = Lunes ... 6 = Sábado.
- `cruza_medianoche`: true si el cierre es al día siguiente (ej: 20:00 - 02:00).
- Un local puede tener múltiples registros por día (horario cortado: 12-15 y 20-23).

#### Tabla: `tipos_comida`

```sql
CREATE TABLE tipos_comida (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre  TEXT NOT NULL,
  slug    TEXT UNIQUE NOT NULL,
  activo  BOOLEAN DEFAULT true
);
```

Los tipos de comida se cargan directo en Supabase Dashboard.

#### Tabla: `lugar_tipos_comida` (many-to-many)

```sql
CREATE TABLE lugar_tipos_comida (
  lugar_id        UUID REFERENCES lugares(id) ON DELETE CASCADE,
  tipo_comida_id  UUID REFERENCES tipos_comida(id) ON DELETE CASCADE,
  PRIMARY KEY (lugar_id, tipo_comida_id)
);
```

#### Tabla: `sugerencias` (v1.5)

```sql
CREATE TABLE sugerencias (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo        TEXT NOT NULL,
  lugar_id    UUID REFERENCES lugares(id),
  contenido   TEXT NOT NULL,
  email       TEXT,
  revisado    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

- `tipo`: `"nuevo_local"` | `"error_horario"` | `"local_cerrado"` | `"otro"`.
- Se revisan desde Supabase Dashboard.

### 7.4 Tablas preparadas para v2 (NO crear ahora)

```
usuarios           → Supabase Auth (sin cambios en esquema actual)
favoritos          → (usuario_id, lugar_id)
resenas            → (usuario_id, lugar_id, puntuacion, texto)
promociones        → (lugar_id, descripcion, fecha_inicio, fecha_fin)
reservas           → (usuario_id, lugar_id, fecha, personas)
eventos            → (lugar_id, nombre, fecha, descripcion)
```

El modelo actual las soporta sin cambios.

### 7.5 Queries principales

#### Q1: Home — Todos los locales activos + horarios

```
Supabase: lugares (activo=true) + horarios + categorias
→ Frontend: calcula distancia (Haversine) + abierto/cerrado
→ Ordena por distancia
→ Filtra por "abierto ahora" (default activado)
```

#### Q2: Búsqueda por texto

```
Supabase: lugares.nombre ILIKE '%texto%'
         + categorias.nombre ILIKE '%texto%'
         + tipos_comida.nombre ILIKE '%texto%' (via join)
Filtro: activo = true
```

#### Q3: Filtros combinados

```
Filtros aplicables en frontend (todo en memoria):
  - categoria_id = X
  - tipo_comida_id = X
  - abierto ahora (lógica JS)
  - atributos->terraza = true (JSONB)
  - distancia <= X km (Haversine)
```

#### Q4: Ficha completa del local

```
Supabase: lugar por slug + horarios (7 días) + tipos_comida (via join)
```

#### Q5: Mapa — Todos los locales con coordenadas

```
Supabase: lugares (activo=true) → id, nombre, slug, lat, lng, categoria_id
→ Frontend: calcula abierto/cerrado para color de pin
```

---

## 8. Módulo Crítico: Lógica de Horarios (`horarios.ts`)

Este es el corazón técnico de MorfiCat. La función `estaAbierto(lugar, horarios)` debe manejar correctamente:

| Caso | Ejemplo | Comportamiento |
|---|---|---|
| Horario normal | 08:00 - 22:00 | Abierto si hora actual está en el rango |
| Horario cortado | 12:00-15:00 y 20:00-23:00 | Múltiples registros por día, abierto si cae en cualquiera |
| Cruza medianoche | 20:00 - 02:00 | `cruza_medianoche = true`, evaluar en dos días |
| Día cerrado | Lunes no abre | `cerrado = true` para dia_semana = 1 |
| Sin horario cargado | No hay registro para un día | Se considera cerrado |

**Timezone**: Argentina es UTC-3 siempre (sin cambio de horario). Se hardcodea en la lógica.

---

## 9. UI/UX

### 9.1 Pantallas del MVP

| # | Pantalla | Ruta | Descripción |
|---|---|---|---|
| 1 | Home (Lista) | `/` | Locales abiertos + cercanos, barra búsqueda, chips |
| 2 | Búsqueda + Filtros | `/buscar` | Pantalla integrada de búsqueda y filtros |
| 3 | Mapa | `/mapa` | Vista de mapa con pines (Leaflet) |
| 4 | Ficha del Local | `/local/[slug]` | Pantalla completa con todo el detalle |
| 5 | Admin - Lista | `/admin` | Tabla de todos los lugares cargados |
| 6 | Admin - Crear/Editar | `/admin/lugar/[id]` | Formulario + horarios |

### 9.2 Modelo de pantalla principal: A Híbrido

```
┌─────────────────────────────────┐
│ MorfiCat                   [🗺️] │  ← Ícono mapa en header
├─────────────────────────────────┤
│ 🔍 Buscar lugar...              │  ← Barra de búsqueda
├─────────────────────────────────┤
│ [🟢 Abierto] [Café] [Bar] [+]  │  ← Chips scrolleables
├─────────────────────────────────┤
│                                 │
│  [Lista de tarjetas de locales] │  ← Ordenadas por distancia
│                                 │
├─────────────────────────────────┤
│  🏠     🔍     🗺️     ≡        │  ← Bottom navigation
│ Home  Buscar  Mapa   Más       │
└─────────────────────────────────┘
```

### 9.3 Navegación

| Elemento | Contenido |
|---|---|
| **Bottom nav** | Home · Buscar · Mapa · Más |
| **Menú "Más"** | Admin (protegido), Sobre MorfiCat, Sugerir un local |
| **Ficha del local** | Pantalla completa nueva (navegación clásica, no bottom sheet) |

### 9.4 Tarjeta de local (LocalCard)

```
┌──────────────────────────────────────────────┐
│ [foto 1:1]  Café del Centro                  │
│             Cafetería · Centro               │
│             🟢 Abierto · cierra a las 22:00  │
│             📍 200m                          │
└──────────────────────────────────────────────┘
```

- Foto: aspect ratio 1:1 en lista.
- Badge: verde "Abierto" / rojo "Cerrado".
- Detalle horario (al lado del badge):
  - Si abierto: "cierra a las HH:MM"
  - Si cerrado pero abre hoy más tarde: "abre a las HH:MM"
  - Si cerrado, abre mañana: "abre mañana HH:MM"
  - Si cerrado, abre en otro día: "abre vie. HH:MM" (con día abreviado)
  - Si no hay horarios cargados: sin detalle.
- Distancia: numérica si hay GPS, zona/barrio si no.

### 9.5 Ficha del local

Pantalla completa con:

- Foto principal (aspect ratio 16:9).
- Nombre + categoría.
- Badge abierto/cerrado.
- Horarios de todos los días (destacando "hoy").
- Dirección + barrio.
- Contacto: teléfono, WhatsApp, Instagram, Facebook.
- Atributos como chips (terraza, wifi, etc.).
- Mini-mapa con pin de ubicación (Leaflet, sin botón externo de navegación).
- Botón compartir (discreto).

### 9.6 Primer minuto de la app

| Momento | Comportamiento |
|---|---|
| **Apertura** | Pide permiso GPS → directo a lista (sin onboarding) |
| **Default** | Lista filtrada por "abiertos ahora" + ordenada por cercanía |
| **Sin GPS** | Mapa centrado en Catamarca capital, zona/barrio en vez de distancia numérica |

---

## 10. Diseño Visual

### 10.1 Identidad visual

| Aspecto | Valor |
|---|---|
| **Estilo** | Cálido, gastronómico, dark mode |
| **Inspiración** | Restaurante con iluminación cálida de noche |
| **Modo** | Dark mode + Light mode con toggle (claro / oscuro) en `/mas`. Default en 1ª visita = preferencia del sistema (`prefers-color-scheme`) |

### 10.2 Paleta de colores

**Marca (constante en ambos modos):**

| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Principal | Terracota | `#E07B4C` | Botones, badges activos, acentos, logo |
| Principal oscuro | Terracota profundo | `#B85A30` | Hover, bordes activos |
| Principal claro | Terracota suave | `#F4A882` | Texto sobre fondos oscuros |
| Éxito (abierto) | Verde cálido | `#4CAF82` | Badge "Abierto ahora" |
| Error (cerrado) | Rojo suave | `#E05252` | Badge "Cerrado" |

**Tokens semánticos (varían con el tema):**

| Token Tailwind | CSS var | Light | Dark |
|---|---|---|---|
| `bg-background` | `--background` | `#FAFAF8` (warm off-white) | `#1A1A1A` (warm dark) |
| `text-foreground` | `--foreground` | `#1A1A1A` | `#FFFFFF` |
| `bg-card` | `--card` | `#FFFFFF` | `#242424` |
| `bg-muted` | `--muted` | `#F0EFEB` | `#2E2E2E` |
| `border-foreground/10` | — | `rgba(26,26,26,0.1)` | `rgba(255,255,255,0.1)` |
| `text-foreground/60` | — | `rgba(26,26,26,0.6)` | `rgba(255,255,255,0.6)` |
| `text-foreground/35` | — | `rgba(26,26,26,0.35)` | `rgba(255,255,255,0.35)` |

Botones con `bg-terracota` siempre usan `text-white` (no `text-foreground`) para preservar contraste e identidad de marca en ambos modos.

### 10.3 Reglas de diseño

1. **Dark + Light mode** — implementados con tokens semánticos vía CSS variables (`--background`, `--foreground`, `--card`, `--muted`). El usuario alterna desde `/mas` (claro / oscuro). En la primera visita el default es la preferencia del sistema (`prefers-color-scheme`); después se respeta la elección guardada en `localStorage` (`morficat-theme`). Inline script en `<head>` previene FOUC.
2. **Color principal terracota** (`#E07B4C`) en todos los elementos interactivos, igual en ambos modos (es identidad de marca).
3. **Fondos cálidos en ambos modos** — dark `#1A1A1A` (warm dark), light `#FAFAF8` (warm off-white). Nunca negro puro `#000` ni blanco puro `#FFF`.
4. **Tipografía**: system fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`).
5. **Border radius**: `12px` cards, `8px` botones/inputs, `20px` badges/pills.
6. **Iconos**: Lucide React, 20px estándar, 16px inline.
7. **Espaciado**: base de 8px (8, 16, 24, 32).
8. **Badges de estado**: fondo al 15% de opacidad del color.
9. **Fotos**: 1:1 en lista, 16:9 en ficha.
10. **Sin sombras** — solo bordes sutiles para separación.
11. **Sin features vacíos** — no mostrar botones de delivery, promos, etc. que no existen todavía.

---

## 11. Reglas de Negocio

### 11.1 Home y lista

| Regla | Valor |
|---|---|
| Orden default | Por distancia (más cercano primero) |
| Filtro "Abierto ahora" | Activado por default |
| Locales cerrados | Ocultos por default, visibles al desactivar filtro (badge rojo) |
| Paginación | Sin límite — se muestran todos (30-50 locales) |
| Madrugada sin abiertos | Mensaje "No hay locales abiertos ahora" + botón "Ver todos" |

### 11.2 Búsqueda

| Regla | Valor |
|---|---|
| Campos de búsqueda | Nombre del local + categoría + tipo de comida |
| Tipo | ILIKE (insensible a mayúsculas, coincidencia parcial) |

### 11.3 Filtros

| Regla | Valor |
|---|---|
| Presentación | Chips horizontales scrolleables |
| Chip default activo | "Abierto ahora" (color terracota) |
| Chips principales | Abierto + categorías |
| Filtros avanzados | Atributos (terraza, wifi, etc.) en panel desplegable con [+] |

### 11.4 Geolocalización

| Regla | Valor |
|---|---|
| Cercanía | Prioriza pero NO limita la exploración |
| Sin GPS | Zona/barrio en lugar de distancia numérica |
| Sin GPS | Mapa centrado en Catamarca capital, todos los locales visibles |

### 11.5 Generales

| Regla | Valor |
|---|---|
| Timezone | UTC-3 hardcodeado (Argentina) |
| Compartir | Botón discreto en ficha del local |
| Datos temporales | Se reemplazan antes del lanzamiento público |
| Scraping | Cero scraping automático en producción pública |

---

## 12. Seguridad

### 12.1 Protección del admin

| Aspecto | Implementación |
|---|---|
| Ruta `/admin` | Protegida por contraseña |
| Contraseña | Variable de entorno `ADMIN_PASSWORD` |
| Validación | Server-side (middleware o API route) |

### 12.2 Supabase RLS (Row Level Security)

| Tabla | Política |
|---|---|
| `lugares` | Lectura pública (`SELECT` para `anon`), escritura solo con `service_role` |
| `categorias` | Lectura pública, escritura solo con `service_role` |
| `horarios` | Lectura pública, escritura solo con `service_role` |
| `tipos_comida` | Lectura pública, escritura solo con `service_role` |
| `lugar_tipos_comida` | Lectura pública, escritura solo con `service_role` |
| `sugerencias` | Inserción pública (`INSERT` para `anon`), lectura solo con `service_role` |

### 12.3 Variables de entorno

```env
# Públicas (expuestas al frontend — seguras gracias a RLS)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Privadas (solo server-side — NUNCA exponer al cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=...
```

### 12.4 HTTPS

- Automático via Vercel (certificado SSL incluido).

---

## 13. Estructura de Carpetas

```
morficat/
├── app/
│   ├── page.tsx                    # Home (lista)
│   ├── layout.tsx                  # Layout global + PWA meta + bottom nav
│   ├── buscar/
│   │   └── page.tsx                # Búsqueda + filtros
│   ├── mapa/
│   │   └── page.tsx                # Vista mapa
│   ├── local/
│   │   └── [slug]/
│   │       └── page.tsx            # Ficha del local
│   └── admin/
│       ├── page.tsx                # Admin - lista de lugares
│       └── lugar/
│           └── [id]/
│               └── page.tsx        # Admin - crear/editar lugar
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── LocalCard.tsx               # Tarjeta de local en lista
│   ├── LocalMap.tsx                # Mapa con Leaflet
│   ├── FiltrosChips.tsx            # Chips de filtros
│   ├── FiltrosAvanzados.tsx        # Panel desplegable de atributos
│   ├── BottomNav.tsx               # Navegación inferior
│   ├── BadgeEstado.tsx             # Badge verde/rojo abierto/cerrado
│   ├── SearchBar.tsx               # Barra de búsqueda
│   ├── MiniMapa.tsx                # Mini-mapa en ficha del local
│   └── HorariosTable.tsx           # Tabla de horarios en ficha
├── lib/
│   ├── supabase.ts                 # Cliente Supabase
│   ├── horarios.ts                 # Lógica "está abierto ahora"
│   ├── distancia.ts                # Cálculo de distancia (Haversine)
│   ├── types.ts                    # TypeScript types e interfaces
│   └── constants.ts                # Constantes (timezone, coordenadas default)
├── public/
│   ├── manifest.json               # PWA manifest
│   └── icons/                      # Iconos PWA (192x192, 512x512)
├── supabase/
│   └── schema.sql                  # Schema completo de la base de datos
├── .env.local                      # Variables de entorno (dev)
├── .env.production                 # Variables de entorno (prod) — NO commitear
├── tailwind.config.ts              # Configuración con paleta terracota
├── next.config.js                  # Config Next.js + PWA
├── tsconfig.json
├── package.json
└── claude.md                       # ESTE ARCHIVO — fuente de verdad
```

---

## 14. Panel de Admin (Mínimo)

### 14.1 Alcance

| Feature | Incluido | Horas |
|---|---|---|
| Ruta `/admin` protegida con contraseña | ✅ | 2h |
| Lista de lugares (nombre, categoría, activo/inactivo) | ✅ | 3h |
| Formulario crear lugar (campos esenciales + 1 imagen) | ✅ | 4h |
| Formulario editar lugar (reutiliza crear) | ✅ | 2h |
| Gestión de horarios (grilla 7 días con hora apertura/cierre) | ✅ | 4h |
| Toggle activo/inactivo (soft delete) | ✅ | 1h |
| **Total** | | **~16h** |

### 14.2 Lo que NO entra en el admin del MVP

- CRUD de categorías → Supabase Dashboard.
- CRUD de tipos de comida → Supabase Dashboard.
- Upload de múltiples imágenes → solo 1 imagen principal.
- Gestión de sugerencias → Supabase Dashboard.
- Búsqueda/filtros dentro del admin.
- Dashboard con métricas.

---

## 15. Roadmap de Desarrollo

### Estimación total: ~70-75 horas (2-3 semanas a 4-5h/día)

### Fase 0 — Setup (~2-3 horas)

- [ ] Crear repositorio en GitHub.
- [ ] Crear proyecto Next.js 14 + TypeScript + Tailwind.
- [ ] Instalar y configurar shadcn/ui.
- [ ] Instalar Lucide React.
- [ ] Crear proyecto en Supabase.
- [ ] Ejecutar schema.sql (crear todas las tablas + RLS).
- [ ] Configurar variables de entorno (.env.local).
- [ ] Configurar tailwind.config.ts con paleta terracota y dark mode.
- [ ] Deploy inicial a Vercel (app vacía funcionando).
- [ ] Verificar conexión Supabase desde el frontend.

### Fase 1 — Datos y Admin (~16 horas)

- [ ] Cargar categorías iniciales en Supabase Dashboard.
- [ ] Cargar tipos de comida iniciales en Supabase Dashboard.
- [ ] Crear middleware de protección para `/admin` (contraseña).
- [ ] Crear página `/admin` — lista de lugares.
- [ ] Crear página `/admin/lugar/[id]` — formulario crear/editar.
- [ ] Implementar upload de imagen a Supabase Storage.
- [ ] Crear gestión de horarios (grilla 7 días).
- [ ] Implementar toggle activo/inactivo.
- [ ] Cargar 5-10 locales de prueba.

### Fase 2 — Home y Lista (~12 horas)

- [ ] Implementar geolocalización (Browser Geolocation API).
- [ ] Crear `lib/distancia.ts` (fórmula Haversine).
- [ ] Crear `lib/horarios.ts` (lógica "está abierto ahora").
- [ ] Crear componente `BadgeEstado` (abierto/cerrado).
- [ ] Crear componente `LocalCard` (tarjeta de local).
- [ ] Crear página Home (`/`) — lista de locales.
- [ ] Implementar query inicial a Supabase (todos los locales activos + horarios).
- [ ] Ordenar por distancia.
- [ ] Filtro "Abierto ahora" activado por default.
- [ ] Estado vacío: "No hay locales abiertos ahora" + botón "Ver todos".
- [ ] Fallback sin GPS: mostrar zona/barrio.

### Fase 3 — Búsqueda y Filtros (~8 horas)

- [ ] Crear componente `SearchBar`.
- [ ] Crear componente `FiltrosChips` (chips scrolleables).
- [ ] Crear componente `FiltrosAvanzados` (panel desplegable de atributos).
- [ ] Crear página `/buscar` — búsqueda + filtros integrados.
- [ ] Implementar búsqueda ILIKE (nombre + categoría + tipo comida).
- [ ] Implementar filtros combinados en frontend.
- [ ] Resultados actualizados en tiempo real.

### Fase 4 — Mapa (~8 horas)

- [ ] Instalar y configurar Leaflet + react-leaflet.
- [ ] Crear componente `LocalMap` (mapa completo).
- [ ] Crear página `/mapa`.
- [ ] Mostrar pines de locales activos.
- [ ] Diferenciar pines abierto (verde) vs cerrado (rojo).
- [ ] Tap en pin → mini-preview del local.
- [ ] Tap en preview → navega a `/local/[slug]`.
- [ ] Sin GPS → centrar en Catamarca capital.

### Fase 5 — Ficha del Local (~8 horas)

- [ ] Crear página `/local/[slug]` (SSR para SEO).
- [ ] Mostrar foto principal (16:9).
- [ ] Badge abierto/cerrado.
- [ ] Crear componente `HorariosTable` (7 días, destacar "hoy").
- [ ] Mostrar dirección + barrio.
- [ ] Mostrar contacto: teléfono, WhatsApp, Instagram, Facebook (con links).
- [ ] Mostrar atributos como chips.
- [ ] Crear componente `MiniMapa` (Leaflet con pin, sin navegación externa).
- [ ] Botón compartir (Web Share API / copiar URL).

### Fase 6 — Navegación y Polish (~6 horas)

- [ ] Crear componente `BottomNav` (Home, Buscar, Mapa, Más).
- [ ] Crear menú "Más" (Admin, Sobre MorfiCat, Sugerir local).
- [ ] Crear página "Sobre MorfiCat" (estática).
- [ ] Configurar PWA: manifest.json + service worker + iconos.
- [ ] Aplicar dark mode completo con paleta terracota.
- [ ] Responsive testing y ajustes.
- [ ] Meta tags para SEO (Open Graph, Twitter Cards).

### Fase 7 — Datos Reales y QA (~10 horas)

- [ ] Cargar los 30-50 locales reales vía admin.
- [ ] Verificar horarios de cada local cargado.
- [ ] Testing en dispositivos móviles reales (Android + iOS Safari).
- [ ] Testing de todos los flujos core (3 escenarios).
- [ ] Corrección de bugs.
- [ ] Performance check (Lighthouse).
- [ ] Deploy final a producción.

---

## 16. Criterios de Aceptación

### 16.1 El MVP está "terminado" cuando:

1. ✅ La app carga en menos de 3 segundos en 4G.
2. ✅ El usuario puede ver locales abiertos ordenados por cercanía al abrir la app.
3. ✅ El filtro "Abierto ahora" funciona correctamente a cualquier hora del día.
4. ✅ Los 3 escenarios core se resuelven en los tiempos esperados (15-45 seg).
5. ✅ La búsqueda encuentra locales por nombre, categoría y tipo de comida.
6. ✅ Los filtros (categoría, atributos) funcionan correctamente.
7. ✅ El mapa muestra todos los locales con pines diferenciados.
8. ✅ La ficha del local muestra toda la información completa.
9. ✅ El admin permite crear, editar y desactivar locales.
10. ✅ La app es instalable como PWA en Android y iOS.
11. ✅ Hay al menos 30 locales cargados con información completa.
12. ✅ La app funciona correctamente sin GPS (fallback a Catamarca capital).
13. ✅ El horario cortado y el que cruza medianoche funcionan bien.
14. ✅ La app se ve correctamente en pantallas de 360px a 430px de ancho.
15. ✅ El admin está protegido por contraseña.
16. ✅ RLS de Supabase está activo (solo lectura pública).

### 16.2 Edge cases que DEBEN funcionar

| Edge case | Comportamiento esperado |
|---|---|
| 4am, todo cerrado | Mensaje "No hay locales abiertos" + botón "Ver todos" |
| Sin GPS | Todos los locales visibles, zona/barrio en vez de metros |
| Local con horario cortado (12-15 y 20-23) | Se evalúan ambos rangos |
| Local que cierra a las 2am | `cruza_medianoche = true`, abierto desde hora_apertura del día anterior |
| Día sin horario cargado | Se considera cerrado |
| Búsqueda sin resultados | Mensaje "No encontramos lugares con ese nombre" |
| Imagen no cargada | Placeholder genérico por categoría |

---

## 17. Equipo

| Rol | Persona |
|---|---|
| **Líder + Desarrollo** | Fundador |
| **Apoyo carga de datos** | 1-2 personas de confianza (familia/amigos) |
| **Ritmo de trabajo** | 4-5 horas/día |
| **Tiempo estimado al MVP** | 2-3 semanas |

---

## 18. Reglas del Proyecto

1. **No implementar nada que no esté en este documento** sin actualizar el spec primero.
2. **No agregar features de v2** al MVP bajo ninguna circunstancia.
3. **No mostrar features vacíos** en la UI (delivery, promos, favoritos, etc.).
4. **Mobile-first siempre** — diseñar para 375px primero, escalar después.
5. **Los datos del MVP son temporales** — marcar con `data_temporal = true`.
6. **Antes del lanzamiento público**: reemplazar datos, verificar horarios, obtener permisos de fotos.
7. **Priorizar velocidad de la app** — cada interacción debe sentirse instantánea.
8. **Simple sobre complejo** — si hay duda entre dos implementaciones, elegir la más simple.

---

> **Última actualización**: Generado vía entrevista SDD.
> **Estado**: Listo para desarrollo.
> **Próximo paso**: Ejecutar Fase 0 — Setup del proyecto.
