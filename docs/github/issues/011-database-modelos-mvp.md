# Database - modelos MVP tenant-aware

Milestone: M3 - Clientes y expedientes

Labels: `type:feature`, `area:database`, `priority:p0`

## Objetivo

Asegurar que los modelos MVP existan y sean tenant-aware.

## Modelos minimos

- `tenants`
- `users`
- `roles`
- `tenant_memberships`
- `tenant_settings`
- `practice_areas`
- `clients`
- `opposing_parties`
- `cases`
- `case_participants`
- `document_categories`
- `documents`
- `tasks`
- `task_responsibles`
- `notifications`

## Criterios de aceptacion

- Prisma actualizado.
- Migracion generada.
- Relaciones correctas.
- Indices basicos.
- Seeds basicos.
- Documentacion actualizada.

## Dependencias

- EPIC 02.
- Backend - tenant context por request.
