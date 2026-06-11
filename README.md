# Savings Tracker API

NestJS backend for the Savings Tracker application. Provides REST endpoints for authentication and savings goal management, with JWT-based auth, Prisma ORM, PostgreSQL, and structured logging via Winston + Loki.

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Passport.js (local + JWT strategies), bcrypt
- **Docs**: Swagger / OpenAPI at `/api/docs`
- **Logging**: Winston + Loki + Grafana
- **Validation**: class-validator / class-transformer

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker (optional — for the full observability stack)

## Project Setup

```bash
npm install
```

Copy the environment template and fill in your values:

```bash
cp .env.template .env
```

Key variables:

| Variable               | Description                    | Default                 |
| ---------------------- | ------------------------------ | ----------------------- |
| `PORT`                 | Port the server listens on     | `4000`                  |
| `DATABASE_URL`         | PostgreSQL connection string   | —                       |
| `JWT_SECRET`           | Secret used to sign JWT tokens | —                       |
| `JWT_TOKEN_EXPIRATION` | Token TTL (e.g. `7d`)          | `7d`                    |
| `CORS_ORIGIN`          | Allowed CORS origin            | `http://localhost:5173` |
| `LOKI_HOST`            | Loki push URL                  | `http://localhost:3100` |

## Database

### Apply migrations (CI / production)

```bash
npm run db:migrate
```

### Create and apply a new migration (development)

```bash
npm run db:migrate:dev -- --name <migration_name>
```

### Reset the database (drops all data and re-applies migrations)

```bash
npm run db:migrate:reset
```

### Regenerate the Prisma client after schema changes

```bash
npm run db:generate
```

### Open Prisma Studio (visual DB browser)

```bash
npm run db:studio
```

## Running the Server

```bash
# development (watch mode)
npm run start:dev

# debug mode
npm run start:debug

# production
npm run start:prod
```

API is available at `http://localhost:<PORT>` (default `4000`).  
Swagger UI: `http://localhost:<PORT>/api/docs`

## Running Tests

```bash
# unit tests
npm run test

# unit tests in watch mode
npm run test:watch

# coverage report
npm run test:cov

# e2e tests
npm run test:e2e
```

## Docker (Observability Stack)

Start PostgreSQL, Loki, and Grafana via Docker Compose:

```bash
docker compose up -d
```

Grafana is available at `http://localhost:3000` (default credentials: `admin` / `admin`).
