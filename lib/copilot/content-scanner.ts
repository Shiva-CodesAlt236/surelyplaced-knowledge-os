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
  { pattern: /guarantee(s|d)?\s*(.*)?(job|role|placement|offer|sponsorship|h1b)/i, label: 'Illegal job or visa placement guarantee' },
  { pattern: /sponsorship\s*is\s*guarantee(s|d)?/i, label: 'Illegal visa sponsorship guarantee' },
  { pattern: /h1b\s*guarantee(s|d)?/i, label: 'Unverified visa guarantee' },
  { pattern: /\$\d+.*guarantee(s|d)?/i, label: 'Unverified salary guarantee' },
  { pattern: /money\s*back\s*guarantee(s|d)?/i, label: 'Unauthorized refund guarantee' },
  { pattern: /\bdiscount\b/i, label: 'Unauthorized discount promise' },
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
