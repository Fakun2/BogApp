# Backend - endpoint bootstrap tenant

Milestone: M1 - Tenant onboarding

Labels: `type:feature`, `area:api`, `area:tenant`, `area:onboarding`, `priority:p0`

## Objetivo

Crear endpoint backend para inicializar un estudio juridico completo desde el
onboarding.

## Debe crear en transaccion

- Tenant.
- Owner user si corresponde.
- Tenant membership.
- Roles base.
- Workspace settings.
- Practice areas iniciales.
- Audit log inicial si existe entidad de auditoria.

## Criterios de aceptacion

- DTO validado.
- Operacion transaccional.
- Si falla una parte, no queda tenant incompleto.
- Respuesta tipada.
- Swagger actualizado.
- Tests minimos.

## Dependencias

- EPIC 02.
