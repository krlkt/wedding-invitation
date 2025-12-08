/**
 * Environment Configuration Module
 * Handles environment detection and configuration management
 * Supports three environments: development, test, production
 */

// T013: Type definitions and interfaces
export type AppEnvironment = 'development' | 'test' | 'production'

export interface EnvironmentConfig {
  environment: AppEnvironment
  databaseUrl: string
  databaseAuthToken: string
  vercelEnv?: 'production' | 'preview' | 'development'
  isProduction: boolean
  canDestroyDatabase: boolean
}

// T014: Environment detection logic
export function getEnvironment(): AppEnvironment {
  // Priority 1: Explicit APP_ENV override
  const appEnv = process.env.APP_ENV as AppEnvironment | undefined
  if (appEnv && ['development', 'test', 'production'].includes(appEnv)) {
    return appEnv
  }

  // Priority 2: VERCEL_ENV automatic detection
  const vercelEnv = process.env.VERCEL_ENV
  if (vercelEnv === 'production') {
    return 'production'
  }
  if (vercelEnv === 'preview') {
    return 'test'
  }

  // Priority 3: Default to development
  return 'development'
}

// T015: Config validation function
function validateConfig(config: EnvironmentConfig): void {
  // Validate DATABASE_URL format
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const validProtocols = ['libsql://', 'http://', 'https://']
  const hasValidProtocol = validProtocols.some((protocol) =>
    config.databaseUrl.startsWith(protocol)
  )

  if (!hasValidProtocol) {
    throw new Error(
      `DATABASE_URL must start with one of: ${validProtocols.join(', ')}. Got: ${config.databaseUrl}`
    )
  }

  // Validate auth token for remote databases
  const isRemoteDatabase = config.databaseUrl.startsWith('libsql://')
  if (isRemoteDatabase && !config.databaseAuthToken) {
    throw new Error('DATABASE_AUTH_TOKEN is required for remote databases (libsql://)')
  }

  // Validate production safety
  if (config.isProduction && config.canDestroyDatabase) {
    throw new Error(
      'CRITICAL: Production database cannot be marked as destroyable. This is a safety violation.'
    )
  }
}

function validateSecurity(): void {
  // Check for NEXT_PUBLIC_ prefix misuse on sensitive variables
  const sensitiveVars = [
    'DATABASE_URL',
    'DATABASE_AUTH_TOKEN',
    'TURSO_DATABASE_URL',
    'TURSO_AUTH_TOKEN',
  ]

  sensitiveVars.forEach((varName) => {
    const publicVarName = `NEXT_PUBLIC_${varName}`
    if (process.env[publicVarName]) {
      console.warn(
        `⚠️  SECURITY WARNING: ${publicVarName} detected! ` +
          `Sensitive database credentials should NOT use NEXT_PUBLIC_ prefix as they will be exposed to the client. ` +
          `Use ${varName} instead (server-only).`
      )
    }
  })
}

// Main configuration getter
export function getConfig(): EnvironmentConfig {
  // Run security validation
  validateSecurity()

  const environment = getEnvironment()

  // Support both new and legacy environment variable naming
  const databaseUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || ''
  const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || ''

  const config: EnvironmentConfig = {
    environment,
    databaseUrl,
    databaseAuthToken,
    vercelEnv: process.env.VERCEL_ENV as 'production' | 'preview' | 'development' | undefined,
    isProduction: environment === 'production',
    canDestroyDatabase: environment !== 'production', // Only dev/test can be destroyed
  }

  // Validate configuration
  validateConfig(config)

  return config
}

// Helper function to check if running in specific environment
export function isDevelopment(): boolean {
  return getEnvironment() === 'development'
}

export function isTest(): boolean {
  return getEnvironment() === 'test'
}

export function isProduction(): boolean {
  return getEnvironment() === 'production'
}
