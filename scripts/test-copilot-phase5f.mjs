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

  // --- 9. Phase 5F.1: SUB2/SUB3 Step 4.5 Promotion Coverage (previously missing) ---
  console.log('\n--- 9. SUB2/SUB3 Step 4.5 Promotion Coverage ---');
  {
    const sub2 = await runCopilotPipeline("I'm not interested because I already have another consultancy.");
    assert(sub2.objectionId === 'already-working-with-consultancy', 'SUB2: Primary is already-working-with-consultancy');
    const sub2Sec = sub2.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sub2Sec.includes('not-interested'), 'SUB2: not-interested is secondary');

    const sub3 = await runCopilotPipeline("I'm not interested because I don't trust consultancies.");
    assert(sub3.objectionId === 'trust-and-credibility', 'SUB3: Primary is trust-and-credibility');
    const sub3Sec = sub3.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(sub3Sec.includes('not-interested'), 'SUB3: not-interested is secondary');
  }

  // --- 10. Phase 5F.1 Blocker 1: nonProgramTerms Trust Guard Adversarial Matrix ---
  console.log('\n--- 10. nonProgramTerms Trust Guard Adversarial Matrix (A1-A13) ---');
  {
    const trustMustSurface = [
      ['A1', 'I was scammed before and I need proof of address.'],
      ['A2', "I don't trust this company, and separately I need help with my address."],
      ['A3', 'How do I know this is genuine? Also, can you guarantee delivery by Friday?'],
      ['A4', 'I was cheated before; can you guarantee shipping by Monday?'],
      ['A5', 'This looks fake, and my address also needs updating.'],
      ['A6', "I don't trust these services and my flight is tomorrow."],
      ['A7', 'I was scammed before and uptime is also important.'],
    ];
    for (const [label, text] of trustMustSurface) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'trust-and-credibility', `${label}: "${text}" -> trust-and-credibility (genuine trust signal must survive non-program term)`);
    }

    const trustMustStayNeutral = [
      ['A8', 'Can you guarantee delivery by Friday?'],
      ['A9', 'Can you guarantee shipping by Monday?'],
      ['A10', 'Can you guarantee uptime?'],
      ['A11', 'I need proof of address.'],
      ['A12', 'Can you guarantee my flight booking?'],
      ['A13', 'Can you guarantee address verification?'],
    ];
    for (const [label, text] of trustMustStayNeutral) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'unclassified', `${label}: "${text}" -> unclassified (neutral non-program term, no genuine trust signal)`);
    }
  }

  // --- 11. Phase 5F.1 Blocker 2: Budget Context Guard Adversarial Matrix ---
  console.log('\n--- 11. Budget Context Guard Adversarial Matrix (B1-B10) ---');
  {
    const b1 = await runCopilotPipeline("My budget is limited and I can't afford this service.");
    assert(b1.objectionId === 'price-objection', 'B1: "My budget is limited and I can\'t afford this service." -> price-objection');

    const b2 = await runCopilotPipeline('My budget is limited and my parents need to approve it.');
    assert(b2.objectionId === 'price-objection', 'B2: Primary is price-objection');
    const b2Sec = b2.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(b2Sec.includes('parents-spouse-approval'), 'B2: Secondary includes parents-spouse-approval');

    const bProgram = await runCopilotPipeline('My budget is limited for this program.');
    assert(bProgram.objectionId === 'price-objection', 'B_program: "My budget is limited for this program." -> price-objection');

    const budgetMustStayNeutral = [
      ['B3', 'The project budget is limited.'],
      ['B4', 'Our marketing budget is limited.'],
      ['B5', 'The department budget is limited.'],
      ['B6', "My employer's training budget is limited."],
      ['B7', "The client's budget is limited."],
      ['B8', 'The API budget is limited.'],
      ['B9', 'The campaign budget is limited this month.'],
      ['B10', 'The infrastructure budget is limited.'],
    ];
    for (const [label, text] of budgetMustStayNeutral) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'unclassified', `${label}: "${text}" -> unclassified (non-candidate/organizational budget)`);
    }
  }

  // --- 12. Phase 5F.1 Blocker 3: Fee Context Guard Adversarial Matrix ---
  console.log('\n--- 12. Fee Context Guard Adversarial Matrix (C1-C8) ---');
  {
    const c2 = await runCopilotPipeline("I don't want another fee for this program.");
    assert(c2.objectionId === 'price-objection', 'C2: "I don\'t want another fee for this program." -> price-objection');

    const c3 = await runCopilotPipeline("I don't want to pay another fee.");
    assert(c3.objectionId === 'price-objection', 'C3: "I don\'t want to pay another fee." -> price-objection');

    const feeMustStayNeutral = [
      ['C4', "I don't want another fee field in the database."],
      ['C5', "The customer said they don't want another fee field."],
      ['C6', "I don't want another fee column in the spreadsheet."],
      ['C7', "We don't want another fee added to the API response."],
      ['C8', 'Remove another fee property from the JSON.'],
    ];
    for (const [label, text] of feeMustStayNeutral) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'unclassified', `${label}: "${text}" -> unclassified (technical/data-schema fee mention)`);
    }
  }

  // --- 13. Phase 5F.1 Blocker 4: Send-The-Pricing Context Guard Adversarial Matrix ---
  console.log('\n--- 13. Send-The-Pricing Context Guard Adversarial Matrix (D1-D10) ---');
  {
    const pricingMustSurface = [
      ['D2', 'Send the pricing.'],
      ['D3', 'Please send the pricing.'],
      ['D4', 'Can you send the pricing?'],
      ['D5', 'Send the pricing breakdown.'],
    ];
    for (const [label, text] of pricingMustSurface) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'information-request-deferral', `${label}: "${text}" -> information-request-deferral`);
    }

    const pricingMustStayNeutral = [
      ['D6', 'Send the pricing field to the API.'],
      ['D7', 'Send the pricing column to engineering.'],
      ['D8', 'Send the pricing payload to the database.'],
      ['D9', 'The recruiter will send the pricing spreadsheet.'],
      ['D10', 'Send the pricing object in JSON.'],
    ];
    for (const [label, text] of pricingMustStayNeutral) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'unclassified', `${label}: "${text}" -> unclassified (technical/data-transfer pricing mention)`);
    }
  }

  // --- 14. Phase 5F.1 Should-Fix #5: Decide-Next-Week/Month Candidate-Subject Guard ---
  console.log('\n--- 14. Decide-Next-Week/Month Candidate-Subject Guard (E1-E12) ---');
  {
    const timingMustSurface = [
      ['E1', "I'll decide next week."],
      ['E2', 'I will decide next week.'],
      ['E3', "I'll decide next month."],
      ['E4', 'Let me decide next week.'],
    ];
    for (const [label, text] of timingMustSurface) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'need-time-to-think', `${label}: "${text}" -> need-time-to-think`);
    }

    const e5 = await runCopilotPipeline("Email the pricing and I'll decide next week.");
    assert(e5.objectionId === 'information-request-deferral', 'E5: Primary is information-request-deferral');
    const e5Sec = e5.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(e5Sec.includes('need-time-to-think'), 'E5: Secondary includes need-time-to-think');

    const timingMustStayNeutral = [
      ['E6', 'The project decision is next week.'],
      ['E7', 'Our hiring decision is next week.'],
      ['E8', 'The committee will decide next week.'],
      ['E9', 'The team will decide next week which database to use.'],
      ['E10', 'The customer will decide next week.'],
      ['E11', 'The engineering group will decide next month.'],
      ['E12', 'My manager will decide next week.'],
    ];
    for (const [label, text] of timingMustStayNeutral) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'unclassified', `${label}: "${text}" -> unclassified (third-party/organizational decision, not candidate's own delay)`);
    }
  }

  // --- 15. Phase 5F.1 Should-Fix #6: Step 4.6 Narrowing & Normal Consultancy Regression ---
  console.log('\n--- 15. Step 4.6 Narrowing & Normal Consultancy Regression (F1-F5) ---');
  {
    const f1 = await runCopilotPipeline("I already paid another company, so I don't want another fee.");
    assert(f1.objectionId === 'already-working-with-consultancy', 'F1: Primary is already-working-with-consultancy');
    const f1Sec = f1.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(f1Sec.includes('price-objection'), 'F1: Secondary includes price-objection');

    const f2 = await runCopilotPipeline("I already paid another company and I don't want to pay another fee.");
    assert(f2.objectionId === 'already-working-with-consultancy', 'F2: Primary is already-working-with-consultancy');
    const f2Sec = f2.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(f2Sec.includes('price-objection'), 'F2: Secondary includes price-objection');

    // F3/F4: Step 4.6 must NOT be the mechanism forcing consultancy primary here (no fee
    // concern phrase present, so the forced-override rule must not engage).
    const f3 = await runCopilotPipeline('I already paid another company because they designed my website.');
    const f3Sec = f3.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(!f3Sec.includes('price-objection'), 'F3: No price-objection secondary (Step 4.6 fee rule did not engage)');

    const f4 = await runCopilotPipeline('I already paid another company for tax filing.');
    const f4Sec = f4.secondaryObjections?.map((s) => s.objectionId) || [];
    assert(!f4Sec.includes('price-objection'), 'F4: No price-objection secondary (Step 4.6 fee rule did not engage)');

    const f5 = await runCopilotPipeline('I already paid another company and don\'t contact me again.');
    assert(f5.objectionId === 'explicit-refusal', 'F5: explicit-refusal absolute override holds');
    assert(f5.secondaryObjections === undefined, 'F5: no secondary objections on explicit refusal');

    // Normal consultancy detection must remain unaffected by the Step 4.6 narrowing.
    const normalConsultancy = [
      'I already hired another recruiter.',
      "I'm already with another consultancy.",
      'I already paid another placement company.',
      'Another career service is helping me.',
    ];
    for (const text of normalConsultancy) {
      const r = await runCopilotPipeline(text);
      assert(r.objectionId === 'already-working-with-consultancy', `Normal consultancy regression: "${text}" -> already-working-with-consultancy`);
    }
  }

  console.log('\n=====================================================');
  console.log(`RESULTS: Passed ${passed}/${total} Phase 5F assertions`);
  console.log('=====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase5FTests();
