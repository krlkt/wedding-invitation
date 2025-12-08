import type { Config } from 'drizzle-kit'
import { config as dotenvConfig } from 'dotenv'

// Load environment variables
dotenvConfig()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

if (!process.env.DATABASE_AUTH_TOKEN) {
  throw new Error('DATABASE_AUTH_TOKEN environment variable is required')
}

export default {
  schema: './db/schema/*',
  out: './db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config
