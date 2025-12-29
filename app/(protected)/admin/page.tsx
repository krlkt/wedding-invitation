/**
 * Multi-tenant Admin Dashboard
 *
 * Authenticated dashboard for wedding configuration management.
 * Requires user to be logged in via session authentication.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { eq } from 'drizzle-orm';

import ConfigDashboard from '@/components/admin/ConfigDashboard';
import { AppBar } from '@/components/admin/AppBar';
import LogoutButton from '@/components/LogoutButton';
import { Button } from '@/components/shadcn/button';
import { weddingConfigurations } from '@/db/schema';
import { db } from '@/lib/database';

async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value);
    return sessionData;
  } catch {
    return null;
  }
}

async function getWeddingConfig(userId: string) {
  const [config] = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.userId, userId))
    .limit(1);

  return config;
}

export default async function AdminDashboard() {
  // Check authentication
  const session = await getSession();

  if (!session?.userId) {
    redirect('/login');
  }

  // Get user's wedding configuration
  const weddingConfig = await getWeddingConfig(session.userId);

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
    );
  }

  // Render the configuration dashboard
  return (
    <div className="flex h-full flex-col">
      <AppBar
        title={`${weddingConfig.groomName} & ${weddingConfig.brideName}`}
        subtitle={`${weddingConfig.subdomain}.oial-wedding.com (coming soon)`}
        actions={
          <Button asChild>
            <Link href="/preview" target="_blank">
              View Live Site
            </Link>
          </Button>
        }
      />

      <main className="flex-1 overflow-hidden">
        <ConfigDashboard />
      </main>
    </div>
  );
}
