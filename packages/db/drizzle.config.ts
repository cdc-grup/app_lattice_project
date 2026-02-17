import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: "postgres",
        password: "password",
        host: "localhost",
        port: 5432,
        database: "circuit_db",
      },
} satisfies Config;
