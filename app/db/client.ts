import { Client, createClient, InArgs } from '@libsql/client'
import { getConfig } from '@/app/lib/env-config'

let client: Client

const getDatabaseClient = () => {
  // Use environment-aware configuration (T016)
  const config = getConfig()

  const client = createClient({
    url: config.databaseUrl,
    authToken: config.databaseAuthToken,
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
