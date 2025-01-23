'use server';

import { query } from '@/app/db/client';
import { Wish } from '@/app/models/wish';
import { revalidatePath } from 'next/cache';

export const addWish = async (data: Wish) => {
    await query('INSERT INTO wish (name, wish) VALUES ($name, $wish)', {
        name: data.name,
        wish: data.wish,
    });

    // Update UI
    revalidatePath('/');
};
