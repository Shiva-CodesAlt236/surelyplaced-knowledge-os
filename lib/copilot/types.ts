/**
 * Sales Copilot MVP — Data Contracts & Interfaces
 *
 * Defines request, response, confidence levels, outcome statuses,
 * and loss reasons for the guided sales assistant workflow.
 */

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type OutcomeStatus = 'enrolled' | 'follow-up' | 'lost'

export type LostReason = 'price' | 'trust' | 'timing' | 'competitor' | 'other'

export interface CopilotRequest {
  objectionText: string
  contextModuleId?: string
  advisorId?: string
}

export interface CopilotResponse {
  exchangeId: string
  objectionId: string
  objectionTitle: string
  confidence: ConfidenceLevel
  recommendedResponse: string
  whyItWorks: string
  nextQuestion: string
  avoidSaying: string[]
  matchedScriptId?: string
}

export interface OutcomePayload {
  exchangeId?: string
  sessionId?: string
  outcome: OutcomeStatus
  reason?: LostReason
  feedback?: 'thumbs-up' | 'neutral' | 'thumbs-down'
  recordedAt?: string
}
