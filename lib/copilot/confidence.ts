/**
 * Sales Copilot — Multi-Signal Confidence Reconciliation Engine
 *
 * Grounded in docs/SALES_COPILOT_CONFIDENCE_MODEL.md
 */

import type { ConfidenceLevel } from './types'

export interface CategoryScoreSignal {
  categoryId: string
  providerScore: number // Sp (0.0 - 1.0)
  vectorScore: number   // Sv (0.0 - 1.0)
  keywordScore: number  // Sk (0.0 - 1.0)
}

export interface ConfidenceCalculationResult {
  categoryId: string | null
  numericConfidence: number // Cfinal (0.0 - 1.0)
  confidenceBand: ConfidenceLevel
  margin: number
  isLowConfidenceRefusal: boolean
  refusalReason?: string
}

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.75,
  MEDIUM: 0.50,
}

/**
 * Calculates conservative reconciled confidence score across provider, vector, keyword, and margin signals.
 *
 * Formula: C_final = min(Sp, Sv, Sk) * (0.75 + 0.25 * Margin)
 */
export function calculateReconciledConfidence(
  signals: CategoryScoreSignal[]
): ConfidenceCalculationResult {
  if (!signals || signals.length === 0) {
    return {
      categoryId: null,
      numericConfidence: 0.0,
      confidenceBand: 'low',
      margin: 0.0,
      isLowConfidenceRefusal: true,
      refusalReason: 'No matching objection categories detected.',
    }
  }

  // Sort signals descending by average score
  const sorted = [...signals].sort((a, b) => {
    const avgA = (a.providerScore + a.vectorScore + a.keywordScore) / 3
    const avgB = (b.providerScore + b.vectorScore + b.keywordScore) / 3
    return avgB - avgA
  })

  const topMatch = sorted[0]
  const secondMatch = sorted[1]

  const topAvg = (topMatch.providerScore + topMatch.vectorScore + topMatch.keywordScore) / 3
  const secondAvg = secondMatch
    ? (secondMatch.providerScore + secondMatch.vectorScore + secondMatch.keywordScore) / 3
    : 0.0

  const margin = Math.max(0.0, Math.min(1.0, topAvg - secondAvg))

  const minSignal = Math.min(topMatch.providerScore, topMatch.vectorScore, topMatch.keywordScore)

  // Scale formula: preserves strong top match signal (Sp >= 0.60) while reflecting margin tightness
  const numericConfidence = Number((minSignal * (0.75 + 0.25 * margin)).toFixed(2))

  let confidenceBand: ConfidenceLevel = 'low'
  if (numericConfidence >= CONFIDENCE_THRESHOLDS.HIGH) {
    confidenceBand = 'high'
  } else if (numericConfidence >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    confidenceBand = 'medium'
  }

  const isLowConfidenceRefusal = confidenceBand === 'low'

  return {
    categoryId: topMatch.categoryId,
    numericConfidence,
    confidenceBand,
    margin,
    isLowConfidenceRefusal,
    refusalReason: isLowConfidenceRefusal
      ? 'I am unable to confidently classify this statement against approved Sales Academy objection categories.'
      : undefined,
  }
}
