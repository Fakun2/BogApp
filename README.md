# BOGAP

SaaS B2B para estudios juridicos.

## Stack

- Turborepo con npm workspaces.
- Backend: NestJS + TypeScript.
- Frontend: Next.js App Router + Tailwind CSS + shadcn/ui.
- Validacion: Zod.
- API client: Orval desde OpenAPI.
- ORM: Prisma.
- DB principal: PostgreSQL.
- Cache DB: Redis.
- Infra local: Docker Compose + Nginx reverse proxy.

## Estructura

- `apps/api`: monolito modular NestJS.
- `apps/web`: frontend Next.js.
- `packages/database`: Prisma schema, client y migraciones.
- `packages/api-client`: cliente TypeScript generado por Orval.
- `docs/diagrams`: PlantUML ERD y notas de diseno.
- `TODO.md`: hoja de ruta de desarrollo.

## Primer objetivo

Construir la base multitenant y RBAC:

- `tenants`
- `users`
- `roles`
- `tenant_memberships`

## Setup

```bash
npm install
npm run db:generate
npm run typecheck
```

## Desarrollo local con hot reload

Para iterar rapido, usar Docker solo para infraestructura y correr backend/frontend en
terminales separadas:

```bash
npm run docker:dev:infra
```

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev:web
```

URLs de desarrollo:

- Frontend Next.js: `http://localhost:3000`
- API NestJS: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`

En este modo no se usa Nginx. Next proxyea `/api/*` hacia `http://localhost:3001`.

## Base de datos

Configurar `DATABASE_URL` copiando `.env.example` a `.env`.

```bash
npm run db:generate
npm run db:migrate
```

## OpenAPI y Orval

```bash
npm run api:openapi
npm run api-client:generate
```

La API expone Swagger en:

- `http://localhost:3001/api/docs`
- `http://localhost:3001/api/docs-json`

## Docker

```bash
npm run docker:up
```

Servicios principales:

- Web via Nginx: `http://localhost`
- API via Nginx: `http://localhost/api/health`
- Swagger via Nginx: `http://localhost/api/docs`
