import { db, pool } from './index';
import { pointsOfInterest, nodes, pathSegments } from './schema';
import { sql } from 'drizzle-orm';
import { seedCommon } from './seed-common';

async function seedPedralbes() {
  console.log('Seeding database (Pedralbes)...');

  // 1. Seed common data (users, profiles)
  await seedCommon(db);

  console.log('Seeding Pedralbes test POIs...');

  const pedralbesPois = [
    {
      name: 'Entrada Institut Pedralbes',
      description: 'Accés principal al centre educatiu.',
      type: 'gate',
      location: sql`ST_GeomFromText('POINT(2.1060698 41.3863034)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'moderate',
    },
    {
      name: 'Cafeteria Pedralbes',
      description: 'Zona de restauració i descans.',
      type: 'restaurant',
      location: sql`ST_GeomFromText('POINT(2.1065 41.3865)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    },
    {
      name: 'WC Planta Baixa',
      description: 'Serveis públics adaptats.',
      type: 'wc',
      location: sql`ST_GeomFromText('POINT(2.1058 41.3862)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    },
    {
      name: 'Secretaria / Recepció',
      description: "Punt d'informació i tràmits.",
      type: 'meetup_point',
      location: sql`ST_GeomFromText('POINT(2.1062 41.3861)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'moderate',
    },
  ] as const;

  for (const poi of pedralbesPois) {
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

  console.log(`Seeded ${pedralbesPois.length} Pedralbes test POIs.`);

  console.log('Seeding Pedralbes routing nodes and segments...');

  // 4. Seed Nodes
  const nodesData = [
    { id: 1, name: 'Main Entrance Node', location: sql`ST_GeomFromText('POINT(2.1061 41.3863)', 4326)` },
    { id: 2, name: 'Corridor A Intersection', location: sql`ST_GeomFromText('POINT(2.1063 41.3864)', 4326)` },
    { id: 3, name: 'Cafeteria Node', location: sql`ST_GeomFromText('POINT(2.1065 41.3865)', 4326)` },
    { id: 4, name: 'WC Hallway Node', location: sql`ST_GeomFromText('POINT(2.1058 41.3862)', 4326)` },
    { id: 5, name: 'Secretary Plaza Node', location: sql`ST_GeomFromText('POINT(2.1062 41.3861)', 4326)` },
  ];

  for (const node of nodesData) {
    await db.insert(nodes).values(node).onConflictDoNothing();
  }

  // 5. Seed Path Segments (Lines)
  // Distance appox (11.1m per 0.0001 deg)
  const segmentsData = [
    { sourceNodeId: 1, targetNodeId: 2, distance: 25.5, surface: 'asphalt', hasStairs: false }, // Entrance to Corridor A
    { sourceNodeId: 2, targetNodeId: 3, distance: 30.2, surface: 'asphalt', hasStairs: false }, // Corridor A to Cafeteria
    { sourceNodeId: 1, targetNodeId: 4, distance: 40.0, surface: 'asphalt', hasStairs: true },  // Entrance to WC (Shortcut with stairs)
    { sourceNodeId: 4, targetNodeId: 5, distance: 35.0, surface: 'asphalt', hasStairs: false }, // WC to Secretary
    { sourceNodeId: 5, targetNodeId: 1, distance: 22.0, surface: 'asphalt', hasStairs: false }, // Secretary back to Entrance
    { sourceNodeId: 2, targetNodeId: 5, distance: 45.0, surface: 'asphalt', hasStairs: false }, // Long way around
  ] as const;

  for (const segment of segmentsData) {
    // Insert bidirectional segments for undirected graph
    await db.insert(pathSegments).values({
      sourceNodeId: segment.sourceNodeId,
      targetNodeId: segment.targetNodeId,
      distance: segment.distance,
      surface: segment.surface,
      hasStairs: segment.hasStairs,
    }).onConflictDoNothing();
    
    await db.insert(pathSegments).values({
      sourceNodeId: segment.targetNodeId,
      targetNodeId: segment.sourceNodeId,
      distance: segment.distance,
      surface: segment.surface,
      hasStairs: segment.hasStairs,
    }).onConflictDoNothing();
  }

  console.log('Seeded routing graph for Pedralbes.');
  await pool.end();
}

seedPedralbes().catch((err) => {
  console.error('Seeding Pedralbes failed:', err);
  process.exit(1);
});
