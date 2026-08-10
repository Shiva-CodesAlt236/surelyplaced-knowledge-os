import * as schema from '../lib/db/schema.ts'
import { getTableColumns } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import fs from 'node:fs'
import path from 'node:path'

async function runPhase4aSchemaAudit() {
  console.log('=====================================================')
  console.log('   SALES COPILOT PHASE 4A SCHEMA AUDIT VERIFICATION  ')
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

  // 1. Exactly 3 tables exported in schema
  const schemaExports = Object.keys(schema)
  assert(schemaExports.includes('copilotSessions'), 'Test 1: copilotSessions table exported')
  assert(schemaExports.includes('copilotExchanges'), 'Test 1: copilotExchanges table exported')
  assert(schemaExports.includes('copilotFeedback'), 'Test 1: copilotFeedback table exported')
  assert(schemaExports.length === 3, 'Test 1: Exactly 3 database tables defined in schema')

  // 2 & 3. No objection_categories or sales_scripts table
  assert(!schemaExports.includes('objectionCategories'), 'Test 2: No objection_categories database table')
  assert(!schemaExports.includes('salesScripts'), 'Test 3: No sales_scripts database table')

  const sessionsColumns = getTableColumns(schema.copilotSessions)
  const exchangesColumns = getTableColumns(schema.copilotExchanges)

  // 4. No candidate identifier in copilotSessions
  const sessionColumnNames = Object.keys(sessionsColumns)
  assert(
    !sessionColumnNames.some((c) => c.toLowerCase().includes('candidate')),
    'Test 4: Zero candidate PII / candidate identifier columns in sessions'
  )

  // 5. advisorIdentifier exists in copilotSessions
  assert(sessionsColumns.advisorIdentifier !== undefined, 'Test 5: advisorIdentifier column exists in sessions')

  // 6 & 7. status exists and supports enum values
  assert(sessionsColumns.status !== undefined, 'Test 6: status column exists in sessions')
  assert(sessionsColumns.status.enumValues?.includes('active'), 'Test 7: sessions.status supports "active"')
  assert(sessionsColumns.status.enumValues?.includes('completed'), 'Test 7: sessions.status supports "completed"')
  assert(sessionsColumns.status.enumValues?.includes('abandoned'), 'Test 7: sessions.status supports "abandoned"')

  // 8. outcome fields exist in copilotSessions
  assert(sessionsColumns.outcomeStatus !== undefined, 'Test 8: outcomeStatus exists in sessions')
  assert(sessionsColumns.outcomeReason !== undefined, 'Test 8: outcomeReason exists in sessions')
  assert(sessionsColumns.outcomeNotes !== undefined, 'Test 8: outcomeNotes exists in sessions')
  assert(sessionsColumns.outcomeRecordedAt !== undefined, 'Test 8: outcomeRecordedAt exists in sessions')

  // 9 & 10. exchanges.sessionId references copilotSessions with onDelete cascade
  const exchangeConfig = getTableConfig(schema.copilotExchanges)
  const sessionFk = exchangeConfig.foreignKeys.find((fk) =>
    fk.reference().foreignColumns.some((col) => col.table === schema.copilotSessions)
  )
  assert(sessionFk !== undefined, 'Test 9: exchanges.sessionId references copilotSessions.id')
  assert(sessionFk?.onDelete === 'cascade', 'Test 10: exchanges FK onDelete is "cascade"')

  // 11 & 12. feedback.exchangeId references copilotExchanges with onDelete cascade and UNIQUE constraint
  const feedbackConfig = getTableConfig(schema.copilotFeedback)
  const feedbackColumns = getTableColumns(schema.copilotFeedback)
  const feedbackFk = feedbackConfig.foreignKeys.find((fk) =>
    fk.reference().foreignColumns.some((col) => col.table === schema.copilotExchanges)
  )
  assert(feedbackFk !== undefined, 'Test 11: feedback.exchangeId references copilotExchanges.id')
  assert(feedbackColumns.exchangeId.isUnique === true || feedbackConfig.uniqueConstraints.length >= 1, 'Test 12: feedback.exchangeId has UNIQUE constraint')

  // 13. matchedScriptId is plain text reference
  assert(exchangesColumns.matchedScriptId !== undefined, 'Test 13: matchedScriptId exists as text reference')
  const scriptFk = exchangeConfig.foreignKeys.find((fk) =>
    fk.reference().foreignColumns.some((col) => col.name.includes('script'))
  )
  assert(scriptFk === undefined, 'Test 13: No database FK for script content (lib/scripts-registry.ts single source of truth)')

  // 14 & 15. No script response text or coaching text stored in exchanges table
  const exchangeColumnNames = Object.keys(exchangesColumns)
  assert(!exchangeColumnNames.includes('recommendedResponse'), 'Test 14: No recommendedResponse text column in exchanges')
  assert(!exchangeColumnNames.includes('whyItWorks'), 'Test 15: No whyItWorks coaching text column in exchanges')
  assert(!exchangeColumnNames.includes('nextQuestion'), 'Test 15: No nextQuestion coaching text column in exchanges')

  // 16. Expected indexes exist
  assert(exchangeConfig.indexes.length >= 4, 'Test 16: Expected indexes exist on copilotExchanges')

  // 17. DATABASE_URL is not prefixed with NEXT_PUBLIC_
  const envExample = fs.readFileSync(path.resolve('.env.example'), 'utf8')
  assert(!envExample.includes('NEXT_PUBLIC_DATABASE_URL'), 'Test 17: DATABASE_URL is not NEXT_PUBLIC_')

  // 18. Database client is not imported by client components
  const askAiPanel = fs.readFileSync(path.resolve('components/ai/AskAIPanel.tsx'), 'utf8')
  assert(!askAiPanel.includes('lib/db'), 'Test 18: AskAIPanel does not import database client')

  // 19. Package scripts do not auto-run migrations from build/start/dev
  const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'))
  assert(!packageJson.scripts.build.includes('migrate'), 'Test 19: build script does not auto-run migrations')
  assert(!packageJson.scripts.start.includes('migrate'), 'Test 19: start script does not auto-run migrations')

  // 20. Schema contains no user/auth/CRM tables
  assert(!schemaExports.includes('users') && !schemaExports.includes('crmCandidates'), 'Test 20: Zero user/auth/CRM tables in schema')

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
