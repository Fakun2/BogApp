# Backend - tenant context por request

Milestone: M2 - Auth, RBAC y seguridad

Labels: `type:feature`, `area:api`, `area:tenant`, `priority:p0`

## Objetivo

Crear contexto de tenant activo por request.

## Criterios de aceptacion

- El backend identifica tenant activo.
- Todas las rutas operativas requieren tenant activo.
- Las queries se filtran por tenant.
- Se documenta como se obtiene tenantId.
- Se agregan tests de no acceso cross-tenant.

## Dependencias

- Backend - RBAC base por tenant.
