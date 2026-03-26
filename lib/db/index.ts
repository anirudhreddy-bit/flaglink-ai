import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  // In dev: falls back to a local SQLite file
  // In prod: uses TURSO_DATABASE_URL + TURSO_AUTH_TOKEN from env
  url: process.env.TURSO_DATABASE_URL ?? "file:./flaglink.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

/** True if `user.plan` exists (billing migration applied). Uses PRAGMA — no failing SELECTs. */
export async function userTableHasPlanColumn(): Promise<boolean> {
  try {
    const res = await client.execute({ sql: 'PRAGMA table_info("user")', args: [] });
    return res.rows.some((row) => {
      const o = row as Record<string, unknown>;
      if (o.name === "plan") return true;
      if (Array.isArray(row) && row[1] === "plan") return true;
      return false;
    });
  } catch {
    return false;
  }
}
