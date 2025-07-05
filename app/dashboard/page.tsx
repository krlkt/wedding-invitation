import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardPage from './DashboardPage';

export default async function Page() {
    const cookieStore = cookies();
    const loggedIn = cookieStore.get('loggedIn');

    if (!loggedIn || loggedIn.value !== 'true') {
        redirect('/login?redirect=/dashboard');
    }

    return <DashboardPage />;
}
