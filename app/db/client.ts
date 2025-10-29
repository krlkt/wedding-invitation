import { Client, createClient, InArgs } from '@libsql/client'

let client: Client

const getDatabaseClient = () => {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) {
    throw new Error('Database URL not found on env variable!')
  }
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  return client
}

import { createGroupsTable } from './migrations'

const initializeClient = () => {
  if (!client) {
    client = getDatabaseClient()
    createGroupsTable()
  }
  return client
}

type DBRows<T> = { rows: T[] }

export async function query<T>(sql: string, args?: InArgs): Promise<DBRows<T>> {
  const client = initializeClient()
  const result = args ? await client.execute({ sql, args }) : await client.execute(sql)
  return { rows: result.rows as T[] }
}
