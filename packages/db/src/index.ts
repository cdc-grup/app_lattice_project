import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Explicit exports to avoid resolution issues
export {
  users,
  tickets,
  pointsOfInterest,
  pathSegments,
  groups,
  groupMembers,
  savedLocations,
  offlinePackages,
  mobilityModeEnum,
  poiTypeEnum,
  crowdLevelEnum,
  surfaceTypeEnum
} from './schema';
export { sql, eq, and, desc, asc } from 'drizzle-orm';

const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'circuit_db',
        password: 'password',
        port: 5432,
      }
);

export const db = drizzle(pool, { schema });
