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

  // Safety Guards — ALL MUST THROW LOUDLY ON ANY FAILURE
  if (dbEnv === 'production') {
    throw new Error('[E2E Teardown Guard] REFUSING execution against production COPILOT_DB_ENV=production!')
  }

  if (!allowNonProd) {
    throw new Error('[E2E Teardown Guard] COPILOT_DB_TEST_ALLOW_NON_PROD=true is required for Playwright E2E global teardown!')
  }

  if (dbEnv !== 'development' && dbEnv !== 'preview') {
    throw new Error(`[E2E Teardown Guard] COPILOT_DB_ENV="${dbEnv}" must be "development" or "preview" for Playwright E2E global teardown!`)
  }

  if (!databaseUrl) {
    throw new Error('[E2E Teardown Guard] DATABASE_URL environment variable is missing!')
  }

  try {
    const sql = neon(databaseUrl)

    // Execute safe test-owned prefix cleanup targeting STRICTLY 'phase5b-e2e-%'
    // Foreign key CASCADE deletes linked exchanges & feedback automatically
    const deletedSessions = await sql`
      DELETE FROM copilot_sessions
      WHERE advisor_identifier LIKE 'phase5b-e2e-%'
      RETURNING id, advisor_identifier;
    `

    console.log(`[E2E Teardown] Successfully cleaned ${deletedSessions.length} test sessions with prefix "phase5b-e2e-%".`)
    console.log('=====================================================\n')
  } catch (err: any) {
    const sanitizedErrorMsg = err?.message || String(err)
    console.error('[E2E Teardown Error] Database cleanup failed:', sanitizedErrorMsg)
    throw new Error(`[E2E Teardown Failed] Database deletion error: ${sanitizedErrorMsg}`)
  }
}
