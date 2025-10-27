import { notFound } from 'next/navigation'

import { Metadata } from 'next'

import { Locations } from '../components/LocationComponent'
import { query } from '../db/client'
import { RSVP } from '../models/rsvp'
import { Wish } from '../models/wish'
import { GuestIdProvider } from '../utils/useGuestId'
import { LocationProvider } from '../utils/useLocation'

import InvitationPage from './InvitationPage'
import NotInGuestListPage from './NotInGuestListPage'
import UnidentifiedPersonPage from './UnidentifiedPersonPage'
import UnopenedInvitationPage from './UnopenedInvitationPage'

export const revalidate = 0

export const metadata: Metadata = {
  title: "Karel & Sabrina's Wedding Invitation",
}

export default async function Page({
  params: { location },
  searchParams,
}: {
  params: { location: Locations }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  if (!('to' in searchParams)) {
    return <UnidentifiedPersonPage />
  }

  const guestName = searchParams.to as string
  const guestId = searchParams.id ? parseInt(searchParams.id as string) : -1
  const wishPage = parseInt((searchParams.page as string) || '1')
  const PAGE_SIZE = 10
  const offset = (wishPage - 1) * PAGE_SIZE

  // Fetch wishes for current page
  const { rows: rawWishes } = await query<Wish>(
    'SELECT * FROM wish ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [PAGE_SIZE, offset]
  )
  const wishes = JSON.parse(JSON.stringify(rawWishes))

  // Fetch total count of wishes
  const { rows: countResult } = await query<{ count: string }>('SELECT COUNT(*) AS count FROM wish')
  const totalCount = parseInt(countResult[0].count)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  // Fetch Rsvp data for current guest
  const { rows } = await query<RSVP>(
    `SELECT * FROM rsvp WHERE id=$id AND name=$name AND location=$location`,
    {
      id: guestId,
      name: guestName,
      location,
    }
  )

  const rawRsvp = rows[0]
  if (rows.length === 0 || !rawRsvp || !guestId) {
    return <NotInGuestListPage guestName={guestName} />
  }

  // This is needed because Next is complaining that "Only plain objects can be passed to Client Components from Server Components"
  const rsvp = JSON.parse(JSON.stringify(rawRsvp))

  if (location !== 'bali' && location !== 'jakarta' && location !== 'malang') {return notFound()}

  return (
    <LocationProvider location={location}>
      <GuestIdProvider id={guestId}>
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
      </GuestIdProvider>
    </LocationProvider>
  )
}
