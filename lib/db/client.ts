import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Sales Copilot — Neon Postgres Database Client (Lazy Initialization)
 *
 * Rules:
 * - Server-side only
 * - Lazily connects when persistence methods are invoked
 * - Does not break Next.js build if DATABASE_URL is missing
 */

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (dbInstance) {
    return dbInstance
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is missing. Please configure a Neon Postgres connection string.'
    )
  }

  const sql = neon(connectionString)
  dbInstance = drizzle(sql, { schema })
  return dbInstance
}
