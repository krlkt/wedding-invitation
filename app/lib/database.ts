/**
 * T032: Database Connection Service
 *
 * Centralized Drizzle ORM database connection service with Turso.
 * Provides singleton database instance for use throughout the application.
 */

import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '@/db/schema'

// Validate required environment variables
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL environment variable is required')
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN environment variable is required')
}

// Create Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Create Drizzle instance with schema
export const db = drizzle(client, { schema })

// Type exports for convenience
export type Database = typeof db
export { schema }