/**
 * T061: Error Handling and Logging
 *
 * Centralized error handling utilities and custom error classes.
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR')
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'AuthorizationError'
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict error (duplicate resources)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

/**
 * File upload error
 */
export class FileUploadError extends AppError {
  constructor(message: string) {
    super(message, 400, 'FILE_UPLOAD_ERROR')
    this.name = 'FileUploadError'
  }
}

/**
 * Log error with context
 */
export function logError(error: Error, context?: Record<string, any>): void {
  console.error('[ERROR]', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Log warning
 */
export function logWarning(message: string, context?: Record<string, any>): void {
  console.warn('[WARNING]', {
    message,
    ...context,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Log info
 */
export function logInfo(message: string, context?: Record<string, any>): void {
  console.log('[INFO]', {
    message,
    ...context,
    timestamp: new Date().toISOString(),
  })
}