# Research: Development and Testing Environment

**Feature**: OIAL-9 Development and Testing Environment
**Phase**: Phase 0 - Research
**Date**: 2025-11-03

## Overview

This document contains research findings for implementing a three-environment architecture (development, test, production) for the wedding invitation application using Turso databases and Vercel hosting.

---

## 1. Turso Multi-Database Setup

### Decision

Use Turso CLI to create three separate database instances under the same organization/account.

### Research Findings

**Turso Database Creation**:

```bash
# Create three databases
turso db create wedding-dev
turso db create wedding-test
turso db create wedding-prod

# Get connection URLs and tokens
turso db show wedding-dev --url
turso db tokens create wedding-dev

# Repeat for test and prod
```

**Key Capabilities**:

- Turso supports multiple databases per organization
- Each database has its own unique URL and auth token
- Databases are completely isolated (no data sharing)
- Billing is per-database based on storage and requests
- Can be created/destroyed via CLI or API

### Rationale

- **True Isolation**: Each environment has a physically separate database
- **Independent Scaling**: Can tune each environment separately
- **Cost-Effective**: Only pay for actual usage per environment
- **Easy Management**: Turso CLI provides simple create/destroy operations

### Alternatives Considered

**Option A: Single database with schema prefixes** (e.g., `dev_users`, `test_users`)

- ❌ Rejected: Not true isolation - schema changes affect all environments
- ❌ Risk of cross-environment queries (human error)
- ❌ Migration rollback affects all environments

**Option B: Different Turso organizations per environment**

- ❌ Rejected: Unnecessary complexity in billing and access management
- ❌ Harder to manage authentication tokens across organizations

---

## 2. Vercel Environment Configuration

### Decision

Use Vercel's built-in environment variable system with automatic environment detection via `VERCEL_ENV`.

### Research Findings

**Vercel Environment Types**:

- `production`: Deployments from the default branch (main)
- `preview`: Deployments from pull requests and other branches
- `development`: Local development (via `vercel dev`)

**Environment Variable Scopes**:

- Production: Only available in production deployments
- Preview: Only available in preview deployments
- Development: Available in local development

**Automatic Environment Detection**:

```typescript
// Vercel automatically sets VERCEL_ENV
const environment = process.env.VERCEL_ENV || 'development'

// Map Vercel envs to our environment names
const appEnv =
  environment === 'production' ? 'production' : environment === 'preview' ? 'test' : 'development'
```

**Configuration in Vercel Dashboard**:

1. Project Settings → Environment Variables
2. Add variable (e.g., `DATABASE_URL`)
3. Select scope: Production, Preview, or Development
4. Vercel automatically injects the correct value per deployment

### Rationale

- **Zero Configuration**: Vercel handles environment detection automatically
- **Secure**: Environment variables not exposed to client-side code
- **Deployment-Aware**: Each deployment gets correct environment automatically
- **Version Controlled**: Can commit .env.example, actual values in Vercel

### Alternatives Considered

**Option A: Custom environment switching logic based on URL**

- ❌ Rejected: Fragile - URL patterns can change
- ❌ Doesn't work for local development
- ❌ Requires custom code for something Vercel provides

**Option B: Environment config files committed to Git**

- ❌ Rejected: Security risk - secrets in version control
- ❌ Manual sync when rotating credentials

---

## 3. Drizzle ORM Migration Strategy

### Decision

Maintain a single set of migration files in version control, applied sequentially to each environment (dev → test → prod).

### Research Findings

**Drizzle Kit Migration Workflow**:

```bash
# 1. Developer makes schema changes locally
# 2. Generate migration file
npm run db:generate
# Creates: drizzle/migrations/0001_add_column.sql

# 3. Apply to dev database (automatic in development)
npm run db:push

# 4. Commit migration file to Git
git add drizzle/migrations/0001_add_column.sql
git commit -m "Add column migration"

# 5. Deploy to test → migration runs automatically
git push origin feature-branch

# 6. Merge to main → migration runs on production
# Vercel build command: npm run db:push && next build
```

**Migration File Tracking**:

- Drizzle creates sequential numbered migration files
- Each file contains both UP (apply) and metadata
- `drizzle-kit push` applies pending migrations to target database
- Idempotent: Safe to run multiple times (tracks applied migrations)

**Environment-Specific Migration Execution**:

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './app/db/schema',
  out: './drizzle/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
})
```

### Rationale

- **Schema Consistency**: Same migrations = same schema across all environments
- **Version Controlled**: Migration history in Git provides audit trail
- **Testable**: Migrations validated in dev/test before production
- **Rollback Safety**: Can revert migrations via Git + database restore

### Alternatives Considered

**Option A: Environment-specific migration files** (e.g., `migrations/dev/`, `migrations/prod/`)

- ❌ Rejected: Leads to schema drift between environments
- ❌ Hard to keep in sync as features evolve
- ❌ Cannot verify production migrations in test environment

**Option B: Manual SQL execution per environment**

- ❌ Rejected: Error-prone, no version control
- ❌ Doesn't track which migrations have been applied
- ❌ Cannot automate in CI/CD pipeline

---

## 4. Environment Detection Pattern

### Decision

Use `process.env.VERCEL_ENV` as primary source with `APP_ENV` fallback for local development.

### Research Findings

**Implementation Pattern**:

```typescript
// app/lib/env-config.ts
export type AppEnvironment = 'development' | 'test' | 'production'

export function getEnvironment(): AppEnvironment {
  // Explicit override (for testing)
  if (process.env.APP_ENV) {
    return process.env.APP_ENV as AppEnvironment
  }

  // Vercel automatic detection
  if (process.env.VERCEL_ENV === 'production') return 'production'
  if (process.env.VERCEL_ENV === 'preview') return 'test'

  // Default for local development
  return 'development'
}

