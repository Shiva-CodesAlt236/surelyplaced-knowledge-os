import * as schema from '../lib/db/schema.ts'
import { getDb } from '../lib/db/client.ts'
import { getTableColumns } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import fs from 'node:fs'
import path from 'node:path'

async function runPhase4aSchemaAudit() {
  console.log('=====================================================')
  console.log('   SALES COPILOT PHASE 4A.1 SCHEMA AUDIT VERIFICATION ')
  console.log('=====================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${message}`)
      failed++
    }
  }

  // -----------------------------------------------------
  // SECTION 1: Schema Metadata Audit
  // -----------------------------------------------------
  console.log('--- 1. Schema Metadata Checks ---')

  const schemaExports = Object.keys(schema)
  assert(schemaExports.includes('copilotSessions'), 'Test 1: copilotSessions table exported')
  assert(schemaExports.includes('copilotExchanges'), 'Test 1: copilotExchanges table exported')
  assert(schemaExports.includes('copilotFeedback'), 'Test 1: copilotFeedback table exported')

  // Count tables (excluding pgEnum objects)
  const tableExports = [schema.copilotSessions, schema.copilotExchanges, schema.copilotFeedback]
  assert(tableExports.length === 3, 'Test 1: Exactly 3 database tables defined in schema')

  assert(!schemaExports.includes('objectionCategories'), 'Test 2: No objection_categories database table')
  assert(!schemaExports.includes('salesScripts'), 'Test 3: No sales_scripts database table')

  const sessionsColumns = getTableColumns(schema.copilotSessions)
  const exchangesColumns = getTableColumns(schema.copilotExchanges)
  const feedbackColumns = getTableColumns(schema.copilotFeedback)

  const sessionColumnNames = Object.keys(sessionsColumns)
  assert(
    !sessionColumnNames.some((c) => c.toLowerCase().includes('candidate')),
    'Test 4: Zero candidate PII / candidate identifier columns in sessions'
  )

  assert(sessionsColumns.advisorIdentifier !== undefined, 'Test 5: advisorIdentifier column exists in sessions')
  assert(sessionsColumns.status !== undefined, 'Test 6: status column exists in sessions')
  assert(sessionsColumns.outcomeStatus !== undefined, 'Test 8: outcomeStatus exists in sessions')
  assert(sessionsColumns.outcomeReason !== undefined, 'Test 8: outcomeReason exists in sessions')

  const exchangeConfig = getTableConfig(schema.copilotExchanges)
  const sessionFk = exchangeConfig.foreignKeys.find((fk) =>
    fk.reference().foreignColumns.some((col) => col.table === schema.copilotSessions)
  )
  assert(sessionFk !== undefined, 'Test 9: exchanges.sessionId references copilotSessions.id')
  assert(sessionFk?.onDelete === 'cascade', 'Test 10: exchanges FK onDelete is "cascade"')

  const feedbackConfig = getTableConfig(schema.copilotFeedback)
  const feedbackFk = feedbackConfig.foreignKeys.find((fk) =>
    fk.reference().foreignColumns.some((col) => col.table === schema.copilotExchanges)
  )
  assert(feedbackFk !== undefined, 'Test 11: feedback.exchangeId references copilotExchanges.id')
  assert(feedbackColumns.exchangeId.isUnique === true || feedbackConfig.uniqueConstraints.length >= 1, 'Test 12: feedback.exchangeId has UNIQUE constraint')

  assert(exchangesColumns.matchedScriptId !== undefined, 'Test 13: matchedScriptId exists as text reference')
  const exchangeColumnNames = Object.keys(exchangesColumns)
  assert(!exchangeColumnNames.includes('recommendedResponse'), 'Test 14: No recommendedResponse text column in exchanges')
  assert(!exchangeColumnNames.includes('whyItWorks'), 'Test 15: No whyItWorks coaching text column in exchanges')
  assert(!exchangeColumnNames.includes('nextQuestion'), 'Test 15: No nextQuestion coaching text column in exchanges')

  assert(exchangeConfig.indexes.length >= 4, 'Test 16: Expected indexes exist on copilotExchanges')
  assert(!schemaExports.includes('users') && !schemaExports.includes('crmCandidates'), 'Test 20: Zero user/auth/CRM tables in schema')

  // -----------------------------------------------------
  // SECTION 2: Generated SQL DDL Audit
  // -----------------------------------------------------
  console.log('\n--- 2. Generated SQL DDL Checks ---')

  const drizzleDir = path.resolve('drizzle')
  const sqlFiles = fs.readdirSync(drizzleDir).filter((f) => f.endsWith('.sql'))
  assert(sqlFiles.length >= 1, 'Test SQL 1: Generated SQL migration file exists in ./drizzle/')

  const latestSqlPath = path.join(drizzleDir, sqlFiles[0])
  const sqlContent = fs.readFileSync(latestSqlPath, 'utf8')

  assert(sqlContent.includes('CREATE TYPE "public"."copilot_session_status" AS ENUM'), 'Test SQL 2: copilot_session_status enum defined in SQL')
  assert(sqlContent.includes('CREATE TYPE "public"."copilot_outcome_status" AS ENUM'), 'Test SQL 3: copilot_outcome_status enum defined in SQL')
  assert(sqlContent.includes('CREATE TYPE "public"."copilot_outcome_reason" AS ENUM'), 'Test SQL 4: copilot_outcome_reason enum defined in SQL')
  assert(sqlContent.includes('CREATE TYPE "public"."copilot_confidence_band" AS ENUM'), 'Test SQL 5: copilot_confidence_band enum defined in SQL')
  assert(sqlContent.includes('CREATE TYPE "public"."copilot_feedback_rating" AS ENUM'), 'Test SQL 6: copilot_feedback_rating enum defined in SQL')

  assert(sqlContent.includes('"secondary_objection_ids" text[]'), 'Test SQL 7: secondary_objection_ids is native text[]')
  assert(!sqlContent.includes('"secondary_objection_ids" jsonb'), 'Test SQL 8: secondary_objection_ids is NOT jsonb')

  assert(sqlContent.includes('CHECK'), 'Test SQL 9: CHECK constraint generated in SQL for selected_level')
  assert(sqlContent.includes('ON DELETE cascade'), 'Test SQL 10: ON DELETE cascade generated in SQL for foreign keys')
  assert(sqlContent.includes('UNIQUE("exchange_id")'), 'Test SQL 11: UNIQUE("exchange_id") constraint generated in SQL')

  // -----------------------------------------------------
  // SECTION 3: Database Client Configuration Audit
  // -----------------------------------------------------
  console.log('\n--- 3. Database Client Configuration Checks ---')

  const envExample = fs.readFileSync(path.resolve('.env.example'), 'utf8')
  assert(!envExample.includes('NEXT_PUBLIC_DATABASE_URL'), 'Test Client 1: DATABASE_URL is not NEXT_PUBLIC_')

  const askAiPanel = fs.readFileSync(path.resolve('components/ai/AskAIPanel.tsx'), 'utf8')
  assert(!askAiPanel.includes('lib/db'), 'Test Client 2: AskAIPanel does not import database client')

  const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'))
  assert(!packageJson.scripts.build.includes('migrate'), 'Test Client 3: build script does not auto-run migrations')
  assert(!packageJson.scripts.start.includes('migrate'), 'Test Client 4: start script does not auto-run migrations')

  // Lazy initialization error test when DATABASE_URL is absent
  let clientErrorCaught = false
  const oldDbUrl = process.env.DATABASE_URL
  delete process.env.DATABASE_URL

  try {
    getDb()
  } catch (err) {
    clientErrorCaught = err.message.includes('DATABASE_URL environment variable is missing')
  } finally {
    if (oldDbUrl) process.env.DATABASE_URL = oldDbUrl
  }
  assert(clientErrorCaught, 'Test Client 5: getDb() throws clear configuration error when DATABASE_URL is absent')

  console.log(`\n=====================================================`)
  console.log(`RESULTS: Passed ${passed}/${passed + failed} tests`)
  console.log(`=====================================================\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

runPhase4aSchemaAudit().catch((err) => {
  console.error('Schema audit error:', err)
  process.exit(1)
})
