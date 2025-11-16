# wedding-invitation Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-03

## Active Technologies

- TypeScript 5.x with Next.js 14.2.4 App Router + React 18, shadcn/ui (Radix UI primitives), Tailwind CSS, React Hook Form, Drizzle ORM (009-i-want-to)
- TypeScript 5.x with Next.js 14.2.4 App Router + React 18, shadcn/ui (Radix UI primitives), Tailwind CSS, React Hook Form, Drizzle ORM (009-i-want-to)
- TypeScript 5.x with Next.js 14.2.4 App Router architecture + React 18, Material-UI 7.x, Tailwind CSS, React Hook Form, Framer Motion (001-the-current-state)
- TypeScript 5.x with Next.js 14.2.4 + React 18, shadcn/ui (Radix UI primitives), Tailwind CSS, React Hook Form, Framer Motion (002-improve-live-preview)
- Turso (libSQL) with Drizzle ORM, Three-environment architecture (development, test, production) (OIAL-9-Development-and-testing-environment)

## Environment Architecture

- **Development**: Local development with shared `wedding-dev` Turso database
- **Test**: Vercel preview deployments with `wedding-test` Turso database (for QA and automated tests)
- **Production**: Vercel production deployments with `wedding-prod` Turso database (live users)
- **Migration Strategy**: Sequential migration-based sync (dev → test → prod) using Drizzle ORM
- **Environment Detection**: Automatic via `VERCEL_ENV` environment variable with `APP_ENV` fallback for local development

## Project Structure

```
app/
├── db/
│   ├── schema/           # Drizzle schema definitions
│   ├── index.ts          # Environment-aware database connection
│   └── migrations/       # Migration files (applied to all environments)
├── lib/
│   └── env-config.ts     # Environment detection and configuration
└── api/
    └── health/
        └── route.ts      # Health check endpoint with environment info

tests/
├── integration/
│   └── environment-isolation.test.ts  # Environment isolation tests
└── e2e/
    └── environment-switching.spec.ts   # E2E environment validation
```

## Commands

- `npm run dev` - Start development server (connects to development database)
- `npm run build` - Build for production (applies migrations automatically)
- `npm test` - Run tests (uses test environment when APP_ENV=test)
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:push` - Apply pending migrations to current environment database

## Code Style

TypeScript 5.x with Next.js 14.2.4 App Router architecture: Follow standard conventions

## Recent Changes

- 009-i-want-to: Added TypeScript 5.x with Next.js 14.2.4 App Router + React 18, shadcn/ui (Radix UI primitives), Tailwind CSS, React Hook Form, Drizzle ORM
- OIAL-9-Development-and-testing-environment: Implemented three-environment architecture (development, test, production) with isolated Turso databases, migration-based schema sync, and Vercel environment configuration
- 009-i-want-to: Added TypeScript 5.x with Next.js 14.2.4 App Router + React 18, shadcn/ui (Radix UI primitives), Tailwind CSS, React Hook Form, Drizzle ORM
- 008-split-instagram-links: Split single instagramLink into groomsInstagramLink and brideInstagramLink, reorganized UI (Content tab), renamed feature toggle to instagram_links

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
