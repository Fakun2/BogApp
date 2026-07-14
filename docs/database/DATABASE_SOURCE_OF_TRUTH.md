# Database source of truth

Este documento define como interpretar las fuentes de base de datos hasta que
los modelos MVP esten completos.

## Fuentes revisadas

- `packages/database/prisma/schema.prisma`: schema implementado y migrable hoy.
- `packages/database/prisma/migrations/20260611125720_onboarding_foundation/migration.sql`:
  migracion inicial existente.
- `docs/diagrams/bogaap-er.puml`: modelo objetivo amplio del dominio.
- `docs/diagrams/bogaap-er-notes.md`: reglas de diseno del ERD.
- `TODO.md`: inventario historico.
- Backend actual en `apps/api/src`.
- Frontend actual en `apps/web/app/onboarding`.

## Autoridad actual

1. Para codigo ejecutable y migraciones actuales, la autoridad es Prisma.
2. Para direccion de dominio, la autoridad es el ERD PlantUML y este documento.
3. Para planificacion, la autoridad es `docs/product/ROADMAP.md` y
   `docs/github/ISSUES_BACKLOG.md`.
4. Si hay conflicto, documentarlo en `docs/database/gaps.md` antes de tocar
   Prisma.

## Entidades implementadas en Prisma

- `Tenant` -> `tenants`
- `User` -> `users`
- `TenantProfile` -> `tenant_profiles`
- `TenantSettings` -> `tenant_settings`
- `PracticeAreaTemplate` -> `practice_area_templates`
- `PracticeArea` -> `practice_areas`
- `TenantMembershipPracticeArea` -> `tenant_membership_practice_areas`
- `Currency` -> `currencies`
- `Role` -> `roles`
- `Permission` -> `permissions`
- `RolePermission` -> `role_permissions`
- `TenantMembership` -> `tenant_memberships`

## Entidades objetivo del ERD aun no implementadas

MVP:

- `clients`
- `opposing_parties`
- `cases`
- `case_participants`
- `document_categories`
- `documents`
- `tasks`
- `task_responsibles`
- `notifications`

Post-MVP o despues del core legal:

- `expense_categories`
- `expenses`
- `current_accounts`
- `account_movement_categories`
- `account_movements`
- `cash_boxes`
- `cash_movement_categories`
- `cash_movements`
- `audit_logs`

## Reglas obligatorias

- Toda entidad operativa debe llevar `tenant_id` o relacion obligatoria con una
  entidad tenant-scoped.
- `users` es global y no lleva `tenant_id`.
- `currencies` es global y no lleva `tenant_id`.
- `permissions` es catalogo global. `roles` mezcla roles de sistema globales
  (`tenant_id = null`) y roles custom por estudio (`tenant_id` definido).
  `roles.active` define si un rol esta disponible para nuevas asignaciones.
- `tenant_memberships.role_id` puede quedar null cuando un rol custom se
  desactiva o elimina; eso representa personal sin rol asignado.
- `PracticeAreaTemplate` es catalogo global; `PracticeArea` representa las areas
  disponibles para un tenant, sean derivadas del catalogo o custom.
- La asignacion de areas de trabajo a miembros del tenant vive en
  `tenant_membership_practice_areas`.
- Evitar arrays de IDs como columnas; usar relaciones 1:N o tablas puente.
- Las FK entre entidades operativas deben impedir cruces de tenant mediante FK
  compuestas o validacion transaccional en aplicacion.
- Toda modificacion de Prisma requiere migracion.

## MVP vs post-MVP

MVP obligatorio:

- Tenancy y RBAC.
- Onboarding de tenant.
- Clientes y partes contrarias.
- Causas y participantes.
- Documentos basicos.
- Tareas y notificaciones basicas.

Post-MVP:

- Finanzas avanzadas.
- Caja completa.
- Cuenta corriente avanzada.
- Integraciones externas.
- Facturacion SaaS.
- IA.

## Decisiones de naming pendientes

- Producto publico: BogApp.
- Paquetes internos actuales: `@bogaap/*`.
- ERD actual: `bogaap-er`.
- La alineacion de marca debe hacerse en una tarea dedicada.

## Plan de migraciones

1. PR 1: documentar fuente de verdad y gaps. Sin cambios Prisma.
2. PR 2/3: alinear contratos de onboarding, sin agregar dominios grandes.
3. PR M3 DB: agregar modelos MVP tenant-aware en una migracion clara.
4. PRs posteriores: agregar finanzas e integraciones por dominio.

## Estado de comandos

- `npm run db:generate`: paso despues de permitir descarga del query engine de
  Prisma.
- `npm run db:migrate`: falla localmente por falta de `DATABASE_URL`.
- `npm run typecheck`: pasa.
- `npm run lint`: pasa.
- `npm run test:e2e`: pasa para 5 tests de auth.
