# Agents — Reglas para Claude Code y otros agentes IA

> Este archivo se carga automáticamente como contexto en cada sesión de Claude Code. Define las reglas del juego.

## Workflow obligatorio (SDD con Spec Kit)

```
Idea → Issue de GitHub → spec.md → plan.md → tasks.md → código → cerrar Issue
```

**Nunca se escribe código sin la spec aprobada.** Si descubrís un cambio necesario durante la implementación:
1. Pausá el código
2. Actualizá `specs/NNN-feature/spec.md`
3. Continuá

## Estructura del proyecto

```
specs/NNN-feature-slug/    ← una carpeta por feature
  ├── spec.md              ← QUÉ hace
  ├── plan.md              ← CÓMO se implementa
  ├── tasks.md             ← tareas paso a paso
  └── checklists/
      └── requirements.md  ← criterios de aceptación

docs/                      ← documentación transversal
  ├── architecture.md
  ├── decisions.md         ← ADRs
  ├── glossary.md          ← términos del dominio
  ├── conventions.md       ← naming, commits, estilos
  ├── requirements.md      ← REQ-* IDs
  ├── roadmap.md
  └── backlog.md

.specify/
  ├── memory/constitution.md   ← reglas inquebrantables
  └── templates/                ← spec/plan/tasks/checklist templates

CLAUDE.md                  ← índice + reglas resumidas
AGENTS.md                  ← este archivo
BACKLOG.md                 ← shortcut a docs/backlog.md
```

## Comandos rápidos

```bash
# Levantar dev
pnpm dev

# Build (NUNCA con dev activo, se pisan los archivos)
pnpm build

# Lint
pnpm lint
```

## Reglas para escribir specs

1. **Una user story por escenario real** — usar formato `Given/When/Then`
2. **Prioridades P1 / P2 / P3** — P1 = MVP, P3 = nice-to-have
3. **Cada requisito tiene ID** — `REQ-XXX-NNN` registrado en `docs/requirements.md`
4. **Out of Scope explícito** — qué NO entra en esta feature
5. **Edge cases listados** — qué pasa cuando faltan datos, hay errores, etc.

## Reglas para escribir código

1. **Mobile first** — diseñar para 375px primero
2. **Tokens Tierra** — usar `var(--terra)`, `var(--fg-50)`, etc. NO hardcodear colores
3. **Server actions** para mutaciones desde forms — no API routes
4. **Cálculo de horarios siempre en UTC-3** (Argentina)
5. **RLS activo** — usar `anon` para lectura pública, `service_role` solo server-side
6. **Sin features vacíos** — no botones de delivery, promos, favoritos si no existen

## Constitución del proyecto

Ver [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

## Para el agente que toma esta sesión

Antes de codear:
1. Leé `CLAUDE.md` para el índice
2. Leé la `spec.md` de la feature en cuestión
3. Revisá `docs/conventions.md` para el estilo
4. Si la spec no existe, frená y avisá al usuario
