import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function CheckinPage() {
    const cookieStore = cookies();
    const loggedIn = cookieStore.get('loggedIn');

    if (!loggedIn || loggedIn.value !== 'true') {
        redirect('/login?redirect=/checkin');
    }

    redirect('/checkin/bali');
}
