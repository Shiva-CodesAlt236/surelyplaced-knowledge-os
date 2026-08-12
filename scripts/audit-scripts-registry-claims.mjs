import { SCRIPTS_REGISTRY } from '../lib/scripts-registry.ts'
import { scanContentSafety } from '../lib/copilot/content-scanner.ts'

console.log('=====================================================')
console.log('  SCRIPTS REGISTRY CONTENT-CLAIMS SAFETY AUDIT SUITE ')
console.log('=====================================================\n')

let scriptsAudited = 0
let fieldsAudited = 0
const findings = []

const HUMAN_REVIEW_PATTERNS = [
  {
    regex: /pay after placement|income share agreement|\bisa\b|no upfront fee/i,
    category: 'Supplemental Human Review (Pay-After-Placement / ISA claim)',
  },
  {
    regex: /fake employer|fake company|false reference|fake verification/i,
    category: 'Supplemental Human Review (Fabricated employer relationship)',
  },
  {
    regex: /proxy interview|interview proxy|someone else take test/i,
    category: 'Supplemental Human Review (Proxy interview assistance)',
  },
  {
    regex: /fake experience|fabricate resume|fake experience letter|exaggerate years/i,
    category: 'Supplemental Human Review (Fabricated experience/resume)',
  },
  {
    regex: /visa guarantee|guaranteed visa|guaranteed sponsorship|sponsorship is guaranteed/i,
    category: 'Supplemental Human Review (Unauthorized visa/sponsorship guarantee)',
  },
]

function auditStringField(scriptId, fieldName, textValue) {
  if (typeof textValue !== 'string' || textValue.trim().length === 0) return

  fieldsAudited++

  // 1. Run canonical production scanner
  const scanResult = scanContentSafety(textValue)
  if (!scanResult.isSafe) {
    for (const v of scanResult.violations) {
      findings.push({
        scriptId,
        fieldName,
        category: `Content Scanner Violation (${v})`,
        excerpt: textValue.substring(0, 120),
      })
    }
  }

  // 2. Run supplemental human review patterns
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
    auditStringField(script.id, 'placeholder', script.placeholder)

    if (Array.isArray(script.hints)) {
      for (let i = 0; i < script.hints.length; i++) {
        auditStringField(script.id, `hints[${i}]`, script.hints[i])
      }
    }

    if (Array.isArray(script.quickRefItems)) {
      for (let i = 0; i < script.quickRefItems.length; i++) {
        const item = script.quickRefItems[i]
        if (item) {
          if (typeof item.value === 'string') {
            auditStringField(script.id, `quickRefItems[${i}].value`, item.value)
          }
          if (typeof item.label === 'string') {
            auditStringField(script.id, `quickRefItems[${i}].label`, item.label)
          }
        }
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
    console.log('STATUS: PASS — Zero Content Safety Findings')
    console.log('=====================================================\n')
  }
} catch (err) {
  console.error('[Audit Suite Failure] Error executing content audit:', err)
  process.exit(1)
}
