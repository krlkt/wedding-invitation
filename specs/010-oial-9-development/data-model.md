# Data Model: Development and Testing Environment

**Feature**: OIAL-9 Development and Testing Environment
**Phase**: Phase 1 - Design
**Date**: 2025-11-03

## Overview

This feature implements environment configuration management but does **not** require new database tables. All environment-specific data is managed through:

1. Environment variables (Vercel + local)
2. TypeScript configuration interfaces
3. Drizzle ORM schema (existing, no changes)

---

## Configuration Entities (TypeScript Interfaces)

### EnvironmentConfig

**Purpose**: Represents the runtime configuration for a specific environment (development, test, or production).

**Location**: `app/lib/env-config.ts`

**Interface**:

```typescript
export type AppEnvironment = 'development' | 'test' | 'production'

export interface EnvironmentConfig {
  /** Current environment name */
  environment: AppEnvironment

  /** Turso database connection URL */
  databaseUrl: string

  /** Turso database authentication token */
  databaseAuthToken: string

  /** Vercel's automatic environment variable (if deployed) */
  vercelEnv?: 'production' | 'preview' | 'development'

  /** Whether this is the production environment */
  isProduction: boolean

  /** Whether the database can be safely destroyed/recreated */
  canDestroyDatabase: boolean
}
```

**Attributes**:

| Field                | Type           | Required | Description                                                               |
| -------------------- | -------------- | -------- | ------------------------------------------------------------------------- |
| `environment`        | AppEnvironment | Yes      | Current app environment (development/test/production)                     |
| `databaseUrl`        | string         | Yes      | libSQL connection URL from Turso                                          |
| `databaseAuthToken`  | string         | Yes      | Authentication token for database access                                  |
| `vercelEnv`          | string?        | No       | Vercel's automatic environment detection (production/preview/development) |
| `isProduction`       | boolean        | Yes      | Convenience flag for production checks                                    |
| `canDestroyDatabase` | boolean        | Yes      | Safety flag: false for production, true for dev/test                      |

**Validation Rules**:

- `databaseUrl` must start with `libsql://` or `http://` (local)
- `databaseAuthToken` must be non-empty string for remote databases
- `environment` must be one of three literal types
- `canDestroyDatabase` must be false when `isProduction` is true

**Usage Example**:

```typescript
import { getConfig } from '@/app/lib/env-config'

const config = getConfig()

if (config.canDestroyDatabase) {
  // Safe to reset database in dev/test
  await resetDatabase()
}

console.log(`Running in ${config.environment} environment`)
```

---

## Database Schema (No Changes)

This feature **does not modify** the existing database schema. All tables remain unchanged:

**Existing Tables** (unchanged):

- `users` - User authentication and profiles
- `wedding_configurations` - Wedding event configuration
- `rsvps` - Guest RSVP responses
- `guests` - Guest information
- `photos` - Photo gallery items
- (Additional tables as defined in `app/db/schema/`)

**Why no schema changes?**

- Environment separation is achieved through **multiple database instances**, not schema modifications
- Each environment (dev/test/prod) has its own complete copy of the schema
- Schema is identical across all environments (maintained via migrations)

---

## Environment Variables (Configuration Data)

### Development Environment

**File**: `.env.local` (not committed to Git)

```bash
# Development Database (Turso)
DATABASE_URL=libsql://wedding-dev-[org].turso.io
DATABASE_AUTH_TOKEN=eyJhbGc...dev-token

# Environment Override (optional, defaults to 'development')
APP_ENV=development

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Test Environment

**File**: Configured in Vercel (Preview scope) + `.env.test` (optional local)

```bash
# Test Database (Turso)
DATABASE_URL=libsql://wedding-test-[org].turso.io
DATABASE_AUTH_TOKEN=eyJhbGc...test-token

# Environment Override
APP_ENV=test

# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://[pr-preview].vercel.app
```

### Production Environment

**File**: Configured in Vercel (Production scope) + `.env.production` (reference only)

```bash
# Production Database (Turso)
DATABASE_URL=libsql://wedding-prod-[org].turso.io
DATABASE_AUTH_TOKEN=eyJhbGc...prod-token

# Vercel automatically sets VERCEL_ENV=production

# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://wedding.example.com
```

**Security Notes**:

- All `DATABASE_AUTH_TOKEN` values are sensitive secrets
- Never commit actual tokens to Git (use `.env.example` with placeholders)
- Vercel encrypts environment variables at rest

---

## Data Relationships

This feature doesn't introduce new database relationships, but it does establish **logical relationships** between configuration concepts:

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel Deployment                        │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Development  │    │    Preview    │    │  Production  │  │
│  │   (local)    │    │  (PR deploy)  │    │ (main branch)│  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                    │          │
└─────────┼───────────────────┼────────────────────┼──────────┘
          │                   │                    │
          ▼                   ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│                      Turso Cloud                              │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ wedding-dev  │    │ wedding-test │    │ wedding-prod │   │
│  │              │    │              │    │              │   │
│  │ [Schema v1]  │    │ [Schema v1]  │    │ [Schema v1]  │   │
│  │              │    │              │    │              │   │
│  │ Test Data    │    │ Test Data    │    │ Real Data    │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Migration Flow:
Developer (local) → Generates migration file (drizzle/migrations/0001_xxx.sql)
                 → Commits to Git
                 → Applies to wedding-dev (manual: npm run db:push)

PR Deploy (test) → Pulls latest migrations from Git
                 → Applies to wedding-test (automatic: build script)

Prod Deploy      → Pulls latest migrations from Git
                 → Applies to wedding-prod (automatic: build script)
```

