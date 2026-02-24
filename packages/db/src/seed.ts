import 'dotenv/config';
import { db, pool } from './index';
import { users, pointsOfInterest } from './schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');

  // 1. Seed a test user
  const [testUser] = await db.insert(users).values({
    email: 'kore@example.com',
    passwordHash: 'password123', // Updated for easier testing
    fullName: 'Kore User',
    mobilityMode: 'standard',
  }).onConflictDoNothing().returning();

  if (testUser) {
    console.log('Created test user:', testUser.email);
  } else {
    console.log('Test user already exists.');
  }

  // 2. We skip clearing POIs to preserve any manual changes or telemetry data
  // await db.delete(pointsOfInterest);
  console.log('Synchronizing points of interest...');

  // 3. Seed Points of Interest (POIs) - Professional Circuit Set
  const pois = [
    {
      name: 'Main Entrance - Gate 3',
      description: 'Main pedestrian access and ticket office.',
      type: 'gate',
      location: sql`ST_GeomFromText('POINT(2.2555 41.5725)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'moderate',
    },
    {
      name: 'Grandstand D (Principal)',
      description: 'Excellent view of the first corner and pit exit.',
      type: 'grandstand',
      location: sql`ST_GeomFromText('POINT(2.2592 41.5695)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'high',
    },
    {
      name: 'Paddock Club Grill',
      description: 'Premium food court with gourmet options.',
      type: 'restaurant',
      location: sql`ST_GeomFromText('POINT(2.2615 41.5698)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    },
    {
      name: 'Medical Center',
      description: 'Primary medical assistance and emergency services.',
      type: 'medical',
      location: sql`ST_GeomFromText('POINT(2.2635 41.5708)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    },
    {
      name: 'Official Merch Store',
      description: 'Get your official team gear and souvenirs.',
      type: 'shop',
      location: sql`ST_GeomFromText('POINT(2.2575 41.5715)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'moderate',
    },
    {
      name: 'Public Restrooms - Sector 1',
      description: 'Clean facilities with accessible cabins.',
      type: 'wc',
      location: sql`ST_GeomFromText('POINT(2.2585 41.5685)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    }
  ] as const;

  for (const poi of pois) {
    await db.insert(pointsOfInterest).values({
      name: poi.name,
      description: poi.description,
      type: poi.type,
      location: poi.location,
      isWheelchairAccessible: poi.isWheelchairAccessible,
      crowdLevel: poi.crowdLevel,
    }).onConflictDoNothing();
  }
  
  console.log(`Seeded ${pois.length} points of interest.`);

  console.log('Seeding completed successfully.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
