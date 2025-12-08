'use server'

import { revalidatePath } from 'next/cache'

import { query } from '@/app/db/client'
import { RSVP, RSVPForm } from '@/app/models/rsvp'

import { Guest } from '@/app/models/guest'

const VALID_LOCATIONS = ['jakarta', 'bali', 'malang']
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || `https://oial.vercel.app`

export const updateLink = async (data: RSVPForm) => {
  let participantId = data.id

  // get last inserted id of new participant
  if (!participantId) {
    const { rows } = await query<{ id: number }>('SELECT last_insert_rowid() as id')
    participantId = rows[0]?.id
  }

  const link = `${BASE_URL}/${data.location}?to=${data.name?.trim().replace(/ /g, '+')}&id=${participantId}`

  await query(
    `
        UPDATE rsvp 
        SET link = $link
        WHERE id = $id
    `,
    {
      link,
      id: participantId,
    }
  )
}

export const addParticipant = async (data: RSVPForm) => {
  // Validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    throw new Error(`Invalid name in row: ${JSON.stringify(data)}`)
  }

  if (!data.location || typeof data.location !== 'string') {
    throw new Error(`Missing location in row: ${JSON.stringify(data)} for guest ${data.name}`)
  }

  const locations = data.location.split(',').map((loc) => loc.trim().toLowerCase())
  const invalidLocations = locations.filter((loc) => !VALID_LOCATIONS.includes(loc))

  if (invalidLocations.length > 0) {
    throw new Error(`Invalid location ${JSON.stringify(data)}`)
  }

  if (typeof data.max_guests !== 'number' || !data.max_guests || data.max_guests === 0) {
    throw new Error(`Invalid max guests`)
  }

  if (
    data.guest_number &&
    typeof data.guest_number === 'number' &&
    data.guest_number > data.max_guests
  ) {
    throw new Error(`Maximal guest number was reached for row ${data}`)
  }

  if (data.location !== 'bali') {
    data.food_choice = null
  }

  let group = data.group
  if (data.id && group === undefined) {
    const { rows } = await query<{ group: string | undefined }>(
      'SELECT "group" FROM rsvp WHERE id = ?',
      [data.id]
    )
    if (rows.length > 0) {
      group = rows[0].group
    }
  }

  await query(
    `
        INSERT INTO rsvp (id, name, attend, max_guests, guest_number, notes, location, food_choice, "group", possibly_not_coming)
        VALUES ($id, $name, $attend, $max_guests, $guest_number, $notes, $location, $food_choice, $group, $possibly_not_coming)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            attend = excluded.attend,
            max_guests= excluded.max_guests,
            guest_number = excluded.guest_number,
            notes = excluded.notes,
            food_choice=excluded.food_choice,
            location = excluded.location,
            "group" = excluded."group",
            possibly_not_coming = excluded.possibly_not_coming;
        `,
    {
      id: data.id ?? null, // pass null if undefined to allow auto-increment
      name: data.name.trim(),
      attend: data.attend ?? null,
      max_guests: data.max_guests,
      guest_number: data.guest_number ?? null,
      notes: data.notes ?? null,
      food_choice: data.food_choice ?? null,
      location: data.location,
      group: group ?? null,
      possibly_not_coming: data.possibly_not_coming ?? false,
    }
  )

  await updateLink(data)

  // Synchronize guests
  const { rows: rsvps } = await query<RSVP>('SELECT * FROM rsvp WHERE name = ? AND location = ?', [
    data.name.trim(),
    data.location,
  ])
  const rsvp = rsvps[0]

  if (rsvp) {
    if (rsvp.attend?.toLowerCase() === 'no') {
      await query('DELETE FROM guests WHERE rsvp_id = ?', [rsvp.id])
    } else {
      const { rows: existingGuests } = await query<Guest>(
        'SELECT * FROM guests WHERE rsvp_id = ?',
        [rsvp.id]
      )
      const targetGuestCount =
        rsvp.attend?.toLowerCase() === 'yes' ? rsvp.guest_number : rsvp.max_guests
      const guestsToCreate = targetGuestCount - existingGuests.length

      if (guestsToCreate > 0) {
        for (let i = 0; i < guestsToCreate; i++) {
          const guestName =
            existingGuests.length + i === 0
              ? rsvp.name
              : `${rsvp.name} +${existingGuests.length + i}`
          await query('INSERT INTO guests (rsvp_id, name) VALUES (?, ?)', [rsvp.id, guestName])
        }
      } else if (guestsToCreate < 0) {
        const guestsToDelete = existingGuests.slice(guestsToCreate)
        for (const guest of guestsToDelete) {
          await query('DELETE FROM guests WHERE id = ?', [guest.id])
        }
      }
    }
  }

  // Update UI
  revalidatePath('/')
}

export const getParticipants = async (location?: string) => {
  let queryString = `SELECT * FROM rsvp`
  const params: (string | number)[] = []

  if (location) {
    queryString += ` WHERE location = ?`
    params.push(location)
  }

  queryString += ` ORDER BY id DESC`

  const { rows } = await query<RSVP>(queryString, params)
  // Update UI
  revalidatePath('/')
  return rows
}

export const deleteParticipant = async (id: string) => {
  await query(`DELETE FROM guests WHERE rsvp_id = ?`, [id])
  await query(`DELETE FROM rsvp WHERE id = ?`, [id])
  revalidatePath('/')
}

export const importDataFromExcel = async (rows: any[]) => {
  const errors: string[] = []
  let total = rows.length

  for (const row of rows) {
    try {
      if (row.group) {
        await query('INSERT INTO groups (name) VALUES ($name) ON CONFLICT(name) DO NOTHING', {
          name: row.group,
        })
      }

      await addParticipant({
        name: row.name,
        attend: row.attend ?? null,
        max_guests: row.max_guests ?? 2,
        guest_number: row.guest_number ? Number(row.guest_number) : undefined,
        notes: row.notes ?? null,
        food_choice: row.food_choice ?? null,
        location: row.location,
        group: row.group ?? null,
      })
    } catch (err: any) {
      total--
      console.error('Error:', err.message)
      errors.push(err.message)
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `${total} participants of total ${rows.length} were added. \n Some rows were skipped:\n\n${errors.join(
        '\n'
      )}`
    )
  }
}

export const updatePossiblyNotComing = async (id: number, possibly_not_coming: boolean) => {
  await query(
    `
        UPDATE rsvp 
        SET possibly_not_coming = $possibly_not_coming
        WHERE id = $id
    `,
    {
      possibly_not_coming,
      id,
    }
  )
  revalidatePath('/')
}
