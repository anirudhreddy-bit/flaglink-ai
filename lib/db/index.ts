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
