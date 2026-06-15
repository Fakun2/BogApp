# Backend - RBAC base por tenant

Milestone: M2 - Auth, RBAC y seguridad

Labels: `type:feature`, `area:api`, `area:auth`, `area:rbac`, `priority:p0`

## Objetivo

Garantizar que los permisos sean por tenant.

## Roles iniciales

- `owner`
- `admin`
- `lawyer`
- `paralegal`
- `accounting`
- `viewer`

## Criterios de aceptacion

- Un usuario puede pertenecer a mas de un tenant.
- El rol puede variar por tenant.
- No hay acceso cruzado entre estudios.
- Guards aplicados en rutas protegidas.
- Permisos documentados.

## Dependencias

- EPIC 01.
- EPIC 02.
