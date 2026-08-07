/**
 * Sales Copilot Drizzle Schema (Postgres)
 *
 * ONLY stores dynamic interaction records:
 *   - Copilot Sessions
 *   - Copilot Exchanges
 *   - Feedback
 *
 * NEVER stores scripts or knowledge content (sourced dynamically from lib/scripts-registry.ts).
 */

export interface DbCopilotSession {
  sessionId: string
  candidateId?: string
  advisorId?: string
  outcomeStatus: 'pending' | 'enrolled' | 'follow_up' | 'lost'
  outcomeReason?: 'price' | 'trust' | 'timing' | 'competitor' | 'other'
  recordedAt?: string
  createdAt: string
  updatedAt: string
}

export interface DbCopilotExchange {
  exchangeId: string
  sessionId: string
  objectionId: string
  rawInput: string
  detectedCategory: string
  confidenceLevel: 'High' | 'Medium' | 'Low'
  confidenceScore: number
  recommendedResponse: string
  nextQuestion: string
  whyThisWorks: string
  avoidSaying: string
  scriptId?: string
  createdAt: string
}

export interface DbCopilotFeedback {
  feedbackId: string
  exchangeId: string
  objectionId: string
  rating: 'HELPFUL' | 'NEUTRAL' | 'UNHELPFUL'
  createdAt: string
}
