/**
 * T032: Database Connection Service
 *
 * Centralized Drizzle ORM database connection service with Turso.
 * Provides singleton database instance for use throughout the application.
 */

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '@/db/schema';
import { getConfig } from '@/lib/env-config';

// Get environment-aware configuration
// This supports both DATABASE_URL and TURSO_DATABASE_URL (for backwards compatibility)
const config = getConfig();

// Create Turso client with environment-aware configuration
const client = createClient({
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
});

// Create Drizzle instance with schema
export const db = drizzle(client, { schema });

// Type exports for convenience
export type Database = typeof db;
export { schema };
