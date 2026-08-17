/**
 * SALES COPILOT PHASE 5F SECONDARY COHERENCE, WORD-BOUNDARY SAFETY & TEST INTEGRITY SUITE
 * Run: node scripts/test-copilot-phase5f.mjs
 */

import { runCopilotPipeline } from '../lib/copilot/pipeline.ts';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`✓ PASS: ${message}`);
  } else {
    console.error(`✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

async function runPhase5FTests() {
  console.log('=====================================================');
  console.log('  SALES COPILOT PHASE 5F REASONING & RECALL MATRIX  ');
  console.log('=====================================================\n');

  // --- 1. Prove / Approve Word-Boundary Safety ---
  console.log('--- 1. Word-Boundary Safety for "prove" vs "approve"/"improve" ---');
  {
    const r1 = await runCopilotPipeline('My wife has to approve this.');
    assert(r1.objectionId === 'parents-spouse-approval', 'Approve 1: Primary is parents-spouse-approval');
    const sec1 = r1.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(!sec1.includes('trust-and-credibility'), 'Approve 1: NO trust-and-credibility secondary on approve');

    const approveInputs = [
      'I improve this every day.',
      'They disapprove this approach.',
      'I want to improve this process.',
      'My proposal was approved this week.',
      'My parents approved this decision.',
    ];
    for (const text of approveInputs) {
      const r = await runCopilotPipeline(text);
      const sec = r.secondaryObjections?.map((s) => s.objectionId) || [];
      assert(r.objectionId !== 'trust-and-credibility' && !sec.includes('trust-and-credibility'), `Approve/Improve negative: "${text}" is NOT trust-and-credibility`);
    }
  }

  // --- 2. Legitimate Prove-This Trust Positives ---
  console.log('\n--- 2. Legitimate Prove-This Trust Positives ---');
  {
    const proveInputs = [
      'Can you prove this works?',
      'Can you prove this?',
      'You need to prove this.',
      'Can you prove that this is genuine?',
      'Can you prove that your placements are real?',
    ];
    for (const text of proveInputs) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'trust-and-credibility', `Prove positive: "${text}" -> trust-and-credibility`);
    }
  }

  // --- 3. Step 4.5 Promoted Primary Secondary Coherence ---
  console.log('\n--- 3. Step 4.5 Promoted Primary Secondary Coherence ---');
  {
    const r1 = await runCopilotPipeline("I'm not interested because I need to talk to my wife.");
    assert(r1.objectionId === 'parents-spouse-approval', 'Promoted secondary 1: Primary is parents-spouse-approval');
    const sec1 = r1.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec1.includes('not-interested'), 'Promoted secondary 1: not-interested is secondary');

    const r2 = await runCopilotPipeline("I'm not interested, I want to try myself.");
    assert(r2.objectionId === 'already-applying-myself', 'Promoted secondary 2: Primary is already-applying-myself');
    const sec2 = r2.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec2.includes('not-interested'), 'Promoted secondary 2: not-interested is secondary');

    const r3 = await runCopilotPipeline("I'm not interested because it's too expensive.");
    assert(r3.objectionId === 'price-objection', 'Promoted secondary 3: Primary is price-objection');
    const sec3 = r3.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec3.includes('not-interested'), 'Promoted secondary 3: not-interested is secondary');
  }

  // --- 4. Compound Test Strengthening ---
  console.log('\n--- 4. Compound Test Strengthening ---');
  {
    // fam_c2
    const r1 = await runCopilotPipeline("I can't spend this much without talking to my husband.");
    assert(r1.objectionId === 'price-objection', 'fam_c2: Primary is price-objection');
    const sec1 = r1.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec1.includes('parents-spouse-approval'), 'fam_c2: Secondary includes parents-spouse-approval');

    // fam_c4
    const r2 = await runCopilotPipeline('Email me the agreement because my wife wants to review it.');
    assert(r2.objectionId === 'information-request-deferral', 'fam_c4: Primary is information-request-deferral');
    const sec2 = r2.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec2.includes('parents-spouse-approval'), 'fam_c4: Secondary includes parents-spouse-approval');

    // fam_c5
    const r3 = await runCopilotPipeline("Send the pricing and I'll ask my husband.");
    assert(r3.objectionId === 'information-request-deferral', 'fam_c5: Primary is information-request-deferral');
    const sec3 = r3.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec3.includes('parents-spouse-approval'), 'fam_c5: Secondary includes parents-spouse-approval');

    // fam_c6
    const r4 = await runCopilotPipeline('My budget is limited and my parents need to approve it.');
    assert(r4.objectionId === 'price-objection', 'fam_c6: Primary is price-objection');
    const sec4 = r4.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec4.includes('parents-spouse-approval'), 'fam_c6: Secondary includes parents-spouse-approval');

    // pr_c4
    const r5 = await runCopilotPipeline('I need some time because the price is high.');
    assert(r5.objectionId === 'need-time-to-think', 'pr_c4: Primary is need-time-to-think');
    const sec5 = r5.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec5.includes('price-objection'), 'pr_c4: Secondary includes price-objection');

    // tr_c3
    const r6 = await runCopilotPipeline("I don't trust placement companies and the fee is too high.");
    assert(r6.objectionId === 'price-objection', 'tr_c3: Primary is price-objection');
    const sec6 = r6.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec6.includes('trust-and-credibility'), 'tr_c3: Secondary includes trust-and-credibility');

    // tr_c4
    const r7 = await runCopilotPipeline("I don't trust consultancies, so I won't pay upfront.");
    assert(r7.objectionId === 'trust-and-credibility', 'tr_c4: Primary is trust-and-credibility');
    const sec7 = r7.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec7.includes('upfront-payment-resistance'), 'tr_c4: Secondary includes upfront-payment-resistance');

    // tr_c5
    const r8 = await runCopilotPipeline("I've been scammed before, why should I make an advance payment?");
    assert(r8.objectionId === 'trust-and-credibility', 'tr_c5: Primary is trust-and-credibility');
    const sec8 = r8.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec8.includes('upfront-payment-resistance'), 'tr_c5: Secondary includes upfront-payment-resistance');

    // info_c2
    const r9 = await runCopilotPipeline("Email the pricing and I'll decide next week.");
    assert(r9.objectionId === 'information-request-deferral', 'info_c2: Primary is information-request-deferral');
    const sec9 = r9.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec9.includes('need-time-to-think'), 'info_c2: Secondary includes need-time-to-think');

    // info_c3
    const r10 = await runCopilotPipeline("Send me the details and I'll get back to you.");
    assert(r10.objectionId === 'information-request-deferral', 'info_c3: Primary is information-request-deferral');
    const sec10 = r10.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec10.includes('need-time-to-think'), 'info_c3: Secondary includes need-time-to-think');

    // con_c2 (Product Owner Decision Locked)
    const r11 = await runCopilotPipeline("I already paid another company, so I don't want another fee.");
    assert(r11.objectionId === 'already-working-with-consultancy', 'con_c2 PO decision: Primary is already-working-with-consultancy');
    const sec11 = r11.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec11.includes('price-objection'), 'con_c2 PO decision: Secondary includes price-objection');

    // con_c3
    const r12 = await runCopilotPipeline('Another recruiter is helping me and this seems expensive.');
    assert(r12.objectionId === 'price-objection', 'con_c3: Primary is price-objection');
    const sec12 = r12.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec12.includes('already-working-with-consultancy'), 'con_c3: Secondary includes already-working-with-consultancy');

    // con_c4
    const r13 = await runCopilotPipeline('I have another recruiter helping me, but I also apply myself.');
    assert(r13.objectionId === 'already-working-with-consultancy', 'con_c4: Primary is already-working-with-consultancy');
    const sec13 = r13.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec13.includes('already-applying-myself'), 'con_c4: Secondary includes already-applying-myself');

    // con_c5
    const r14 = await runCopilotPipeline("I'm already enrolled elsewhere and I'm still applying on my own.");
    assert(r14.objectionId === 'already-applying-myself', 'con_c5: Primary is already-applying-myself');
    const sec14 = r14.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sec14.includes('already-working-with-consultancy'), 'con_c5: Secondary includes already-working-with-consultancy');
  }

  // --- 5. Intentional Single-Intent Behavior ---
  console.log('\n--- 5. Intentional Single-Intent Behavior ---');
  {
    // tr_c2
    const r1 = await runCopilotPipeline('How do I know this is genuine for that price?');
    assert(r1.objectionId === 'trust-and-credibility', 'tr_c2 single-intent: Primary is trust-and-credibility');

    // con_c1
    const r2 = await runCopilotPipeline("I'm already working with another consultancy and they're cheaper.");
    assert(r2.objectionId === 'already-working-with-consultancy', 'con_c1 single-intent: Primary is already-working-with-consultancy');
  }

  // --- 6. Guarantee Verb-Form Positives & Negatives ---
  console.log('\n--- 6. Guarantee Verb-Form Positives & Negatives ---');
  {
    const gPositives = [
      'Do you guarantee placement?',
      'Do you guarantee placements?',
      'Can you guarantee placement?',
      'Do you guarantee results?',
      'Can you guarantee interview calls?',
    ];
    for (const text of gPositives) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'trust-and-credibility', `Guarantee positive: "${text}" -> trust-and-credibility`);
    }

    const gNegatives = [
      'Can you guarantee delivery by Friday?',
      'Can you guarantee shipping by Monday?',
      'Can you guarantee uptime?',
    ];
    for (const text of gNegatives) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId !== 'trust-and-credibility', `Guarantee negative: "${text}" is NOT trust-and-credibility`);
    }
  }

  // --- 7. Frozen Precision Regressions ---
  console.log('\n--- 7. Frozen Precision Regressions (Price, Trust, Hard-Refusal, Family) ---');
  {
    // Price factual questions
    const priceNegatives = [
      'What is the price?',
      'What does the fee include?',
      'Send me the price.',
      'The API returns a price.',
      'My project has a cost field.',
      'My employer gives me a training budget.',
    ];
    for (const text of priceNegatives) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId !== 'price-objection', `Price negative: "${text}" is NOT price-objection`);
    }

    // Trust factual statements
    const trustNegatives = [
      'I have real work experience.',
      'This is a real interview.',
      'I work on real-time projects.',
      'I need proof of address.',
      'I read reviews for this course.',
    ];
    for (const text of trustNegatives) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId !== 'trust-and-credibility', `Trust negative: "${text}" is NOT trust-and-credibility`);
    }

    // Hard Refusal
    const rDnc1 = await runCopilotPipeline("Please don't reach out again.");
    assert(rDnc1.objectionId === 'explicit-refusal', 'DNC positive: explicit-refusal');

    const rDnc2 = await runCopilotPipeline('Stop calling the API.');
    assert(rDnc2.objectionId !== 'explicit-refusal', 'DNC tech guard: NOT explicit-refusal');

    const rDnc3 = await runCopilotPipeline("Stop calling the API and don't contact me again.");
    assert(rDnc3.objectionId === 'explicit-refusal', 'DNC mixed tech+DNC: explicit-refusal');

    // Family
    const rFam1 = await runCopilotPipeline('My wife has to approve this.');
    assert(rFam1.objectionId === 'parents-spouse-approval', 'Family positive: parents-spouse-approval');

    const rFam2 = await runCopilotPipeline('My spouse works at Google.');
    assert(rFam2.objectionId !== 'parents-spouse-approval', 'Family negative: NOT parents-spouse-approval');
  }

  // --- 8. Determinism Verification ---
  console.log('\n--- 8. Determinism Verification ---');
  {
    const sampleInput = "I already paid another company, so I don't want another fee.";
    const rA = await runCopilotPipeline(sampleInput);
    const rB = await runCopilotPipeline(sampleInput);
    assert(rA.objectionId === rB.objectionId, 'Determinism 1: objectionId stable');
    assert(rA.recommendedResponse === rB.recommendedResponse, 'Determinism 2: recommendedResponse stable');
  }

  console.log('\n=====================================================');
  console.log(`RESULTS: Passed ${passed}/${total} Phase 5F assertions`);
  console.log('=====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase5FTests();
