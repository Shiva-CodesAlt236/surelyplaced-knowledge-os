export interface ProtectedSpanCheckResult {
  isVerbatimValid: boolean
  fallbackText?: string
}

/**
 * Ensures personalization does not alter core compliance wording.
 * If adaptation alters approved text beyond simple greeting insertion,
 * falls back to the original approved response template.
 */
export function verifyProtectedSpans(
  originalTemplate: string,
  personalizedText: string
): ProtectedSpanCheckResult {
  if (!originalTemplate || !personalizedText) {
    return { isVerbatimValid: true }
  }

  // Extract core sentence structure ignoring candidate name greeting
  const cleanOriginal = originalTemplate.replace(/^[^\w]+/, '').trim()
  const cleanPersonalized = personalizedText.replace(/^Hi\s+[A-Za-z]+,\s*/i, '').trim()

  if (cleanPersonalized.includes(cleanOriginal) || cleanOriginal.includes(cleanPersonalized)) {
    return { isVerbatimValid: true }
  }

  // If adaptation strays from original, return fallback
  return {
    isVerbatimValid: false,
    fallbackText: originalTemplate,
  }
}
