# Database gaps

Este archivo lista diferencias detectadas entre ERD, Prisma, backend, frontend
y decisiones de producto. No corregir todas en un mismo PR.

## Gaps criticos para MVP

### CUIT/CUIL requerido vs opcional

- Decision de producto: CUIT/CUIL opcional en MVP y validado si se completa.
- Estado actual: `tenant.taxId` esta requerido en schemas frontend/backend.
- Impacto: el onboarding puede bloquear altas MVP sin CUIT/CUIL.
- Resolver en: PR 2/3.

### Numeracion de causas

- Decision de producto: conceptos MVP `MANUAL` y `AUTO_SIMPLE`.
- Estado actual Prisma/backend/frontend: `manual` y `automatic`.
- Impacto: naming ambiguo para futuras estrategias de numeracion.
- Resolver en: PR de onboarding/DB antes de implementar causas.

### Storage provider

- Decision de producto: abstraccion `StorageProvider` con LOCAL, SUPABASE, S3 y
  GOOGLE_DRIVE conceptual.
- Estado actual Prisma: `DocumentStorageMode` solo `local` y `s3`.
- Impacto: documentos pueden acoplarse demasiado pronto a un proveedor.
- Resolver en: PR documentos/storage.

### Tenant guard incompleto

- Decision de arquitectura: impedir acceso cruzado por tenant.
- Estado actual: `TenantGuard` toma `x-tenant-id` y lo asigna como
  `activeTenantId`, pero no valida membership ni existencia de tenant.
- Impacto: la seguridad real depende de guards posteriores y payload JWT.
- Resolver en: PR 5.

### Entidades legales MVP faltantes

- ERD objetivo incluye clientes, contrarios, causas, participantes, documentos,
  tareas y notificaciones.
- Prisma actual solo cubre onboarding foundation.
- Impacto: no existe aun core operativo legal.
- Resolver en: M3/M4/M5, con migraciones separadas.

## Gaps de ERD vs Prisma

Implementado en Prisma y presente en ERD:

- `tenants`
- `users`
- `roles`
- `permissions`
- `role_permissions`
- `tenant_memberships`
- `tenant_profiles`
- `tenant_settings`
- `practice_area_templates`
- `practice_areas`
- `tenant_membership_practice_areas`
- `currencies`

Presente en ERD y no implementado en Prisma:

- `clients`
- `opposing_parties`
- `cases`
- `case_participants`
- `document_categories`
- `documents`
- `notifications`
- `tasks`
- `task_responsibles`
- `expense_categories`
- `expenses`
- `current_accounts`
- `account_movement_categories`
- `account_movements`
- `cash_boxes`
- `cash_movement_categories`
- `cash_movements`

Implementado en Prisma y no conflictivo:

- No se detectan entidades Prisma ajenas al modelo objetivo. `TenantProfile` y
  `TenantSettings` existen en ERD.

## Gaps de backend

- `OnboardingService.start` ya usa transaccion y crea tenant, user, profile,
  settings, areas, roles/permisos y membership.
- No hay audit log inicial porque no existe entidad `audit_logs`.
- `AuthService.createAccount` permite crear usuario global sin tenant; debe
  quedar integrado con una continuacion clara hacia onboarding.
- `IdentityController` expone respuestas minimas; falta modelo de usuario/tenant
  mas rico para dashboard.
- No existen modulos `clients`, `cases`, `documents`, `tasks`, `notifications`,
  `storage` ni `audit-logs`.

## Gaps de frontend

- El onboarding actual renderiza 3 pasos en un unico componente.
- Falta store dedicado para persistir y limpiar estado del onboarding.
- El paso 1 no tiene confirmacion de password.
- La marca visible aun aparece como BOGAP en pantallas.
- El flujo de exito muestra resultado en pantalla; la decision pide redireccion
  a dashboard.

## Gaps de comandos/entorno

- `npm install` paso, pero primero tuvo fallos por cache/logs de npm y un
  `ENOTEMPTY` posterior al timeout.
- `npm install` reporta 17 vulnerabilidades (2 moderate, 15 high).
- `npm run db:migrate` falla sin `DATABASE_URL`.
- No se verifico migracion contra PostgreSQL real en PR 1.

## Gaps de documentacion historica

- `TODO.md` queda como inventario historico.
- La fuente de verdad actual se mueve a `docs/product`, `docs/database`,
  `docs/architecture` y `docs/github`.
