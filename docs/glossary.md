# Glossary

> Términos del dominio de Haku. Cuando aparezca uno de estos en código o specs, debe usarse exactamente con este significado.

| Término | Definición |
|---|---|
| **Lugar** | Entidad principal: un local gastronómico (cafetería, bar, restaurante, etc.) en Catamarca. |
| **Categoría** | Clasificación principal del lugar (Cafetería, Restaurante, Bar...). Un lugar tiene una sola categoría. |
| **Tipo de comida** | Estilo de cocina (italiana, parrilla, vegetariana...). Un lugar puede tener varios. |
| **Atributo** | Característica física o de servicio del local (terraza, wifi, mesas adentro...). Booleano en JSONB. |
| **Horario** | Registro de día + apertura + cierre. Un lugar puede tener varios horarios por día (horario cortado). |
| **Cruza medianoche** | Horario que termina al día siguiente (ej: 20:00 - 02:00). Marca booleana. |
| **Abierto / Cerrado** | Estado calculado en frontend comparando hora actual (AR) vs horarios del día. |
| **Distancia** | Kilómetros desde la posición GPS del usuario al local (Haversine). |
| **Sugerencia** | Reporte enviado por un usuario: nuevo local, error de horario, local cerrado, otro. |
| **Reseña** | Puntuación de 1-5 estrellas + texto opcional. Un usuario = una reseña por local. |
| **Data temporal** | Flag `data_temporal=true` en lugares con info cargada desde fuentes públicas (Instagram, Google) sin verificar con el local. |
| **MVP privado** | Estado actual: app en producción pero URL no distribuida. Solo accesible a personas seleccionadas. |
| **Lanzamiento público** | Estado futuro: URL pública. Requiere completar `specs/014-lanzamiento-publico/`. |
| **Tierra** | Sistema de diseño visual de Haku (warm dark cálido, serif italic, paleta terracota). |
| **Haku** | "Vamos" en quechua. Nombre del proyecto. |
| **Catamarca** | Provincia argentina. Capital: San Fernando del Valle. Cobertura inicial del MVP. |
| **Hiperlocal** | Foco exclusivo en una zona geográfica acotada (Catamarca). Diferenciador vs Google Maps. |
| **PWA** | Progressive Web App. Instalable en Android/iOS desde el navegador. |
