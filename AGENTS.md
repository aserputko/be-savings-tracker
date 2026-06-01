# AGENTS

## Project Snapshot

- Backend service built with NestJS 11 and TypeScript.
- Current structure is a single root module with starter controller/service flow.
- Environment variables are loaded with `ConfigModule.forRoot()`.

## Fast Start

1. Install dependencies: `npm install`
2. Create environment file from template: `cp .env.template .env`
3. Optional local Postgres via Docker: `docker compose up -d postgresDB`
4. Run in watch mode: `npm run start:dev`

## Required Validation Before Finishing Changes

1. Lint: `npm run lint`
2. Unit tests: `npm run test`
3. E2E tests: `npm run test:e2e`
4. Build: `npm run build`

## Architecture Map

- App bootstrap: `src/main.ts`
- Root module and DI wiring: `src/app.module.ts`
- HTTP entrypoint pattern: `src/app.controller.ts`
- Business logic pattern: `src/app.service.ts`
- Unit tests: `src/**/*.spec.ts`
- E2E tests: `test/**/*.e2e-spec.ts`

## Project Structure

```
src/
├── modules/
│   └── [feature]/
│       ├── commands/
│       │   ├── create-[feature].handler.ts
│       │   └── create-[feature].command.ts
│       ├── queries/
│       │   ├── get-[feature].handler.ts
│       │   └── get-[feature].query.ts
│       ├── dto/
│       │   ├── create-[feature].dto.ts
│       │   └── [feature]-response.dto.ts
│       ├── entities/
│       │   └── [feature].entity.ts
│       ├── [feature].controller.ts
│       ├── [feature].repository.ts
│       ├── [feature].service.ts
│       └── [feature].module.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── config/
```

## Code Conventions For Agents

- Keep request handling in controllers and move logic into services.
- Use Nest dependency injection and decorators consistently.
- When adding features, prefer creating a dedicated module/controller/service set rather than growing `AppController` and `AppService`.
- Keep TypeScript imports and compiler settings compatible with `module: nodenext`.
- Avoid deep package imports (for example, prefer `@nestjs/config` over internal dist paths).
- Each feature module must have a `[feature].repository.ts` that encapsulates all Prisma access for that feature. Handlers and services must not use `PrismaService` directly — they go through the repository.
- The repository exposes typed methods (`findAll`, `findOne`, `create`, `update`, `delete`) and returns entity classes (from `entities/`), not raw Prisma types. Use a private `toEntity()` mapper inside the repository to convert `Prisma.Decimal` and other Prisma-specific types to plain TypeScript primitives.

## Environment And Runtime Pitfalls

- Docker Compose expects `DATABASE_*` values from `.env`; missing values can break local database startup.
- App port is controlled by `PORT` and defaults to `3000` if unset.
- Lint command uses `--fix` and may modify files automatically.

## References

- Project overview and scripts: [README.md](README.md)
- Required environment variables: [.env.template](.env.template)
- Local database service: [docker-compose.yml](docker-compose.yml)
- Lint and TypeScript rules: [eslint.config.mjs](eslint.config.mjs)
