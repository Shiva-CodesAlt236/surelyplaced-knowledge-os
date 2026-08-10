/**
 * Sales Copilot — Protected Spans Verifier
 *
 * Protects financial, legal, guarantee, and policy assertions from being corrupted or hallucinated.
 */

export interface ProtectedSpanViolation {
  spanType: 'price' | 'guarantee' | 'salary' | 'visa'
  detectedText: string
  reason: string
}

const GUARANTEE_PATTERNS = [
  /guarantee\b/i,
  /100%\s*(placement|job|hired)/i,
  /guaranteed\s*(job|placement|hire|role)/i,
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
  /\bh1b\s*guarantee\b/i,
  /\bvisa\s*guarantee\b/i,
  /\b\$\d{2,3}k\s*guaranteed\b/i,
]

/**
 * Scans adapted/personalized output for unapproved protected span alterations or illegal claims.
 */
export function verifyProtectedSpans(originalScript: string, adaptedScript: string): {
  isValid: boolean
  violations: ProtectedSpanViolation[]
} {
  const violations: ProtectedSpanViolation[] = []
  const text = adaptedScript.toLowerCase()

  // 1. Check for unapproved guarantee claims introduced into adapted text
  for (const pattern of GUARANTEE_PATTERNS) {
    if (pattern.test(text) && !pattern.test(originalScript.toLowerCase())) {
      violations.push({
        spanType: 'guarantee',
        detectedText: text.match(pattern)?.[0] || 'guarantee claim',
        reason: 'Personalized output introduced an unapproved job or placement guarantee claim.',
      })
    }
  }

  // 2. Check for unauthorized price modifications or discount promises
  for (const pattern of PRICE_DISCOUNT_PATTERNS) {
    if (pattern.test(text) && !pattern.test(originalScript.toLowerCase())) {
      violations.push({
        spanType: 'price',
        detectedText: text.match(pattern)?.[0] || 'price modification',
        reason: 'Personalized output introduced an unapproved price or discount claim.',
      })
    }
  }

  // 3. Check for unapproved visa/salary promises
  for (const pattern of VISA_SALARY_PATTERNS) {
    if (pattern.test(text) && !pattern.test(originalScript.toLowerCase())) {
      violations.push({
        spanType: 'visa',
        detectedText: text.match(pattern)?.[0] || 'visa/salary claim',
        reason: 'Personalized output introduced an unapproved visa or salary claim.',
      })
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  }
}
