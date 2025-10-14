/**
 * T033: Authentication Service
 *
 * User authentication service with bcrypt password hashing.
 * Handles user registration, login, and session management.
 */

import { db } from './database'
import { userAccounts, type NewUserAccount } from '@/app/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

/**
 * Register a new user account
 */
export async function registerUser(email: string, password: string): Promise<{ userId: string }> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }

  // Validate password length
  if (password.length < 8) {
    throw new Error('Password too short')
  }

  // Check if email already exists
  const existingUser = await db
    .select()
    .from(userAccounts)
    .where(eq(userAccounts.email, email))
    .limit(1)

  if (existingUser.length > 0) {
    throw new Error('Email already registered')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user account
  const newUser: NewUserAccount = {
    email,
    passwordHash,
  }

  const [user] = await db.insert(userAccounts).values(newUser).returning()

  return { userId: user.id }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ userId: string; email: string } | null> {
  // Find user by email
  const [user] = await db.select().from(userAccounts).where(eq(userAccounts.email, email)).limit(1)

  if (!user) {
    return null
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return null
  }

  return {
    userId: user.id,
    email: user.email,
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const [user] = await db
    .select({
      id: userAccounts.id,
      email: userAccounts.email,
      createdAt: userAccounts.createdAt,
      updatedAt: userAccounts.updatedAt,
    })
    .from(userAccounts)
    .where(eq(userAccounts.id, userId))
    .limit(1)

  return user || null
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const [user] = await db
    .select({
      id: userAccounts.id,
      email: userAccounts.email,
      createdAt: userAccounts.createdAt,
      updatedAt: userAccounts.updatedAt,
    })
    .from(userAccounts)
    .where(eq(userAccounts.email, email))
    .limit(1)

  return user || null
}