**Key Points**:

1. One-to-one mapping: Each Vercel environment → One Turso database
2. Schema consistency: Same migration files applied to all databases
3. Data isolation: No sharing between databases (complete separation)
4. Sequential flow: dev → test → prod (migrations tested before production)

---

## Migration Tracking (Drizzle ORM)

While not a "data model" in the traditional sense, migration metadata is crucial for this feature:

**Drizzle Migration Metadata** (stored in each database):

```sql
-- __drizzle_migrations table (created automatically by Drizzle Kit)
CREATE TABLE __drizzle_migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);
```

**Purpose**: Tracks which migrations have been applied to each database instance.

**How it works**:

1. When `npm run db:push` runs, Drizzle checks `__drizzle_migrations`
2. Compares with files in `drizzle/migrations/` directory
3. Applies only pending migrations (not yet in metadata table)
4. Inserts new entry for each applied migration

**Example Metadata**:

```sql
-- After running migrations 0001, 0002, 0003:
SELECT * FROM __drizzle_migrations;
```

| id  | hash      | created_at |
| --- | --------- | ---------- |
| 1   | a1b2c3... | 1699001234 |
| 2   | d4e5f6... | 1699002345 |
| 3   | g7h8i9... | 1699003456 |

This ensures idempotency: Running migrations multiple times is safe.

---

## State Transitions

### Environment Lifecycle

```
┌─────────────┐
│   CREATED   │  Database created via Turso CLI
│             │  (empty, no schema)
└──────┬──────┘
       │
       │ Run initial migrations
       ▼
┌─────────────┐
│ INITIALIZED │  Schema applied, ready for data
│             │  (tables exist, but empty)
└──────┬──────┘
       │
       │ Seed test data (optional for dev/test)
       ▼
┌─────────────┐
│   ACTIVE    │  Receiving application queries
│             │  (normal operation)
└──────┬──────┘
       │
       │ New migration applied
       ▼
┌─────────────┐
│  MIGRATING  │  Schema being updated
│             │  (brief, automatic)
└──────┬──────┘
       │
       │ Migration complete
       ▼
┌─────────────┐
│   ACTIVE    │  Continues normal operation
│             │  (with updated schema)
└──────┬──────┘
       │
       │ [DEV/TEST ONLY] Reset database
       ▼
┌─────────────┐
│  DESTROYED  │  Database deleted (Turso CLI)
│             │  Can recreate from scratch
└─────────────┘
```

**State Rules**:

- Production database: Cannot transition to DESTROYED (protected)
- Dev/Test databases: Can be destroyed and recreated anytime
- All environments follow same migration path (CREATED → INITIALIZED → ACTIVE)

---

## Identity & Uniqueness

### Environment Identification

**Unique Identifiers**:

- Environment name: `'development' | 'test' | 'production'` (unique across app)
- Database URL: `libsql://wedding-{env}-{org}.turso.io` (globally unique)
- Database auth token: UUID-based token (unique per database)

**Uniqueness Constraints**:

- Cannot have two environments with the same name simultaneously
- Each environment must point to a different database URL
- Database URLs must be distinct (enforced by Turso naming)

### Migration File Identity

**Unique Identifiers**:

- Migration hash: SHA256 of file contents (stored in `__drizzle_migrations.hash`)
- Migration filename: Sequential number + descriptive name (e.g., `0001_initial.sql`)

**Uniqueness Constraints**:

- Migration hashes must be unique (Drizzle enforces)
- Migration numbers must be sequential
- Cannot apply same migration twice (idempotent via hash check)

---

## Validation Rules Summary

### EnvironmentConfig Validation

```typescript
function validateConfig(config: EnvironmentConfig): void {
  // Database URL validation
  if (!config.databaseUrl.startsWith('libsql://') && !config.databaseUrl.startsWith('http://')) {
    throw new Error('Invalid database URL format')
  }

  // Token validation (non-empty for remote DBs)
  if (config.databaseUrl.startsWith('libsql://') && !config.databaseAuthToken) {
    throw new Error('Database auth token required for remote databases')
  }

  // Production safety check
  if (config.isProduction && config.canDestroyDatabase) {
    throw new Error('Production database cannot be marked as destroyable')
  }

  // Environment consistency
  const envName = config.environment
  if (!['development', 'test', 'production'].includes(envName)) {
    throw new Error(`Invalid environment: ${envName}`)
  }
}
```

### Environment Variable Validation

**Required Variables** (all environments):

- `DATABASE_URL` - Must be valid libSQL URL
- `DATABASE_AUTH_TOKEN` - Must be non-empty (except local dev with file:// URLs)

**Optional Variables**:

- `APP_ENV` - Defaults to Vercel ENV detection or 'development'
- `VERCEL_ENV` - Automatically set by Vercel (production/preview/development)

---

## No Database Tables = No Schema Changes

**Important Note**: This data model documentation primarily describes:

1. TypeScript interfaces (code-level types)
2. Environment variable structure (configuration)
3. Logical relationships between environments and databases

**No SQL DDL required** for this feature. The existing database schema (users, wedding_configurations, etc.) remains unchanged. The only "schema" modification is the metadata table `__drizzle_migrations`, which is created automatically by Drizzle ORM.

---

**Status**: ✅ Data Model Complete - No database schema changes required
