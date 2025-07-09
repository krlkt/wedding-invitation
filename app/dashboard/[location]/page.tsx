import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getParticipants } from '../action';
import DashboardClientPage from '../DashboardClientPage';

export default async function LocationDashboardPage({ params }: { params: { location: string } }) {
    const cookieStore = cookies();
    const loggedIn = cookieStore.get('loggedIn');

    if (!loggedIn || loggedIn.value !== 'true') {
        redirect('/login?redirect=/dashboard/' + params.location);
    }

    const data = await getParticipants(params.location);
    return <DashboardClientPage initialData={data} />;
}