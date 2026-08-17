import { runCopilotPipeline } from '../lib/copilot/pipeline.ts'

console.log('=====================================================')
console.log('   SALES COPILOT PHASE 5E COMPOUND CLASSIFIER HARDENING  ')
console.log('=====================================================')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    passed++
    console.log(`✓ PASS: ${message}`)
  } else {
    failed++
    console.error(`✗ FAIL: ${message}`)
  }
}

async function runTests() {
  // --- 1. Hard-Refusal New Positives (Section 7) ---
  console.log('\n--- 1. Hard-Refusal New Positives ---')
  const hr_p1 = await runCopilotPipeline("Please don't reach out again.")
  assert(hr_p1.objectionId === 'explicit-refusal', "Please don't reach out again. -> explicit-refusal")
  assert(hr_p1.nextQuestion === '', "Please don't reach out again. -> empty nextQuestion")
  assert(hr_p1.secondaryObjections === undefined, "Please don't reach out again. -> no secondaries")

  const hr_p2 = await runCopilotPipeline("Do not reach out to me again.")
  assert(hr_p2.objectionId === 'explicit-refusal', "Do not reach out to me again. -> explicit-refusal")

  const hr_p3 = await runCopilotPipeline("Stop reaching out.")
  assert(hr_p3.objectionId === 'explicit-refusal', "Stop reaching out. -> explicit-refusal")

  const hr_p4 = await runCopilotPipeline("Take me off the calling list.")
  assert(hr_p4.objectionId === 'explicit-refusal', "Take me off the calling list. -> explicit-refusal")

  const hr_p5 = await runCopilotPipeline("Delete my contact.")
  assert(hr_p5.objectionId === 'explicit-refusal', "Delete my contact. -> explicit-refusal")

  const hr_p6 = await runCopilotPipeline("Remove me from your database.")
  assert(hr_p6.objectionId === 'explicit-refusal', "Remove me from your database. -> explicit-refusal")

  const hr_p7 = await runCopilotPipeline("Don't text me anymore.")
  assert(hr_p7.objectionId === 'explicit-refusal', "Don't text me anymore. -> explicit-refusal")

  const hr_p8 = await runCopilotPipeline("Stop texting me.")
  assert(hr_p8.objectionId === 'explicit-refusal', "Stop texting me. -> explicit-refusal")

  const hr_p9 = await runCopilotPipeline("No more calls.")
  assert(hr_p9.objectionId === 'explicit-refusal', "No more calls. -> explicit-refusal")

  const hr_p10 = await runCopilotPipeline("I've told you before, stop calling.")
  assert(hr_p10.objectionId === 'explicit-refusal', "I've told you before, stop calling. -> explicit-refusal")

  const hr_p11 = await runCopilotPipeline("Don't contact me.")
  assert(hr_p11.objectionId === 'explicit-refusal', "Don't contact me. -> explicit-refusal")

  const hr_p12 = await runCopilotPipeline("Do not message me again.")
  assert(hr_p12.objectionId === 'explicit-refusal', "Do not message me again. -> explicit-refusal")

  const hr_p13 = await runCopilotPipeline("I already told you not to call.")
  assert(hr_p13.objectionId === 'explicit-refusal', "I already told you not to call. -> explicit-refusal")

  // --- 2. Hard-Refusal Near-Misses (Section 8) ---
  console.log('\n--- 2. Hard-Refusal Near-Misses ---')
  const hr_nm1 = await runCopilotPipeline("Reach out again next week.")
  assert(hr_nm1.objectionId !== 'explicit-refusal', "Reach out again next week. -> NOT explicit-refusal")

  const hr_nm2 = await runCopilotPipeline("Don't text me the Zoom link.")
  assert(hr_nm2.objectionId !== 'explicit-refusal', "Don't text me the Zoom link. -> NOT explicit-refusal")

  const hr_nm3 = await runCopilotPipeline("Delete my old resume.")
  assert(hr_nm3.objectionId !== 'explicit-refusal', "Delete my old resume. -> NOT explicit-refusal")

  const hr_nm4 = await runCopilotPipeline("Remove me from this meeting.")
  assert(hr_nm4.objectionId !== 'explicit-refusal', "Remove me from this meeting. -> NOT explicit-refusal")

  const hr_nm5 = await runCopilotPipeline("Stop calling the API.")
  assert(hr_nm5.objectionId !== 'explicit-refusal', "Stop calling the API. -> NOT explicit-refusal")

  const hr_nm6 = await runCopilotPipeline("Stop the screen share.")
  assert(hr_nm6.objectionId !== 'explicit-refusal', "Stop the screen share. -> NOT explicit-refusal")

  const hr_nm7 = await runCopilotPipeline("Don't call this function again.")
  assert(hr_nm7.objectionId !== 'explicit-refusal', "Don't call this function again. -> NOT explicit-refusal")

  const hr_nm8 = await runCopilotPipeline("Stop the application.")
  assert(hr_nm8.objectionId !== 'explicit-refusal', "Stop the application. -> NOT explicit-refusal")

  const hr_nm9 = await runCopilotPipeline("Message me the details.")
  assert(hr_nm9.objectionId !== 'explicit-refusal', "Message me the details. -> NOT explicit-refusal")

  const hr_nm10 = await runCopilotPipeline("Contact me next week.")
  assert(hr_nm10.objectionId !== 'explicit-refusal', "Contact me next week. -> NOT explicit-refusal")

  // --- 3. Explicit-Refusal Compound Override (Section 35) ---
  console.log('\n--- 3. Explicit-Refusal Compound Override ---')
  const hr_co1 = await runCopilotPipeline("Don't contact me, it's too expensive.")
  assert(hr_co1.objectionId === 'explicit-refusal', "Don't contact me, it's too expensive. -> explicit-refusal")
  assert(hr_co1.secondaryObjections === undefined, "Don't contact me, it's too expensive. -> no secondaries")
  assert(hr_co1.nextQuestion === '', "Don't contact me, it's too expensive. -> empty nextQuestion")

  const hr_co2 = await runCopilotPipeline("Stop calling me, I already have another consultancy.")
  assert(hr_co2.objectionId === 'explicit-refusal', "Stop calling me, I already have another consultancy. -> explicit-refusal")
  assert(hr_co2.secondaryObjections === undefined, "Stop calling me -> no secondaries")

  const hr_co3 = await runCopilotPipeline("I said don't call me again, I want to apply myself.")
  assert(hr_co3.objectionId === 'explicit-refusal', "I said don't call me again -> explicit-refusal")

  const hr_co4 = await runCopilotPipeline("Don't reach out again, I need to talk to my wife.")
  assert(hr_co4.objectionId === 'explicit-refusal', "Don't reach out again, I need to talk to my wife. -> explicit-refusal")

  const hr_co5 = await runCopilotPipeline("No more calls, the fee is too high.")
  assert(hr_co5.objectionId === 'explicit-refusal', "No more calls, the fee is too high. -> explicit-refusal")
  assert(hr_co5.secondaryObjections === undefined, "No more calls -> no secondaries")

  // Tech-context with independent person-directed refusal (Correction #2)
  const hr_co6 = await runCopilotPipeline("Stop calling the API and don't contact me again.")
  assert(hr_co6.objectionId === 'explicit-refusal', "Stop calling the API and don't contact me again. -> explicit-refusal")

  const hr_co7 = await runCopilotPipeline("Delete the application, and please don't call me anymore.")
  assert(hr_co7.objectionId === 'explicit-refusal', "Delete the application, and please don't call me anymore. -> explicit-refusal")

  // --- 4. Family Positives (Section 11) ---
  console.log('\n--- 4. Family Positives ---')
  const fam_p1 = await runCopilotPipeline("My wife has to approve this.")
  assert(fam_p1.objectionId === 'parents-spouse-approval', "My wife has to approve this. -> parents-spouse-approval")

  const fam_p2 = await runCopilotPipeline("My husband needs to agree before I enroll.")
  assert(fam_p2.objectionId === 'parents-spouse-approval', "My husband needs to agree before I enroll. -> parents-spouse-approval")

  const fam_p3 = await runCopilotPipeline("My parents want to decide together.")
  assert(fam_p3.objectionId === 'parents-spouse-approval', "My parents want to decide together. -> parents-spouse-approval")

  const fam_p4 = await runCopilotPipeline("I have to check with my family.")
  assert(fam_p4.objectionId === 'parents-spouse-approval', "I have to check with my family. -> parents-spouse-approval")

  const fam_p5 = await runCopilotPipeline("My spouse wants to review the plan.")
  assert(fam_p5.objectionId === 'parents-spouse-approval', "My spouse wants to review the plan. -> parents-spouse-approval")

  const fam_p6 = await runCopilotPipeline("My father handles these decisions.")
  assert(fam_p6.objectionId === 'parents-spouse-approval', "My father handles these decisions. -> parents-spouse-approval")

  const fam_p7 = await runCopilotPipeline("I need to discuss it with my spouse.")
  assert(fam_p7.objectionId === 'parents-spouse-approval', "I need to discuss it with my spouse. -> parents-spouse-approval")

  const fam_p8 = await runCopilotPipeline("I need to talk to my parents.")
  assert(fam_p8.objectionId === 'parents-spouse-approval', "I need to talk to my parents. -> parents-spouse-approval")

  const fam_p9 = await runCopilotPipeline("I need to ask my wife.")
  assert(fam_p9.objectionId === 'parents-spouse-approval', "I need to ask my wife. -> parents-spouse-approval")

  const fam_p10 = await runCopilotPipeline("My family won't agree.")
  assert(fam_p10.objectionId === 'parents-spouse-approval', "My family won't agree. -> parents-spouse-approval")

  const fam_p11 = await runCopilotPipeline("My mother wants to review it.")
  assert(fam_p11.objectionId === 'parents-spouse-approval', "My mother wants to review it. -> parents-spouse-approval")

  // --- 5. Family Negatives (Section 12) ---
  console.log('\n--- 5. Family Negatives ---')
  const fam_nm1 = await runCopilotPipeline("My wife applied yesterday.")
  assert(fam_nm1.objectionId !== 'parents-spouse-approval', "My wife applied yesterday. -> NOT parents-spouse-approval")

  const fam_nm2 = await runCopilotPipeline("My husband works in IT.")
  assert(fam_nm2.objectionId !== 'parents-spouse-approval', "My husband works in IT. -> NOT parents-spouse-approval")

  const fam_nm3 = await runCopilotPipeline("My family is in India.")
  assert(fam_nm3.objectionId !== 'parents-spouse-approval', "My family is in India. -> NOT parents-spouse-approval")

  const fam_nm4 = await runCopilotPipeline("My parents need a flight ticket.")
  assert(fam_nm4.objectionId !== 'parents-spouse-approval', "My parents need a flight ticket. -> NOT parents-spouse-approval")

  const fam_nm5 = await runCopilotPipeline("My father reviewed my resume.")
  assert(fam_nm5.objectionId !== 'parents-spouse-approval', "My father reviewed my resume. -> NOT parents-spouse-approval")

  const fam_nm6 = await runCopilotPipeline("My mother asked about my interview.")
  assert(fam_nm6.objectionId !== 'parents-spouse-approval', "My mother asked about my interview. -> NOT parents-spouse-approval")

  const fam_nm7 = await runCopilotPipeline("My spouse works at Google.")
  assert(fam_nm7.objectionId !== 'parents-spouse-approval', "My spouse works at Google. -> NOT parents-spouse-approval")

  const fam_nm8 = await runCopilotPipeline("My spouse needs a vacation.")
  assert(fam_nm8.objectionId !== 'parents-spouse-approval', "My spouse needs a vacation. -> NOT parents-spouse-approval")

  const fam_nm9 = await runCopilotPipeline("My spouse needs a new laptop.")
  assert(fam_nm9.objectionId !== 'parents-spouse-approval', "My spouse needs a new laptop. -> NOT parents-spouse-approval")

  const fam_nm10 = await runCopilotPipeline("My spouse needs medical treatment.")
  assert(fam_nm10.objectionId !== 'parents-spouse-approval', "My spouse needs medical treatment. -> NOT parents-spouse-approval")

  const fam_nm11 = await runCopilotPipeline("My parents live in India.")
  assert(fam_nm11.objectionId !== 'parents-spouse-approval', "My parents live in India. -> NOT parents-spouse-approval")

  // --- 6. Family Compound Scenarios (Section 18, 26) ---
  console.log('\n--- 6. Family Compound Scenarios ---')
  const fam_c1 = await runCopilotPipeline("This is expensive, I need to discuss it with my wife.")
  assert(fam_c1.objectionId === 'price-objection' || fam_c1.objectionId === 'parents-spouse-approval', "Price+family compound primary valid")
  assert(
    fam_c1.secondaryObjections?.some(s => s.objectionId === 'parents-spouse-approval' || s.objectionId === 'price-objection'),
    "Price+family compound has secondary"
  )

  const fam_c2 = await runCopilotPipeline("I can't spend this much without talking to my husband.")
  assert(fam_c2.objectionId === 'price-objection' || fam_c2.objectionId === 'parents-spouse-approval', "Price+family compound 2 primary valid")

  const fam_c3 = await runCopilotPipeline("Send me the details so I can discuss them with my parents.")
  assert(fam_c3.objectionId === 'information-request-deferral' || fam_c3.objectionId === 'parents-spouse-approval', "Info+family compound primary valid")
  assert(
    fam_c3.secondaryObjections?.some(s => s.objectionId === 'parents-spouse-approval' || s.objectionId === 'information-request-deferral'),
    "Info+family compound has secondary"
  )

  const fam_c4 = await runCopilotPipeline("Email me the agreement because my wife wants to review it.")
  assert(fam_c4.objectionId === 'information-request-deferral' || fam_c4.objectionId === 'parents-spouse-approval', "Info+family compound 2 primary valid")

  const fam_c5 = await runCopilotPipeline("Send the pricing and I'll ask my husband.")
  assert(fam_c5.objectionId === 'information-request-deferral' || fam_c5.objectionId === 'parents-spouse-approval', "Info+family compound 3 primary valid")

  const fam_c6 = await runCopilotPipeline("My budget is limited and my parents need to approve it.")
  assert(fam_c6.objectionId === 'price-objection' || fam_c6.objectionId === 'parents-spouse-approval', "Price+family compound 3 primary valid")

  // --- 7. DIY+Time Compounds (Section 13) ---
  console.log('\n--- 7. DIY+Time Compounds ---')
  const diy_t1 = await runCopilotPipeline("I want to try myself for another month, then I'll think about your program.")
  assert(diy_t1.objectionId === 'already-applying-myself', "DIY+time primary is already-applying-myself")
  assert(
    diy_t1.secondaryObjections?.some(s => s.objectionId === 'need-time-to-think'),
    "DIY+time compound has need-time-to-think secondary"
  )

  const diy_t2 = await runCopilotPipeline("I want to try myself for another month and then decide.")
  assert(diy_t2.objectionId === 'already-applying-myself', "DIY+time compound 2 primary valid")

  const diy_t3 = await runCopilotPipeline("I'll apply myself for a few more weeks and get back to you.")
  assert(diy_t3.objectionId === 'already-applying-myself', "DIY+time compound 3 primary valid")

  const diy_t4 = await runCopilotPipeline("I want to continue on my own for now and think about your program later.")
  assert(diy_t4.objectionId === 'already-applying-myself', "DIY+time compound 4 primary valid")

  const diy_t5 = await runCopilotPipeline("I already have interviews, so let me see how things go this month.")
  assert(diy_t5.objectionId === 'already-applying-myself', "DIY+time compound 5 primary valid")

  const diy_t6 = await runCopilotPipeline("I'll keep applying myself and maybe talk next month.")
  assert(diy_t6.objectionId === 'already-applying-myself', "DIY+time compound 6 primary valid")

  const diy_t7 = await runCopilotPipeline("I can manage the job search myself, but give me a few days to decide.")
  assert(diy_t7.objectionId === 'already-applying-myself', "DIY+time compound 7 primary valid")

  // --- 8. Time Near-Misses (Section 14) ---
  console.log('\n--- 8. Time Near-Misses ---')
  const tm_nm1 = await runCopilotPipeline("I need time to finish my coding assessment.")
  assert(tm_nm1.objectionId !== 'need-time-to-think', "I need time to finish my coding assessment. -> NOT need-time-to-think")

  const tm_nm2 = await runCopilotPipeline("My interview is next month.")
  assert(tm_nm2.objectionId !== 'need-time-to-think', "My interview is next month. -> NOT need-time-to-think")

  const tm_nm3 = await runCopilotPipeline("The call lasts five minutes.")
  assert(tm_nm3.objectionId !== 'need-time-to-think', "The call lasts five minutes. -> NOT need-time-to-think")

  const tm_nm4 = await runCopilotPipeline("Give me a few days to complete the project.")
  assert(tm_nm4.objectionId !== 'need-time-to-think', "Give me a few days to complete the project. -> NOT need-time-to-think")

  // Correction #3: Time near-miss with genuine sales delay preserved
  const tm_nm5 = await runCopilotPipeline("My interview is next month, so call me after that.")
  assert(tm_nm5.objectionId === 'need-time-to-think', "Interview + call me after -> need-time-to-think (Correction #3)")

  const tm_nm6 = await runCopilotPipeline("I need a few days to finish the assessment, then I'll decide about your program.")
  assert(tm_nm6.objectionId === 'need-time-to-think', "Assessment + then I'll decide -> need-time-to-think (Correction #3)")

  // --- 9. Price Positives (Section 16) ---
  console.log('\n--- 9. Price Positives ---')
  const pr_p1 = await runCopilotPipeline("This is too expensive.")
  assert(pr_p1.objectionId === 'price-objection', "This is too expensive. -> price-objection")

  const pr_p2 = await runCopilotPipeline("I can't afford this.")
  assert(pr_p2.objectionId === 'price-objection', "I can't afford this. -> price-objection")

  const pr_p3 = await runCopilotPipeline("I cannot afford this.")
  assert(pr_p3.objectionId === 'price-objection', "I cannot afford this. -> price-objection")

  const pr_p4 = await runCopilotPipeline("My budget is too low.")
  assert(pr_p4.objectionId === 'price-objection', "My budget is too low. -> price-objection")

  const pr_p5 = await runCopilotPipeline("This is outside my budget.")
  assert(pr_p5.objectionId === 'price-objection', "This is outside my budget. -> price-objection")

  const pr_p6 = await runCopilotPipeline("I can't spend this much.")
  assert(pr_p6.objectionId === 'price-objection', "I can't spend this much. -> price-objection")

  const pr_p7 = await runCopilotPipeline("I can't spend that much.")
  assert(pr_p7.objectionId === 'price-objection', "I can't spend that much. -> price-objection")

  const pr_p8 = await runCopilotPipeline("The fee is too high.")
  assert(pr_p8.objectionId === 'price-objection', "The fee is too high. -> price-objection")

  const pr_p9 = await runCopilotPipeline("This costs too much.")
  assert(pr_p9.objectionId === 'price-objection', "This costs too much. -> price-objection")

  const pr_p10 = await runCopilotPipeline("This is financially difficult for me.")
  assert(pr_p10.objectionId === 'price-objection', "This is financially difficult for me. -> price-objection")

  const pr_p11 = await runCopilotPipeline("That's too much for me.")
  assert(pr_p11.objectionId === 'price-objection', "That's too much for me. -> price-objection")

  const pr_p12 = await runCopilotPipeline("I have a price issue with this offer.")
  assert(pr_p12.objectionId === 'price-objection', "I have a price issue with this offer. -> price-objection")

  // --- 10. Price Informational Negatives (Section 15) ---
  console.log('\n--- 10. Price Informational Negatives ---')
  const pr_nm1 = await runCopilotPipeline("What is the price?")
  assert(pr_nm1.objectionId !== 'price-objection', "What is the price? -> NOT price-objection")

  const pr_nm2 = await runCopilotPipeline("Send me the price.")
  assert(pr_nm2.objectionId !== 'price-objection', "Send me the price. -> NOT price-objection")

  const pr_nm3 = await runCopilotPipeline("What does the fee include?")
  assert(pr_nm3.objectionId !== 'price-objection', "What does the fee include? -> NOT price-objection")

  const pr_nm4 = await runCopilotPipeline("My project has a cost field.")
  assert(pr_nm4.objectionId !== 'price-objection', "My project has a cost field. -> NOT price-objection")

  const pr_nm5 = await runCopilotPipeline("The API returns a price.")
  assert(pr_nm5.objectionId !== 'price-objection', "The API returns a price. -> NOT price-objection")

  const pr_nm6 = await runCopilotPipeline("My employer gives me a training budget.")
  assert(pr_nm6.objectionId !== 'price-objection', "My employer gives me a training budget. -> NOT price-objection")

  const pr_nm7 = await runCopilotPipeline("The database has a price field.")
  assert(pr_nm7.objectionId !== 'price-objection', "The database has a price field. -> NOT price-objection")

  const pr_nm8 = await runCopilotPipeline("The product has a pricing issue in the database.")
  assert(pr_nm8.objectionId !== 'price-objection', "The product has a pricing issue in the database. -> NOT price-objection")

  // --- 11. Price Compounds (Section 17, 18) ---
  console.log('\n--- 11. Price Compounds ---')
  const pr_c1 = await runCopilotPipeline("It's expensive, let me think about it.")
  assert(pr_c1.objectionId === 'price-objection', "Price+time primary is price-objection")
  assert(
    pr_c1.secondaryObjections?.some(s => s.objectionId === 'need-time-to-think'),
    "Price+time has need-time-to-think secondary"
  )

  const pr_c2 = await runCopilotPipeline("I can't afford this right now, call me next month.")
  assert(pr_c2.objectionId === 'price-objection', "Price+time compound 2 primary")

  const pr_c3 = await runCopilotPipeline("My budget is tight, give me a few days.")
  assert(pr_c3.objectionId === 'price-objection', "Price+time compound 3 primary")

  const pr_c4 = await runCopilotPipeline("I need some time because the price is high.")
  assert(pr_c4.objectionId === 'price-objection' || pr_c4.objectionId === 'need-time-to-think', "Price+time compound 4 primary valid")

  // --- 12. Trust Positives (Section 20) ---
  console.log('\n--- 12. Trust Positives ---')
  const tr_p1 = await runCopilotPipeline("How do I know this is genuine?")
  assert(tr_p1.objectionId === 'trust-and-credibility', "How do I know this is genuine? -> trust-and-credibility")

  const tr_p2 = await runCopilotPipeline("Is this legitimate?")
  assert(tr_p2.objectionId === 'trust-and-credibility', "Is this legitimate? -> trust-and-credibility")

  const tr_p3 = await runCopilotPipeline("Is this legit?")
  assert(tr_p3.objectionId === 'trust-and-credibility', "Is this legit? -> trust-and-credibility")

  const tr_p4 = await runCopilotPipeline("I was scammed before.")
  assert(tr_p4.objectionId === 'trust-and-credibility', "I was scammed before. -> trust-and-credibility")

  const tr_p5 = await runCopilotPipeline("I was cheated by another consultancy.")
  assert(tr_p5.objectionId === 'trust-and-credibility', "I was cheated by another consultancy. -> trust-and-credibility")

  const tr_p6 = await runCopilotPipeline("I don't trust placement companies.")
  assert(tr_p6.objectionId === 'trust-and-credibility', "I don't trust placement companies. -> trust-and-credibility")

  const tr_p7 = await runCopilotPipeline("Can you prove this actually works?")
  assert(tr_p7.objectionId === 'trust-and-credibility', "Can you prove this actually works? -> trust-and-credibility")

  const tr_p8 = await runCopilotPipeline("Do you have proof that your placements are real?")
  assert(tr_p8.objectionId === 'trust-and-credibility', "Do you have proof that your placements are real? -> trust-and-credibility")

  const tr_p9 = await runCopilotPipeline("Do you have genuine success stories?")
  assert(tr_p9.objectionId === 'trust-and-credibility', "Do you have genuine success stories? -> trust-and-credibility")

  const tr_p10 = await runCopilotPipeline("I had a bad experience with another agency.")
  assert(tr_p10.objectionId === 'trust-and-credibility', "I had a bad experience with another agency. -> trust-and-credibility")

  // --- 13. Trust Neutral Negatives (Section 19) ---
  console.log('\n--- 13. Trust Neutral Negatives ---')
  const tr_nm1 = await runCopilotPipeline("I have real work experience.")
  assert(tr_nm1.objectionId !== 'trust-and-credibility', "I have real work experience. -> NOT trust-and-credibility")

  const tr_nm2 = await runCopilotPipeline("This is a real interview.")
  assert(tr_nm2.objectionId !== 'trust-and-credibility', "This is a real interview. -> NOT trust-and-credibility")

  const tr_nm3 = await runCopilotPipeline("I work on real-time projects.")
  assert(tr_nm3.objectionId !== 'trust-and-credibility', "I work on real-time projects. -> NOT trust-and-credibility")

  const tr_nm4 = await runCopilotPipeline("I need a real project.")
  assert(tr_nm4.objectionId !== 'trust-and-credibility', "I need a real project. -> NOT trust-and-credibility")

  const tr_nm5 = await runCopilotPipeline("I want real recruiter connections.")
  assert(tr_nm5.objectionId !== 'trust-and-credibility', "I want real recruiter connections. -> NOT trust-and-credibility")

  const tr_nm6 = await runCopilotPipeline("I need proof of address.")
  assert(tr_nm6.objectionId !== 'trust-and-credibility', "I need proof of address. -> NOT trust-and-credibility")

  const tr_nm7 = await runCopilotPipeline("Can you guarantee delivery by Friday?")
  assert(tr_nm7.objectionId !== 'trust-and-credibility', "Can you guarantee delivery by Friday? -> NOT trust-and-credibility")

  const tr_nm8 = await runCopilotPipeline("I read reviews for this course.")
  assert(tr_nm8.objectionId !== 'trust-and-credibility', "I read reviews for this course. -> NOT trust-and-credibility")

  // --- 14. Trust Compounds (Section 21, 22) ---
  console.log('\n--- 14. Trust Compounds ---')
  const tr_c1 = await runCopilotPipeline("I've been scammed before and this is also expensive.")
  assert(tr_c1.objectionId === 'trust-and-credibility' || tr_c1.objectionId === 'price-objection', "Trust+price compound primary valid")
  assert(
    tr_c1.secondaryObjections?.some(s => s.objectionId === 'trust-and-credibility' || s.objectionId === 'price-objection'),
    "Trust+price has secondary"
  )

  const tr_c2 = await runCopilotPipeline("How do I know this is genuine for that price?")
  assert(tr_c2.objectionId === 'trust-and-credibility' || tr_c2.objectionId === 'price-objection', "Trust+price compound 2 primary valid")

  const tr_c3 = await runCopilotPipeline("I don't trust placement companies and the fee is too high.")
  assert(tr_c3.objectionId === 'trust-and-credibility' || tr_c3.objectionId === 'price-objection', "Trust+price compound 3 primary valid")

  const tr_c4 = await runCopilotPipeline("I don't trust consultancies, so I won't pay upfront.")
  assert(tr_c4.objectionId === 'trust-and-credibility' || tr_c4.objectionId === 'upfront-payment-resistance', "Trust+upfront compound primary valid")

  const tr_c5 = await runCopilotPipeline("I've been scammed before, why should I make an advance payment?")
  assert(tr_c5.objectionId === 'trust-and-credibility' || tr_c5.objectionId === 'upfront-payment-resistance', "Trust+upfront compound 2 primary valid")

  const tr_c6 = await runCopilotPipeline("I need proof before paying anything upfront.")
  assert(
    (tr_c6.objectionId === 'trust-and-credibility' && tr_c6.secondaryObjections?.some(s => s.objectionId === 'upfront-payment-resistance')) ||
    (tr_c6.objectionId === 'upfront-payment-resistance' && tr_c6.secondaryObjections?.some(s => s.objectionId === 'trust-and-credibility')),
    "Trust+upfront compound must surface both (Probe S)"
  )

  // --- 15. Upfront Positives (Section 23) ---
  console.log('\n--- 15. Upfront Positives ---')
  const uf_p1 = await runCopilotPipeline("No advance payment.")
  assert(uf_p1.objectionId === 'upfront-payment-resistance', "No advance payment. -> upfront-payment-resistance")

  const uf_p2 = await runCopilotPipeline("I won't make an advance payment.")
  assert(uf_p2.objectionId === 'upfront-payment-resistance', "I won't make an advance payment. -> upfront-payment-resistance")

  const uf_p3 = await runCopilotPipeline("I don't want to pay before results.")
  assert(uf_p3.objectionId === 'upfront-payment-resistance', "I don't want to pay before results. -> upfront-payment-resistance")

  const uf_p4 = await runCopilotPipeline("I don't want to pay before getting placed.")
  assert(uf_p4.objectionId === 'upfront-payment-resistance', "I don't want to pay before getting placed. -> upfront-payment-resistance")

  const uf_p5 = await runCopilotPipeline("I only pay after I join.")
  assert(uf_p5.objectionId === 'upfront-payment-resistance', "I only pay after I join. -> upfront-payment-resistance")

  const uf_p6 = await runCopilotPipeline("I'll pay after I get a job.")
  assert(uf_p6.objectionId === 'upfront-payment-resistance', "I'll pay after I get a job. -> upfront-payment-resistance")

  const uf_p7 = await runCopilotPipeline("I'll pay once I start earning.")
  assert(uf_p7.objectionId === 'upfront-payment-resistance', "I'll pay once I start earning. -> upfront-payment-resistance")

  const uf_p8 = await runCopilotPipeline("Why should I pay before placement?")
  assert(uf_p8.objectionId === 'upfront-payment-resistance', "Why should I pay before placement? -> upfront-payment-resistance")

  const uf_p9 = await runCopilotPipeline("Can I pay after placement?")
  assert(uf_p9.objectionId === 'upfront-payment-resistance', "Can I pay after placement? -> upfront-payment-resistance")

  // --- 16. Upfront Negatives (Section 23) ---
  console.log('\n--- 16. Upfront Negatives ---')
  const uf_nm1 = await runCopilotPipeline("I paid my apartment upfront.")
  assert(uf_nm1.objectionId !== 'upfront-payment-resistance', "I paid my apartment upfront. -> NOT upfront-payment-resistance")

  const uf_nm2 = await runCopilotPipeline("I paid my laptop in advance.")
  assert(uf_nm2.objectionId !== 'upfront-payment-resistance', "I paid my laptop in advance. -> NOT upfront-payment-resistance")

  const uf_nm3 = await runCopilotPipeline("I paid rent in advance.")
  assert(uf_nm3.objectionId !== 'upfront-payment-resistance', "I paid rent in advance. -> NOT upfront-payment-resistance")

  // --- 17. Info Positives (Section 24) ---
  console.log('\n--- 17. Info Positives ---')
  const info_p1 = await runCopilotPipeline("Send me the agreement.")
  assert(info_p1.objectionId === 'information-request-deferral', "Send me the agreement. -> information-request-deferral")

  const info_p2 = await runCopilotPipeline("Email me the agreement.")
  assert(info_p2.objectionId === 'information-request-deferral', "Email me the agreement. -> information-request-deferral")

  const info_p3 = await runCopilotPipeline("Send me the pricing.")
  assert(info_p3.objectionId === 'information-request-deferral', "Send me the pricing. -> information-request-deferral")

  const info_p4 = await runCopilotPipeline("Send me the pricing breakdown.")
  assert(info_p4.objectionId === 'information-request-deferral', "Send me the pricing breakdown. -> information-request-deferral")

  const info_p5 = await runCopilotPipeline("Send me the brochure.")
  assert(info_p5.objectionId === 'information-request-deferral', "Send me the brochure. -> information-request-deferral")

  const info_p6 = await runCopilotPipeline("Send me the proposal.")
  assert(info_p6.objectionId === 'information-request-deferral', "Send me the proposal. -> information-request-deferral")

  const info_p7 = await runCopilotPipeline("Send me the plan details.")
  assert(info_p7.objectionId === 'information-request-deferral', "Send me the plan details. -> information-request-deferral")

  const info_p8 = await runCopilotPipeline("Send me the information and I'll review it.")
  assert(info_p8.objectionId === 'information-request-deferral', "Send me the information and I'll review it. -> information-request-deferral")

  const info_p9 = await runCopilotPipeline("Email me the details and I'll decide.")
  assert(info_p9.objectionId === 'information-request-deferral', "Email me the details and I'll decide. -> information-request-deferral")

  const info_p10 = await runCopilotPipeline("Send me everything in writing.")
  assert(info_p10.objectionId === 'information-request-deferral', "Send me everything in writing. -> information-request-deferral")

  // --- 18. Pure Pricing Questions Staying Unclassified ---
  console.log('\n--- 18. Pure Pricing Questions ---')
  const pq1 = await runCopilotPipeline("What is the price?")
  assert(pq1.objectionId === 'unclassified' || pq1.objectionId !== 'price-objection', "What is the price? -> unclassified/not-price")

  const pq2 = await runCopilotPipeline("What does the fee include?")
  assert(pq2.objectionId === 'unclassified' || pq2.objectionId !== 'price-objection', "What does the fee include? -> unclassified/not-price")

  // --- 19. Info Compounds (Section 25, 26) ---
  console.log('\n--- 19. Info Compounds ---')
  const info_c1 = await runCopilotPipeline("Send me the agreement and give me a few days.")
  assert(info_c1.objectionId === 'information-request-deferral' || info_c1.objectionId === 'need-time-to-think', "Info+time compound primary valid")
  assert(
    info_c1.secondaryObjections?.some(s => s.objectionId === 'need-time-to-think' || s.objectionId === 'information-request-deferral'),
    "Info+time compound has secondary"
  )

  const info_c2 = await runCopilotPipeline("Email the pricing and I'll decide next week.")
  assert(info_c2.objectionId === 'information-request-deferral' || info_c2.objectionId === 'need-time-to-think', "Info+time compound 2 primary valid")

  const info_c3 = await runCopilotPipeline("Send me the details and I'll get back to you.")
  assert(info_c3.objectionId === 'information-request-deferral' || info_c3.objectionId === 'need-time-to-think', "Info+time compound 3 primary valid")

  // --- 20. Consultancy Positives (Section 27) ---
  console.log('\n--- 20. Consultancy Positives ---')
  const con_p1 = await runCopilotPipeline("I'm already working with a consultancy.")
  assert(con_p1.objectionId === 'already-working-with-consultancy', "I'm already working with a consultancy. -> consultancy")

  const con_p2 = await runCopilotPipeline("I already hired a recruiter.")
  assert(con_p2.objectionId === 'already-working-with-consultancy', "I already hired a recruiter. -> consultancy")

  const con_p3 = await runCopilotPipeline("I already have a placement agency.")
  assert(con_p3.objectionId === 'already-working-with-consultancy', "I already have a placement agency. -> consultancy")

  const con_p4 = await runCopilotPipeline("Another agency is marketing my profile.")
  assert(con_p4.objectionId === 'already-working-with-consultancy', "Another agency is marketing my profile. -> consultancy")

  const con_p5 = await runCopilotPipeline("I signed a contract with another career service.")
  assert(con_p5.objectionId === 'already-working-with-consultancy', "I signed a contract with another career service. -> consultancy")

  const con_p6 = await runCopilotPipeline("I have another recruiter helping me.")
  assert(con_p6.objectionId === 'already-working-with-consultancy', "I have another recruiter helping me. -> consultancy")

  const con_p7 = await runCopilotPipeline("I already paid another company.")
  assert(con_p7.objectionId === 'already-working-with-consultancy', "I already paid another company. -> consultancy")

  const con_p8 = await runCopilotPipeline("I'm already enrolled somewhere else.")
  assert(con_p8.objectionId === 'already-working-with-consultancy', "I'm already enrolled somewhere else. -> consultancy")

  const con_p9 = await runCopilotPipeline("Another company is doing this for me.")
  assert(con_p9.objectionId === 'already-working-with-consultancy', "Another company is doing this for me. -> consultancy")

  const con_p10 = await runCopilotPipeline("I'm already using another placement company.")
  assert(con_p10.objectionId === 'already-working-with-consultancy', "I'm already using another placement company. -> consultancy")

  // --- 21. Consultancy Neutral Negatives (Section 28) ---
  console.log('\n--- 21. Consultancy Neutral Negatives ---')
  const con_nm1 = await runCopilotPipeline("I work at a consultancy.")
  assert(con_nm1.objectionId !== 'already-working-with-consultancy', "I work at a consultancy. -> NOT consultancy")

  const con_nm2 = await runCopilotPipeline("My recruiter works for another company.")
  assert(con_nm2.objectionId !== 'already-working-with-consultancy', "My recruiter works for another company. -> NOT consultancy")

  const con_nm3 = await runCopilotPipeline("I'm applying to consulting companies.")
  assert(con_nm3.objectionId !== 'already-working-with-consultancy', "I'm applying to consulting companies. -> NOT consultancy")

  const con_nm4 = await runCopilotPipeline("My company has internal recruiters.")
  assert(con_nm4.objectionId !== 'already-working-with-consultancy', "My company has internal recruiters. -> NOT consultancy")

  // --- 22. Consultancy Compounds (Section 29, 30) ---
  console.log('\n--- 22. Consultancy Compounds ---')
  const con_c1 = await runCopilotPipeline("I'm already working with another consultancy and they're cheaper.")
  assert(con_c1.objectionId === 'already-working-with-consultancy' || con_c1.objectionId === 'price-objection', "Consultancy+price primary valid")

  const con_c2 = await runCopilotPipeline("I already paid another company, so I don't want another fee.")
  assert(con_c2.objectionId === 'already-working-with-consultancy' || con_c2.objectionId === 'price-objection', "Consultancy+price compound 2 primary valid")

  const con_c3 = await runCopilotPipeline("Another recruiter is helping me and this seems expensive.")
  assert(con_c3.objectionId === 'already-working-with-consultancy' || con_c3.objectionId === 'price-objection', "Consultancy+price compound 3 primary valid")

  const con_c4 = await runCopilotPipeline("I have another recruiter helping me, but I also apply myself.")
  assert(con_c4.objectionId === 'already-working-with-consultancy' || con_c4.objectionId === 'already-applying-myself', "Consultancy+DIY primary valid")

  const con_c5 = await runCopilotPipeline("I'm already enrolled elsewhere and I'm still applying on my own.")
  assert(con_c5.objectionId === 'already-working-with-consultancy' || con_c5.objectionId === 'already-applying-myself', "Consultancy+DIY compound 2 primary valid")

  // --- 23. Not-Interested Positives (Section 31) ---
  console.log('\n--- 23. Not-Interested Positives ---')
  const ni_p1 = await runCopilotPipeline("I'm not interested.")
  assert(ni_p1.objectionId === 'not-interested', "I'm not interested. -> not-interested")

  const ni_p2 = await runCopilotPipeline("I'm not interested in the premium package.")
  assert(ni_p2.objectionId === 'not-interested', "I'm not interested in the premium package. -> not-interested")

  const ni_p3 = await runCopilotPipeline("I'm not interested in your Elite plan.")
  assert(ni_p3.objectionId === 'not-interested', "I'm not interested in your Elite plan. -> not-interested")

  const ni_p4 = await runCopilotPipeline("I'm not interested in this placement service.")
  assert(ni_p4.objectionId === 'not-interested', "I'm not interested in this placement service. -> not-interested")

  const ni_p5 = await runCopilotPipeline("I'm not interested in this opportunity.")
  assert(ni_p5.objectionId === 'not-interested', "I'm not interested in this opportunity. -> not-interested")

  const ni_p6 = await runCopilotPipeline("I'm not interested in continuing.")
  assert(ni_p6.objectionId === 'not-interested', "I'm not interested in continuing. -> not-interested")

  const ni_p7 = await runCopilotPipeline("I'm not interested in proceeding.")
  assert(ni_p7.objectionId === 'not-interested', "I'm not interested in proceeding. -> not-interested")

  const ni_p8 = await runCopilotPipeline("I'm not interested in this program.")
  assert(ni_p8.objectionId === 'not-interested', "I'm not interested in this program. -> not-interested")

  const ni_p9 = await runCopilotPipeline("I'm not interested in your program.")
  assert(ni_p9.objectionId === 'not-interested', "I'm not interested in your program. -> not-interested")

  const ni_p10 = await runCopilotPipeline("I'm not interested in this service.")
  assert(ni_p10.objectionId === 'not-interested', "I'm not interested in this service. -> not-interested")

  const ni_p11 = await runCopilotPipeline("I'm not interested in signing up.")
  assert(ni_p11.objectionId === 'not-interested', "I'm not interested in signing up. -> not-interested")

  const ni_p12 = await runCopilotPipeline("I'm not interested in enrolling.")
  assert(ni_p12.objectionId === 'not-interested', "I'm not interested in enrolling. -> not-interested")

  const ni_p13 = await runCopilotPipeline("I'm not interested in moving forward.")
  assert(ni_p13.objectionId === 'not-interested', "I'm not interested in moving forward. -> not-interested")

  // --- 24. Not-Interested Contextual Negatives (Section 32) ---
  console.log('\n--- 24. Not-Interested Contextual Negatives ---')
  const ni_nm1 = await runCopilotPipeline("I'm not interested in remote jobs.")
  assert(ni_nm1.objectionId !== 'not-interested', "I'm not interested in remote jobs. -> NOT not-interested")

  const ni_nm2 = await runCopilotPipeline("I'm not interested in software engineering.")
  assert(ni_nm2.objectionId !== 'not-interested', "I'm not interested in software engineering. -> NOT not-interested")

  const ni_nm3 = await runCopilotPipeline("I'm not interested in healthcare roles.")
  assert(ni_nm3.objectionId !== 'not-interested', "I'm not interested in healthcare roles. -> NOT not-interested")

  const ni_nm4 = await runCopilotPipeline("I'm not interested in relocating.")
  assert(ni_nm4.objectionId !== 'not-interested', "I'm not interested in relocating. -> NOT not-interested")

  const ni_nm5 = await runCopilotPipeline("I'm not interested in changing my resume format.")
  assert(ni_nm5.objectionId !== 'not-interested', "I'm not interested in changing my resume format. -> NOT not-interested")

  const ni_nm6 = await runCopilotPipeline("I'm not interested in using LinkedIn.")
  assert(ni_nm6.objectionId !== 'not-interested', "I'm not interested in using LinkedIn. -> NOT not-interested")

  const ni_nm7 = await runCopilotPipeline("I'm not interested in that payment method.")
  assert(ni_nm7.objectionId !== 'not-interested', "I'm not interested in that payment method. -> NOT not-interested")

  // --- 25. Substantive-Over-Soft-Not-Interested Ranking (Section 33, Correction #4) ---
  console.log('\n--- 25. Substantive-Over-Soft-Not-Interested Ranking ---')
  const rank1 = await runCopilotPipeline("I'm not interested because it's too expensive.")
  assert(rank1.objectionId === 'price-objection', "Not-interested + price -> price-objection primary")

  const rank2 = await runCopilotPipeline("I'm not interested because I already have another consultancy.")
  assert(rank2.objectionId === 'already-working-with-consultancy', "Not-interested + consultancy -> consultancy primary")

  const rank3 = await runCopilotPipeline("I'm not interested because I don't trust consultancies.")
  assert(rank3.objectionId === 'trust-and-credibility', "Not-interested + trust -> trust primary")

  const rank4 = await runCopilotPipeline("I'm not interested because I need to talk to my wife.")
  assert(rank4.objectionId === 'parents-spouse-approval', "Not-interested + family -> family primary")

  const rank5 = await runCopilotPipeline("I'm not interested, I want to try myself.")
  assert(rank5.objectionId === 'already-applying-myself', "Not-interested + DIY -> DIY primary")

  // Bare not-interested stays primary
  const rank6 = await runCopilotPipeline("I'm not interested.")
  assert(rank6.objectionId === 'not-interested', "Bare not-interested -> stays not-interested primary")

  // --- 26. Upfront vs Not-Interested (Section 34) ---
  console.log('\n--- 26. Upfront vs Not-Interested ---')
  const upni = await runCopilotPipeline("I'm not interested in paying upfront.")
  assert(upni.objectionId === 'upfront-payment-resistance', "I'm not interested in paying upfront. -> upfront-payment-resistance")

  // --- 27. Deterministic Identical-Input Behavior ---
  console.log('\n--- 27. Determinism Verification ---')
  const detInputs = [
    "Please don't reach out again.",
    "My wife has to approve this.",
    "What is the price?",
    "I have real work experience.",
    "I'm not interested because it's too expensive.",
    "I already hired a recruiter.",
    "I work at a consultancy.",
    "Send me the agreement and give me a few days.",
    "I want to try myself for another month, then I'll think about your program.",
    "I need proof before paying anything upfront.",
  ]
  for (let i = 0; i < detInputs.length; i++) {
    const input = detInputs[i]
    const out1 = await runCopilotPipeline(input)
    const out2 = await runCopilotPipeline(input)
    assert(
      out1.objectionId === out2.objectionId && out1.recommendedResponse === out2.recommendedResponse,
      `Determinism ${i + 1}: Stable output for "${input.substring(0, 40)}..."`
    )
  }

  console.log('\n=====================================================')
  console.log(`RESULTS: Passed ${passed}/${passed + failed} assertions`)
  console.log('=====================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
