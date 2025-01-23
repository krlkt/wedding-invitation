'use server';

import { query } from '@/app/db/client';
import { revalidatePath } from 'next/cache';

export const addWish = async (formData: FormData) => {
    // extract data from the form
    const name = formData.get('name') as string;
    const wish = formData.get('wish') as string;

    await query('INSERT INTO wish (name, wish) VALUES ($name, $wish)', {
        name,
        wish,
    });

    // Update UI
    revalidatePath('/');
};
