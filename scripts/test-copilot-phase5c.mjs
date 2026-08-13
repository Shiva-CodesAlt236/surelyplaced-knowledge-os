import { runCopilotPipeline } from '../lib/copilot/pipeline.ts'

console.log('=====================================================')
console.log('   SALES COPILOT PHASE 5C LIVE OBJECTION HOTFIX SUITE  ')
console.log('=====================================================')
console.log('   Phase 5C.1 Explicit-Refusal Truthfulness Verification\n')

let passCount = 0
let failCount = 0

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`)
    passCount++
  } else {
    console.error(`❌ FAIL: ${message}`)
    failCount++
  }
}

const FORBIDDEN_NAMES = ['rahul', 'akash', 'emily', 'neha']
const FORBIDDEN_CRM_PROMISES = [
  'updated your contact',
  'updating your contact',
  'updated your records',
  'updating your records',
  'won\'t receive further calls',
  'wont receive further calls',
  'stop all further outreach',
  'removed your number',
  'updating your contact records',
]

function containsForbiddenPersonaName(text) {
  const lower = text.toLowerCase()
  return FORBIDDEN_NAMES.some((name) => new RegExp(`\\b${name}\\b`, 'i').test(lower))
}

function containsFalseCrmPromise(text) {
  const lower = text.toLowerCase()
  return FORBIDDEN_CRM_PROMISES.some((phrase) => lower.includes(phrase))
}

async function runPhase5CSuite() {
  console.log('--- 1. Mandatory Live Regression Tests (10 Cases) ---')

  // TEST 1
  const t1 = await runCopilotPipeline("I don't want to pay any upfront.")
  assert(t1.isRefusal !== true, 'Test 1: "I don\'t want to pay any upfront." is NOT Deferred')
  assert(t1.objectionId === 'upfront-payment-resistance', 'Test 1: Primary is upfront-payment-resistance')

  // TEST 2
  const t2 = await runCopilotPipeline("Can you please email me the details so that I can review them and get back to you?")
  assert(t2.isRefusal !== true, 'Test 2: Email details request is NOT Deferred')
  assert(t2.objectionId === 'information-request-deferral', 'Test 2: Primary is information-request-deferral')

  // TEST 3
  const t3 = await runCopilotPipeline("I want to try on my own for some time.")
  assert(t3.objectionId === 'already-applying-myself', 'Test 3: Primary is already-applying-myself')
  assert(t3.isRefusal !== true, 'Test 3: Output is classified and valid')

  // TEST 4
  const t4 = await runCopilotPipeline("I'm already applying on LinkedIn myself.")
  assert(t4.objectionId === 'already-applying-myself', 'Test 4: Primary is already-applying-myself')

  // TEST 5
  const t5 = await runCopilotPipeline("It's too expensive for my budget.")
  assert(t5.objectionId === 'price-objection', 'Test 5: Primary is price-objection')

  // TEST 6
  const t6 = await runCopilotPipeline("I want to think about it.")
  assert(t6.objectionId === 'need-time-to-think', 'Test 6: Primary is need-time-to-think')

  // TEST 7
  const t7 = await runCopilotPipeline("I'm not interested.")
  assert(t7.objectionId === 'not-interested', 'Test 7: Primary is soft not-interested')
  assert(t7.objectionId !== 'explicit-refusal', 'Test 7: Must NOT be explicit-refusal on first soft brush-off')

  // TEST 8
  const t8 = await runCopilotPipeline("Please stop calling me.")
  assert(t8.objectionId === 'explicit-refusal', 'Test 8: Primary is explicit-refusal')
  assert(!t8.secondaryObjections || t8.secondaryObjections.length === 0, 'Test 8: No secondary objections on explicit-refusal')
  assert(t8.nextQuestion === '', 'Test 8: No persuasive next question on explicit-refusal')
  assert(!containsForbiddenPersonaName(t8.recommendedResponse), 'Test 8: Response is name-neutral (no Rahul/Akash/Emily/Neha)')
  assert(!containsFalseCrmPromise(t8.recommendedResponse), 'Test 8: Response contains no false completed CRM/DNC promises')

  // TEST 9: Sequential Soft Refusal Escalation
  const t9a = await runCopilotPipeline("I'm not interested.")
  assert(t9a.objectionId === 'not-interested', 'Test 9a: First utterance classifies as not-interested')
  const t9b = await runCopilotPipeline("No, I'm still not interested.", { previousObjectionId: t9a.objectionId })
  assert(t9b.objectionId === 'explicit-refusal', 'Test 9b: Second soft refusal with previousObjectionId escalates to explicit-refusal')
  assert(!containsForbiddenPersonaName(t9b.recommendedResponse), 'Test 9b: Escalated response is name-neutral')
  assert(!containsFalseCrmPromise(t9b.recommendedResponse), 'Test 9b: Escalated response contains no false CRM promises')

  // TEST 10: Compound Statement
  const t10 = await runCopilotPipeline("I don't trust these companies and I don't want to pay upfront.")
  const ids10 = [t10.objectionId, ...(t10.secondaryObjections?.map((s) => s.objectionId) || [])]
  assert(ids10.includes('trust-and-credibility') && ids10.includes('upfront-payment-resistance'), 'Test 10: Compound statement detects both trust and upfront-payment-resistance')

  console.log('\n--- 2. Phase 5C.1 Explicit-Refusal Truthfulness & Name-Neutrality ---')
  const refusalVariations = [
    "Please stop calling me.",
    "Don't call me again.",
    "Remove my number.",
    "Do not contact me.",
  ]

  for (let i = 0; i < refusalVariations.length; i++) {
    const input = refusalVariations[i]
    const res = await runCopilotPipeline(input)
    assert(res.objectionId === 'explicit-refusal', `Refusal ${i + 1}: "${input}" -> explicit-refusal`)
    assert(res.nextQuestion === '', `Refusal ${i + 1}: nextQuestion is empty`)
    assert(!containsForbiddenPersonaName(res.recommendedResponse), `Refusal ${i + 1}: Name-neutral response ("${res.recommendedResponse.substring(0, 40)}...")`)
    assert(!containsFalseCrmPromise(res.recommendedResponse), `Refusal ${i + 1}: No false CRM update claim`)
  }

  console.log('\n--- 3. Collision & Response Differentiation Tests ---')
  const catA = await runCopilotPipeline("I don't want to pay any upfront.")
  const catB = await runCopilotPipeline("Can you please email me the details so that I can review them and get back to you?")
  const catC = await runCopilotPipeline("I want to try on my own for some time.")
  const catD = await runCopilotPipeline("I want to think about it.")
  const catE = await runCopilotPipeline("How do I know this is real?")
  const catF = await runCopilotPipeline("I'm not interested.")
  const catG = await runCopilotPipeline("Please stop calling me.")

  assert(catA.recommendedResponse !== catB.recommendedResponse, 'Collision 1: Upfront vs Info request responses differ')
  assert(catB.recommendedResponse !== catC.recommendedResponse, 'Collision 2: Info request vs DIY responses differ')
  assert(catC.recommendedResponse !== catD.recommendedResponse, 'Collision 3: DIY vs Timing responses differ')
  assert(catD.recommendedResponse !== catE.recommendedResponse, 'Collision 4: Timing vs Trust responses differ')
  assert(catF.recommendedResponse !== catG.recommendedResponse, 'Collision 5: Soft not-interested vs Hard refusal responses differ')
  assert(catG.nextQuestion === '', 'Collision 6: Hard refusal has empty nextQuestion')

  console.log('\n--- 4. Determinism Verification Tests ---')
  const testInputs = [
    "I don't want to pay any upfront.",
    "Can you please email me the details?",
    "I want to try on my own for some time.",
    "I'm not interested.",
    "Please stop calling me.",
  ]

  for (let i = 0; i < testInputs.length; i++) {
    const input = testInputs[i]
    const run1 = await runCopilotPipeline(input)
    const run2 = await runCopilotPipeline(input)
    assert(
      run1.objectionId === run2.objectionId &&
      run1.recommendedResponse === run2.recommendedResponse &&
      run1.nextQuestion === run2.nextQuestion,
      `Determinism ${i + 1}: Stable output for "${input.substring(0, 30)}..."`
    )
  }

  console.log('\n--- 5. Negative / Near-Miss Safety Tests ---')
  const nm1 = await runCopilotPipeline("Can you email me the calendar invite?")
  assert(nm1.objectionId !== 'information-request-deferral', 'Near-Miss 1: Calendar invite request is not sales info deferral')

  const nm2 = await runCopilotPipeline("I paid my electricity bill upfront.")
  assert(nm2.objectionId !== 'upfront-payment-resistance', 'Near-Miss 2: Electricity bill upfront is not sales upfront payment resistance')

  const nm3 = await runCopilotPipeline("Please stop the application for now.")
  assert(nm3.objectionId !== 'explicit-refusal', 'Near-Miss 3: Stopping job application is not do-not-call explicit refusal')

  const nm4 = await runCopilotPipeline("I am interested but I need some time.")
  assert(nm4.objectionId === 'need-time-to-think', 'Near-Miss 4: Interested but need time is need-time-to-think, not not-interested')

  const nm5 = await runCopilotPipeline("I'm not interested in changing my resume format.")
  assert(nm5.objectionId !== 'explicit-refusal', 'Near-Miss 5: Resume format disinterest is not hard exit explicit refusal')

  console.log('\n--- 6. Cold-Call Colloquial Language Fixtures (20 Fixtures) ---')
  const colloquialFixtures = [
    { input: "nah I'm good", expected: 'not-interested' },
    { input: "send me something", expected: 'information-request-deferral' },
    { input: "mail me details", expected: 'information-request-deferral' },
    { input: "I'll check and tell you", expected: 'information-request-deferral' },
    { input: "let me try myself", expected: 'already-applying-myself' },
    { input: "I don't want to pay before I get a job", expected: 'upfront-payment-resistance' },
    { input: "I'll pay once I get placed", expected: 'upfront-payment-resistance' },
    { input: "I have no budget right now", expected: 'price-objection' },
    { input: "I'm already getting interviews", expected: 'already-applying-myself' },
    { input: "I'm doing fine myself", expected: 'already-applying-myself' },
    { input: "call after two weeks", expected: 'need-time-to-think' },
    { input: "my parents won't agree", expected: 'parents-spouse-approval' },
    { input: "I got scammed already", expected: 'trust-and-credibility' },
    { input: "how do I know this is real?", expected: 'trust-and-credibility' },
    { input: "I'll think about it", expected: 'need-time-to-think' },
    { input: "maybe later", expected: 'need-time-to-think' },
    { input: "don't call me again", expected: 'explicit-refusal' },
    { input: "remove my number", expected: 'explicit-refusal' },
    { input: "I'm already working with another consultancy", expected: 'already-working-with-consultancy' },
    { input: "I already have a placement company", expected: 'already-working-with-consultancy' },
  ]

  for (let i = 0; i < colloquialFixtures.length; i++) {
    const f = colloquialFixtures[i]
    const res = await runCopilotPipeline(f.input)
    assert(
      res.objectionId === f.expected,
      `Colloquial ${i + 1}: "${f.input}" -> ${f.expected} (got: ${res.objectionId})`
    )
  }

  console.log(`\n=====================================================`)
  console.log(`RESULTS: Passed ${passCount}/${passCount + failCount} Phase 5C assertions`)
  console.log(`=====================================================\n`)

  if (failCount > 0) {
    process.exit(1)
  }
}

runPhase5CSuite().catch((err) => {
  console.error('Phase 5C test suite error:', err)
  process.exit(1)
})
