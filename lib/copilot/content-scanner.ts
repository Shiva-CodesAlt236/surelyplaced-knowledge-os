/**
 * Sales Copilot — Content Safety Scanner
 *
 * Defense-in-depth content scanner ensuring output text contains zero unsupported sales claims,
 * illegal guarantees, or policy violations.
 */

export interface ContentScanResult {
  isSafe: boolean
  violations: string[]
}

const FORBIDDEN_CLAIMS = [
  { pattern: /100%\s*(placement|job|hired)/i, label: 'Unverified 100% placement guarantee' },
  { pattern: /guaranteed\s*(job|role|placement|offer|sponsorship)/i, label: 'Illegal job placement guarantee' },
  { pattern: /sponsorship\s*is\s*guaranteed/i, label: 'Illegal visa sponsorship guarantee' },
  { pattern: /h1b\s*guarantee/i, label: 'Unverified visa guarantee' },
  { pattern: /salary\s*guarantee/i, label: 'Unverified salary guarantee' },
  { pattern: /money\s*back\s*guarantee/i, label: 'Unauthorized refund guarantee' },
]

export function scanContentSafety(text: string): ContentScanResult {
  const violations: string[] = []

  for (const claim of FORBIDDEN_CLAIMS) {
    if (claim.pattern.test(text)) {
      violations.push(claim.label)
    }
  }

  return {
    isSafe: violations.length === 0,
    violations,
  }
}
