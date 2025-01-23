'use server';

import { query } from '@/app/db/client';
import { RSVP } from '@/app/models/rsvp';
import { revalidatePath } from 'next/cache';

export const addRSVP = async (data: RSVP) => {
    await query(
        `INSERT OR REPLACE INTO rsvp (name, attend, guest_number)
        VALUES ($name, $attend, $guest_number);`,
        {
            name: data.name,
            attend: data.attend,
            guest_number: data.guest_number,
        }
    );
};
