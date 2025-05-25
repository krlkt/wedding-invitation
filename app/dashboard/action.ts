'use server';

import { query } from '@/app/db/client';
import { RSVP, RSVPForm } from '@/app/models/rsvp';
import { revalidatePath } from 'next/cache';

const VALID_LOCATIONS = ['jakarta', 'bali', 'malang'];

export const addParticipant = async (data: RSVPForm) => {
    // Validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        throw new Error(`Invalid name in row: ${JSON.stringify(data)}`);
    }

    if (!data.location || typeof data.location !== 'string') {
        throw new Error(`Missing location in row: ${JSON.stringify(data)} for guest ${data.name}`);
    }

    const locations = data.location.split(',').map((loc) => loc.trim().toLowerCase());
    const invalidLocations = locations.filter((loc) => !VALID_LOCATIONS.includes(loc));

    if (invalidLocations.length > 0) {
        throw new Error(`Invalid location(s) "${invalidLocations.join(', ')}" ${JSON.stringify(data)}`);
    }

    if (typeof data.max_guests !== 'number' || !data.max_guests || data.max_guests === 0) {
        throw new Error(`Invalid max guests`);
    }

    await query(
        `
        INSERT INTO rsvp (id, name, attend, max_guests, guest_number, notes, location)
        VALUES ($id, $name, $attend, $max_guests, $guest_number, $notes, $location)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            attend = excluded.attend,
            max_guests= excluded.max_guests,
            guest_number = excluded.guest_number,
            notes = excluded.notes,
            location = excluded.location;
        `,
        {
            id: data.id ?? null, // pass null if undefined to allow auto-increment
            name: data.name,
            attend: data.attend ?? null,
            max_guests: data.max_guests,
            guest_number: data.guest_number ?? null,
            notes: data.notes ?? null,
            location: data.location,
        }
    );

    // Update UI
    revalidatePath('/');
};

export const getParticipants = async () => {
    const { rows } = await query<RSVP>(`SELECT * FROM rsvp ORDER BY id DESC`);
    // Update UI
    revalidatePath('/');
    return rows;
};

export const deleteParticipant = async (id: string) => {
    await query(`DELETE FROM rsvp WHERE id = ?`, [id]);
    revalidatePath('/');
};

export const importDataFromExcel = async (rows: any[]) => {
    const errors: string[] = [];

    for (const row of rows) {
        try {
            await addParticipant({
                name: row.name,
                attend: row.attend ?? null,
                max_guests: row.max_guests ?? 2,
                guest_number: row.guest_number ? Number(row.guest_number) : undefined,
                notes: row.notes ?? null,
                location: row.location,
            });
        } catch (err: any) {
            console.error('Skipping row due to error:', err.message);
            errors.push(err.message);
        }
    }

    if (errors.length > 0) {
        throw new Error(`Some rows were skipped due to validation errors:\n\n${errors.join('\n')}`);
    }
};
