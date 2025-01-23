import { Metadata } from 'next';
import InvitationPage from './InvitationPage';
import UnopenedInvitationPage from './UnopenedInvitationPage';
import UnidentifiedPersonPage from './UnidentifiedPersonPage';
import NotInGuestListPage from './NotInGuestListPage';
import { notFound } from 'next/navigation';
import { baliGuests, jakartaGuests, malangGuests } from '../utils/guestList';
import { Locations } from '../components/LocationComponent';
import { query } from '../db/client';
import { Wish } from '../models/wish';

export const revalidate = 0;

export const metadata: Metadata = {
    title: "Karel & Sabrina's Wedding Invitation",
};

export default async function Page({
    params,
    searchParams,
}: {
    params: { location: Locations };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const guestName = searchParams.to as string;

    const { rows: wishes } = await query<Wish>('SELECT * FROM wish');

    if (
        params.location !== 'bali' &&
        params.location !== 'jakarta' &&
        params.location !== 'malang'
    )
        return notFound();

    if (!('to' in searchParams)) {
        return <UnidentifiedPersonPage />;
    }

    if (!isInGuestList(params.location, guestName)) {
        return <NotInGuestListPage guestName={guestName} />;
    }

    return 'opened' in searchParams ? (
        <InvitationPage location={params.location} wishes={wishes} />
    ) : (
        <UnopenedInvitationPage guestName={guestName} />
    );
}

function isInGuestList(location: string, guestName: string) {
    switch (location) {
        case 'bali':
            return baliGuests.includes(guestName);
        case 'jakarta':
            return jakartaGuests.includes(guestName);
        case 'malang':
            return malangGuests.includes(guestName);
        default:
            return false;
    }
}
