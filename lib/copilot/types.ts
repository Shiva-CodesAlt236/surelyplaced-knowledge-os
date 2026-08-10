/**
 * Sales Copilot MVP — Data Contracts & Interfaces (Phase 3 Pipeline)
 *
 * Defines request, response, confidence levels, outcome statuses,
 * response levels, compound objections, and refusal paths.
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

export interface SecondaryObjectionInfo {
  objectionId: string
  objectionTitle: string
  score: number
}

export interface CopilotResponse {
  exchangeId: string
  objectionId: string
  objectionTitle: string
  confidence: ConfidenceLevel
  numericConfidence: number // 0.0 - 1.0
  confidenceBand: ConfidenceLevel
  recommendedResponse: string
  whyItWorks: string
  nextQuestion: string
  avoidSaying: string[]
  matchedScriptId?: string

  // Response Level Ladder
  levelOptions?: CopilotResponseLevelOption[]
  selectedLevel?: ResponseLevel

  // Compound Objections
  primaryObjection?: {
    objectionId: string
    objectionTitle: string
  }
  secondaryObjections?: SecondaryObjectionInfo[]

  // Refusal & Safety Controls
  isRefusal?: boolean
  refusalReason?: string
  isPersonalized?: boolean
  safetyFallback?: boolean
}

export interface OutcomePayload {
  exchangeId?: string
  sessionId?: string
  outcome: OutcomeStatus
  reason?: LostReason
  feedback?: 'thumbs-up' | 'neutral' | 'thumbs-down'
  recordedAt?: string
}
