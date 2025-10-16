'use server'

import { query } from '@/app/db/client'
import { Wish } from '@/app/models/wish'
import { revalidatePath } from 'next/cache'

export const addWish = async (data: Wish) => {
  await query(
    'INSERT INTO wish (name, wish, created_by_id, created_at) VALUES ($name, $wish, $created_by_id, CURRENT_TIMESTAMP)',
    {
      name: data.name,
      wish: data.wish,
      created_by_id: data.created_by_id,
    }
  )

  // Update UI
  revalidatePath('/')
}