export function getConfig() {
  const env = getEnvironment()

  return {
    environment: env,
    databaseUrl: process.env.DATABASE_URL!,
    databaseAuthToken: process.env.DATABASE_AUTH_TOKEN!,
    isProduction: env === 'production',
    canDestroyDatabase: env !== 'production',
  }
}
```

**Environment Variable Naming**:

- `VERCEL_ENV`: Set automatically by Vercel (production/preview/development)
- `APP_ENV`: Manual override for local testing (development/test/production)
- `DATABASE_URL`: Environment-specific database connection string
- `DATABASE_AUTH_TOKEN`: Environment-specific Turso auth token

### Rationale

- **Automatic in Production**: Zero configuration when deployed to Vercel
- **Flexible Locally**: Can override with `APP_ENV=test npm run dev` for testing
- **Type-Safe**: TypeScript ensures only valid environment names
- **Server-Only**: Never exposed to client (no NEXT*PUBLIC* prefix)

### Alternatives Considered

**Option A: URL-based detection** (e.g., if domain contains "dev")

- ❌ Rejected: Fragile - breaks if URLs change
- ❌ Doesn't work for localhost
- ❌ Security risk if URL manipulation possible

**Option B: Hardcoded by file** (e.g., `config.development.ts`)

- ❌ Rejected: Requires code changes per environment
- ❌ Risk of committing wrong config
- ❌ Doesn't leverage Vercel's automatic detection

---

## 5. Database Connection Pooling

### Decision

Use Turso's server-side connection pooling; application maintains single connection per environment.

### Research Findings

**Turso Connection Architecture**:

```typescript
// app/db/index.ts
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { getConfig } from '@/app/lib/env-config'

const config = getConfig()

// Single client per environment
const client = createClient({
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
})

export const db = drizzle(client)
```

**Turso Connection Pooling**:

- Turso automatically pools connections on their edge servers
- Application connections are HTTP-based (stateless)
- No need for application-level pooling (like pg-pool)
- Concurrent requests automatically multiplexed by Turso

**Next.js App Router Considerations**:

- Server Components: Connection per request (Next.js handles)
- API Routes: Connection per request (Next.js handles)
- Server Actions: Connection per invocation (Next.js handles)
- No persistent connection needed (HTTP protocol)

### Rationale

- **Simplicity**: Turso handles complexity of connection pooling
- **Serverless-Friendly**: No persistent connections needed (edge-compatible)
- **Cost-Effective**: Only billed for actual queries (not connection time)
- **Auto-Scaling**: Turso scales connections based on demand

### Alternatives Considered

**Option A: Application-level connection pooling** (e.g., connection pool library)

- ❌ Rejected: Unnecessary with Turso's HTTP-based protocol
- ❌ Adds complexity without performance benefit
- ❌ Not needed for serverless/edge deployments

**Option B: Singleton pattern for database client**

- ✅ Acceptable for development (faster hot-reload)
- ⚠️ Not necessary for production (Vercel handles caching)
- ✅ Implemented via module-level export (standard pattern)

---

## Implementation Recommendations

### Immediate Actions

1. **Create Turso Databases**:

   ```bash
   turso db create wedding-dev
   turso db create wedding-test
   turso db create wedding-prod
   ```

2. **Configure Local Environment**:

   ```bash
   # .env.local
   DATABASE_URL=libsql://wedding-dev-[org].turso.io
   DATABASE_AUTH_TOKEN=eyJhbG...
   APP_ENV=development
   ```

3. **Configure Vercel Environments**:
   - Production scope: `DATABASE_URL` + `DATABASE_AUTH_TOKEN` (prod database)
   - Preview scope: `DATABASE_URL` + `DATABASE_AUTH_TOKEN` (test database)

4. **Update Database Connection**:
   - Modify `app/db/index.ts` to use environment-based config
   - Add `app/lib/env-config.ts` for environment detection

5. **Update Build Commands**:
   - Vercel build command: `npm run db:push && npm run build`
   - Ensures migrations run before deployment

### Testing Strategy

1. **Unit Tests**: Verify environment detection logic
2. **Integration Tests**: Verify database connections per environment
3. **E2E Tests**: Verify full deployment flow (dev → test → prod)

### Rollback Plan

If environment separation causes issues:

1. All databases exist independently - can rollback application code
2. Migrations are versioned - can revert Git commits
3. Vercel deployments are immutable - can redeploy previous version
4. No data loss risk - each environment isolated

---

## Appendix: Environment Comparison Matrix

| Aspect               | Development                | Test                     | Production                    |
| -------------------- | -------------------------- | ------------------------ | ----------------------------- |
| **Database**         | wedding-dev                | wedding-test             | wedding-prod                  |
| **Data Persistence** | Volatile (can reset)       | Volatile (can reset)     | Persistent (backups)          |
| **Access**           | All developers             | All developers           | All developers (but careful!) |
| **Deployment**       | Manual (`npm run dev`)     | Automatic (PR deploy)    | Automatic (main merge)        |
| **Migrations**       | Manual (`npm run db:push`) | Automatic (build script) | Automatic (build script)      |
| **Vercel ENV**       | development                | preview                  | production                    |
| **Purpose**          | Feature development        | QA testing, E2E tests    | Live users                    |

---

## References

- Turso Documentation: https://docs.turso.tech/
- Vercel Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Drizzle Kit Migrations: https://orm.drizzle.team/kit-docs/overview
- Next.js Environment Variables: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

---

**Status**: ✅ Research Complete - Ready for Phase 1 (Design & Contracts)
