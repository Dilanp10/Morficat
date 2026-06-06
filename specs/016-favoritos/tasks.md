# Tasks: Favoritos

> Implementación por fases. **Fase A** (US1+US2, localStorage) ya está hecha y
> verificada. **Fase B** (US3, cuenta + migración) queda pendiente.

## Fase A — Favoritos con localStorage (US1 + US2) ✅

### Estado cliente
- [x] T005 `components/FavoritosProvider.tsx`: context con `Set<string>`, `esFavorito(id)`, `toggle(id)`, `ready`, `count`. Hidratación desde localStorage al montar. (Seam listo para sumar cuenta en Fase B.)
- [x] T006 `app/layout.tsx`: envolver children en `FavoritosProvider` (dentro de `ThemeProvider`).

### UI
- [x] T007 `components/BotonFavorito.tsx`: botón ♥ (lucide `Heart`), `aria-pressed`/`aria-label`, variantes `card` + `floating`, activo en `var(--terra)` (`fill: currentColor`), tap target 40px, `active:scale-90`.
- [x] T008 `components/LocalCard.tsx`: `lugarId` en `LocalCardData`; patrón overlay-link (Link `absolute inset-0 z-10`) + ♥ `z-20` que corta navegación con `preventDefault`/`stopPropagation`. Reemplaza el chevron.
- [x] T009 `components/FiltrosChips.tsx`: chip "♥ Favoritos" tras "Abierto ahora".
- [x] T010 `components/HomeListClient.tsx`: estado `soloFavoritos`, filtro por `esFavorito`, `lugarId` a la card, empty state propio ("Todavía no guardaste lugares").
- [x] T011 `app/local/[slug]/page.tsx`: `BotonFavorito` floating en la top bar junto a `ShareButton`.

### Verificación
- [x] T012 Invitado: guardar → recargar → persiste + ♥ rehidratado (375px, light + dark, vía computed styles).
- [x] T014 Chip "♥ Favoritos" filtra (1 resultado), combinable con "Abierto ahora", empty state OK. Card navega / ♥ no navega. Sync Home↔ficha.
- [x] T015 `pnpm lint` limpio, consola sin errores.

## Fase B — Persistencia por cuenta + migración (US3)

> Código ✅ (lint + `tsc --noEmit` limpios, path invitado sin regresión).
> Pendiente de **acción del usuario**: correr el SQL en Supabase y probar en vivo
> con una cuenta real (no testeable desde el preview sin DB + login).

- [x] T002 `lib/favoritos.ts` → `listarFavoritosIds(): Promise<string[]>` (favoritos del user logueado; `[]` si invitado o tabla inexistente).
- [x] T003 `app/_actions/favoritos.ts` → `setFavorito(lugarId, favorito)`: estado deseado explícito (race-safe), insert/delete, verifica user. *(Nota: se eligió `setFavorito` sobre `toggleFavorito` para evitar carreras con clics rápidos; sin `revalidatePath` porque el provider mantiene el estado en memoria durante la sesión.)*
- [x] T004 `app/_actions/favoritos.ts` → `migrarFavoritos(ids)`: upsert idempotente (`ignoreDuplicates`).
- [x] T005b `FavoritosProvider` híbrido: `initialFavoritos` + `isAuthenticated`; fuente de verdad = server si logueado (sin parpadeo); toggle optimista con rollback vía `setFavorito`; migración al montar (merge + `migrarFavoritos` + limpiar localStorage).
- [x] T006b `app/layout.tsx`: `Promise.all([getCurrentUser(), listarFavoritosIds()])`, props al provider.
- [ ] **T001 (acción usuario)** Correr `supabase/v1-6_favoritos.sql` en el SQL Editor de Supabase.
- [ ] **T013 (test en vivo)** Tras T001: invitado guarda → crea cuenta/login → favoritos quedan en la cuenta + localStorage limpio + sin duplicados + sync entre dispositivos.

## Cierre
- [ ] T016 Crear Issue GitHub label "spec", commit con `Closes #N`, actualizar tabla de specs en `CLAUDE.md` (017 sería la siguiente).
