import 'dotenv/config';
import { query } from '../app/db/client';

async function viewGroups() {
  try {
    console.log('👨‍👩‍👧‍👦 Current wedding groups:\n');

    const groups = await query<{ id: number; name: string }>(`SELECT * FROM groups ORDER BY name`);

    for (const group of groups.rows) {
      // Count RSVPs in this group
      const rsvpCount = await query<{ count: number }>(
        `
        SELECT COUNT(*) as count FROM rsvp WHERE \`group\` = ?
      `,
        [group.name]
      );

      console.log(`📋 Group: "${group.name}" (ID: ${group.id})`);
      console.log(`   👥 RSVPs: ${rsvpCount.rows[0].count}`);
      console.log();
    }

    // Check for ungrouped RSVPs
    const ungrouped = await query<{ count: number }>(`
      SELECT COUNT(*) as count FROM rsvp WHERE \`group\` IS NULL
    `);
    console.log(`❓ Ungrouped RSVPs: ${ungrouped.rows[0].count}\n`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

viewGroups();
