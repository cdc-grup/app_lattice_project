import 'dotenv/config';
import { db, pool } from './index';
import { pointsOfInterest } from './schema';
import { sql } from 'drizzle-orm';

async function seedPedralbes() {
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
  await pool.end();
}

seedPedralbes().catch((err) => {
  console.error('Seeding Pedralbes failed:', err);
  process.exit(1);
});
