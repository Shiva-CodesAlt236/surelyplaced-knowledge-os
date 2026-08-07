import { runCopilotPipeline } from '../lib/copilot/pipeline'
import { scanContentSensitivity } from '../lib/copilot/content-scanner'

async function runQA() {
  console.log("==================================================")
  console.log("🧪 KNOWLEDGE OS SALES COPILOT MVP — PRODUCTION QA")
  console.log("==================================================")

  const testObjections = [
    "I want to think about it",
    "It's expensive",
    "Can you guarantee a job?",
    "I need to talk to my parents"
  ]

  let passed = 0

  for (const [idx, obj] of testObjections.entries()) {
    console.log(`\nTest ${idx + 1}: "${obj}"`)
    const res = await runCopilotPipeline(obj, { candidateName: "Jane" })

    console.log("  ✓ Detected Objection:", res.detectedObjection)
    console.log("  ✓ Category:", res.category)
    console.log("  ✓ Confidence:", res.confidenceLevel, `(${res.confidenceScore}%)`)
    console.log("  ✓ Approved Response:", res.recommendedResponse.substring(0, 75) + "...")
    console.log("  ✓ Why This Works:", res.whyThisWorks.substring(0, 60) + "...")
    console.log("  ✓ Next Question:", res.nextQuestion.substring(0, 60) + "...")
    console.log("  ✓ Avoid Saying:", res.avoidSaying.substring(0, 55) + "...")

    const scan = scanContentSensitivity(res.recommendedResponse)
    console.log("  ✓ Content Sensitivity Scan:", scan.isCompliant ? "COMPLIANT (No forbidden claims)" : "VIOLATION DETECTED")

    if (res.hasMatch && scan.isCompliant) passed++
  }

  console.log("\n==================================================")
  console.log(`SUMMARY: ${passed} / 4 Test Objections Passed Cleanly!`)
  console.log("==================================================")
}

runQA().catch(console.error)
