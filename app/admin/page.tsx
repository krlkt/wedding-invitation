/**
 * Multi-tenant Admin Dashboard
 *
 * Authenticated dashboard for wedding configuration management.
 * Requires user to be logged in via session authentication.
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { db } from '@/app/lib/database'
import { weddingConfigurations } from '@/app/db/schema'
import { eq } from 'drizzle-orm'
import ConfigDashboard from '@/app/components/ConfigDashboard'
import LogoutButton from '@/app/components/LogoutButton'

async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    return sessionData
  } catch {
    return null
  }
}

async function getWeddingConfig(userId: string) {
  const [config] = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.userId, userId))
    .limit(1)

  return config
}

export default async function AdminDashboard() {
  // Check authentication
  const session = await getSession()

  if (!session || !session.userId) {
    redirect('/admin/login')
  }

  // Get user's wedding configuration
  const weddingConfig = await getWeddingConfig(session.userId)

  if (!weddingConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">No Wedding Configuration Found</h1>
          <p className="mb-6 text-gray-600">
            You don&apos;t have a wedding configuration yet. Please contact support to set up your
            wedding.
          </p>
          <LogoutButton fullWidth />
        </div>
      </div>
    )
  }

  // Render the configuration dashboard
  return (
    <div className="flex h-full flex-col">
      <header className="flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {weddingConfig.groomName} & {weddingConfig.brideName}
            </h1>
            <p className="text-sm text-gray-500">
              {weddingConfig.subdomain}.oial-wedding.com (coming soon)
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ConfigDashboard />
      </main>
    </div>
  )
}
