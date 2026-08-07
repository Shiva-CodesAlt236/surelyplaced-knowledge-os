export interface ContentScanResult {
  isCompliant: boolean
  violations: string[]
}

const FORBIDDEN_PATTERNS = [
  { pattern: /\b(100%|hundred percent)\s+placement\b/i, violation: 'Prohibited 100% placement guarantee claim' },
  { pattern: /\bguarantee\s+(a\s+)?job\b/i, violation: 'Prohibited job guarantee claim' },
  { pattern: /\bpromise\s+(a\s+)?job\b/i, violation: 'Prohibited job promise claim' },
  { pattern: /\b(opt|h1b|stem)\s+approval\s+guaranteed\b/i, violation: 'Prohibited visa approval guarantee' },
  { pattern: /\b50%\s+discount\b/i, violation: 'Unauthorized pricing discount claim' },
  { pattern: /\bfree\s+enrollment\b/i, violation: 'Unauthorized free enrollment claim' }
]

export function scanContentSensitivity(text: string): ContentScanResult {
  if (!text) return { isCompliant: true, violations: [] }

  const violations: string[] = []

  FORBIDDEN_PATTERNS.forEach((item) => {
    if (item.pattern.test(text)) {
      violations.push(item.violation)
    }
  })

  return {
    isCompliant: violations.length === 0,
    violations,
  }
}
