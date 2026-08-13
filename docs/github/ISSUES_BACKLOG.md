# Issues backlog

Backlog inicial preparado para GitHub. Si no se crean issues reales desde la
API, cada issue tiene una version markdown en `docs/github/issues/`.

## Milestones

| Milestone                              | Objetivo                                                               |
| -------------------------------------- | ---------------------------------------------------------------------- |
| M0 - Auditoria y organizacion          | Entender repo, validar stack, ordenar docs y definir fuente de verdad. |
| M1 - Tenant onboarding                 | Hacer funcional el alta real del estudio juridico.                     |
| M2 - Auth, RBAC y seguridad            | Proteger rutas, roles, permisos y separacion por tenant.               |
| M3 - Clientes y expedientes            | Implementar la operacion legal central.                                |
| M4 - Documentos                        | Asociar documentos a clientes y causas con storage provider.           |
| M5 - Tareas, agenda y notificaciones   | Implementar operacion diaria, vencimientos y seguimiento.              |
| M6 - Caja, cuenta corriente y reportes | Implementar control financiero base.                                   |
| M7 - Integraciones                     | Preparar Google Drive, Google Calendar e integraciones externas.       |
| M8 - QA, deploy y escalabilidad        | Robustecer testing, CI/CD, observabilidad y despliegue.                |

## Labels

- `type:epic`
- `type:feature`
- `type:bug`
- `type:docs`
- `type:chore`
- `type:refactor`
- `type:test`
- `area:api`
- `area:web`
- `area:database`
- `area:auth`
- `area:tenant`
- `area:rbac`
- `area:onboarding`
- `area:clients`
- `area:cases`
- `area:documents`
- `area:tasks`
- `area:finance`
- `area:integrations`
- `area:qa`
- `area:infra`
- `priority:p0`
- `priority:p1`
- `priority:p2`
- `priority:p3`
- `status:blocked`
- `status:ready`
- `status:in-progress`
- `status:needs-review`

## Initial issues

### EPIC 01 - Auditoria tecnica del repositorio

Milestone: M0 - Auditoria y organizacion

Labels: `type:epic`, `area:infra`, `priority:p0`

Objetivo: auditar el estado real del proyecto antes de avanzar.

Entregables:

- Mapa del repo.
- Stack confirmado.
- Comandos funcionales documentados.
- Riesgos tecnicos detectados.
- Diferencias entre README, TODO, Prisma, backend, frontend y diagrama.
- `docs/architecture/DECISIONS.md` actualizado.

Criterios:

- `npm install` funciona o queda documentado el error.
- `npm run typecheck` funciona o queda documentado el error.
- Se identifica fuente de verdad tecnica.
- Se documentan bloqueos reales.

### EPIC 02 - Fuente de verdad de base de datos

Milestone: M0 - Auditoria y organizacion

Labels: `type:epic`, `area:database`, `priority:p0`

Objetivo: definir la base de datos real del proyecto.

Entregables:

- `docs/database/DATABASE_SOURCE_OF_TRUTH.md`
- `docs/database/gaps.md`
- Lista de entidades existentes.
- Lista de entidades faltantes.
- Plan de migraciones.
- Decision de entidades MVP vs post-MVP.

Criterios:

- No queda ambiguedad sobre que schema implementar.
- Las diferencias entre diagrama y Prisma quedan documentadas.
- Las entidades MVP quedan marcadas.

### EPIC 03 - Onboarding real de tenant

Milestone: M1 - Tenant onboarding

Labels: `type:epic`, `area:onboarding`, `area:tenant`, `priority:p0`

Dependencias: EPIC 01, EPIC 02

Objetivo: implementar alta real del estudio juridico.

Entregables:

- UI en 3 pasos.
- Store de onboarding.
- Validaciones Zod.
- Endpoint backend de bootstrap.
- Persistencia real.
- Redireccion al dashboard.
- Tests basicos.

Criterios:

- Crear estudio genera tenant real.
- Crear estudio genera owner/membership real.
- Crear estudio genera roles base.
- Crear estudio genera configuracion workspace.
- Crear estudio genera areas iniciales.
- No quedan datos hardcodeados como solucion final.

### Issue - Backend: endpoint bootstrap tenant

Milestone: M1 - Tenant onboarding

Labels: `type:feature`, `area:api`, `area:tenant`, `area:onboarding`, `priority:p0`

