# Architecture decisions

Este archivo registra decisiones tecnicas activas. Nuevas decisiones deben
agregarse aca antes de implementar cambios grandes.

## ADR-001 - Monorepo con Turborepo

Decision: mantener monorepo con npm workspaces.

Motivo: permite evolucionar backend, frontend, database y api-client con
contratos compartidos y comandos unificados.

Estado: aceptado.

## ADR-002 - Monolito modular en NestJS

Decision: mantener backend como monolito modular NestJS.

Motivo: el producto esta en etapa MVP y necesita limites claros por dominio sin
sobrecosto de microservicios.

Estado: aceptado.

## ADR-003 - PostgreSQL compartido multi-tenant

Decision: usar una sola base PostgreSQL compartida, con `tenant_id` como
frontera logica para entidades operativas.

Motivo: simplifica operacion inicial y mantiene escalabilidad SaaS B2B.

Estado: aceptado.

## ADR-004 - Prisma como schema ejecutable

Decision: Prisma es la fuente ejecutable para modelos y migraciones.

Motivo: schema tipado, migraciones versionadas y cliente TS.

Estado: aceptado.

## ADR-005 - Zod para validaciones de contrato

Decision: usar Zod en frontend y backend, con `nestjs-zod` para DTOs.

Motivo: reduce divergencia entre validacion de UI y API.

Estado: aceptado.

## ADR-006 - OpenAPI + Orval para cliente

Decision: generar cliente TypeScript desde OpenAPI con Orval.

Motivo: evita clientes manuales y mantiene contratos trazables.

Estado: aceptado.

## ADR-007 - RBAC base por tenant

Decision: roles globales y membresias por tenant. El rol efectivo de un usuario
se resuelve desde `tenant_memberships`.

Motivo: un usuario puede pertenecer a varios estudios con roles distintos.

Estado: aceptado.

## ADR-008 - Storage provider abstracto

Decision: documentos no deben acoplarse directamente a Google Drive.

Motivo: el MVP necesita local/dev y proveedor productivo preparado; Google Drive
queda como integracion post-MVP.

Estado: propuesto para PR documentos.

## ADR-009 - GitHub como sistema operativo del proyecto

Decision: roadmap, milestones, labels, issues y templates quedan documentados en
`docs/github` y `.github`.

Motivo: permite trabajar por PRs pequenos y coordinados.

Estado: aceptado.

## ADR-010 - Frontend por feature modules y query global

Decision: organizar pantallas complejas de `apps/web` como feature modules con
`_api`, `_components`, `_hooks`, `_types`, `_constants` y `_utils`, y consumir
datos del dashboard mediante `useDashboardQuery`.

Motivo: separa UI de logica de negocio, centraliza tenant/auth/permisos para
TanStack Query y mantiene componentes pequenos con un componente por archivo.

Estado: aceptado.
