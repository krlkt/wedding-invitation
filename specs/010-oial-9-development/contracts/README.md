# API Contracts: Development and Testing Environment

**Feature**: OIAL-9 Development and Testing Environment
**Phase**: Phase 1 - Design
**Date**: 2025-11-03

## Overview

This feature implements infrastructure-level changes (environment separation, database configuration, deployment setup) and **does not introduce new API endpoints**. Therefore, no new API contracts are required.

---

## Existing API Enhancements

While no new endpoints are created, one existing endpoint will be enhanced to expose environment information:

### Enhanced Endpoint: GET /api/health

**Purpose**: Health check endpoint that now includes environment information for debugging and verification.

**Current Implementation**: Basic health check returning `{ status: 'ok' }`

**Enhanced Implementation**:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { getConfig } from '@/app/lib/env-config';

export async function GET() {
  const config = getConfig();

  return NextResponse.json({
    status: 'ok',
    environment: config.environment,
    database: config.databaseUrl ? 'connected' : 'error',
    timestamp: new Date().toISOString(),
  });
}
```

**Request**:

```http
GET /api/health HTTP/1.1
Host: localhost:3000
```

**Response** (Development):

```json
{
  "status": "ok",
  "environment": "development",
  "database": "connected",
  "timestamp": "2025-11-03T10:30:00.000Z"
}
```

**Response** (Test):

```json
{
  "status": "ok",
  "environment": "test",
  "database": "connected",
  "timestamp": "2025-11-03T10:30:00.000Z"
}
```

**Response** (Production):

```json
{
  "status": "ok",
  "environment": "production",
  "database": "connected",
  "timestamp": "2025-11-03T10:30:00.000Z"
}
```

**Status Codes**:

- `200 OK`: Service is healthy
- `500 Internal Server Error`: Database connection failed

**Security Note**: This endpoint does NOT expose sensitive information (database URLs, tokens, etc.). It only shows the environment name, which is useful for debugging deployment issues.

---

## No New Authentication/Authorization

This feature does not change authentication or authorization mechanisms:

- Existing authentication remains unchanged (cookie-based sessions)
- No new protected routes
- No changes to existing API route protection

---

## No New Data Validation Schemas

Since this is an infrastructure feature:

- No new request/response schemas
- No new validation rules for API payloads
- No changes to existing API contracts

---

## Database API (Indirect)

While not traditional API contracts, this feature establishes patterns for database connection management:

### Database Connection Interface

**Internal API** (used by application code, not exposed via HTTP):

```typescript
// app/db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { getConfig } from '@/app/lib/env-config';

// Environment-aware database connection
export function getDatabaseClient() {
  const config = getConfig();

  const client = createClient({
    url: config.databaseUrl,
    authToken: config.databaseAuthToken,
  });

  return drizzle(client);
}

export const db = getDatabaseClient();
```

**Usage** (Server Components, API Routes, Server Actions):

```typescript
import { db } from '@/app/db';

// Automatically uses correct database based on environment
const users = await db.select().from(usersTable);
```

**Environment Resolution**:

- Development: Connects to `wedding-dev` database
- Test: Connects to `wedding-test` database
- Production: Connects to `wedding-prod` database

**Connection Pooling**: Handled automatically by Turso (no explicit pooling required)

---

## Contract Testing Strategy

Since there are no new API endpoints, contract tests for this feature focus on:

### 1. Environment Detection Contracts

**Test**: Verify environment is correctly detected based on configuration

```typescript
// __tests__/contracts/environment-detection.test.ts
describe('Environment Detection Contract', () => {
  it('should detect development environment from env vars', () => {
    process.env.APP_ENV = 'development';
    const config = getConfig();
    expect(config.environment).toBe('development');
  });

  it('should detect test environment from Vercel preview', () => {
    process.env.VERCEL_ENV = 'preview';
    const config = getConfig();
    expect(config.environment).toBe('test');
  });

  it('should detect production environment from Vercel production', () => {
    process.env.VERCEL_ENV = 'production';
    const config = getConfig();
    expect(config.environment).toBe('production');
  });
});
```

### 2. Database Connection Contracts

**Test**: Verify database connection uses correct environment-specific URL

```typescript
// __tests__/contracts/database-connection.test.ts
describe('Database Connection Contract', () => {
  it('should connect to development database in dev environment', () => {
    process.env.APP_ENV = 'development';
    process.env.DATABASE_URL = 'libsql://wedding-dev.turso.io';

    const config = getConfig();
    expect(config.databaseUrl).toContain('wedding-dev');
  });

  it('should connect to test database in test environment', () => {
    process.env.APP_ENV = 'test';
    process.env.DATABASE_URL = 'libsql://wedding-test.turso.io';

    const config = getConfig();
    expect(config.databaseUrl).toContain('wedding-test');
  });

  it('should connect to production database in production environment', () => {
    process.env.VERCEL_ENV = 'production';
    process.env.DATABASE_URL = 'libsql://wedding-prod.turso.io';

    const config = getConfig();
    expect(config.databaseUrl).toContain('wedding-prod');
  });
});
```

### 3. Health Endpoint Contract

**Test**: Verify health endpoint returns correct environment information

```typescript
// __tests__/contracts/health-endpoint.test.ts
describe('Health Endpoint Contract', () => {
  it('GET /api/health returns environment information', async () => {
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      status: 'ok',
      environment: expect.stringMatching(/^(development|test|production)$/),
      database: expect.stringMatching(/^(connected|error)$/),
      timestamp: expect.any(String),
    });
  });
});
```

---

## No OpenAPI/GraphQL Schemas

This feature does not require:

- OpenAPI (Swagger) specifications (no REST API changes)
- GraphQL schema definitions (not using GraphQL)
- Protocol Buffers (not using gRPC)

The existing API surface remains unchanged except for the enhanced `/api/health` endpoint.

---

## Integration Points

While not traditional API contracts, this feature affects how the application integrates with external services:

### Turso Database Service

**"Contract"** (expected behavior from Turso):

- Accepts libSQL protocol connections
- Authenticates via bearer token in HTTP header
- Applies migrations idempotently via hash tracking
- Supports concurrent connections (pooling on Turso side)

**SLA Expectations** (from Turso documentation):

- 99.9% uptime
- <100ms query latency (p50)
- Automatic backups (production database)

### Vercel Deployment Service

**"Contract"** (expected behavior from Vercel):

- Injects `VERCEL_ENV` variable automatically
- Provides isolated preview deployments per PR
- Runs build command before deployment
- Serves environment-specific variables securely

**SLA Expectations** (from Vercel documentation):

- 99.99% uptime (Enterprise)
- Global edge network (<100ms CDN)
- Automatic HTTPS certificates

---

## Backward Compatibility

**No Breaking Changes**: This feature is fully backward compatible with existing code:

- Existing API endpoints continue to work unchanged
- Database queries use same ORM interface (Drizzle)
- Environment detection is additive (existing code works without changes)

**Migration Path**:

1. ✅ New environment configuration is opt-in (via env vars)
2. ✅ If env vars not set, defaults to original behavior (single database)
3. ✅ Gradual migration possible (can add environments one at a time)

---

## Summary

**New API Endpoints**: 0
**Modified API Endpoints**: 1 (enhanced `/api/health` with environment info)
**Deprecated API Endpoints**: 0
**Breaking Changes**: 0

**Contract Testing Required**:

- ✅ Environment detection contracts
- ✅ Database connection contracts
- ✅ Health endpoint contracts
- ❌ No traditional REST/GraphQL API contracts needed

---

**Status**: ✅ No new API contracts required - Infrastructure feature only
