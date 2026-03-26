import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  // In dev: falls back to a local SQLite file
  // In prod: uses TURSO_DATABASE_URL + TURSO_AUTH_TOKEN from env
  url: process.env.TURSO_DATABASE_URL ?? "file:./flaglink.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

function rowColumnNames(res: { rows: unknown[] }): string[] {
  return res.rows.map((row) => {
    if (Array.isArray(row)) {
      return typeof row[1] === "string" ? row[1] : "";
    }
    const o = row as Record<string, unknown>;
    const n = o.name ?? o.Name;
    return typeof n === "string" ? n : "";
  }).filter(Boolean);
}

/**
 * Adds plan + Stripe columns if the DB was created before billing.
 * Safe to call multiple times (Turso / local SQLite).
 */
export async function ensureUserBillingSchema(c: Client = client): Promise<void> {
  try {
    const info = await c.execute({ sql: 'PRAGMA table_info("user")', args: [] });
    const cols = rowColumnNames(info);
    if (!cols.length) return;

    const has = (n: string) => cols.includes(n);
    if (has("plan") && has("stripeCustomerId") && has("stripeSubscriptionId")) return;

    const alters = [
      'ALTER TABLE user ADD COLUMN plan TEXT NOT NULL DEFAULT \'free\'',
      "ALTER TABLE user ADD COLUMN stripeCustomerId TEXT",
      "ALTER TABLE user ADD COLUMN stripeSubscriptionId TEXT",
    ];
    for (const sql of alters) {
      try {
        await c.execute({ sql, args: [] });
      } catch (e) {
        const m = String((e as { message?: string })?.message ?? e);
        if (!/duplicate column|already exists/i.test(m)) {
          console.warn("[db] ensureUserBillingSchema ALTER:", m);
        }
      }
    }
  } catch (e) {
    console.warn("[db] ensureUserBillingSchema:", e);
  }
}

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
