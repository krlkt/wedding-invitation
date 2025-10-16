import { config } from 'dotenv'
import { createClient } from '@libsql/client'

config()

async function checkCounts() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })

  const counts = await Promise.all([
    client.execute('SELECT COUNT(*) as count FROM rsvps_new'),
    client.execute('SELECT COUNT(*) as count FROM guests_new'),
    client.execute('SELECT COUNT(*) as count FROM wishes_new'),
    client.execute('SELECT COUNT(*) as count FROM tables_new'),
    client.execute('SELECT COUNT(*) as count FROM groups_new'),
  ])

  console.log('rsvps_new:', counts[0].rows[0].count)
  console.log('guests_new:', counts[1].rows[0].count)
  console.log('wishes_new:', counts[2].rows[0].count)
  console.log('tables_new:', counts[3].rows[0].count)
  console.log('groups_new:', counts[4].rows[0].count)

  client.close()
}

checkCounts()
