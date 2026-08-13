# BogApp VPS Production Deploy

This guide prepares a single-VPS production deployment with Docker Compose, Nginx,
PostgreSQL, Redis and MinIO.

## 1. Server Prerequisites

- A Linux VPS with Docker and Docker Compose installed.
- DNS A record pointing your subdomain to the VPS public IP.
- Ports `80` and `443` open in the VPS firewall.
- SSH access with a non-root deploy user.

## 2. Clone And Configure

```bash
git clone <YOUR_REPOSITORY_URL> BogApp
cd BogApp
cp .env.production.example .env.production
```

Edit `.env.production` and replace every `CHANGE_ME` value.

Also replace the mock domain in `infra/nginx/nginx.prod.conf`:

```text
app.bogaap.example
```

Use the real subdomain in every `server_name` and certificate path.

## 3. Issue TLS Certificates

Before starting Nginx, generate the first Let's Encrypt certificate with Certbot:

```bash
docker compose \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  --profile certbot \
  run --rm --service-ports certbot \
  certonly --standalone \
  -d app.bogaap.example \
  --email admin@app.bogaap.example \
  --agree-tos \
  --no-eff-email
```

Replace `app.bogaap.example` and the email before running.

## 4. Build And Start

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

Check status:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production ps
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f nginx
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f api
```

## 5. Database Migrations And Base Seeds

Run migrations after the images are built and Postgres is healthy:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production run --rm api \
  npx prisma migrate deploy --schema packages/database/prisma/schema.prisma
```

Seed required catalogs:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production run --rm api \
  node packages/database/prisma/seed-rbac.cjs

docker compose -f docker-compose.prod.yml --env-file .env.production run --rm api \
  node packages/database/prisma/seed-practice-area-templates.cjs

docker compose -f docker-compose.prod.yml --env-file .env.production run --rm api \
  node packages/database/prisma/seed-legal-catalogs.cjs
```

Create the Moreira tenant when needed:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production run --rm api \
  node packages/database/prisma/seed-moreira-tenant.cjs
```

Do not run demo or volume seeds in production.

## 6. Certificate Renewal

Renew certificates periodically:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production --profile certbot run --rm certbot renew
docker compose -f docker-compose.prod.yml --env-file .env.production exec nginx nginx -s reload
```

Add the renewal command to cron/systemd once the first deploy is verified.

## 7. Backups

At minimum, back up:

- `postgres_data`
- `minio_data`
- `.env.production`
- the `letsencrypt` volume

PostgreSQL dump example:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production exec postgres \
  sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > bogaap-$(date +%F).sql
```

Always test restore before trusting backups.

## 8. Production Notes

- Only Nginx publishes host ports.
- PostgreSQL, Redis and MinIO are internal Docker services.
- PostgreSQL uses the `pgvector/pgvector:pg16` image because AI legal corpus
  migrations require the `vector` extension.
- Auth cookies require HTTPS because `AUTH_COOKIE_SECURE=true`.
- The `/api` path intentionally goes through Next.js first, because Next owns
  httpOnly auth cookies, token refresh and tenant header forwarding.
- Keep `.env.production` out of Git. Commit only `.env.production.example`.
