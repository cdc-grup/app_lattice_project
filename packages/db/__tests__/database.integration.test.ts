import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import path from 'path';
import { users } from '../src/schema.js';
import { eq } from 'drizzle-orm';

describe('Database Integration Tests', () => {
  let container: StartedPostgreSqlContainer;
  let pool: pg.Pool;
  let db: any;

  beforeAll(async () => {
    // 1. Start Postgres Container
    container = await new PostgreSqlContainer('postgres:16-alpine').start();

    // 2. Setup DB connection
    pool = new pg.Pool({
      connectionString: container.getConnectionUri(),
    });
    db = drizzle(pool);

    // 3. Run Migrations
    await migrate(db, { migrationsFolder: path.resolve(__dirname, '../drizzle') });
  }, 120000); // 2 min timeout for container start + migrations

  afterAll(async () => {
    if (pool) await pool.end();
    if (container) await container.stop();
  });

  it('should insert and retrieve a user', async () => {
    const newUser = {
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      fullName: 'Test User',
    };

    // Insert
    const insertedUsers = await db.insert(users).values(newUser).returning();
    expect(insertedUsers).toHaveLength(1);
    expect(insertedUsers[0].email).toBe(newUser.email);

    // Retrieve
    const retrievedUsers = await db.select().from(users).where(eq(users.email, newUser.email));
    expect(retrievedUsers).toHaveLength(1);
    expect(retrievedUsers[0].fullName).toBe(newUser.fullName);
  });

  it('should enforce unique email constraint', async () => {
    const user = {
      email: 'unique@example.com',
      passwordHash: 'hash',
    };

    // First insert should succeed
    await db.insert(users).values(user);

    // Second insert with same email should fail
    await expect(db.insert(users).values(user)).rejects.toThrow();
  });
});
