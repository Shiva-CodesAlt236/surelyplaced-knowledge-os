import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, sql } from 'drizzle-orm'
import * as schema from '../lib/db/schema.ts'

async function runLiveDatabaseValidation() {
  console.log('=====================================================')
  console.log('   SALES COPILOT PHASE 4A.2 LIVE NEON DB VALIDATION  ')
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
  // STEP 1: Safety Environment Guards
  // -----------------------------------------------------
  console.log('--- 1. Safety Environment Guards ---')

  const dbEnv = process.env.COPILOT_DB_ENV
  const allowNonProd = process.env.COPILOT_DB_TEST_ALLOW_NON_PROD

  assert(
    allowNonProd === 'true',
    'Safety Guard: COPILOT_DB_TEST_ALLOW_NON_PROD must equal "true"'
  )
  assert(
    dbEnv === 'development' || dbEnv === 'preview',
    'Safety Guard: COPILOT_DB_ENV must equal "development" or "preview"'
  )
  assert(
    dbEnv !== 'production',
    'Safety Guard: COPILOT_DB_ENV MUST NOT equal "production"'
  )

  const connectionString = process.env.DATABASE_URL
  assert(
    typeof connectionString === 'string' && connectionString.length > 0,
    'Safety Guard: DATABASE_URL environment variable is present'
  )

  if (allowNonProd !== 'true' || (dbEnv !== 'development' && dbEnv !== 'preview') || dbEnv === 'production' || !connectionString) {
    console.error('❌ ABORTING: Safety environment guards failed.')
    process.exit(1)
  }

  const sqlClient = neon(connectionString)
  const db = drizzle(sqlClient, { schema })

  // Log redacted connection host for proof
  const hostMatch = connectionString.match(/@([^/]+)/)
  const hostName = hostMatch ? hostMatch[1] : 'unknown-host'
  console.log(`✓ Connected to Non-Production Database Host: postgresql://***@${hostName}`)

  const TEST_ADVISOR = `phase4-test-advisor-${Date.now()}`

  try {
    // -----------------------------------------------------
    // STEP 2: Live Schema & Metadata Introspection
    // -----------------------------------------------------
    console.log('\n--- 2. Live Schema Metadata Introspection ---')

    const tableRows = await sqlClient`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'copilot_%';
    `
    const tableNames = tableRows.map((r) => r.table_name)
    assert(tableNames.includes('copilot_sessions'), 'Live Introspection 1: copilot_sessions table exists')
    assert(tableNames.includes('copilot_exchanges'), 'Live Introspection 1: copilot_exchanges table exists')
    assert(tableNames.includes('copilot_feedback'), 'Live Introspection 1: copilot_feedback table exists')
    assert(tableNames.length === 3, 'Live Introspection 1: Exactly 3 copilot persistence tables exist')

    const enumRows = await sqlClient`
      SELECT typname 
      FROM pg_type 
      WHERE typname LIKE 'copilot_%';
    `
    const enumNames = enumRows.map((r) => r.typname)
    assert(enumNames.includes('copilot_session_status'), 'Live Introspection 2: copilot_session_status enum type exists')
    assert(enumNames.includes('copilot_outcome_status'), 'Live Introspection 2: copilot_outcome_status enum type exists')
    assert(enumNames.includes('copilot_outcome_reason'), 'Live Introspection 2: copilot_outcome_reason enum type exists')
    assert(enumNames.includes('copilot_confidence_band'), 'Live Introspection 2: copilot_confidence_band enum type exists')
    assert(enumNames.includes('copilot_feedback_rating'), 'Live Introspection 2: copilot_feedback_rating enum type exists')

    const columnRows = await sqlClient`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'copilot_exchanges' AND column_name = 'secondary_objection_ids';
    `
    const arrayCol = columnRows[0]
    assert(
      arrayCol && (arrayCol.data_type === 'ARRAY' || arrayCol.udt_name === '_text'),
      'Live Introspection 3: secondary_objection_ids is PostgreSQL native text[]'
    )

    const checkRows = await sqlClient`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'copilot_exchanges' AND constraint_name = 'copilot_exchanges_selected_level_check';
    `
    assert(checkRows.length === 1, 'Live Introspection 4: selected_level CHECK constraint exists')

    const uniqueRows = await sqlClient`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'copilot_feedback' AND constraint_name = 'copilot_feedback_exchange_id_unique';
    `
    assert(uniqueRows.length === 1, 'Live Introspection 5: exchange_id UNIQUE constraint exists')

    const indexRows = await sqlClient`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename LIKE 'copilot_%';
    `
    assert(indexRows.length >= 7, 'Live Introspection 6: 7 expected indexes exist on copilot tables')

    // -----------------------------------------------------
    // STEP 3: Live Round-Trip Test (Session + 2 Exchanges)
    // -----------------------------------------------------
    console.log('\n--- 3. Live Round-Trip Test ---')

    const [insertedSession] = await db
      .insert(schema.copilotSessions)
      .values({
        advisorIdentifier: TEST_ADVISOR,
        status: 'active',
      })
      .returning()

    assert(insertedSession !== undefined && insertedSession.id !== undefined, 'Live Round-Trip 1: Session inserted')

    const [ex1] = await db
      .insert(schema.copilotExchanges)
      .values({
        sessionId: insertedSession.id,
        objectionText: 'It is too expensive.',
        isRefusal: false,
        primaryObjectionId: 'price-objection',
        secondaryObjectionIds: ['parents-spouse-approval'],
        numericConfidence: 0.85,
        confidenceBand: 'high',
        matchedScriptId: '/docs/objections/price-objection#roleplay-1',
        selectedLevel: 1,
      })
      .returning()

    const [ex2] = await db
      .insert(schema.copilotExchanges)
      .values({
        sessionId: insertedSession.id,
        objectionText: 'How do I know your company is real?',
        isRefusal: false,
        primaryObjectionId: 'trust-and-credibility',
        secondaryObjectionIds: [],
        numericConfidence: 0.78,
        confidenceBand: 'high',
        matchedScriptId: '/docs/objections/trust-and-credibility#roleplay-1',
        selectedLevel: 2,
      })
      .returning()

    assert(ex1 !== undefined && ex2 !== undefined, 'Live Round-Trip 2: Two linked exchanges inserted')

    const fetchedExchanges = await db
      .select()
      .from(schema.copilotExchanges)
      .where(eq(schema.copilotExchanges.sessionId, insertedSession.id))

    assert(fetchedExchanges.length === 2, 'Live Round-Trip 3: Query returned exactly 2 linked exchanges for session')

    // -----------------------------------------------------
    // STEP 4: Live Constraint Enforcement Tests
    // -----------------------------------------------------
    console.log('\n--- 4. Live Constraint Enforcement Tests ---')

    let invalidStatusRejected = false
    try {
      await sqlClient`
        INSERT INTO copilot_sessions (advisor_identifier, status)
        VALUES (${TEST_ADVISOR}, 'not-a-status'::copilot_session_status);
      `
    } catch (err) {
      invalidStatusRejected = true
    }
    assert(invalidStatusRejected, 'Constraint Test 1: Invalid session status rejected by PostgreSQL enum')

    let invalidOutcomeRejected = false
    try {
      await sqlClient`
        INSERT INTO copilot_sessions (advisor_identifier, outcome_status)
        VALUES (${TEST_ADVISOR}, 'not-an-outcome'::copilot_outcome_status);
      `
    } catch (err) {
      invalidOutcomeRejected = true
    }
    assert(invalidOutcomeRejected, 'Constraint Test 2: Invalid outcome status rejected by PostgreSQL enum')

    let invalidReasonRejected = false
    try {
      await sqlClient`
        INSERT INTO copilot_sessions (advisor_identifier, outcome_reason)
        VALUES (${TEST_ADVISOR}, 'not-a-reason'::copilot_outcome_reason);
      `
    } catch (err) {
      invalidReasonRejected = true
    }
    assert(invalidReasonRejected, 'Constraint Test 3: Invalid outcome reason rejected by PostgreSQL enum')

    let invalidConfidenceRejected = false
    try {
      await sqlClient`
        INSERT INTO copilot_exchanges (session_id, objection_text, numeric_confidence, confidence_band)
        VALUES (${insertedSession.id}, 'test', 0.9, 'super-high'::copilot_confidence_band);
      `
    } catch (err) {
      invalidConfidenceRejected = true
    }
    assert(invalidConfidenceRejected, 'Constraint Test 4: Invalid confidence band rejected by PostgreSQL enum')

    let invalidRatingRejected = false
    try {
      await sqlClient`
        INSERT INTO copilot_feedback (exchange_id, rating)
        VALUES (${ex1.id}, 'amazing'::copilot_feedback_rating);
      `
    } catch (err) {
      invalidRatingRejected = true
    }
    assert(invalidRatingRejected, 'Constraint Test 5: Invalid feedback rating rejected by PostgreSQL enum')

    let invalidSelectedLevelRejected = false
    try {
      await db.insert(schema.copilotExchanges).values({
        sessionId: insertedSession.id,
        objectionText: 'test level 3',
        isRefusal: false,
        numericConfidence: 0.8,
        confidenceBand: 'high',
        selectedLevel: 3,
      })
    } catch (err) {
      invalidSelectedLevelRejected = true
    }
    assert(invalidSelectedLevelRejected, 'Constraint Test 6: selected_level = 3 rejected by DB CHECK constraint')

    // -----------------------------------------------------
    // STEP 5: Live Duplicate Feedback UNIQUE Constraint Test
    // -----------------------------------------------------
    console.log('\n--- 5. Live Duplicate Feedback UNIQUE Constraint Test ---')

    await db.insert(schema.copilotFeedback).values({
      exchangeId: ex1.id,
      advisorIdentifier: TEST_ADVISOR,
      rating: 'thumbs-up',
    })

    let duplicateFeedbackRejected = false
    try {
      await db.insert(schema.copilotFeedback).values({
        exchangeId: ex1.id,
        advisorIdentifier: TEST_ADVISOR,
        rating: 'thumbs-down',
      })
    } catch (err) {
      duplicateFeedbackRejected = true
    }
    assert(duplicateFeedbackRejected, 'UNIQUE Test: Duplicate feedback insert for exchange_id rejected by DB UNIQUE constraint')

    // -----------------------------------------------------
    // STEP 6: Live Cascade Delete Test
    // -----------------------------------------------------
    console.log('\n--- 6. Live Cascade Delete Test ---')

    await db.delete(schema.copilotSessions).where(eq(schema.copilotSessions.id, insertedSession.id))

    const remainingSessions = await db.select().from(schema.copilotSessions).where(eq(schema.copilotSessions.id, insertedSession.id))
    const remainingExchanges = await db.select().from(schema.copilotExchanges).where(eq(schema.copilotExchanges.sessionId, insertedSession.id))
    const remainingFeedback = await db.select().from(schema.copilotFeedback).where(eq(schema.copilotFeedback.exchangeId, ex1.id))

    assert(
      remainingSessions.length === 0 && remainingExchanges.length === 0 && remainingFeedback.length === 0,
      'Cascade Delete Test: Deleting copilotSession recursively deleted exchanges and feedback rows ON DELETE CASCADE'
    )

    // -----------------------------------------------------
    // STEP 7: Live Outcome Update Test
    // -----------------------------------------------------
    console.log('\n--- 7. Live Outcome Update Test ---')

    const [sessionToUpdate] = await db
      .insert(schema.copilotSessions)
      .values({
        advisorIdentifier: TEST_ADVISOR,
        status: 'active',
      })
      .returning()

    const [updatedSession] = await db
      .update(schema.copilotSessions)
      .set({
        outcomeStatus: 'lost',
        outcomeReason: 'price',
        outcomeNotes: 'Synthetic phase4 test note',
        outcomeRecordedAt: new Date(),
        status: 'completed',
      })
      .where(eq(schema.copilotSessions.id, sessionToUpdate.id))
      .returning()

    assert(
      updatedSession.outcomeStatus === 'lost' &&
        updatedSession.outcomeReason === 'price' &&
        updatedSession.status === 'completed',
      'Outcome Update Test: Session outcome updated and status set to "completed"'
    )

    // Clean up update test session
    await db.delete(schema.copilotSessions).where(eq(schema.copilotSessions.id, sessionToUpdate.id))

    // -----------------------------------------------------
    // STEP 8: Cleanup Test Data Assertion
    // -----------------------------------------------------
    console.log('\n--- 8. Cleanup Test Data Assertion ---')

    await sqlClient`
      DELETE FROM copilot_sessions WHERE advisor_identifier LIKE 'phase4-test-%';
    `

    const remainingTestRows = await sqlClient`
      SELECT COUNT(*)::int AS cnt FROM copilot_sessions WHERE advisor_identifier LIKE 'phase4-test-%';
    `
    const leftoverCount = remainingTestRows[0]?.cnt || 0
    assert(leftoverCount === 0, 'Cleanup Assertion: Exactly 0 test rows remaining in database')

    console.log(`\n=====================================================`)
    console.log(`RESULTS: Passed ${passed}/${passed + failed} live database tests`)
    console.log(`=====================================================\n`)

    if (failed > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Live Database Validation Error:', error)
    // Emergency cleanup
    try {
      await sqlClient`DELETE FROM copilot_sessions WHERE advisor_identifier LIKE 'phase4-test-%';`
    } catch {}
    process.exit(1)
  }
}

runLiveDatabaseValidation().catch((err) => {
  console.error('Fatal live test error:', err)
  process.exit(1)
})
