import type { Config } from 'drizzle-kit'
import { config as dotenvConfig } from 'dotenv'

// Load environment variables
dotenvConfig()

export default {
  schema: './app/db/schema/*',
  out: './app/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
} satisfies Config
