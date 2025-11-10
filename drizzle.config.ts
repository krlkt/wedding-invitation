import type { Config } from 'drizzle-kit'
import { config as dotenvConfig } from 'dotenv'

// Load environment variables
dotenvConfig()

export default {
  schema: './app/db/schema/*',
  out: './app/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    // Support both new and legacy naming conventions (T018)
    url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
} satisfies Config
