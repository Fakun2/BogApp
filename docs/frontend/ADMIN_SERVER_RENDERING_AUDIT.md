# Admin Server Rendering Audit

Fecha: 2026-08-18

## Estado Actual

- `/admin/cases` ya es el patrón de referencia: página server, permisos server-side, `Suspense`, API server con `Authorization` y `x-tenant-id`, y componentes cliente solo para tabla/interacciones.
- `/admin` ahora precarga métricas en servidor y deja React Query con `initialData` para tooltip/refetch client-side.
- `/admin/staff`, `/admin/currencies`, `/admin/categories`, `/admin/legal-catalogs`, `/admin/cashbox` y `/admin/roles` siguen siendo client pages completas.

## Candidatas A Migrar

- `staff`: alta prioridad. Filtros, sort y paginación son serializables; conviene moverlos a `searchParams`, cargar primera página en server y pasar `initialData` al client view.
- `currencies` y `categories`: alta prioridad. Mismo patrón que staff; métricas y primera página pueden venir desde server sin afectar dialogs/mutaciones.
- `legal-catalogs`: prioridad media. Requiere mover `tab`, `offset`, `sort` y `provinceId` a URL antes de server-renderizar la primera carga.
- `roles`: prioridad media-baja. Puede recibir roles/permisos iniciales server-side, pero creación/edición y selector de permisos deben quedar client-side.

## Mantener Client-Side Por Ahora

- `cashbox`: fecha, moneda, movimientos, conversiones, diálogos y mutaciones están muy acoplados a estado interactivo. Se puede precargar `summary`, `movements` y monedas activas luego, pero no conviene mover toda la vista.
- IA/chat, formularios, sheets, popups, menús, tablas con selección de columnas y acciones inline deben seguir en cliente.

## Patrón Recomendado

- Crear página server por módulo que lea sesión con `getServerAuthSession()`, valide permiso y cargue datos operativos con `requestAdminApiServer`.
- Mantener un `*ClientView` con hooks, filtros, mutaciones y tablas.
- Usar query keys idénticas y `initialData` para evitar doble carga visual.
- Renderizar `Skeleton` solo cuando no existe data previa; durante refetch conservar la tabla/lista actual.

## Próximo Orden Sugerido

1. Migrar `currencies` y `categories` a server wrapper con `searchParams`.
2. Migrar `staff` con filtros en URL.
3. Migrar `legal-catalogs` después de serializar tab/filtros.
4. Evaluar `roles` con `initialData`.
5. Evaluar precarga parcial de `cashbox`.