Dependencias: EPIC 02

Debe crear en transaccion tenant, owner user si corresponde, membership, roles
base, workspace settings, practice areas y audit log inicial si existe entidad.

Criterios:

- DTO validado.
- Operacion transaccional.
- Si falla una parte, no queda tenant incompleto.
- Respuesta tipada.
- Swagger actualizado.
- Tests minimos.

### Issue - Frontend: onboarding paso 1 owner

Milestone: M1 - Tenant onboarding

Labels: `type:feature`, `area:web`, `area:onboarding`, `priority:p0`

Criterios:

- Validacion con Zod.
- Estado persistente entre pasos.
- Resumen lateral actualizado.
- No permite avanzar con email invalido.
- Si auth ya existe, reutiliza el flujo existente.

### Issue - Frontend: onboarding paso 2 estudio juridico

Milestone: M1 - Tenant onboarding

Labels: `type:feature`, `area:web`, `area:onboarding`, `priority:p0`

Criterios:

- Validacion con Zod.
- CUIT/CUIL opcional.
- CUIT/CUIL validado si se completa.
- Areas separadas por coma.
- Estado persistente entre pasos.
- Resumen lateral actualizado.
- Boton siguiente bloqueado si faltan campos obligatorios.

### Issue - Frontend: onboarding paso 3 workspace

Milestone: M1 - Tenant onboarding

Labels: `type:feature`, `area:web`, `area:onboarding`, `priority:p0`

Criterios:

- Validacion con Zod.
- Boton `Crear estudio`.
- Loading state.
- Error state.
- Success state.
- Redireccion al dashboard.
- Envio real al endpoint bootstrap.

### Issue - Frontend: onboarding store

Milestone: M1 - Tenant onboarding

Labels: `type:feature`, `area:web`, `area:onboarding`, `priority:p0`

Criterios:

- Mantiene datos de pasos 1, 2 y 3.
- Permite volver atras sin perder informacion.
- Limpia estado al finalizar.
- No guarda informacion sensible innecesaria.
- Tipado correcto.

### Issue - Backend: RBAC base por tenant

Milestone: M2 - Auth, RBAC y seguridad

Labels: `type:feature`, `area:api`, `area:auth`, `area:rbac`, `priority:p0`

Criterios:

- Un usuario puede pertenecer a mas de un tenant.
- El rol puede variar por tenant.
- No hay acceso cruzado entre estudios.
- Guards aplicados en rutas protegidas.
- Permisos documentados.

### Issue - Backend: tenant context por request

Milestone: M2 - Auth, RBAC y seguridad

Labels: `type:feature`, `area:api`, `area:tenant`, `priority:p0`

Criterios:

- El backend identifica tenant activo.
- Todas las rutas operativas requieren tenant activo.
- Las queries se filtran por tenant.
- Se documenta como se obtiene tenantId.
- Se agregan tests de no acceso cross-tenant.

### Issue - Database: modelos MVP tenant-aware

Milestone: M3 - Clientes y expedientes

Labels: `type:feature`, `area:database`, `priority:p0`

Modelos minimos:

- `tenants`
- `users`
- `roles`
- `tenant_memberships`
- `workspace_settings` o `tenant_settings`
- `practice_areas`
- `clients`
- `opposing_parties`
- `cases`
- `case_participants`
- `document_categories`
- `documents`
- `tasks`
- `task_responsibles`
- `notifications`

Criterios:

- Prisma actualizado.
- Migracion generada.
- Relaciones correctas.
- Indices basicos.
- Seeds basicos.
- Documentacion actualizada.

### Issue - Docs: roadmap y backlog GitHub

Milestone: M0 - Auditoria y organizacion

Labels: `type:docs`, `priority:p0`

Criterios:

- Roadmap por fases.
- Backlog priorizado.
- Correlatividades claras.
- Division para 2 desarrolladores.
- Entregables por sprint.
- `docs/github/ISSUES_BACKLOG.md` creado.

### Issue - QA: pruebas minimas onboarding y tenant

Milestone: M1 - Tenant onboarding

Labels: `type:test`, `area:qa`, `priority:p1`

Criterios:

- Test de DTO backend.
- Test de creacion de tenant.
- Test de validacion frontend.
- Test de bloqueo por datos invalidos.
- Test de no acceso cross-tenant si existe RBAC base.
