'use server'

import { revalidatePath } from 'next/cache'

import { query } from '@/db/client'
import { Guest } from '@/legacy/types/guest'
import { RSVP } from '@/legacy/types/rsvp'
import { Table } from '@/legacy/types/table'

export const synchronizeGuests = async (location: string) => {
  // Fetch all RSVPs for the given location that are not marked as 'no'
  const { rows: rsvps } = await query<RSVP>(
    `SELECT * FROM rsvp WHERE location = ? AND (attend IS NULL OR attend != 'no')`,
    [location]
  )

  for (const rsvp of rsvps) {
    // Check how many guests already exist for this RSVP
    const { rows: existingGuests } = await query<Guest>('SELECT * FROM guests WHERE rsvp_id = ?', [
      rsvp.id,
    ])

    const guestsToCreate =
      (rsvp.attend === 'yes' ? rsvp.guest_number : rsvp.max_guests) - existingGuests.length

    if (guestsToCreate > 0) {
      for (let i = existingGuests.length; i < guestsToCreate; i++) {
        const guestName = i === 0 ? rsvp.name : `${rsvp.name} +${i}`
        await query('INSERT INTO guests (rsvp_id, name) VALUES (?, ?)', [rsvp.id, guestName])
      }
    }
  }
}

export const getTablesAndGuests = async (
  location: string
): Promise<{ tables: Table[]; unassignedGuests: Guest[] }> => {
  const { rows: tables } = await query<Table>(
    'SELECT * FROM tables WHERE location = ? ORDER BY name ASC',
    [location]
  )
  const { rows: rawGuests } = await query<any>(
    'SELECT guests.id, guests.rsvp_id, guests.name, guests.table_id, rsvp.name as rsvp_name, guests.checked_in FROM guests JOIN rsvp ON guests.rsvp_id = rsvp.id WHERE rsvp.location = ?',
    [location]
  )

  const guests: Guest[] = rawGuests.map((row: any) => ({
    id: row.id,
    rsvp_id: row.rsvp_id,
    name: row.name,
    table_id: row.table_id,
    rsvp_name: row.rsvp_name,
    checked_in: row.checked_in === 1, // Convert to boolean
  }))

  const tablesWithGuests = tables.map((table) => ({
    ...table,
    guests: guests.filter((guest) => guest.table_id === table.id),
  }))

  const unassignedGuests = guests.filter((guest) => guest.table_id === null)

  return {
    tables: tablesWithGuests,
    unassignedGuests,
  }
}

export const createTable = async (name: string, max_guests: number, location: string) => {
  await query('INSERT INTO tables (name, max_guests, location) VALUES (?, ?, ?)', [
    name,
    max_guests,
    location,
  ])
  revalidatePath(`/tables/${location}`)
}

export const updateTableName = async (id: number, name: string, location: string) => {
  await query('UPDATE tables SET name = ? WHERE id = ?', [name, id])
  revalidatePath(`/tables/${location}`)
}

export const updateTableMaxGuests = async (id: number, max_guests: number, location: string) => {
  await query('UPDATE tables SET max_guests = ? WHERE id = ?', [max_guests, id])
  revalidatePath(`/tables/${location}`)
}

export const deleteTable = async (id: number, location: string) => {
  await query('DELETE FROM tables WHERE id = ?', [id])
  revalidatePath(`/tables/${location}`)
}

export const moveGuestToTable = async (
  guestId: number,
  tableId: number | null,
  location: string
) => {
  await query('UPDATE guests SET table_id = ? WHERE id = ?', [tableId, guestId])
  revalidatePath(`/tables/${location}`)
}

export const updateGuestName = async (guestId: number, name: string, location: string) => {
  await query('UPDATE guests SET name = ? WHERE id = ?', [name, guestId])
  revalidatePath(`/tables/${location}`)
}

export const updateGuestCheckinStatus = async (
  guestId: number,
  isChecked: boolean,
  location: string
) => {
  await query('UPDATE guests SET checked_in = ? WHERE id = ?', [isChecked, guestId])
  revalidatePath(`/tables/${location}`)
}
