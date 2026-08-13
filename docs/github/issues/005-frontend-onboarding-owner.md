# Frontend - onboarding paso 1 owner

Milestone: M1 - Tenant onboarding

Labels: `type:feature`, `area:web`, `area:onboarding`, `priority:p0`

## Objetivo

Implementar o conectar el paso de identidad del owner.

## Campos minimos

- Nombre.
- Email.
- Password si aplica.
- Confirmacion password si aplica.

## Criterios de aceptacion

- Validacion con Zod.
- Estado persistente entre pasos.
- Resumen lateral actualizado.
- No permite avanzar con email invalido.
- Si auth ya existe, reutilizar el flujo existente.

## Dependencias

- EPIC 03.
