/**
 * Sales Copilot — Protected Spans Verifier
 *
 * Validates responses to ensure financial, legal, guarantee, and policy assertions
 * are never corrupted or introduced.
 *
 * Current Phase 3.2 Status:
 * Prepared differential verifier primitive for future LLM-adapted outputs.
 */

export interface ProtectedSpanViolation {
  spanType: 'price' | 'guarantee' | 'salary' | 'visa'
  detectedText: string
  reason: string
}

const GUARANTEE_PATTERNS = [
  /guarantee(s|d)?\b/i,
  /100%\s*(placement|job|hired)/i,
  /guarantee(s|d)?\s*(job|placement|hire|role|sponsorship)/i,
  /promise\s*you\s*a\s*job/i,
  /money\s*back\s*guarantee/i,
]

const PRICE_DISCOUNT_PATTERNS = [
  /\$\d+/,
  /\b\d+\s*dollars\b/i,
  /\bdiscount\b/i,
  /\bhalf\s*price\b/i,
  /\bfree\s*access\b/i,
]

const VISA_SALARY_PATTERNS = [
  /\bh1b\b/i,
  /\bvisa\s*guarantee(s|d)?\b/i,
  /\bsponsorship\s*is\s*guarantee(s|d)?\b/i,
  /\b\$\d{2,3}k\b/i,
]

/**
 * Scans output text for unapproved protected span alterations or illegal claims.
 */
export function verifyProtectedSpans(originalScript: string, outputScript: string): {
  isValid: boolean
  violations: ProtectedSpanViolation[]
} {
  const violations: ProtectedSpanViolation[] = []
  const text = outputScript.toLowerCase()
  const originalLower = originalScript.toLowerCase()

  // 1. Check for guarantee claims
  for (const pattern of GUARANTEE_PATTERNS) {
    if (pattern.test(text) && !pattern.test(originalLower)) {
      violations.push({
        spanType: 'guarantee',
        detectedText: text.match(pattern)?.[0] || 'guarantee claim',
        reason: 'Response text contains an unapproved job or placement guarantee claim.',
      })
    }
  }

  // 2. Check for price modifications / discounts
  for (const pattern of PRICE_DISCOUNT_PATTERNS) {
    if (pattern.test(text) && !pattern.test(originalLower)) {
      violations.push({
        spanType: 'price',
        detectedText: text.match(pattern)?.[0] || 'price modification',
        reason: 'Response text contains an unapproved price or discount claim.',
      })
    }
  }

  // 3. Check for visa / salary promises
  for (const pattern of VISA_SALARY_PATTERNS) {
    if (pattern.test(text) && !pattern.test(originalLower)) {
      violations.push({
        spanType: 'visa',
        detectedText: text.match(pattern)?.[0] || 'visa/salary claim',
        reason: 'Response text contains an unapproved visa or salary claim.',
      })
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  }
}
