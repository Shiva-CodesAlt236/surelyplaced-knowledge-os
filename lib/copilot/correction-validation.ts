import { COPILOT_OBJECTION_CATEGORIES } from './objection-categories'

/**
 * Sales Copilot — Phase 6B Correction Input Validation (pure, no DB/HTTP)
 *
 * Extracted out of app/api/copilot/correction/route.ts into its own pure
 * function specifically so this shape/taxonomy validation logic is unit
 * testable without a database or a real authenticated HTTP request — the
 * correction route has no legacy-mode fallback (see route.ts's doc comment),
 * so every request must carry a real Auth.js session before any body
 * validation runs, which would otherwise make these rules only exercisable
 * via a DB-backed integration test. Mirrors the same pure-core /
 * HTTP-wrapper split lib/auth/access.ts already uses for the same reason.
 */

export const UNCLASSIFIED = 'unclassified'
export const EXPLICIT_REFUSAL = 'explicit-refusal'
export const MAX_CORRECTION_REASON_LENGTH = 500
export const MAX_CORRECTED_SECONDARIES = 5

export function isValidCorrectionCategoryId(id: unknown): id is string {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(COPILOT_OBJECTION_CATEGORIES, id)
}

export interface ValidatedCorrectionInput {
  exchangeId: string
  correctedPrimaryCategoryId: string
  correctedSecondaryCategoryIds: string[]
  correctionReason?: string
}

export type CorrectionValidationResult =
  | { valid: true; data: ValidatedCorrectionInput }
  | { valid: false; error: string }

function isValidUuidLoose(id: unknown): id is string {
  return (
    typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  )
}

export function validateCorrectionInput(body: any): CorrectionValidationResult {
  const { exchangeId, correctedPrimaryCategoryId, correctedSecondaryCategoryIds, correctionReason } = body || {}

  if (!exchangeId || typeof exchangeId !== 'string' || !isValidUuidLoose(exchangeId)) {
    return { valid: false, error: 'Invalid input. exchangeId must be a valid UUID string.' }
  }

  if (
    typeof correctedPrimaryCategoryId !== 'string' ||
    (correctedPrimaryCategoryId !== UNCLASSIFIED && !isValidCorrectionCategoryId(correctedPrimaryCategoryId))
  ) {
    return {
      valid: false,
      error: `Invalid correctedPrimaryCategoryId. Expected a recognized objection category or "${UNCLASSIFIED}".`,
    }
  }

  let secondaries: string[] = []
  if (correctedSecondaryCategoryIds !== undefined && correctedSecondaryCategoryIds !== null) {
    if (!Array.isArray(correctedSecondaryCategoryIds)) {
      return {
        valid: false,
        error: 'Invalid correctedSecondaryCategoryIds. Expected an array of objection category IDs.',
      }
    }
    secondaries = correctedSecondaryCategoryIds
  }

  if (correctedPrimaryCategoryId === UNCLASSIFIED && secondaries.length > 0) {
    return {
      valid: false,
      error: 'correctedSecondaryCategoryIds must be empty when correctedPrimaryCategoryId is "unclassified".',
    }
  }
  if (correctedPrimaryCategoryId === EXPLICIT_REFUSAL && secondaries.length > 0) {
    return {
      valid: false,
      error: 'correctedSecondaryCategoryIds must be empty when correctedPrimaryCategoryId is "explicit-refusal".',
    }
  }

  if (secondaries.length > MAX_CORRECTED_SECONDARIES) {
    return {
      valid: false,
      error: `correctedSecondaryCategoryIds must contain at most ${MAX_CORRECTED_SECONDARIES} entries.`,
    }
  }

  for (const secondaryId of secondaries) {
    if (!isValidCorrectionCategoryId(secondaryId)) {
      return {
        valid: false,
        error: `Invalid correctedSecondaryCategoryIds entry: "${String(
          secondaryId
        )}" is not a recognized objection category.`,
      }
    }
  }

  if (new Set(secondaries).size !== secondaries.length) {
    return { valid: false, error: 'correctedSecondaryCategoryIds must not contain duplicate entries.' }
  }

  if (secondaries.includes(correctedPrimaryCategoryId)) {
    return {
      valid: false,
      error: 'correctedPrimaryCategoryId must not also appear in correctedSecondaryCategoryIds.',
    }
  }

  if (correctionReason !== undefined && correctionReason !== null) {
    if (typeof correctionReason !== 'string') {
      return { valid: false, error: 'Invalid correctionReason. Expected a string.' }
    }
    if (correctionReason.trim().length > MAX_CORRECTION_REASON_LENGTH) {
      return {
        valid: false,
        error: `correctionReason must be ${MAX_CORRECTION_REASON_LENGTH} characters or fewer.`,
      }
    }
  }

  return {
    valid: true,
    data: {
      exchangeId,
      correctedPrimaryCategoryId,
      correctedSecondaryCategoryIds: secondaries,
      correctionReason: typeof correctionReason === 'string' ? correctionReason.trim() || undefined : undefined,
    },
  }
}
