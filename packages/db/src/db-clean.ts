import { db, pool } from './index';
import { sql } from 'drizzle-orm';

async function clean() {
  console.log('Cleaning database...');

  const tables = [
    'group_members',
    'groups',
    'offline_packages',
    'path_segments',
    'tickets',
    'saved_locations',
    'points_of_interest',
    'users',
  ];

  try {
    for (const table of tables) {
      console.log(`Truncating ${table}...`);
      await db.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE`));
    }
    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await pool.end();
  }
}

clean();
