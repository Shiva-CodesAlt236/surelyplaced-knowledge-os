import { neon } from '@neondatabase/serverless'
import fs from 'node:fs'
import {
  createCopilotSession,
  recordCopilotExchange,
  recordCopilotFeedback,
  updateCopilotOutcome,
} from '../lib/copilot/persistence.ts'

// Load .env.local if process.env.DATABASE_URL is not pre-set
if (!process.env.DATABASE_URL && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^DATABASE_URL=["']?(.*?)["']?$/)
    if (match) {
      process.env.DATABASE_URL = match[1]
      break
    }
  }
}

async function runPhase4bPersistenceTests() {
  console.log('=====================================================')
  console.log('   SALES COPILOT PHASE 4B RUNTIME PERSISTENCE SUITE  ')
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

  // Safety Guards
  const dbEnv = process.env.COPILOT_DB_ENV
  const allowNonProd = process.env.COPILOT_DB_TEST_ALLOW_NON_PROD

  assert(
    allowNonProd === 'true',
    'Safety Guard 1: COPILOT_DB_TEST_ALLOW_NON_PROD=true is required'
  )
  assert(
    dbEnv === 'development' || dbEnv === 'preview',
    'Safety Guard 2: COPILOT_DB_ENV must be "development" or "preview"'
  )

  if (allowNonProd !== 'true' || (dbEnv !== 'development' && dbEnv !== 'preview')) {
    console.error('❌ Safety guard failure! Refusing to run Phase 4B live persistence suite.')
    process.exit(1)
  }

  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) {
    console.error('DATABASE_URL is missing!')
    process.exit(1)
  }

  const sql = neon(rawUrl)
  const testAdvisor = 'phase4b-test-advisor-1'

  try {
    // -----------------------------------------------------
    // 1. Session Creation Persistence
    // -----------------------------------------------------
    console.log('--- 1. Session Persistence ---')

    const session = await createCopilotSession({
      advisorIdentifier: testAdvisor,
      contextModuleId: 'objection-handling-module',
    })

    assert(session.id !== undefined, 'Test 1: createCopilotSession returns a valid UUID')

    const readSession = await sql`
      SELECT id, advisor_identifier, status, context_module_id
      FROM copilot_sessions
      WHERE id = ${session.id}
    `
    assert(readSession.length === 1, 'Test 2: Session persisted in live database')
    assert(readSession[0].status === 'active', 'Test 3: Default session status is "active"')
    assert(readSession[0].advisor_identifier === testAdvisor, 'Test 4: Advisor identifier persisted accurately')

    // -----------------------------------------------------
    // 2. Exchange Persistence
    // -----------------------------------------------------
    console.log('\n--- 2. Exchange Persistence ---')

    const exchange = await recordCopilotExchange({
      sessionId: session.id,
      objectionText: 'The tuition price is higher than I expected',
      isRefusal: false,
      primaryObjectionId: 'price-objection',
      secondaryObjectionIds: ['parents-spouse-approval'],
      numericConfidence: 0.88,
      confidenceBand: 'high',
      matchedScriptId: '/docs/objections/price-objection#roleplay-1',
      selectedLevel: 1,
      safetyFallback: false,
      isPersonalized: false,
    })

    assert(exchange.id !== undefined, 'Test 5: recordCopilotExchange returns valid exchange UUID')

    const readExchange = await sql`
      SELECT id, session_id, primary_objection_id, secondary_objection_ids, matched_script_id, selected_level
      FROM copilot_exchanges
      WHERE id = ${exchange.id}
    `
    assert(readExchange.length === 1, 'Test 6: Exchange persisted in live database linked to session')
    assert(readExchange[0].session_id === session.id, 'Test 7: Exchange linked to correct session_id')
    assert(readExchange[0].matched_script_id === '/docs/objections/price-objection#roleplay-1', 'Test 8: Matched script ID reference persisted')
    assert(Array.isArray(readExchange[0].secondary_objection_ids), 'Test 9: Secondary objections persisted as text array')
    assert(readExchange[0].selected_level === 1, 'Test 10: selected_level=1 persisted')

    // -----------------------------------------------------
    // 3. Feedback Persistence & Upsert Semantics
    // -----------------------------------------------------
    console.log('\n--- 3. Feedback Persistence & Upsert Semantics ---')

    const feedback1 = await recordCopilotFeedback({
      exchangeId: exchange.id,
      rating: 'thumbs-up',
      advisorIdentifier: testAdvisor,
    })
    assert(feedback1.id !== undefined, 'Test 11: Feedback record created with UUID')
    assert(feedback1.rating === 'thumbs-up', 'Test 12: Initial feedback rating recorded as thumbs-up')

    // Update rating (Upsert semantics)
    const feedback2 = await recordCopilotFeedback({
      exchangeId: exchange.id,
      rating: 'neutral',
      advisorIdentifier: testAdvisor,
    })
    assert(feedback2.id === feedback1.id, 'Test 13: Duplicate exchange_id updated existing feedback record (Upsert)')
    assert(feedback2.rating === 'neutral', 'Test 14: Updated feedback rating persisted as neutral')

    // -----------------------------------------------------
    // 4. Outcome Update Persistence
    // -----------------------------------------------------
    console.log('\n--- 4. Outcome Update Persistence ---')

    const outcomeRes = await updateCopilotOutcome({
      sessionId: session.id,
      outcomeStatus: 'enrolled',
    })
    assert(outcomeRes.success === true, 'Test 15: updateCopilotOutcome returned success')

    const readCompletedSession = await sql`
      SELECT status, outcome_status, outcome_recorded_at
      FROM copilot_sessions
      WHERE id = ${session.id}
    `
    assert(readCompletedSession[0].status === 'completed', 'Test 16: Session status set to "completed"')
    assert(readCompletedSession[0].outcome_status === 'enrolled', 'Test 17: Outcome status set to "enrolled"')
    assert(readCompletedSession[0].outcome_recorded_at !== null, 'Test 18: outcome_recorded_at timestamp set')

    // -----------------------------------------------------
    // 5. Input Validation Rejection Tests
    // -----------------------------------------------------
    console.log('\n--- 5. Input Validation & Error Handling ---')

    let invalidLevelRejected = false
    try {
      await recordCopilotExchange({
        sessionId: session.id,
        objectionText: 'test',
        numericConfidence: 0.9,
        confidenceBand: 'high',
        selectedLevel: 3, // Invalid level!
      })
    } catch {
      invalidLevelRejected = true
    }
    assert(invalidLevelRejected, 'Test 19: selectedLevel=3 rejected by persistence service')

    let invalidRatingRejected = false
    try {
      await recordCopilotFeedback({
        exchangeId: exchange.id,
        rating: 'amazing', // Invalid rating!
      })
    } catch {
      invalidRatingRejected = true
    }
    assert(invalidRatingRejected, 'Test 20: Invalid rating value rejected by persistence service')

    let invalidOutcomeRejected = false
    try {
      await updateCopilotOutcome({
        sessionId: session.id,
        outcomeStatus: 'invalid-status', // Invalid outcome!
      })
    } catch {
      invalidOutcomeRejected = true
    }
    assert(invalidOutcomeRejected, 'Test 21: Invalid outcomeStatus rejected by persistence service')

    // -----------------------------------------------------
    // 6. Privacy & Script Duplication Verification
    // -----------------------------------------------------
    console.log('\n--- 6. Privacy & Script Duplication Audit ---')

    const exchangeColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'copilot_exchanges'
    `
    const colNames = exchangeColumns.map((c) => c.column_name)

    assert(!colNames.includes('recommended_response'), 'Test 22: Zero response text stored in database exchanges table')
    assert(!colNames.includes('why_it_works'), 'Test 23: Zero coaching text stored in database exchanges table')

    const sessionColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'copilot_sessions'
    `
    const sessionColNames = sessionColumns.map((c) => c.column_name)

    assert(!sessionColNames.some((c) => c.includes('candidate')), 'Test 24: Zero candidate PII / candidate identity columns exist')

    // -----------------------------------------------------
    // 7. Cleanup
    // -----------------------------------------------------
    console.log('\n--- 7. Test Row Cleanup ---')

    await sql`DELETE FROM copilot_sessions WHERE advisor_identifier LIKE 'phase4b-test-advisor%'`

    const remainingRows = await sql`
      SELECT count(*)::int as count 
      FROM copilot_sessions 
      WHERE advisor_identifier LIKE 'phase4b-test-advisor%'
    `
    assert(remainingRows[0].count === 0, 'Test 25: 0 test rows remain in database after cleanup')

    console.log(`\n=====================================================`)
    console.log(`RESULTS: Passed ${passed}/${passed + failed} tests`)
    console.log(`=====================================================\n`)

    if (failed > 0) {
      process.exit(1)
    }
  } catch (err) {
    console.error('Phase 4B test error:', err)
    process.exit(1)
  }
}

runPhase4bPersistenceTests().catch((err) => {
  console.error('Fatal Phase 4B test error:', err)
  process.exit(1)
})
