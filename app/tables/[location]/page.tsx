import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTablesAndGuests } from '../actions';
import TableManagementClientPage from '../TableManagementClientPage';
import { Locations } from '../../components/LocationComponent';

export default async function TableManagementPage({ params }: { params: { location: Locations } }) {
    const cookieStore = cookies();
    const loggedIn = cookieStore.get('loggedIn');

    if (!loggedIn || loggedIn.value !== 'true') {
        redirect('/login?redirect=/tables/' + params.location);
    }

    const { tables, unassignedGuests } = await getTablesAndGuests(params.location);
    const plainTables = JSON.parse(JSON.stringify(tables));
    const plainUnassignedGuests = JSON.parse(JSON.stringify(unassignedGuests));

    return <TableManagementClientPage initialTables={plainTables} initialUnassignedGuests={plainUnassignedGuests} location={params.location} />;
}
