import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppBar } from '@/components/admin/AppBar';

async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }

  return (
    <div className="flex h-full flex-col">
      <AppBar title="Dashboard" subtitle="Welcome to your wedding admin" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h2>
          <p className="text-gray-600">Dashboard content coming soon...</p>
        </div>
      </main>
    </div>
  );
}
