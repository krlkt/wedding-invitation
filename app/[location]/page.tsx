import { Metadata } from 'next';
import InvitationPage from './InvitationPage';
import UnopenedInvitationPage from './UnopenedInvitationPage';
import UnidentifiedPersonPage from './UnidentifiedPersonPage';
import NotInGuestListPage from './NotInGuestListPage';
import { notFound } from 'next/navigation';
import { Locations } from '../components/LocationComponent';
import { query } from '../db/client';
import { Wish } from '../models/wish';
import { RSVP } from '../models/rsvp';
import { LocationProvider } from '../utils/useLocation';

export const revalidate = 0;

export const metadata: Metadata = {
    title: "Karel & Sabrina's Wedding Invitation",
};

export default async function Page({
    params: { location },
    searchParams,
}: {
    params: { location: Locations };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const guestName = searchParams.to as string;
    const guestId = searchParams.id ? parseInt(searchParams.id as string) : -1;
    const wishPage = parseInt((searchParams.page as string) || '1');
    const PAGE_SIZE = 10;
    const offset = (wishPage - 1) * PAGE_SIZE;

    // Fetch wishes for current page
    const { rows: wishes } = await query<Wish>('SELECT * FROM wish ORDER BY created_at DESC LIMIT $1 OFFSET $2', [
        PAGE_SIZE,
        offset,
    ]);
    // Fetch total count of wishes
    const { rows: countResult } = await query<{ count: string }>('SELECT COUNT(*) AS count FROM wish');
    const totalCount = parseInt(countResult[0].count);
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    // Fetch Rsvp data for current guest
    const { rows } = await query<RSVP>(`SELECT * FROM rsvp WHERE id=$id AND name=$name`, {
        id: guestId,
        name: guestName,
    });
    const rsvp = rows[0];

    if (location !== 'bali' && location !== 'jakarta' && location !== 'malang') return notFound();

    if (!('to' in searchParams)) {
        return <UnidentifiedPersonPage />;
    }

    if (rows.length === 0 || !rsvp || !guestId) {
        return <NotInGuestListPage guestName={guestName} />;
    }

    return (
        <LocationProvider location={location}>
            {'opened' in searchParams ? (
                <InvitationPage
                    location={location}
                    wishes={{ wishes, wishPage, totalPages }}
                    guestName={guestName}
                    rsvp={rsvp}
                />
            ) : (
                <UnopenedInvitationPage guestName={guestName} id={guestId} />
            )}
        </LocationProvider>
    );
}
