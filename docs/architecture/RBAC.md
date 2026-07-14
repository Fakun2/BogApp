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
- `roles:manage`
- `clients:read`
- `clients:create`
- `clients:update`
- `clients:delete`
- `clients:write`
- `cases:read`
- `cases:create`
- `cases:update`
- `cases:delete`
- `cases:write`
- `documents:read`
- `documents:write`
- `tasks:read`
- `tasks:create`
- `tasks:update`
- `tasks:delete`
- `tasks:write`
- `finance:read`
- `finance:create`
- `finance:update`
- `finance:delete`
- `finance:write`
- `billing:manage`

## Matriz esperada

### owner

Puede ver todo, gestionar tenant, usuarios, roles, configuracion, clientes,
causas, documentos, tareas, finanzas, caja y auditoria.

### admin

Puede gestionar usuarios salvo transferir ownership, clientes, causas,
documentos, tareas, reportes y configuracion limitada.

### lawyer

Puede gestionar sus causas asignadas, ver clientes vinculados, crear tareas,
subir documentos, ver documentos autorizados y ver agenda. No gestiona roles ni
tenant.

### paralegal

Puede ver causas asignadas, cargar documentos, completar tareas y crear notas o
movimientos simples. No elimina causas ni ve finanzas sensibles.

### accounting

Puede ver clientes, ver causas en modo limitado, gestionar gastos, cuenta
corriente, caja y reportes financieros. No modifica estrategia legal ni
documentos sensibles salvo permiso explicito.

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
