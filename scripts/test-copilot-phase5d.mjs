import { runCopilotPipeline } from '../lib/copilot/pipeline.ts'

console.log('=====================================================')
console.log('   SALES COPILOT PHASE 5D CLASSIFICATION PRECISION  ')
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
  // --- 1. Explicit Refusal Safety Coverage & Mandatory Tests (Section 34) ---
  console.log('\n--- 1. Explicit Refusal Safety Coverage ---')
  const r1 = await runCopilotPipeline("Don't contact me.")
  assert(r1.objectionId === 'explicit-refusal', "Don't contact me. -> explicit-refusal")
  assert(r1.nextQuestion === '', "Don't contact me. -> empty nextQuestion")
  assert(r1.secondaryObjections === undefined, "Don't contact me. -> no secondary objections")

  const r2 = await runCopilotPipeline("Do not contact me.")
  assert(r2.objectionId === 'explicit-refusal', "Do not contact me. -> explicit-refusal")
  assert(r2.nextQuestion === '', "Do not contact me. -> empty nextQuestion")

  const r3 = await runCopilotPipeline("Do not message me again.")
  assert(r3.objectionId === 'explicit-refusal', "Do not message me again. -> explicit-refusal")

  const r4 = await runCopilotPipeline("I already told you not to call.")
  assert(r4.objectionId === 'explicit-refusal', "I already told you not to call. -> explicit-refusal")

  const r5 = await runCopilotPipeline("Please stop calling me.")
  assert(r5.objectionId === 'explicit-refusal', "Please stop calling me. -> explicit-refusal")

  // --- 2. Explicit Refusal Near-Miss Safety (Section 34) ---
  console.log('\n--- 2. Explicit Refusal Near-Miss Safety ---')
  const nm1 = await runCopilotPipeline("Please stop the application for now.")
  assert(nm1.objectionId !== 'explicit-refusal', "Please stop the application for now. -> NOT explicit-refusal")

  const nm2 = await runCopilotPipeline("Stop the video.")
  assert(nm2.objectionId !== 'explicit-refusal', "Stop the video. -> NOT explicit-refusal")

  const nm3 = await runCopilotPipeline("Message me the details.")
  assert(nm3.objectionId !== 'explicit-refusal', "Message me the details. -> NOT explicit-refusal")

  const nm4 = await runCopilotPipeline("Can you call me tomorrow?")
  assert(nm4.objectionId !== 'explicit-refusal', "Can you call me tomorrow? -> NOT explicit-refusal")

  const nm5 = await runCopilotPipeline("Contact me next week.")
  assert(nm5.objectionId !== 'explicit-refusal', "Contact me next week. -> NOT explicit-refusal")

  const nm6 = await runCopilotPipeline("Don't call this API twice.")
  assert(nm6.objectionId !== 'explicit-refusal', "Don't call this API twice. -> NOT explicit-refusal")

  // --- 3. Not-Interested Contextual Precision & Mandatory Tests (Section 35) ---
  console.log('\n--- 3. Not-Interested Contextual Precision ---')
  // Exclusions (MUST NOT be not-interested)
  const ni_ex1 = await runCopilotPipeline("I'm not interested in changing my resume format.")
  assert(ni_ex1.objectionId !== 'not-interested', "I'm not interested in changing my resume format. -> NOT not-interested")

  const ni_ex2 = await runCopilotPipeline("I'm not interested in Java roles.")
  assert(ni_ex2.objectionId !== 'not-interested', "I'm not interested in Java roles. -> NOT not-interested")

  const ni_ex3 = await runCopilotPipeline("I'm not interested in relocating.")
  assert(ni_ex3.objectionId !== 'not-interested', "I'm not interested in relocating. -> NOT not-interested")

  const ni_ex4 = await runCopilotPipeline("I'm not interested in healthcare jobs.")
  assert(ni_ex4.objectionId !== 'not-interested', "I'm not interested in healthcare jobs. -> NOT not-interested")

  const ni_ex5 = await runCopilotPipeline("I'm not interested in paying by credit card.")
  assert(ni_ex5.objectionId !== 'not-interested', "I'm not interested in paying by credit card. -> NOT not-interested")

  const ni_ex6 = await runCopilotPipeline("I'm not interested in using WhatsApp.")
  assert(ni_ex6.objectionId !== 'not-interested', "I'm not interested in using WhatsApp. -> NOT not-interested")

  const ni_ex7 = await runCopilotPipeline("I'm not interested in night-shift roles.")
  assert(ni_ex7.objectionId !== 'not-interested', "I'm not interested in night-shift roles. -> NOT not-interested")

  const ni_ex8 = await runCopilotPipeline("I'm not interested in that job.")
  assert(ni_ex8.objectionId !== 'not-interested', "I'm not interested in that job. -> NOT not-interested")

  const ni_ex9 = await runCopilotPipeline("I'm not interested in this particular employer.")
  assert(ni_ex9.objectionId !== 'not-interested', "I'm not interested in this particular employer. -> NOT not-interested")

  // Positives (MUST STILL be not-interested)
  const ni_p1 = await runCopilotPipeline("I'm not interested.")
  assert(ni_p1.objectionId === 'not-interested', "I'm not interested. -> not-interested")

  const ni_p2 = await runCopilotPipeline("I'm not interested in this program.")
  assert(ni_p2.objectionId === 'not-interested', "I'm not interested in this program. -> not-interested")

  const ni_p3 = await runCopilotPipeline("I'm not interested in your program.")
  assert(ni_p3.objectionId === 'not-interested', "I'm not interested in your program. -> not-interested")

  const ni_p4 = await runCopilotPipeline("I'm not interested in this service.")
  assert(ni_p4.objectionId === 'not-interested', "I'm not interested in this service. -> not-interested")

  const ni_p5 = await runCopilotPipeline("I'm not interested in your service.")
  assert(ni_p5.objectionId === 'not-interested', "I'm not interested in your service. -> not-interested")

  const ni_p6 = await runCopilotPipeline("I'm not interested in this package.")
  assert(ni_p6.objectionId === 'not-interested', "I'm not interested in this package. -> not-interested")

  const ni_p7 = await runCopilotPipeline("I'm not interested in signing up.")
  assert(ni_p7.objectionId === 'not-interested', "I'm not interested in signing up. -> not-interested")

  const ni_p8 = await runCopilotPipeline("I'm not interested in enrolling.")
  assert(ni_p8.objectionId === 'not-interested', "I'm not interested in enrolling. -> not-interested")

  const ni_p9 = await runCopilotPipeline("I'm not interested in moving forward.")
  assert(ni_p9.objectionId === 'not-interested', "I'm not interested in moving forward. -> not-interested")

  const ni_p10 = await runCopilotPipeline("I'm not interested in this offer.")
  assert(ni_p10.objectionId === 'not-interested', "I'm not interested in this offer. -> not-interested")

  const ni_p11 = await runCopilotPipeline("No thanks.")
  assert(ni_p11.objectionId === 'not-interested', "No thanks. -> not-interested")

  const ni_p12 = await runCopilotPipeline("Nah I'm good.")
  assert(ni_p12.objectionId === 'not-interested', "Nah I'm good. -> not-interested")

  const ni_p13 = await runCopilotPipeline("I don't think I need this.")
  assert(ni_p13.objectionId === 'not-interested', "I don't think I need this. -> not-interested")

  // --- 4. Price Coverage & Mandatory Tests (Section 36) ---
  console.log('\n--- 4. Price Coverage & Near-Miss Safety ---')
  const pr_p1 = await runCopilotPipeline("I can't afford that.")
  assert(pr_p1.objectionId === 'price-objection', "I can't afford that. -> price-objection")

  const pr_p2 = await runCopilotPipeline("I don't have the money right now.")
  assert(pr_p2.objectionId === 'price-objection', "I don't have the money right now. -> price-objection")

  const pr_p3 = await runCopilotPipeline("This is outside my budget.")
  assert(pr_p3.objectionId === 'price-objection', "This is outside my budget. -> price-objection")

  const pr_p4 = await runCopilotPipeline("My budget is very low.")
  assert(pr_p4.objectionId === 'price-objection', "My budget is very low. -> price-objection")

  const pr_p5 = await runCopilotPipeline("I can't spend that much.")
  assert(pr_p5.objectionId === 'price-objection', "I can't spend that much. -> price-objection")

  const pr_p6 = await runCopilotPipeline("Why is it so expensive?")
  assert(pr_p6.objectionId === 'price-objection', "Why is it so expensive? -> price-objection")

  const pr_p7 = await runCopilotPipeline("It's too expensive.")
  assert(pr_p7.objectionId === 'price-objection', "It's too expensive. -> price-objection")

  // Price Near-Misses (Negative)
  const pr_nm1 = await runCopilotPipeline("I received money yesterday.")
  assert(pr_nm1.objectionId !== 'price-objection', "I received money yesterday. -> NOT price-objection")

  const pr_nm2 = await runCopilotPipeline("I transferred money to my account.")
  assert(pr_nm2.objectionId !== 'price-objection', "I transferred money to my account. -> NOT price-objection")

  const pr_nm3 = await runCopilotPipeline("I need money for rent.")
  assert(pr_nm3.objectionId !== 'price-objection', "I need money for rent. -> NOT price-objection")

  const pr_nm4 = await runCopilotPipeline("My salary is paid monthly.")
  assert(pr_nm4.objectionId !== 'price-objection', "My salary is paid monthly. -> NOT price-objection")

  // --- 5. Upfront Payment Coverage & Mandatory Tests (Section 37) ---
  console.log('\n--- 5. Upfront Payment Coverage & Near-Miss Safety ---')
  const uf_p1 = await runCopilotPipeline("No advance payment from my side.")
  assert(uf_p1.objectionId === 'upfront-payment-resistance', "No advance payment from my side. -> upfront-payment-resistance")

  const uf_p2 = await runCopilotPipeline("I won't make an advance payment.")
  assert(uf_p2.objectionId === 'upfront-payment-resistance', "I won't make an advance payment. -> upfront-payment-resistance")

  const uf_p3 = await runCopilotPipeline("I don't want to risk money before getting results.")
  assert(uf_p3.objectionId === 'upfront-payment-resistance', "I don't want to risk money before getting results. -> upfront-payment-resistance")

  const uf_p4 = await runCopilotPipeline("I don't want to pay before getting results.")
  assert(uf_p4.objectionId === 'upfront-payment-resistance', "I don't want to pay before getting results. -> upfront-payment-resistance")

  const uf_p5 = await runCopilotPipeline("I only pay after I join.")
  assert(uf_p5.objectionId === 'upfront-payment-resistance', "I only pay after I join. -> upfront-payment-resistance")

  const uf_p6 = await runCopilotPipeline("I'll pay after I get a job.")
  assert(uf_p6.objectionId === 'upfront-payment-resistance', "I'll pay after I get a job. -> upfront-payment-resistance")

  const uf_p7 = await runCopilotPipeline("I'll pay once I start earning.")
  assert(uf_p7.objectionId === 'upfront-payment-resistance', "I'll pay once I start earning. -> upfront-payment-resistance")

  const uf_p8 = await runCopilotPipeline("Why should I pay before getting placed?")
  assert(uf_p8.objectionId === 'upfront-payment-resistance', "Why should I pay before getting placed? -> upfront-payment-resistance")

  const uf_p9 = await runCopilotPipeline("I don't want to pay before I get placed.")
  assert(uf_p9.objectionId === 'upfront-payment-resistance', "I don't want to pay before I get placed. -> upfront-payment-resistance")

  const uf_p10 = await runCopilotPipeline("Can I pay after placement?")
  assert(uf_p10.objectionId === 'upfront-payment-resistance', "Can I pay after placement? -> upfront-payment-resistance")

  // Upfront Near-Misses (Negative)
  const uf_nm1 = await runCopilotPipeline("I paid upfront for my laptop.")
  assert(uf_nm1.objectionId !== 'upfront-payment-resistance', "I paid upfront for my laptop. -> NOT upfront-payment-resistance")

  const uf_nm2 = await runCopilotPipeline("I made an advance payment for my apartment.")
  assert(uf_nm2.objectionId !== 'upfront-payment-resistance', "I made an advance payment for my apartment. -> NOT upfront-payment-resistance")

  const uf_nm3 = await runCopilotPipeline("I paid my electricity bill in advance.")
  assert(uf_nm3.objectionId !== 'upfront-payment-resistance', "I paid my electricity bill in advance. -> NOT upfront-payment-resistance")

  // --- 6. Information Request Coverage & Mandatory Tests (Section 38) ---
  console.log('\n--- 6. Information Request Coverage & Near-Miss Safety ---')
  const info_p1 = await runCopilotPipeline("Send me the details.")
  assert(info_p1.objectionId === 'information-request-deferral', "Send me the details. -> information-request-deferral")

  const info_p2 = await runCopilotPipeline("Email me the details.")
  assert(info_p2.objectionId === 'information-request-deferral', "Email me the details. -> information-request-deferral")

  const info_p3 = await runCopilotPipeline("Send me everything on WhatsApp.")
  assert(info_p3.objectionId === 'information-request-deferral', "Send me everything on WhatsApp. -> information-request-deferral")

  const info_p4 = await runCopilotPipeline("Send me the pricing first.")
  assert(info_p4.objectionId === 'information-request-deferral', "Send me the pricing first. -> information-request-deferral")

  const info_p5 = await runCopilotPipeline("Send me the agreement.")
  assert(info_p5.objectionId === 'information-request-deferral', "Send me the agreement. -> information-request-deferral")

  const info_p6 = await runCopilotPipeline("Send me the information.")
  assert(info_p6.objectionId === 'information-request-deferral', "Send me the information. -> information-request-deferral")

  const info_p7 = await runCopilotPipeline("Share the information and I'll decide.")
  assert(info_p7.objectionId === 'information-request-deferral', "Share the information and I'll decide. -> information-request-deferral")

  const info_p8 = await runCopilotPipeline("I'll go through the information.")
  assert(info_p8.objectionId === 'information-request-deferral', "I'll go through the information. -> information-request-deferral")

  const info_p9 = await runCopilotPipeline("Send me something to review.")
  assert(info_p9.objectionId === 'information-request-deferral', "Send me something to review. -> information-request-deferral")

  const info_p10 = await runCopilotPipeline("I want everything written first.")
  assert(info_p10.objectionId === 'information-request-deferral', "I want everything written first. -> information-request-deferral")

  const info_p11 = await runCopilotPipeline("Mail me the details.")
  assert(info_p11.objectionId === 'information-request-deferral', "Mail me the details. -> information-request-deferral")

  const info_p12 = await runCopilotPipeline("Text me the details.")
  assert(info_p12.objectionId === 'information-request-deferral', "Text me the details. -> information-request-deferral")

  // Information Request Near-Misses (Negative)
  const info_nm1 = await runCopilotPipeline("Send me the calendar invite.")
  assert(info_nm1.objectionId !== 'information-request-deferral', "Send me the calendar invite. -> NOT information-request-deferral")

  const info_nm2 = await runCopilotPipeline("Email me the meeting link.")
  assert(info_nm2.objectionId !== 'information-request-deferral', "Email me the meeting link. -> NOT information-request-deferral")

  const info_nm3 = await runCopilotPipeline("I'll email you my resume.")
  assert(info_nm3.objectionId !== 'information-request-deferral', "I'll email you my resume. -> NOT information-request-deferral")

  const info_nm4 = await runCopilotPipeline("Send me the Zoom link.")
  assert(info_nm4.objectionId !== 'information-request-deferral', "Send me the Zoom link. -> NOT information-request-deferral")

  const info_nm5 = await runCopilotPipeline("Send me the interview schedule.")
  assert(info_nm5.objectionId !== 'information-request-deferral', "Send me the interview schedule. -> NOT information-request-deferral")

  const info_nm6 = await runCopilotPipeline("Email me your phone number.")
  assert(info_nm6.objectionId !== 'information-request-deferral', "Email me your phone number. -> NOT information-request-deferral")

  // --- 7. Need-Time Coverage & Mandatory Tests (Section 39) ---
  console.log('\n--- 7. Need-Time Coverage & Near-Miss Safety ---')
  const tm_p1 = await runCopilotPipeline("I need some time.")
  assert(tm_p1.objectionId === 'need-time-to-think', "I need some time. -> need-time-to-think")

  const tm_p2 = await runCopilotPipeline("I'll think about it.")
  assert(tm_p2.objectionId === 'need-time-to-think', "I'll think about it. -> need-time-to-think")

  const tm_p3 = await runCopilotPipeline("Call me next week.")
  assert(tm_p3.objectionId === 'need-time-to-think', "Call me next week. -> need-time-to-think")

  const tm_p4 = await runCopilotPipeline("Call me next month.")
  assert(tm_p4.objectionId === 'need-time-to-think', "Call me next month. -> need-time-to-think")

  const tm_p5 = await runCopilotPipeline("Not today.")
  assert(tm_p5.objectionId === 'need-time-to-think', "Not today. -> need-time-to-think")

  const tm_p6 = await runCopilotPipeline("I'm busy right now.")
  assert(tm_p6.objectionId === 'need-time-to-think', "I'm busy right now. -> need-time-to-think")

  const tm_p7 = await runCopilotPipeline("Let me decide later.")
  assert(tm_p7.objectionId === 'need-time-to-think', "Let me decide later. -> need-time-to-think")

  const tm_p8 = await runCopilotPipeline("I'll get back to you.")
  assert(tm_p8.objectionId === 'need-time-to-think', "I'll get back to you. -> need-time-to-think")

  const tm_p9 = await runCopilotPipeline("Maybe later.")
  assert(tm_p9.objectionId === 'need-time-to-think', "Maybe later. -> need-time-to-think")

  const tm_p10 = await runCopilotPipeline("Call after two weeks.")
  assert(tm_p10.objectionId === 'need-time-to-think', "Call after two weeks. -> need-time-to-think")

  const tm_p11 = await runCopilotPipeline("I need a few days.")
  assert(tm_p11.objectionId === 'need-time-to-think', "I need a few days. -> need-time-to-think")

  const tm_p12 = await runCopilotPipeline("I'll decide tomorrow.")
  assert(tm_p12.objectionId === 'need-time-to-think', "I'll decide tomorrow. -> need-time-to-think")

  const tm_p13 = await runCopilotPipeline("I need time to decide.")
  assert(tm_p13.objectionId === 'need-time-to-think', "I need time to decide. -> need-time-to-think")

  // Time Near-Misses (Negative)
  const tm_nm1 = await runCopilotPipeline("I need time to finish my assignment.")
  assert(tm_nm1.objectionId !== 'need-time-to-think', "I need time to finish my assignment. -> NOT need-time-to-think")

  const tm_nm2 = await runCopilotPipeline("I need time to complete my project.")
  assert(tm_nm2.objectionId !== 'need-time-to-think', "I need time to complete my project. -> NOT need-time-to-think")

  const tm_nm3 = await runCopilotPipeline("I don't have time to cook.")
  assert(tm_nm3.objectionId !== 'need-time-to-think', "I don't have time to cook. -> NOT need-time-to-think")

  const tm_nm4 = await runCopilotPipeline("The interview time is 3 PM.")
  assert(tm_nm4.objectionId !== 'need-time-to-think', "The interview time is 3 PM. -> NOT need-time-to-think")

  const tm_nm5 = await runCopilotPipeline("Call time is five minutes.")
  assert(tm_nm5.objectionId !== 'need-time-to-think', "Call time is five minutes. -> NOT need-time-to-think")

  // --- 8. DIY Coverage & Mandatory Tests (Section 40) ---
  console.log('\n--- 8. DIY Coverage & Near-Miss Safety ---')
  const diy_p1 = await runCopilotPipeline("I'm already applying myself.")
  assert(diy_p1.objectionId === 'already-applying-myself', "I'm already applying myself. -> already-applying-myself")

  const diy_p2 = await runCopilotPipeline("I'm applying on my own.")
  assert(diy_p2.objectionId === 'already-applying-myself', "I'm applying on my own. -> already-applying-myself")

  const diy_p3 = await runCopilotPipeline("I'm doing applications myself.")
  assert(diy_p3.objectionId === 'already-applying-myself', "I'm doing applications myself. -> already-applying-myself")

  const diy_p4 = await runCopilotPipeline("I'll try myself first.")
  assert(diy_p4.objectionId === 'already-applying-myself', "I'll try myself first. -> already-applying-myself")

  const diy_p5 = await runCopilotPipeline("I think I can do it on my own.")
  assert(diy_p5.objectionId === 'already-applying-myself', "I think I can do it on my own. -> already-applying-myself")

  const diy_p6 = await runCopilotPipeline("I'll give myself another month.")
  assert(diy_p6.objectionId === 'already-applying-myself', "I'll give myself another month. -> already-applying-myself")

  const diy_p7 = await runCopilotPipeline("I'm already getting interviews.")
  assert(diy_p7.objectionId === 'already-applying-myself', "I'm already getting interviews. -> already-applying-myself")

  const diy_p8 = await runCopilotPipeline("I already have interviews.")
  assert(diy_p8.objectionId === 'already-applying-myself', "I already have interviews. -> already-applying-myself")

  const diy_p9 = await runCopilotPipeline("I've been doing applications myself.")
  assert(diy_p9.objectionId === 'already-applying-myself', "I've been doing applications myself. -> already-applying-myself")

  const diy_p10 = await runCopilotPipeline("I don't think I need help yet.")
  assert(diy_p10.objectionId === 'already-applying-myself', "I don't think I need help yet. -> already-applying-myself")

  const diy_p11 = await runCopilotPipeline("I'm handling the job search myself.")
  assert(diy_p11.objectionId === 'already-applying-myself', "I'm handling the job search myself. -> already-applying-myself")

  const diy_p12 = await runCopilotPipeline("I am applying independently.")
  assert(diy_p12.objectionId === 'already-applying-myself', "I am applying independently. -> already-applying-myself")

  // DIY Near-Misses (Negative)
  const diy_nm1 = await runCopilotPipeline("I wrote the email myself.")
  assert(diy_nm1.objectionId !== 'already-applying-myself', "I wrote the email myself. -> NOT already-applying-myself")

  const diy_nm2 = await runCopilotPipeline("I own a car.")
  assert(diy_nm2.objectionId !== 'already-applying-myself', "I own a car. -> NOT already-applying-myself")

  const diy_nm3 = await runCopilotPipeline("I built my resume myself.")
  assert(diy_nm3.objectionId !== 'already-applying-myself', "I built my resume myself. -> NOT already-applying-myself")

  const diy_nm4 = await runCopilotPipeline("I completed the assignment myself.")
  assert(diy_nm4.objectionId !== 'already-applying-myself', "I completed the assignment myself. -> NOT already-applying-myself")

  // --- 9. Consultancy Coverage & Mandatory Tests (Section 41) ---
  console.log('\n--- 9. Consultancy Coverage ---')
  const con_p1 = await runCopilotPipeline("I'm already working with a consultancy.")
  assert(con_p1.objectionId === 'already-working-with-consultancy', "I'm already working with a consultancy. -> already-working-with-consultancy")

  const con_p2 = await runCopilotPipeline("I'm already working with another consultancy.")
  assert(con_p2.objectionId === 'already-working-with-consultancy', "I'm already working with another consultancy. -> already-working-with-consultancy")

  const con_p3 = await runCopilotPipeline("I have another recruiter helping me.")
  assert(con_p3.objectionId === 'already-working-with-consultancy', "I have another recruiter helping me. -> already-working-with-consultancy")

  const con_p4 = await runCopilotPipeline("I already paid another company.")
  assert(con_p4.objectionId === 'already-working-with-consultancy', "I already paid another company. -> already-working-with-consultancy")

  const con_p5 = await runCopilotPipeline("I'm already enrolled somewhere else.")
  assert(con_p5.objectionId === 'already-working-with-consultancy', "I'm already enrolled somewhere else. -> already-working-with-consultancy")

  const con_p6 = await runCopilotPipeline("Another company is doing this for me.")
  assert(con_p6.objectionId === 'already-working-with-consultancy', "Another company is doing this for me. -> already-working-with-consultancy")

  const con_p7 = await runCopilotPipeline("I already have someone helping me.")
  assert(con_p7.objectionId === 'already-working-with-consultancy', "I already have someone helping me. -> already-working-with-consultancy")

  const con_p8 = await runCopilotPipeline("I already signed up with another service.")
  assert(con_p8.objectionId === 'already-working-with-consultancy', "I already signed up with another service. -> already-working-with-consultancy")

  const con_p9 = await runCopilotPipeline("I am already using another placement company.")
  assert(con_p9.objectionId === 'already-working-with-consultancy', "I am already using another placement company. -> already-working-with-consultancy")

  const con_p10 = await runCopilotPipeline("I already hired someone for my job search.")
  assert(con_p10.objectionId === 'already-working-with-consultancy', "I already hired someone for my job search. -> already-working-with-consultancy")

  // --- 10. Trust Coverage & Collision Fix (Section 42) ---
  console.log('\n--- 10. Trust Coverage & Keyword Collision Fix ---')
  const tr_p1 = await runCopilotPipeline("How do I know this is genuine?")
  assert(tr_p1.objectionId === 'trust-and-credibility', "How do I know this is genuine? -> trust-and-credibility")

  const tr_p2 = await runCopilotPipeline("I was scammed before.")
  assert(tr_p2.objectionId === 'trust-and-credibility', "I was scammed before. -> trust-and-credibility")

  const tr_p3 = await runCopilotPipeline("I've been cheated by agencies before.")
  assert(tr_p3.objectionId === 'trust-and-credibility', "I've been cheated by agencies before. -> trust-and-credibility")

  const tr_p4 = await runCopilotPipeline("I don't trust consultancies.")
  assert(tr_p4.objectionId === 'trust-and-credibility', "I don't trust consultancies. -> trust-and-credibility")

  const tr_p5 = await runCopilotPipeline("Can you prove this works?")
  assert(tr_p5.objectionId === 'trust-and-credibility', "Can you prove this works? -> trust-and-credibility")

  const tr_p6 = await runCopilotPipeline("How do I know your recruiters are real?")
  assert(tr_p6.objectionId === 'trust-and-credibility', "How do I know your recruiters are real? -> trust-and-credibility")

  const tr_p7 = await runCopilotPipeline("I have seen fake placement companies.")
  assert(tr_p7.objectionId === 'trust-and-credibility', "I have seen fake placement companies. -> trust-and-credibility")

  const tr_p8 = await runCopilotPipeline("Is this legit?")
  assert(tr_p8.objectionId === 'trust-and-credibility', "Is this legit? -> trust-and-credibility")

  const tr_p9 = await runCopilotPipeline("Do you have real success stories?")
  assert(tr_p9.objectionId === 'trust-and-credibility', "Do you have real success stories? -> trust-and-credibility")

  // Trust Near-Misses (Negative)
  const tr_nm1 = await runCopilotPipeline("I work at a consulting company.")
  assert(tr_nm1.objectionId !== 'trust-and-credibility', "I work at a consulting company. -> NOT trust-and-credibility")

  const tr_nm2 = await runCopilotPipeline("I already paid another company.")
  assert(tr_nm2.objectionId !== 'trust-and-credibility', "I already paid another company. -> NOT trust-and-credibility as primary")

  // --- 11. Family Approval Coverage & Collision Fix (Section 43) ---
  console.log('\n--- 11. Family Approval Coverage & Collision Fix ---')
  const fam_p1 = await runCopilotPipeline("I need to talk to my parents.")
  assert(fam_p1.objectionId === 'parents-spouse-approval', "I need to talk to my parents. -> parents-spouse-approval")

  const fam_p2 = await runCopilotPipeline("My father will decide.")
  assert(fam_p2.objectionId === 'parents-spouse-approval', "My father will decide. -> parents-spouse-approval")

  const fam_p3 = await runCopilotPipeline("I need to discuss it with my husband.")
  assert(fam_p3.objectionId === 'parents-spouse-approval', "I need to discuss it with my husband. -> parents-spouse-approval")

  const fam_p4 = await runCopilotPipeline("I need to ask my wife.")
  assert(fam_p4.objectionId === 'parents-spouse-approval', "I need to ask my wife. -> parents-spouse-approval")

  const fam_p5 = await runCopilotPipeline("My family won't agree.")
  assert(fam_p5.objectionId === 'parents-spouse-approval', "My family won't agree. -> parents-spouse-approval")

  const fam_p6 = await runCopilotPipeline("My parents need to approve this.")
  assert(fam_p6.objectionId === 'parents-spouse-approval', "My parents need to approve this. -> parents-spouse-approval")

  const fam_p7 = await runCopilotPipeline("My father wants to review it.")
  assert(fam_p7.objectionId === 'parents-spouse-approval', "My father wants to review it. -> parents-spouse-approval")

  // Family Near-Misses (Negative)
  const fam_nm1 = await runCopilotPipeline("My parents live in India.")
  assert(fam_nm1.objectionId !== 'parents-spouse-approval', "My parents live in India. -> NOT parents-spouse-approval")

  const fam_nm2 = await runCopilotPipeline("My wife works at Google.")
  assert(fam_nm2.objectionId !== 'parents-spouse-approval', "My wife works at Google. -> NOT parents-spouse-approval")

  const fam_nm3 = await runCopilotPipeline("My husband is a developer.")
  assert(fam_nm3.objectionId !== 'parents-spouse-approval', "My husband is a developer. -> NOT parents-spouse-approval")

  const fam_nm4 = await runCopilotPipeline("My father lives with us.")
  assert(fam_nm4.objectionId !== 'parents-spouse-approval', "My father lives with us. -> NOT parents-spouse-approval")

  const fam_nm5 = await runCopilotPipeline("My mother is visiting.")
  assert(fam_nm5.objectionId !== 'parents-spouse-approval', "My mother is visiting. -> NOT parents-spouse-approval")

  // --- 12. Compound Objections (Section 25 & 44) ---
  console.log('\n--- 12. Compound Objections ---')
  const cmp1 = await runCopilotPipeline("I don't trust consultancies and I don't want to pay upfront.")
  assert(cmp1.objectionId === 'trust-and-credibility' || cmp1.objectionId === 'upfront-payment-resistance', "Compound 1 primary is valid")
  assert(
    cmp1.secondaryObjections?.some((s) => s.objectionId === 'upfront-payment-resistance' || s.objectionId === 'trust-and-credibility'),
    "Compound 1 contains secondary objection"
  )

  const cmp2 = await runCopilotPipeline("It's too expensive and I need to talk to my parents.")
  assert(cmp2.objectionId === 'price-objection' || cmp2.objectionId === 'parents-spouse-approval', "Compound 2 primary is valid")
  assert(
    cmp2.secondaryObjections?.some((s) => s.objectionId === 'parents-spouse-approval' || s.objectionId === 'price-objection'),
    "Compound 2 contains secondary objection"
  )

  const cmp3 = await runCopilotPipeline("I'm already applying myself and I don't think I need to pay anyone.")
  assert(cmp3.objectionId === 'already-applying-myself', "Compound 3 primary is already-applying-myself")

  const cmp4 = await runCopilotPipeline("Send me the details because I need to discuss it with my father.")
  assert(cmp4.objectionId === 'information-request-deferral' || cmp4.objectionId === 'parents-spouse-approval', "Compound 4 primary is valid")
  assert(
    cmp4.secondaryObjections?.some((s) => s.objectionId === 'parents-spouse-approval' || s.objectionId === 'information-request-deferral'),
    "Compound 4 contains secondary objection"
  )

  const cmp5 = await runCopilotPipeline("I want to try myself for another month, then I'll think about your program.")
  assert(cmp5.objectionId === 'already-applying-myself' || cmp5.objectionId === 'need-time-to-think', "Compound 5 primary is valid")

  const cmp6 = await runCopilotPipeline("I already have interviews so I don't think I need a consultancy.")
  assert(cmp6.objectionId === 'already-applying-myself' || cmp6.objectionId === 'already-working-with-consultancy', "Compound 6 detected")

  const cmp7 = await runCopilotPipeline("I'm interested, but I can't afford the upfront fee.")
  assert(cmp7.objectionId !== 'not-interested', "Compound 7 is NOT not-interested")
  assert(cmp7.objectionId === 'price-objection' || cmp7.objectionId === 'upfront-payment-resistance', "Compound 7 is price/upfront")

  const cmp8 = await runCopilotPipeline("I don't trust placement companies because I was scammed before.")
  assert(cmp8.objectionId === 'trust-and-credibility', "Compound 8 is trust-and-credibility")

  // --- 13. Determinism Verification (Section 45) ---
  console.log('\n--- 13. Determinism Verification ---')
  const detInputs = [
    "Don't contact me.",
    "I'm not interested in changing my resume format.",
    "I'm not interested in this program.",
    "I can't afford that.",
    "No advance payment from my side.",
    "Send me the pricing first.",
    "Call me next week.",
    "I already have interviews.",
    "I'm already working with a consultancy.",
    "I need to talk to my parents.",
  ]

  for (let i = 0; i < detInputs.length; i++) {
    const input = detInputs[i]
    const out1 = await runCopilotPipeline(input)
    const out2 = await runCopilotPipeline(input)
    assert(
      out1.objectionId === out2.objectionId && out1.recommendedResponse === out2.recommendedResponse,
      `Determinism ${i + 1}: Stable output for "${input.substring(0, 30)}..."`
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
