import { neon } from '@neondatabase/serverless'
import fs from 'node:fs'

// Import API route handlers directly for true route-layer testing
import { POST as copilotRoute } from '../app/api/copilot/route.ts'
import { POST as feedbackRoute } from '../app/api/copilot/feedback/route.ts'
import { POST as outcomeRoute } from '../app/api/copilot/outcome/route.ts'

import {
  createCopilotSession,
  recordCopilotExchange,
  recordCopilotFeedback,
  updateCopilotOutcome,
} from '../lib/copilot/persistence.ts'

import {
  validateAdvisorIdentifier,
  normalizeAdvisorIdentifier,
} from '../lib/copilot/advisor.ts'

import {
  isStaleSessionError,
} from '../lib/copilot/session.ts'

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
  console.log('   SALES COPILOT PHASE 4B.3 PRODUCT ALIGNMENT SUITE  ')
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
  const testRunSuffix = Date.now()
  const testAdvisor = `phase4b-test-advisor-${testRunSuffix}`

  try {
    // -----------------------------------------------------
    // 1. Advisor & Stale Session Unit Helper Tests
    // -----------------------------------------------------
    console.log('--- 1. Pure Advisor & Session Helper Unit Tests ---')

    const norm1 = normalizeAdvisorIdentifier(`   phase4b-normalization-test-${testRunSuffix}   Advisor   `)
    assert(
      norm1 === `phase4b-normalization-test-${testRunSuffix} Advisor`,
      'Advisor Test 1: Trims and collapses internal spaces without lowercasing'
    )

    const valEmpty = validateAdvisorIdentifier('    ')
    assert(!valEmpty.valid, 'Advisor Test 2: Blank advisor identifier rejected')

    const valLong = validateAdvisorIdentifier('A'.repeat(101))
    assert(!valLong.valid, 'Advisor Test 3: Advisor identifier > 100 chars rejected')

    const stale1 = isStaleSessionError(400, 'Cannot append exchange to a completed session.')
    assert(stale1 === true, 'Session Test 1: Completed session 400 classified as stale session error')

    const stale2 = isStaleSessionError(400, 'Session not found for provided sessionId.')
    assert(stale2 === true, 'Session Test 2: Session not found 400 classified as stale session error')

    const stale3 = isStaleSessionError(400, 'Inactive session.')
    assert(stale3 === true, 'Session Test 3: Inactive session 400 classified as stale session error')

    const stale4 = isStaleSessionError(400, 'Invalid sessionId format. Must be a valid UUID.')
    assert(stale4 === true, 'Session Test 4: Invalid sessionId format 400 classified as stale session error')

    const stale5 = isStaleSessionError(400, 'Unrelated client error.')
    assert(stale5 === false, 'Session Test 5: Unrelated 400 error NOT classified as stale session error')

    const stale6 = isStaleSessionError(500, 'Cannot append exchange to a completed session.')
    assert(stale6 === false, 'Session Test 6: HTTP 500 error NOT classified as stale session error')

    // -----------------------------------------------------
    // 2. Persistence Service Direct Function Tests
    // -----------------------------------------------------
    console.log('\n--- 2. Persistence Service Direct Function Tests ---')

    let blankAdvisorRejected = false
    try {
      await createCopilotSession({ advisorIdentifier: '   ' })
    } catch {
      blankAdvisorRejected = true
    }
    assert(blankAdvisorRejected, 'Service Test 1: createCopilotSession rejects blank advisor identifier')

    const session = await createCopilotSession({
      advisorIdentifier: `   phase4b-normalization-test-${testRunSuffix}   Advisor   `,
      contextModuleId: 'objection-handling-module',
    })

    assert(session.id !== undefined, 'Service Test 2: createCopilotSession returns a valid UUID')

    const readSession = await sql`
      SELECT id, advisor_identifier, status, context_module_id
      FROM copilot_sessions
      WHERE id = ${session.id}
    `
    assert(readSession.length === 1, 'Service Test 3: Session persisted in live database')
    assert(readSession[0].status === 'active', 'Service Test 4: Default session status is "active"')
    assert(
      readSession[0].advisor_identifier === `phase4b-normalization-test-${testRunSuffix} Advisor`,
      'Service Test 5: Advisor identifier normalized and persisted accurately'
    )

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

    assert(exchange.id !== undefined, 'Service Test 6: recordCopilotExchange returns valid exchange UUID')

    // Feedback Upsert
    const feedback1 = await recordCopilotFeedback({
      exchangeId: exchange.id,
      rating: 'thumbs-up',
      advisorIdentifier: testAdvisor,
    })
    assert(feedback1.id !== undefined, 'Service Test 7: Feedback record created with UUID')

    const feedback2 = await recordCopilotFeedback({
      exchangeId: exchange.id,
      rating: 'neutral',
      advisorIdentifier: testAdvisor,
    })
    assert(feedback2.id === feedback1.id, 'Service Test 8: Duplicate exchange_id updated existing feedback record (Upsert)')

    // Outcome Follow-Up (Leaves session active)
    const followUpRes = await updateCopilotOutcome({
      sessionId: session.id,
      outcomeStatus: 'follow-up',
    })
    assert(followUpRes.success === true, 'Service Test 9: updateCopilotOutcome returned success for follow-up')

    const readFollowUpSession = await sql`SELECT status FROM copilot_sessions WHERE id = ${session.id}`
    assert(readFollowUpSession[0].status === 'active', 'Service Test 10: "follow-up" outcome leaves session status "active"')

    // Outcome Enrolled (Marks session completed)
    const enrolledRes = await updateCopilotOutcome({
      sessionId: session.id,
      outcomeStatus: 'enrolled',
    })
    assert(enrolledRes.success === true, 'Service Test 11: updateCopilotOutcome returned success for enrolled')

    const readEnrolledSession = await sql`SELECT status FROM copilot_sessions WHERE id = ${session.id}`
    assert(readEnrolledSession[0].status === 'completed', 'Service Test 12: "enrolled" outcome marks session status "completed"')

    // Completed Outcome Corrections & Reopening Protections
    const correctionEnrolledToLost = await updateCopilotOutcome({
      sessionId: session.id,
      outcomeStatus: 'lost',
      outcomeReason: 'price',
    })
    assert(correctionEnrolledToLost.success === true, 'Service Test 13: Completed session outcome updated from enrolled to lost')

    const readCorrectedLost = await sql`SELECT status, outcome_status, outcome_reason FROM copilot_sessions WHERE id = ${session.id}`
    assert(readCorrectedLost[0].status === 'completed', 'Service Test 14: Session status remains "completed" after outcome correction')
    assert(readCorrectedLost[0].outcome_status === 'lost' && readCorrectedLost[0].outcome_reason === 'price', 'Service Test 15: Outcome status updated to lost with price reason')

    const correctionReasonOnly = await updateCopilotOutcome({
      sessionId: session.id,
      outcomeStatus: 'lost',
      outcomeReason: 'trust',
    })
    assert(correctionReasonOnly.success === true, 'Service Test 16: Completed session reason updated from price to trust')

    const readCorrectedReason = await sql`SELECT status, outcome_reason FROM copilot_sessions WHERE id = ${session.id}`
    assert(readCorrectedReason[0].status === 'completed' && readCorrectedReason[0].outcome_reason === 'trust', 'Service Test 17: Reason updated to trust while remaining completed')

    let completedToFollowUpRejected = false
    try {
      await updateCopilotOutcome({
        sessionId: session.id,
        outcomeStatus: 'follow-up',
      })
    } catch (err) {
      completedToFollowUpRejected = true
    }
    assert(completedToFollowUpRejected, 'Service Test 18: Changing completed session to follow-up rejected with error')

    const readUnreopenedSession = await sql`SELECT status FROM copilot_sessions WHERE id = ${session.id}`
    assert(readUnreopenedSession[0].status === 'completed', 'Service Test 19: Completed session was NOT reopened to active')

    // -----------------------------------------------------
    // 3. Actual Next.js API Route Execution Tests
    // -----------------------------------------------------
    console.log('\n--- 3. Actual Next.js API Route Execution Tests ---')

    // Missing Advisor ID -> HTTP 400
    const noAdvisorReq = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectionText: 'Valid objection text' }),
    })
    const noAdvisorRes = await copilotRoute(noAdvisorReq)
    assert(noAdvisorRes.status === 400, 'Route Test 1: POST /api/copilot without advisorId rejected with HTTP 400')

    // Blank Advisor ID -> HTTP 400
    const blankAdvisorReq = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectionText: 'Valid objection text', advisorId: '   ' }),
    })
    const blankAdvisorRes = await copilotRoute(blankAdvisorReq)
    assert(blankAdvisorRes.status === 400, 'Route Test 2: POST /api/copilot with blank advisorId rejected with HTTP 400')

    // Oversized Advisor ID -> HTTP 400
    const longAdvisorReq = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectionText: 'Valid objection text', advisorId: 'A'.repeat(101) }),
    })
    const longAdvisorRes = await copilotRoute(longAdvisorReq)
    assert(longAdvisorRes.status === 400, 'Route Test 3: POST /api/copilot with >100 char advisorId rejected with HTTP 400')

    // Valid Request -> HTTP 200
    const route1Req = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objectionText: 'I need time to think about this investment',
        advisorId: testAdvisor,
      }),
    })
    const route1Res = await copilotRoute(route1Req)
    assert(route1Res.status === 200, 'Route Test 4: POST /api/copilot with valid advisorId returned HTTP 200')

    const route1Data = await route1Res.json()
    assert(route1Data.persistenceStatus === 'persisted', 'Route Test 5: POST /api/copilot returns persistenceStatus="persisted"')
    assert(typeof route1Data.sessionId === 'string' && route1Data.sessionId.length > 20, 'Route Test 6: Returns real DB UUID sessionId')

    const apiSessionId = route1Data.sessionId
    const apiExchangeId = route1Data.exchangeId

    // Continuation of active session
    const route2Req = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objectionText: 'Is there a money back guarantee if I am not satisfied?',
        sessionId: apiSessionId,
        advisorId: testAdvisor,
      }),
    })
    const route2Res = await copilotRoute(route2Req)
    const route2Data = await route2Res.json()
    assert(route2Res.status === 200 && route2Data.sessionId === apiSessionId, 'Route Test 7: Continued active session preserved same sessionId')

    // Feedback
    const feedbackReq = new Request('http://localhost/api/copilot/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exchangeId: apiExchangeId,
        rating: 'thumbs-up',
        advisorId: testAdvisor,
      }),
    })
    const feedbackRes = await feedbackRoute(feedbackReq)
    assert(feedbackRes.status === 200, 'Route Test 8: POST /api/copilot/feedback returned HTTP 200')

    // Outcome (Enrolled -> Completes Session)
    const outcomeReq = new Request('http://localhost/api/copilot/outcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: apiSessionId,
        outcome: 'enrolled',
      }),
    })
    const outcomeRes = await outcomeRoute(outcomeReq)
    assert(outcomeRes.status === 200, 'Route Test 9: POST /api/copilot/outcome returned HTTP 200')

    // Completed session outcome correction to follow-up -> REJECTED WITH HTTP 400
    const followupReopenReq = new Request('http://localhost/api/copilot/outcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: apiSessionId,
        outcome: 'follow-up',
      }),
    })
    const followupReopenRes = await outcomeRoute(followupReopenReq)
    assert(followupReopenRes.status === 400, 'Route Test 10: Outcome API rejected completed to follow-up update with HTTP 400')
    const followupReopenData = await followupReopenRes.json()
    assert(
      typeof followupReopenData.error === 'string' &&
        followupReopenData.error.includes('Completed session cannot be changed to follow-up'),
      'Route Test 11: Outcome API returns clear error message explaining completed session reopening rejection'
    )

    // Appending exchange to completed session -> HTTP 400
    const completedAppendReq = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objectionText: 'Another question after enrollment',
        sessionId: apiSessionId,
        advisorId: testAdvisor,
      }),
    })
    const completedAppendRes = await copilotRoute(completedAppendReq)
    assert(completedAppendRes.status === 400, 'Route Test 12: Appending exchange to completed session rejected with HTTP 400')

    // -----------------------------------------------------
    // 4. API Input Validation & Non-Existent Identifier Tests
    // -----------------------------------------------------
    console.log('\n--- 4. API Validation & Non-Existent Identifier Tests ---')

    // Empty objectionText
    const emptyReq = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectionText: '   ', advisorId: testAdvisor }),
    })
    const emptyRes = await copilotRoute(emptyReq)
    assert(emptyRes.status === 400, 'Validation Test 1: Empty objectionText rejected with HTTP 400')

    // Invalid Session UUID format
    const badUuidReq = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectionText: 'Valid text', sessionId: 'not-a-valid-uuid', advisorId: testAdvisor }),
    })
    const badUuidRes = await copilotRoute(badUuidReq)
    assert(badUuidRes.status === 400, 'Validation Test 2: Invalid sessionId UUID syntax rejected with HTTP 400')

    // Non-existent Feedback Exchange UUID -> HTTP 404
    const nonExistentExchangeReq = new Request('http://localhost/api/copilot/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exchangeId: '00000000-0000-4000-8000-000000000000',
        rating: 'thumbs-up',
      }),
    })
    const nonExistentExchangeRes = await feedbackRoute(nonExistentExchangeReq)
    assert(nonExistentExchangeRes.status === 404, 'Validation Test 3: Non-existent feedback exchange UUID returns HTTP 404')

    // Non-existent Session Outcome UUID -> HTTP 404
    const nonExistentSessionReq = new Request('http://localhost/api/copilot/outcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: '00000000-0000-4000-8000-000000000000',
        outcome: 'enrolled',
      }),
    })
    const nonExistentSessionRes = await outcomeRoute(nonExistentSessionReq)
    assert(nonExistentSessionRes.status === 404, 'Validation Test 4: Non-existent outcome session UUID returns HTTP 404')

    // -----------------------------------------------------
    // 5. Privacy & Script Duplication Audit
    // -----------------------------------------------------
    console.log('\n--- 5. Privacy & Script Duplication Audit ---')

    const exchangeColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'copilot_exchanges'
    `
    const colNames = exchangeColumns.map((c) => c.column_name)

    assert(!colNames.includes('recommended_response'), 'Privacy Test 1: Zero response text stored in database exchanges table')
    assert(!colNames.includes('why_it_works'), 'Privacy Test 2: Zero coaching text stored in database exchanges table')

    const sessionColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'copilot_sessions'
    `
    const sessionColNames = sessionColumns.map((c) => c.column_name)

    assert(!sessionColNames.some((c) => c.includes('candidate')), 'Privacy Test 3: Zero candidate PII / candidate identity columns exist')

    console.log(`\n=====================================================`)
    console.log(`RESULTS: Passed ${passed}/${passed + failed} tests`)
    console.log(`=====================================================\n`)

    if (failed > 0) {
      process.exit(1)
    }
  } catch (err) {
    console.error('Phase 4B test error:', err)
    process.exit(1)
  } finally {
    // -----------------------------------------------------
    // 6. Controlled Test-Only Prefix Cleanup in finally block
    // -----------------------------------------------------
    console.log('Executing controlled test row cleanup...')
    try {
      await sql`
        DELETE FROM copilot_sessions 
        WHERE advisor_identifier LIKE 'phase4b-test-%' 
           OR advisor_identifier LIKE 'phase4b-normalization-%'
      `
      console.log('✓ Controlled test row cleanup completed successfully.')
    } catch (cleanupErr) {
      console.error('Cleanup error:', cleanupErr)
    }
  }
}

runPhase4bPersistenceTests().catch((err) => {
  console.error('Fatal Phase 4B test error:', err)
  process.exit(1)
})
