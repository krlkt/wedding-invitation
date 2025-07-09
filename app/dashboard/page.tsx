import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getParticipants } from './action';
import DashboardClientPage from './DashboardClientPage';

export default async function DashboardPage() {
    const cookieStore = cookies();
    const loggedIn = cookieStore.get('loggedIn');

    if (!loggedIn || loggedIn.value !== 'true') {
        redirect('/login?redirect=/dashboard');
    }

    const data = await getParticipants();
    return <DashboardClientPage initialData={data} />;
}