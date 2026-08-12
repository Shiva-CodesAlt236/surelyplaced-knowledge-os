import { SCRIPTS_REGISTRY } from '../lib/scripts-registry.ts'

console.log('=====================================================')
console.log('  SCRIPTS REGISTRY CONTENT-CLAIMS SAFETY AUDIT SUITE ')
console.log('=====================================================\n')

let scriptsAudited = 0
let fieldsAudited = 0
const findings = []

const FORBIDDEN_CLAIM_PATTERNS = [
  {
    regex: /guarantee\s+placement|guaranteed\s+placement|placement\s+is\s+guaranteed/i,
    category: 'Content Scanner Violation (Unauthorized placement guarantee)',
  },
  {
    regex: /guarantee\s+sponsorship|guaranteed\s+sponsorship|sponsorship\s+is\s+guaranteed/i,
    category: 'Content Scanner Violation (Unauthorized visa sponsorship guarantee)',
  },
  {
    regex: /100%\s+placement\s+rate/i,
    category: 'Content Scanner Violation (100% placement rate claim)',
  },
  {
    regex: /discount/i,
    category: 'Content Scanner Violation (Unauthorized discount promise)',
  },
  {
    regex: /\$\d{3,},\d{3}\s+guaranteed/i,
    category: 'Content Scanner Violation (Guaranteed salary claim)',
  },
]

function auditStringField(scriptId, fieldName, textValue) {
  if (typeof textValue !== 'string' || textValue.trim().length === 0) return

  fieldsAudited++

  for (const pattern of FORBIDDEN_CLAIM_PATTERNS) {
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

    if (Array.isArray(script.hints)) {
      for (let i = 0; i < script.hints.length; i++) {
        auditStringField(script.id, `hints[${i}]`, script.hints[i])
      }
    }

    if (Array.isArray(script.quickRefItems)) {
      for (let i = 0; i < script.quickRefItems.length; i++) {
        const item = script.quickRefItems[i]
        if (item && typeof item.value === 'string') {
          auditStringField(script.id, `quickRefItems[${i}].value`, item.value)
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
