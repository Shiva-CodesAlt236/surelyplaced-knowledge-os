import { SCRIPTS_REGISTRY } from '../lib/scripts-registry.ts'
import { scanContentSafety } from '../lib/copilot/content-scanner.ts'

console.log('=====================================================')
console.log('  SCRIPTS REGISTRY CONTENT-CLAIMS SAFETY AUDIT SUITE ')
console.log('=====================================================\n')

const HUMAN_REVIEW_PATTERNS = [
  { category: 'Pay-After-Placement / ISA Claim', regex: /\b(pay after placement|income share agreement|isa\b|no upfront fee)\b/i },
  { category: 'Fabricated Employer Relationship', regex: /\b(fake employer|fake company|false reference|fake verification)\b/i },
  { category: 'Proxy Interview Assistance', regex: /\b(proxy interview|interview proxy|someone else take test)\b/i },
  { category: 'Fabricated Experience / Resume', regex: /\b(fake experience|fabricate resume|fake experience letter|exaggerate years)\b/i },
  { category: 'Unauthorized Visa / Sponsorship Guarantee', regex: /\b(visa guarantee|guaranteed visa|guaranteed sponsorship|sponsorship is guaranteed)\b/i },
]

let scriptsAudited = 0
let fieldsAudited = 0
let findings = []

function auditStringField(scriptId, fieldName, textValue) {
  if (typeof textValue !== 'string' || !textValue.trim()) return
  fieldsAudited++

  // 1. Run direct content safety scanner
  const scannerResult = scanContentSafety(textValue)
  if (!scannerResult.isSafe) {
    findings.push({
      scriptId,
      fieldName,
      category: `Content Scanner Violation (${scannerResult.violations.join(', ')})`,
      excerpt: textValue.substring(0, 120),
    })
  }

  // 2. Run local human-triage supplementary patterns
  for (const pattern of HUMAN_REVIEW_PATTERNS) {
    if (pattern.regex.test(textValue)) {
      findings.push({
        scriptId,
        fieldName,
        category: pattern.category,
        excerpt: textValue.substring(0, 120),
      })
    }
  }
}

try {
  for (const script of SCRIPTS_REGISTRY) {
    scriptsAudited++

    auditStringField(script.id, 'scenario', script.scenario)
    auditStringField(script.id, 'prompt', script.prompt)
    auditStringField(script.id, 'recommendedAnswer', script.recommendedAnswer)
    auditStringField(script.id, 'managerTip', script.managerTip)
    auditStringField(script.id, 'whyThisWorks', script.whyThisWorks)
    auditStringField(script.id, 'commonMistake', script.commonMistake)

    if (Array.isArray(script.quickRefItems)) {
      for (let i = 0; i < script.quickRefItems.length; i++) {
        auditStringField(script.id, `quickRefItems[${i}]`, script.quickRefItems[i])
      }
    }
  }

  console.log(`TOTAL SCRIPTS AUDITED:     ${scriptsAudited}`)
  console.log(`TOTAL TEXT FIELDS AUDITED: ${fieldsAudited}`)
  console.log(`TOTAL FINDINGS:            ${findings.length}\n`)

  if (findings.length > 0) {
    console.log('--- FINDINGS DETAILS FOR HUMAN TRIAGE ---')
    findings.forEach((item, index) => {
      console.log(`[${index + 1}] Script: ${item.scriptId} | Field: ${item.fieldName}`)
      console.log(`    Category: ${item.category}`)
      console.log(`    Excerpt:  "${item.excerpt}..."\n`)
    })
    console.log('=====================================================')
    console.log('STATUS: HUMAN TRIAGE REQUIRED')
    console.log('=====================================================\n')
  } else {
    console.log('=====================================================')
    console.log('STATUS: NO AUTOMATED CLAIM-SAFETY FINDINGS')
    console.log('=====================================================\n')
  }

  // Exit 0 for reporting and human triage tool
  process.exit(0)
} catch (err) {
  console.error('[Audit Script Error] Registry loading or audit execution failed:', err)
  process.exit(1)
}
