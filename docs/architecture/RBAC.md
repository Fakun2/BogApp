# RBAC

RBAC se resuelve por tenant mediante `tenant_memberships`.

## Roles MVP

- `owner`
- `admin`
- `lawyer`
- `paralegal`
- `accounting`
- `viewer`

## Permisos actuales en codigo

- `tenants:manage`
- `staff:read`
- `staff:create`
- `staff:update`
- `staff:delete`
- `staff:manage`
- `users:manage`
- `roles:read`
- `roles:create`
- `roles:update`
- `roles:delete`
- `roles:manage`
- `clients:read`
- `clients:create`
- `clients:update`
- `clients:delete`
- `cases:read`
- `cases:create`
- `cases:update`
- `cases:delete`
- `forums:read`
- `provinces:read`
- `documents:read`
- `documents:write`
- `tasks:read`
- `tasks:create`
- `tasks:update`
- `tasks:delete`
- `expenses:read`
- `expenses:create`
- `expenses:update`
- `expenses:delete`
- `finance:read`
- `finance:create`
- `finance:update`
- `finance:delete`
- `billing:manage`

## Matriz esperada

### owner

Puede ver todo, gestionar tenant, usuarios, roles, configuracion, clientes,
causas, documentos, tareas, finanzas, caja y auditoria.

### admin

Puede gestionar usuarios salvo transferir ownership, clientes, documentos,
tareas, reportes y configuracion limitada. No accede a expedientes ni gastos
del expediente por defecto.

### lawyer

Puede leer, crear y modificar expedientes; leer, crear, modificar y eliminar
tareas; y leer, crear, modificar y eliminar gastos asociados a tareas. No
gestiona roles ni tenant.

### paralegal

Puede leer expedientes, crear y modificar tareas, y leer, crear y modificar
gastos asociados a tareas. No elimina expedientes, tareas ni gastos.

### accounting

Tiene permisos de caja (`finance:*`). Por ahora Caja no existe como modulo
operativo completo, por lo que no accede a expedientes ni a gastos asociados a
tareas.

### viewer

Puede ver informacion autorizada. No crea, edita ni elimina.

## Estado actual

- Permisos se persisten como catalogo global en `permissions`.
- Roles de sistema viven en `roles` con `tenant_id = null`.
- Roles custom viven en `roles` con `tenant_id` del estudio activo.
- `roles.active` indica si un rol esta disponible para nuevas asignaciones.
- Si un rol custom se desactiva o elimina, las membresias asociadas quedan con
  `role_id = null` mediante un evento interno idempotente.
- `OnboardingService.start` upsertea permisos, roles y relaciones.
- `RolesGuard` valida rol requerido contra `request.user.tenantAccess`.
- `PermissionsGuard` valida permisos requeridos contra `request.user.tenantAccess`.

## Gaps

- Falta validacion robusta de membership activa por request.
- Falta granularidad ABAC para causas/documentos asignados.
- Faltan modulos operativos donde aplicar permisos reales.
- `billing:manage` existe en permisos pero facturacion SaaS queda post-MVP.

## Decision

Para MVP, implementar RBAC base y documentar ABAC/permisos granulares como
post-MVP o como extension incremental cuando existan causas/documentos.
