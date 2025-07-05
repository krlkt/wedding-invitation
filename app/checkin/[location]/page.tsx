import { Container, Typography } from '@mui/material';
import { query } from '../../db/client';
import { RSVP } from '../../models/rsvp';
import { Checkin } from '../../models/checkin';
import CheckinList from '../CheckinList';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Guest = RSVP & Partial<Pick<Checkin, 'checked_in'>>;

async function getGuests(location: string): Promise<Guest[]> {
    const { rows } = await query(
        `SELECT r.*, c.checked_in FROM rsvp r
         LEFT JOIN checkin c ON r.id = c.rsvp_id
         WHERE r.location = ? AND (r.attend IS NULL OR r.attend != 'no')`,
        [location]
    );
    return rows.map((row: any) => ({ ...row })) as Guest[];
}

export default async function CheckinPage({ params }: { params: { location: string } }) {
    const cookieStore = cookies();
    const loggedIn = cookieStore.get('loggedIn');

    if (!loggedIn || loggedIn.value !== 'true') {
        redirect(`/login?redirect=/checkin/${params.location}`);
    }

    const validLocations = ['bali', 'jakarta', 'malang'];
    const requestedLocation = params.location?.toLowerCase();

    let currentLocation = 'bali';
    if (requestedLocation && validLocations.includes(requestedLocation)) {
        currentLocation = requestedLocation;
    }

    const guests = await getGuests(currentLocation);

    return (
        <Container className="py-8">
            <Typography variant="h4" component="h1" gutterBottom>
                Guest Check-in - {currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1)}
            </Typography>
            {requestedLocation && !validLocations.includes(requestedLocation) && (
                <Typography color="error" className="mb-4">
                    Invalid location specified. Showing guests for {currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1)}.
                </Typography>
            )}
            <CheckinList initialGuests={guests} />
        </Container>
    );
}
