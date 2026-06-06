# Conventions

## Estructura de carpetas

```
app/
  page.tsx                 # Server component
  [feature]/
    page.tsx
    _actions.ts            # Server actions de la feature
    _components/           # Componentes específicos de la ruta

components/                # UI reutilizable
  LocalCard.tsx
  BadgeEstado.tsx

lib/                       # Lógica de negocio + clientes
  horarios.ts
  distancia.ts
  supabase/
  types.ts
```

## Naming

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `LocalCard.tsx`, `BadgeEstado.tsx` |
| Hooks / utilidades | camelCase | `useTheme`, `calcularDistanciaKm` |
| Server actions | camelCase + sufijo `Action` | `enviarSugerenciaAction` |
| Tipos / interfaces | PascalCase | `LugarPublic`, `HorarioSemana` |
| Constantes | UPPER_SNAKE | `DIAS_SEMANA`, `ATRIBUTOS_LABELS` |
| Slugs de DB | kebab-case | `cafe-del-centro` |
| Variables de entorno | UPPER_SNAKE | `SUPABASE_SERVICE_ROLE_KEY` |
| Rutas | kebab-case | `/local/[slug]`, `/buscar` |

## Idioma

- **Código (variables, funciones)**: español + inglés mezclados. Términos del dominio en español (`lugar`, `horario`, `categoria`).
- **Comentarios**: español.
- **UI**: español rioplatense (vos, querés).
- **Specs y docs**: español.
- **Commits**: español.

## Commits

Conventional commits en español:
- `feat:` nueva feature
- `fix:` corrección de bug
- `docs:` documentación
- `style:` solo estilo (Tierra)
- `refactor:` refactor sin cambio funcional
- `chore:` configuración, tooling

Si cierra un Issue: `Closes #N` al final.

## CSS / Tailwind

- Tokens via CSS variables (`var(--terra)`, `var(--fg-50)`) — NO `bg-terracota-500`
- Inline `style={{...}}` con CSS variables es preferible a clases custom para colores temáticos
- `className` para layout, spacing, tipografía

## Server actions vs API routes

- Server actions para mutaciones que vienen de un form de la app
- API routes solo para webhooks externos o auth callback
