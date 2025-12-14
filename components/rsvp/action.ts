'use server';

import { revalidatePath } from 'next/cache';

import { query } from '@/db/client';
import { RSVP } from '@/legacy/types/rsvp';

export const addRSVP = async (data: RSVP) => {
  await query(
    `INSERT OR REPLACE INTO rsvp (name, attend, guest_number, notes)
        VALUES ($name, $attend, $guest_number, $notes);`,
    {
      name: data.name,
      attend: data.attend,
      guest_number: data.guest_number,
      notes: data.notes,
    }
  );

  // Update UI
  revalidatePath('/');
};
