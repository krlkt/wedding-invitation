import 'dotenv/config'
import { query } from '../app/db/client'

async function exploreDatabase() {
  try {
    console.log("🎉 Karel & Sabrina's Wedding Database Explorer\n")

    // Get table overview
    const tables = await query<{ name: string; sql: string }>(`
      SELECT name, sql FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `)

    console.log(`📊 Database Overview:`)
    for (const table of tables.rows) {
      const count = await query<{ count: number }>(`SELECT COUNT(*) as count FROM ${table.name}`)
      console.log(
        `   ${table.name.padEnd(8)} | ${count.rows[0].count.toString().padStart(3)} records`
      )
    }

    console.log(`\n🌟 Wedding Highlights:\n`)

    // Show wedding groups
    console.log('👨‍👩‍👧‍👦 Invitation Groups:')
    const groups = await query<{ name: string; count: number }>(`
      SELECT g.name, COUNT(r.id) as count
      FROM groups g
      LEFT JOIN rsvp r ON g.name = r.\`group\`
      GROUP BY g.name
      ORDER BY count DESC
    `)

    for (const group of groups.rows) {
      console.log(`   ${group.name.padEnd(12)} | ${group.count.toString().padStart(2)} RSVPs`)
    }

    // Show RSVP summary
    console.log('\n📋 RSVP Summary:')
    const rsvpStats = await query<{ attend: string; count: number }>(`
      SELECT attend, COUNT(*) as count
      FROM rsvp
      WHERE attend IS NOT NULL
      GROUP BY attend
      ORDER BY count DESC
    `)

    for (const stat of rsvpStats.rows) {
      const emoji = stat.attend === 'yes' ? '✅' : stat.attend === 'no' ? '❌' : '❓'
      console.log(
        `   ${emoji} ${stat.attend.padEnd(6)} | ${stat.count.toString().padStart(3)} responses`
      )
    }

    // Show location summary
    console.log('\n📍 Wedding Locations:')
    const locations = await query<{ location: string; count: number }>(`
      SELECT location, COUNT(*) as count
      FROM rsvp
      WHERE location IS NOT NULL
      GROUP BY location
      ORDER BY count DESC
    `)

    for (const loc of locations.rows) {
      console.log(`   ${loc.location.padEnd(10)} | ${loc.count.toString().padStart(3)} guests`)
    }

    // Show some wishes
    console.log('\n💝 Recent Wishes:')
    const wishes = await query<{ name: string; wish: string; created_at: string }>(`
      SELECT name, wish, created_at
      FROM wish
      ORDER BY created_at DESC
      LIMIT 3
    `)

    for (const wish of wishes.rows) {
      const shortWish = wish.wish.length > 50 ? wish.wish.substring(0, 50) + '...' : wish.wish
      console.log(`   From ${wish.name}: "${shortWish}"`)
    }

    // Show table assignments
    console.log('\n🪑 Table Management:')
    const tableStats = await query<{
      location: string
      tables: number
      seated: number
      total: number
    }>(`
      SELECT
        t.location,
        COUNT(DISTINCT t.id) as tables,
        COUNT(g.id) as seated,
        SUM(t.max_guests) as total
      FROM tables t
      LEFT JOIN guests g ON g.table_id = t.id
      GROUP BY t.location
      ORDER BY total DESC
    `)

    for (const stat of tableStats.rows) {
      console.log(
        `   ${stat.location.padEnd(10)} | ${stat.tables} tables, ${stat.seated}/${stat.total} seats filled`
      )
    }

    console.log('\n🎊 Total Wedding Data:')
    console.log(`   📧 ${groups.rows.length} invitation groups managed the guest list`)
    console.log(
      `   👥 ${(await query<{ count: number }>('SELECT COUNT(*) as count FROM guests')).rows[0].count} total guests invited`
    )
    console.log(
      `   ✉️  ${(await query<{ count: number }>('SELECT COUNT(*) as count FROM rsvp')).rows[0].count} RSVP invitations sent`
    )
    console.log(
      `   💌 ${(await query<{ count: number }>('SELECT COUNT(*) as count FROM wish')).rows[0].count} heartfelt wishes received`
    )
    console.log(
      `   🪑 ${(await query<{ count: number }>('SELECT COUNT(*) as count FROM tables')).rows[0].count} tables arranged for seating`
    )

    console.log('\n✨ What a wonderful celebration this must have been! ✨\n')
  } catch (error) {
    console.error('❌ Error exploring database:', error)
  }
}

exploreDatabase()
