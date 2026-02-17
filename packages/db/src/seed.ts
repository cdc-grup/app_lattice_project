import 'dotenv/config';
import { db, pool } from './index';
import { users, pointsOfInterest } from './schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');

  // 1. Seed a test user
  const [testUser] = await db.insert(users).values({
    email: 'kore@example.com',
    passwordHash: 'hashed_password_here', // In a real app, this would be a bcrypt hash
    fullName: 'Kore User',
    mobilityMode: 'standard',
  }).onConflictDoNothing().returning();

  if (testUser) {
    console.log('Created test user:', testUser.email);
  } else {
    console.log('Test user already exists.');
  }

  // 2. Seed some Points of Interest (POIs)
  const pois = [
    {
      name: 'Main Entrance - Gate 1',
      description: 'Primary entry point for the circuit.',
      type: 'gate',
      location: sql`ST_GeomFromText('POINT(2.261 41.568)', 4326)`,
      isWheelchairAccessible: true,
    },
    {
      name: 'Grandstand G',
      description: 'Best views of the main straight.',
      type: 'grandstand',
      location: sql`ST_GeomFromText('POINT(2.2645 41.5701)', 4326)`,
      isWheelchairAccessible: true,
    },
    {
      name: 'Medical Center',
      description: 'First aid and emergency services.',
      type: 'medical',
      location: sql`ST_GeomFromText('POINT(2.262 41.569)', 4326)`,
      isWheelchairAccessible: true,
    },
    {
      name: 'Paddock Restaurant',
      description: 'Full service dining near the pit lane.',
      type: 'restaurant',
      location: sql`ST_GeomFromText('POINT(2.268 41.572)', 4326)`,
      isWheelchairAccessible: true,
    },
  ] as const;

  for (const poi of pois) {
    await db.insert(pointsOfInterest).values(poi).onConflictDoNothing();
  }
  
  console.log(`Seeded ${pois.length} points of interest.`);

  console.log('Seeding completed successfully.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
