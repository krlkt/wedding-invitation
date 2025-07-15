import { query } from '@/app/db/client';
import { NextResponse } from 'next/server';

export async function GET() {
    const { rows } = await query<{ id: number; name: string }>('SELECT * FROM groups');
    return NextResponse.json(rows);
}

export async function POST(request: Request) {
    const { name } = await request.json();
    await query('INSERT INTO groups (name) VALUES (?)', [name]);
    return NextResponse.json({ message: 'Group created successfully' });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    await query('DELETE FROM groups WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Group deleted successfully' });
}