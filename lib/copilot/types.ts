/**
 * Sales Copilot MVP — Data Contracts & Interfaces
 *
 * Defines request, response, confidence levels, outcome statuses,
 * response levels, and loss reasons for the guided sales assistant workflow.
 */

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type ResponseLevel = 1 | 2

export type OutcomeStatus = 'enrolled' | 'follow-up' | 'lost'

export type LostReason = 'price' | 'trust' | 'timing' | 'competitor' | 'other'

export interface CopilotRequest {
  objectionText: string
  contextModuleId?: string
  advisorId?: string
}

export interface CopilotResponseLevelOption {
  level: ResponseLevel
  levelLabel: string
  response: string
  difficulty: string | null
  matchedScriptId?: string
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

  // Phase 2.5 Reconciliation Additions
  levelOptions?: CopilotResponseLevelOption[]
  selectedLevel?: ResponseLevel
  isRefusal?: boolean
  refusalReason?: string
}

export interface OutcomePayload {
  exchangeId?: string
  sessionId?: string
  outcome: OutcomeStatus
  reason?: LostReason
  feedback?: 'thumbs-up' | 'neutral' | 'thumbs-down'
  recordedAt?: string
}
