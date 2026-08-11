/**
 * Sales Copilot MVP — Advisor Attribution Utilities (Phase 4B.1 Product Alignment)
 *
 * Implements self-entered advisor identifier normalization & validation.
 *
 * IMPORTANT: This identifier is self-asserted attribution for local browser usage.
 * It is NOT authenticated identity or RBAC.
 */

export const ADVISOR_STORAGE_KEY = 'surelyplaced_advisor_identifier'

export function normalizeAdvisorIdentifier(raw?: string | null): string | null {
  if (typeof raw !== 'string') return null

  // Trim leading/trailing whitespace and collapse internal repeated whitespace
  const cleaned = raw.trim().replace(/\s+/g, ' ')
  if (!cleaned) return null

  return cleaned
}

export function validateAdvisorIdentifier(raw?: string | null): {
  valid: boolean
  normalized?: string
  error?: string
} {
  const normalized = normalizeAdvisorIdentifier(raw)

  if (!normalized) {
    return {
      valid: false,
      error: 'Advisor identifier is required and cannot be blank.',
    }
  }

  if (normalized.length > 100) {
    return {
      valid: false,
      error: 'Advisor identifier must be 100 characters or fewer.',
    }
  }

  return {
    valid: true,
    normalized,
  }
}
