import assert from 'assert'
import fs from 'fs'
import path from 'path'

// Phase 6A note: this suite exercises the route's legacy (pre-Phase-6A) input-
// validation/passthrough behavior directly via in-process invocation, not through
// an authenticated session. As of Phase 6A, /api/copilot fails closed (503) unless
// LEVEL_C_ENABLED or COPILOT_LEGACY_IDENTITY_MODE is explicitly set — so this
// suite must explicitly opt into the disclosed, default-OFF legacy compatibility
// mode to reach the same validation code path it has always tested. This does not
// change, weaken, or bypass any assertion below; it only makes explicit which
// identity mode this suite is testing, matching Phase 6A's fail-closed design.
process.env.LEVEL_C_ENABLED = ''
process.env.COPILOT_LEGACY_IDENTITY_MODE = 'true'

import { POST as copilotRoute } from '../app/api/copilot/route.ts'
import { MAX_OBJECTION_TEXT_LENGTH } from '../lib/copilot/limits.ts'

console.log('=====================================================')
console.log('   SALES COPILOT PHASE 5A DATA TRUST & SAFETY SUITE ')
console.log('=====================================================\n')

let passCount = 0

function test(name, fn) {
  try {
    fn()
    console.log(`✓ PASS: ${name}`)
    passCount++
  } catch (err) {
    console.error(`✗ FAIL: ${name}`)
    console.error(err)
    process.exit(1)
  }
}

async function asyncTest(name, fn) {
  try {
    await fn()
    console.log(`✓ PASS: ${name}`)
    passCount++
  } catch (err) {
    console.error(`✗ FAIL: ${name}`)
    console.error(err)
    process.exit(1)
  }
}

// --- 1. Canonical Limits (1 Unit Assertion) ---
test('Limits Test 1: MAX_OBJECTION_TEXT_LENGTH is 4000', () => {
  assert.strictEqual(MAX_OBJECTION_TEXT_LENGTH, 4000)
})

// --- 2. Real Server Route Execution Tests (3 Route Tests) ---
async function runRouteTests() {
  console.log('\n--- Real Server Route Execution Tests ---')

  await asyncTest('Route Test 1: Exactly 4000 chars accepted by /api/copilot', async () => {
    const text4000 = 'A'.repeat(4000)
    const req = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objectionText: text4000,
        advisorId: 'Phase5a Test Advisor',
      }),
    })
    const res = await copilotRoute(req)
    assert.strictEqual(res.status, 200)
  })

  await asyncTest('Route Test 2: 4001 chars rejected with HTTP 400 by /api/copilot', async () => {
    const text4001 = 'A'.repeat(4001)
    const req = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objectionText: text4001,
        advisorId: 'Phase5a Test Advisor',
      }),
    })
    const res = await copilotRoute(req)
    assert.strictEqual(res.status, 400)
    const data = await res.json()
    assert(data.error.includes('Objection text must be 4000 characters or fewer.'))
  })

  await asyncTest('Route Test 3: Empty objection text still rejected with HTTP 400', async () => {
    const req = new Request('http://localhost/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objectionText: '   ',
        advisorId: 'Phase5a Test Advisor',
      }),
    })
    const res = await copilotRoute(req)
    assert.strictEqual(res.status, 400)
  })
}

// --- 3. Static Source Code Assertions (9 Static Assertions) ---
function runStaticSourceAssertions() {
  console.log('\n--- Static Source Code Security & Architectural Assertions ---')

  test('STATIC SOURCE ASSERTION: Outcome route generic 500 response is sanitized', () => {
    const outcomeCode = fs.readFileSync(path.join(process.cwd(), 'app/api/copilot/outcome/route.ts'), 'utf8')
    assert(outcomeCode.includes("error: 'Database persistence error while saving outcome.'"))
    assert(!outcomeCode.includes("error: msg || 'Database persistence error while saving outcome.'"))
  })

  test('STATIC SOURCE ASSERTION: AskAIPanel does NOT import getCopilotAIProvider', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/ai/AskAIPanel.tsx'), 'utf8')
    assert(!code.includes('getCopilotAIProvider'), 'AskAIPanel should not import getCopilotAIProvider')
  })

  test('STATIC SOURCE ASSERTION: AskAIPanel does NOT contain browser fallback reasoning', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/ai/AskAIPanel.tsx'), 'utf8')
    assert(!code.includes('provider.analyzeObjection'), 'AskAIPanel must not fall back to browser provider')
    assert(code.includes('Unable to reach Sales Copilot. Please try again.'))
  })

  test('STATIC SOURCE ASSERTION: AskAIPanel handleFeedback throws if exchangeId is missing or not-persisted', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/ai/AskAIPanel.tsx'), 'utf8')
    assert(code.includes('if (!copilotResponse?.exchangeId || copilotResponse?.persistenceStatus === "not-persisted")'))
    assert(code.includes('throw new Error("Feedback unavailable because this response was not saved.")'))
  })

  test('STATIC SOURCE ASSERTION: CopilotInput displays candidate PII privacy warning', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/copilot/CopilotInput.tsx'), 'utf8')
    assert(code.includes('Do not include candidate names, email addresses, phone numbers, or other personal information.'))
  })

  test('STATIC SOURCE ASSERTION: CopilotInput enforces maxLength={MAX_OBJECTION_TEXT_LENGTH}', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/copilot/CopilotInput.tsx'), 'utf8')
    assert(code.includes('maxLength={MAX_OBJECTION_TEXT_LENGTH}'))
  })

  test('STATIC SOURCE ASSERTION: CopilotResponseCard displays visible not-persisted warning banner', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/copilot/CopilotResponseCard.tsx'), 'utf8')
    assert(code.includes('Response Not Persisted'))
    assert(code.includes('Response generated, but this conversation was not saved. Feedback and outcome tracking are unavailable for this response.'))
  })

  test('STATIC SOURCE ASSERTION: OutcomeRecorder disables controls when isPersisted is false', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/copilot/OutcomeRecorder.tsx'), 'utf8')
    assert(code.includes('disabled={!isPersisted}'))
    assert(code.includes('Unavailable because this response was not saved.'))
  })

  test('STATIC SOURCE ASSERTION: AskAIPanel feedback request uses valid application/json Content-Type header', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'components/ai/AskAIPanel.tsx'), 'utf8')
    assert(code.includes('headers: { "Content-Type": "application/json" }'))
    assert(!code.includes('application/json font'), 'AskAIPanel must not contain malformed Content-Type header')
  })
}

async function main() {
  await runRouteTests()
  runStaticSourceAssertions()

  console.log('\n=====================================================')
  console.log(`RESULTS: Passed ${passCount} Phase 5A tests`)
  console.log('=====================================================\n')
}

main()
