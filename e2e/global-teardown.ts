import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export default async function globalTeardown() {
  const dbEnv = (process.env.COPILOT_DB_ENV || '').toLowerCase()
  const allowNonProd = process.env.COPILOT_DB_TEST_ALLOW_NON_PROD === 'true'
  const databaseUrl = process.env.DATABASE_URL

  console.log('\n=====================================================')
  console.log('      PLAYWRIGHT E2E GLOBAL TEARDOWN CLEANUP        ')
  console.log('=====================================================')

  // Safety Guards
  if (dbEnv === 'production') {
    throw new Error('[E2E Teardown Guard] REFUSING execution against production COPILOT_DB_ENV=production!')
  }

  if (!allowNonProd) {
    console.log('[E2E Teardown] COPILOT_DB_TEST_ALLOW_NON_PROD is not "true". Skipping database teardown cleanup.')
    return
  }

  if (dbEnv !== 'development' && dbEnv !== 'preview') {
    console.log(`[E2E Teardown] COPILOT_DB_ENV="${dbEnv}" is not "development" or "preview". Skipping teardown.`)
    return
  }

  if (!databaseUrl) {
    console.log('[E2E Teardown] DATABASE_URL is not configured. Skipping database teardown cleanup.')
    return
  }

  try {
    const sql = neon(databaseUrl)

    // Execute safe test-owned prefix cleanup targeting STRICTLY 'phase5b-e2e-%'
    // Cascade delete on copilot_exchanges & copilot_feedback cleans child records automatically
    const deletedSessions = await sql`
      DELETE FROM copilot_sessions
      WHERE advisor_identifier LIKE 'phase5b-e2e-%'
      RETURNING id, advisor_identifier;
    `

    console.log(`[E2E Teardown] Successfully cleaned ${deletedSessions.length} test sessions with prefix "phase5b-e2e-%".`)
    console.log('=====================================================\n')
  } catch (err: any) {
    console.error('[E2E Teardown Error] Database cleanup failed:', err?.message || err)
  }
}
