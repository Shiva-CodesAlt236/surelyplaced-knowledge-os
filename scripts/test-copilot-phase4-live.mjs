import { neon } from '@neondatabase/serverless'
import fs from 'node:fs'

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

async function runLiveDatabaseValidation() {
  console.log('=====================================================')
  console.log('   SALES COPILOT PHASE 4A.2 LIVE DB VERIFICATION      ')
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

  // 1. Production Safety Guards
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
  assert(
    dbEnv !== 'production',
    'Safety Guard 3: COPILOT_DB_ENV is NOT production'
  )

  if (allowNonProd !== 'true' || (dbEnv !== 'development' && dbEnv !== 'preview')) {
    console.error('❌ Safety guard failure! Refusing to run live DB suite.')
    process.exit(1)
  }

  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) {
    console.error('DATABASE_URL is missing!')
    process.exit(1)
  }

  const redactedUrl = rawUrl.replace(/postgresql:\/\/([^:]+):([^@]+)@/, 'postgresql://***:***@')
  console.log(`Connected to Neon non-production target (${dbEnv}): ${redactedUrl}\n`)

  const sql = neon(rawUrl)

  try {
    // -----------------------------------------------------
    // 2. Introspection Checks
    // -----------------------------------------------------
    console.log('--- 1. Live Database Metadata Introspection ---')

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'copilot_%'
    `
    const tableNames = tables.map((t) => t.table_name)
    assert(tableNames.includes('copilot_sessions'), 'DB Test 1: copilot_sessions table exists')
    assert(tableNames.includes('copilot_exchanges'), 'DB Test 1: copilot_exchanges table exists')
    assert(tableNames.includes('copilot_feedback'), 'DB Test 1: copilot_feedback table exists')
    assert(tableNames.length === 3, 'DB Test 1: Exactly 3 copilot tables exist in live DB')

    const enums = await sql`
      SELECT typname 
      FROM pg_type 
      WHERE typcategory = 'E' AND typname LIKE 'copilot_%'
    `
    const enumNames = enums.map((e) => e.typname)
    assert(enumNames.includes('copilot_session_status'), 'DB Test 2: copilot_session_status pgEnum exists')
    assert(enumNames.includes('copilot_outcome_status'), 'DB Test 2: copilot_outcome_status pgEnum exists')
    assert(enumNames.includes('copilot_outcome_reason'), 'DB Test 2: copilot_outcome_reason pgEnum exists')
    assert(enumNames.includes('copilot_confidence_band'), 'DB Test 2: copilot_confidence_band pgEnum exists')
    assert(enumNames.includes('copilot_feedback_rating'), 'DB Test 2: copilot_feedback_rating pgEnum exists')

    const secObjCol = await sql`
      SELECT udt_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'copilot_exchanges' AND column_name = 'secondary_objection_ids'
    `
    assert(secObjCol[0]?.data_type === 'ARRAY' || secObjCol[0]?.udt_name === '_text', 'DB Test 3: secondary_objection_ids is native text[]')

    const checkConstraints = await sql`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'copilot_exchanges' AND constraint_type = 'CHECK'
    `
    assert(checkConstraints.length >= 1, 'DB Test 4: selected_level CHECK constraint exists in live DB')

    const uniqueConstraints = await sql`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'copilot_feedback' AND constraint_type = 'UNIQUE'
    `
    assert(uniqueConstraints.length >= 1, 'DB Test 5: copilot_feedback UNIQUE constraint exists in live DB')

    const indexes = await sql`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename LIKE 'copilot_%'
    `
    assert(indexes.length >= 7, 'DB Test 6: All 7 expected indexes exist in live DB')

    const forbiddenTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('sales_scripts', 'objection_categories', 'users', 'auth', 'candidates')
    `
    assert(forbiddenTables.length === 0, 'DB Test 7: Zero script duplication or auth/CRM tables exist')

    // -----------------------------------------------------
    // 3. Round-Trip CRUD Test
    // -----------------------------------------------------
    console.log('\n--- 2. Live Database Round-Trip CRUD Test ---')

    const testAdvisor = 'phase4-test-advisor-1'

    const sessionRes = await sql`
      INSERT INTO copilot_sessions (advisor_identifier, status)
      VALUES (${testAdvisor}, 'active')
      RETURNING id, advisor_identifier, status
    `
    const sessionId = sessionRes[0].id
    assert(sessionId !== undefined, 'CRUD Test 1: Insert session succeeded with UUID PK')

    const ex1Res = await sql`
      INSERT INTO copilot_exchanges (
        session_id, objection_text, is_refusal, primary_objection_id, 
        secondary_objection_ids, numeric_confidence, confidence_band, matched_script_id
      )
      VALUES (
        ${sessionId}, 'It is too expensive', false, 'price-objection',
        ARRAY['parents-spouse-approval']::text[], 0.85, 'high', '/docs/objections/price-objection#roleplay-1'
      )
      RETURNING id
    `
    const exchange1Id = ex1Res[0].id

    const ex2Res = await sql`
      INSERT INTO copilot_exchanges (
        session_id, objection_text, is_refusal, primary_objection_id, 
        secondary_objection_ids, numeric_confidence, confidence_band, matched_script_id
      )
      VALUES (
        ${sessionId}, 'I want to think about it', false, 'need-time-to-think',
        '{}'::text[], 0.90, 'high', '/docs/objections/need-time-to-think#roleplay-1'
      )
      RETURNING id
    `
    const exchange2Id = ex2Res[0].id

    assert(exchange1Id && exchange2Id, 'CRUD Test 2: Inserted 2 exchanges linked to single session')

    const readExchanges = await sql`
      SELECT id, session_id, objection_text, secondary_objection_ids
      FROM copilot_exchanges
      WHERE session_id = ${sessionId}
    `
    assert(readExchanges.length === 2, 'CRUD Test 3: Select returned exactly 2 linked exchanges')
    assert(Array.isArray(readExchanges[0].secondary_objection_ids), 'CRUD Test 3: secondary_objection_ids returned as text array')

    // -----------------------------------------------------
    // 4. Live DB Constraint Rejection Tests
    // -----------------------------------------------------
    console.log('\n--- 3. Live Database Constraint Rejection Tests ---')

    // Test Invalid Session Status Enum
    let sessionEnumRejected = false
    try {
      await sql`
        INSERT INTO copilot_sessions (advisor_identifier, status)
        VALUES (${testAdvisor}, 'not-a-status')
      `
    } catch {
      sessionEnumRejected = true
    }
    assert(sessionEnumRejected, 'Constraint Test 1: Invalid session status enum rejected by Postgres')

    // Test Invalid Outcome Status Enum
    let outcomeEnumRejected = false
    try {
      await sql`
        INSERT INTO copilot_sessions (advisor_identifier, status, outcome_status)
        VALUES (${testAdvisor}, 'active', 'not-an-outcome')
      `
    } catch {
      outcomeEnumRejected = true
    }
    assert(outcomeEnumRejected, 'Constraint Test 2: Invalid outcome status enum rejected by Postgres')

    // Test Invalid Outcome Reason Enum
    let outcomeReasonRejected = false
    try {
      await sql`
        INSERT INTO copilot_sessions (advisor_identifier, status, outcome_status, outcome_reason)
        VALUES (${testAdvisor}, 'completed', 'lost', 'not-a-reason')
      `
    } catch {
      outcomeReasonRejected = true
    }
    assert(outcomeReasonRejected, 'Constraint Test 3: Invalid outcome reason enum rejected by Postgres')

    // Test Invalid Confidence Band Enum
    let confidenceEnumRejected = false
    try {
      await sql`
        INSERT INTO copilot_exchanges (
          session_id, objection_text, numeric_confidence, confidence_band
        )
        VALUES (${sessionId}, 'test text', 0.9, 'super-high')
      `
    } catch {
      confidenceEnumRejected = true
    }
    assert(confidenceEnumRejected, 'Constraint Test 4: Invalid confidence band enum rejected by Postgres')

    // Test Invalid Feedback Rating Enum
    let feedbackEnumRejected = false
    try {
      await sql`
        INSERT INTO copilot_feedback (exchange_id, rating)
        VALUES (${exchange1Id}, 'amazing')
      `
    } catch {
      feedbackEnumRejected = true
    }
    assert(feedbackEnumRejected, 'Constraint Test 5: Invalid feedback rating enum rejected by Postgres')

    // Test CHECK Constraint (selected_level = 3)
    let checkConstraintRejected = false
    try {
      await sql`
        INSERT INTO copilot_exchanges (
          session_id, objection_text, numeric_confidence, confidence_band, selected_level
        )
        VALUES (${sessionId}, 'test text', 0.9, 'high', 3)
      `
    } catch {
      checkConstraintRejected = true
    }
    assert(checkConstraintRejected, 'Constraint Test 6: selected_level = 3 rejected by Postgres CHECK constraint')

    // -----------------------------------------------------
    // 5. UNIQUE Constraint Test
    // -----------------------------------------------------
    console.log('\n--- 4. Feedback UNIQUE Constraint Test ---')

    await sql`
      INSERT INTO copilot_feedback (exchange_id, rating)
      VALUES (${exchange1Id}, 'thumbs-up')
    `

    let duplicateFeedbackRejected = false
    try {
      await sql`
        INSERT INTO copilot_feedback (exchange_id, rating)
        VALUES (${exchange1Id}, 'neutral')
      `
    } catch {
      duplicateFeedbackRejected = true
    }
    assert(duplicateFeedbackRejected, 'UNIQUE Test 1: Duplicate feedback exchange_id rejected by Postgres UNIQUE constraint')

    // -----------------------------------------------------
    // 6. Cascade Delete Test
    // -----------------------------------------------------
    console.log('\n--- 5. Cascade Delete Test ---')

    await sql`DELETE FROM copilot_sessions WHERE id = ${sessionId}`

    const checkExchanges = await sql`SELECT id FROM copilot_exchanges WHERE session_id = ${sessionId}`
    const checkFeedback = await sql`SELECT id FROM copilot_feedback WHERE exchange_id = ${exchange1Id}`

    assert(checkExchanges.length === 0, 'Cascade Test 1: Parent session deletion deleted linked exchanges')
    assert(checkFeedback.length === 0, 'Cascade Test 2: Parent session deletion deleted linked feedback row')

    // -----------------------------------------------------
    // 7. Outcome Update Foundation Test
    // -----------------------------------------------------
    console.log('\n--- 6. Outcome Update Test ---')

    const session2 = await sql`
      INSERT INTO copilot_sessions (advisor_identifier, status)
      VALUES (${testAdvisor}, 'active')
      RETURNING id
    `
    const s2Id = session2[0].id

    await sql`
      UPDATE copilot_sessions
      SET status = 'completed', outcome_status = 'lost', outcome_reason = 'price', outcome_notes = 'Too expensive', outcome_recorded_at = NOW()
      WHERE id = ${s2Id}
    `

    const updatedSession = await sql`SELECT status, outcome_status, outcome_reason FROM copilot_sessions WHERE id = ${s2Id}`
    assert(updatedSession[0].status === 'completed', 'Outcome Test 1: Session status updated to "completed"')
    assert(updatedSession[0].outcome_status === 'lost', 'Outcome Test 2: Outcome status updated to "lost"')
    assert(updatedSession[0].outcome_reason === 'price', 'Outcome Test 3: Outcome reason updated to "price"')

    // -----------------------------------------------------
    // 8. Cleanup Verification
    // -----------------------------------------------------
    console.log('\n--- 7. Cleanup Verification ---')

    await sql`DELETE FROM copilot_sessions WHERE advisor_identifier LIKE 'phase4-test-advisor%'`

    const remainingRows = await sql`
      SELECT count(*)::int as count 
      FROM copilot_sessions 
      WHERE advisor_identifier LIKE 'phase4-test-advisor%'
    `
    assert(remainingRows[0].count === 0, 'Cleanup Test 1: 0 test rows remain in database')

    console.log(`\n=====================================================`)
    console.log(`RESULTS: Passed ${passed}/${passed + failed} tests`)
    console.log(`=====================================================\n`)

    if (failed > 0) {
      process.exit(1)
    }
  } catch (err) {
    console.error('Live database test error:', err)
    process.exit(1)
  }
}

runLiveDatabaseValidation().catch((err) => {
  console.error('Fatal live test error:', err)
  process.exit(1)
})
