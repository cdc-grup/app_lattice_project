import { db, pool } from './index';
import { users, pointsOfInterest, tickets, nodes, pathSegments } from './schema';
import { sql } from 'drizzle-orm';
import { seedCommon } from './seed-common';

async function seed() {
  console.log('Seeding database...');

  // 1. Seed a test user
  const [testUser] = await db
    .insert(users)
    .values({
      email: 'kore@example.com',
      passwordHash: 'password123', // Updated for easier testing
      fullName: 'Kore User',
      mobilityMode: 'standard',
    })
    .onConflictDoNothing()
    .returning();

  if (testUser) {
    console.log('Created test user:', testUser.email);
  } else {
    console.log('Test user already exists.');
  }

  // Seeding additional tester accounts for QR flow
  const testerEmails = [
    'tester_circuitvip2026@example.com',
    'tester_circuitg2026@example.com'
  ];

  for (const email of testerEmails) {
    await db
      .insert(users)
      .values({
        email,
        passwordHash: 'password123',
        fullName: email.split('@')[0],
        hasTicket: true,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { 
          passwordHash: 'password123',
          fullName: email.split('@')[0]
        }
      });
    console.log(`Ensured tester account exists and is updated: ${email}`);
  }

  // 2. Seed Test Tickets
  console.log('Seeding test tickets...');
  const testTickets = [
    {
      code: 'CIRCUIT-VIP-2026',
      ownerEmail: 'kore@example.com',
      gate: 'Gate 1 (VIP)',
      zoneName: 'Paddock Club',
      seatRow: 'A',
      seatNumber: '12',
      isActive: true,
      createdAt: new Date(),
    },
    {
      code: 'CIRCUIT-G-2026',
      ownerEmail: 'tester_circuitg2026@example.com',
      gate: 'Gate 3',
      zoneName: 'Grandstand G',
      seatRow: '15',
      seatNumber: '42',
      isActive: true,
      createdAt: new Date(),
    },
    {
      code: 'CIRCUIT-PLATINUM-2026',
      ownerEmail: 'tester_circuitplatinum2026@example.com',
      gate: 'Gate 0',
      zoneName: 'Platinum Lounge',
      seatRow: '1',
      seatNumber: '1',
      isActive: true,
      createdAt: new Date(),
    },
    {
      code: 'CIRCUIT-EXTRA-VIP',
      ownerEmail: 'tester_circuitvip2026@example.com',
      gate: 'Gate 1 (VIP)',
      zoneName: 'Paddock Club (Extra)',
      seatRow: 'B',
      seatNumber: '24',
      isActive: true,
      createdAt: new Date(),
    },
  ];

  for (const ticket of testTickets) {
    await db.insert(tickets).values(ticket).onConflictDoNothing();
  }
  console.log(`Seeded ${testTickets.length} test tickets.`);

  // 3. We skip clearing POIs to preserve any manual changes or telemetry data
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
    },
  ] as const;

  for (const poi of pois) {
    await db
      .insert(pointsOfInterest)
      .values({
        name: poi.name,
        description: poi.description,
        type: poi.type,
        location: poi.location,
        isWheelchairAccessible: poi.isWheelchairAccessible,
        crowdLevel: poi.crowdLevel,
      })
      .onConflictDoNothing();
  }

  console.log(`Seeded ${pois.length} points of interest.`);

  console.log('Seeding Montmelo routing nodes and segments...');

  // 4. Seed Nodes (Starting from ID 11 to avoid Pedralbes collision)
  const nodesData = [
    { id: 11, name: 'Gate 3 Node', location: sql`ST_GeomFromText('POINT(2.2555 41.5725)', 4326)` },
    { id: 12, name: 'Main Walkway West', location: sql`ST_GeomFromText('POINT(2.2565 41.5720)', 4326)` },
    { id: 13, name: 'Merch Store Node', location: sql`ST_GeomFromText('POINT(2.2575 41.5715)', 4326)` },
    { id: 14, name: 'Central Junction', location: sql`ST_GeomFromText('POINT(2.2585 41.5705)', 4326)` },
    { id: 15, name: 'Grandstand D Node', location: sql`ST_GeomFromText('POINT(2.2592 41.5695)', 4326)` },
    { id: 16, name: 'Paddock Club Node', location: sql`ST_GeomFromText('POINT(2.2615 41.5698)', 4326)` },
    { id: 17, name: 'Medical Center Node', location: sql`ST_GeomFromText('POINT(2.2635 41.5708)', 4326)` },
    { id: 18, name: 'Restrooms Node', location: sql`ST_GeomFromText('POINT(2.2585 41.5685)', 4326)` },
    { id: 19, name: 'Tunnel Alpha Entrance', location: sql`ST_GeomFromText('POINT(2.2600 41.5702)', 4326)` },
  ];

  for (const node of nodesData) {
    await db.insert(nodes).values(node).onConflictDoNothing();
  }

  // 5. Seed Path Segments
  // approx 11.1m per 0.0001 deg
  const segmentsData = [
    { sourceNodeId: 11, targetNodeId: 12, distance: 120.0, surface: 'asphalt' },
    { sourceNodeId: 12, targetNodeId: 13, distance: 115.0, surface: 'asphalt' },
    { sourceNodeId: 13, targetNodeId: 14, distance: 140.0, surface: 'asphalt' },
    { sourceNodeId: 14, targetNodeId: 15, distance: 130.0, surface: 'asphalt' },
    { sourceNodeId: 14, targetNodeId: 19, distance: 165.0, surface: 'asphalt' },
    { sourceNodeId: 19, targetNodeId: 16, distance: 150.0, surface: 'asphalt' },
    { sourceNodeId: 16, targetNodeId: 17, distance: 230.0, surface: 'asphalt' },
    { sourceNodeId: 15, targetNodeId: 18, distance: 110.0, surface: 'asphalt' },
    { sourceNodeId: 12, targetNodeId: 18, distance: 450.0, surface: 'gravel', hasStairs: true }, // Long gravel path with stairs
  ] as const;

  for (const segment of segmentsData) {
    await db.insert(pathSegments).values({
      sourceNodeId: segment.sourceNodeId,
      targetNodeId: segment.targetNodeId,
      distance: segment.distance,
      surface: segment.surface,
      hasStairs: 'hasStairs' in segment ? segment.hasStairs : false,
    }).onConflictDoNothing();
    
    await db.insert(pathSegments).values({
      sourceNodeId: segment.targetNodeId,
      targetNodeId: segment.sourceNodeId,
      distance: segment.distance,
      surface: segment.surface,
      hasStairs: 'hasStairs' in segment ? segment.hasStairs : false,
    }).onConflictDoNothing();
  }

  console.log('Seeded routing graph for Montmelo.');
  console.log('Seeding completed successfully.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
