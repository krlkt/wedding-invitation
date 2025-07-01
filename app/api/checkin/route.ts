import { query } from '../../db/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
        return NextResponse.json({ message: 'Location is required' }, { status: 400 });
    }

    try {
        const { rows } = await query(
            `SELECT r.*, c.checked_in FROM rsvp r
             LEFT JOIN checkin c ON r.id = c.rsvp_id
             WHERE r.location = ?`,
            [location]
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to fetch guests' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { rsvp_id, checked_in } = await request.json();

    if (rsvp_id === undefined || checked_in === undefined) {
        return NextResponse.json({ message: 'rsvp_id and checked_in are required' }, { status: 400 });
    }

    try {
        await query(
            `INSERT INTO checkin (rsvp_id, checked_in) VALUES (?, ?)
             ON CONFLICT(rsvp_id) DO UPDATE SET checked_in = ?`,
            [rsvp_id, checked_in, checked_in]
        );
        return NextResponse.json({ message: 'Check-in status updated' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to update check-in status' }, { status: 500 });
    }
}
