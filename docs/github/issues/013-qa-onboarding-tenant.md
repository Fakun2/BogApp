# QA - pruebas minimas onboarding y tenant

Milestone: M1 - Tenant onboarding

Labels: `type:test`, `area:qa`, `priority:p1`

## Objetivo

Agregar pruebas minimas para onboarding y bootstrap tenant.

## Criterios de aceptacion

- Test de DTO backend.
- Test de creacion de tenant.
- Test de validacion frontend.
- Test de bloqueo por datos invalidos.
- Test de no acceso cross-tenant si existe RBAC base.

## Dependencias

- EPIC 03.
- Backend - endpoint bootstrap tenant.
- Backend - tenant context por request.
