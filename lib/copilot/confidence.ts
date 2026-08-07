import type { ConfidenceLevel } from './types'

export interface ConfidenceEvaluation {
  level: ConfidenceLevel
  score: number
  isLowConfidence: boolean
}

export function evaluateConfidence(score: number): ConfidenceEvaluation {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)))
  let level: ConfidenceLevel = 'Low'

  if (normalizedScore >= 75) {
    level = 'High'
  } else if (normalizedScore >= 50) {
    level = 'Medium'
  }

  return {
    level,
    score: normalizedScore,
    isLowConfidence: level === 'Low',
  }
}
