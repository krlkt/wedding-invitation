/**
 * Multi-tenant Admin Dashboard
 *
 * Authenticated dashboard for wedding configuration management.
 * Requires user to be logged in via session authentication.
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { db } from '@/app/lib/database'
import { userAccounts, weddingConfigurations } from '@/app/db/schema'
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
    redirect('/login?redirect=/admin')
  }

  // Get user's wedding configuration
  const weddingConfig = await getWeddingConfig(session.userId)

  if (!weddingConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Wedding Configuration Found</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have a wedding configuration yet. Please contact support to set up your wedding.
          </p>
          <LogoutButton fullWidth />
        </div>
      </div>
    )
  }

  // Render the configuration dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {weddingConfig.groomName} & {weddingConfig.brideName}
            </h1>
            <p className="text-sm text-gray-500">
              {weddingConfig.subdomain}-oialt.vercel.app
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main>
        <ConfigDashboard />
      </main>
    </div>
  )
}
