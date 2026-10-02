import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/*
  Neon Postgres, provisioned through the Vercel Neon integration
  (resource "neon-mikaelson-group"), which sets DATABASE_URL on the project.
  Returns null when no database is configured so public pages can still
  render (with no posts) instead of failing the build.
*/

let client: NeonQueryFunction<false, false> | null | undefined;

export function getDb() {
  if (client !== undefined) return client;
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  client = url ? neon(url) : null;
  return client;
}
