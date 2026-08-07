export type ConfidenceLevel = 'High' | 'Medium' | 'Low'

export type OutcomeStatus = 'pending' | 'enrolled' | 'follow_up' | 'lost'

export type LostReason = 'price' | 'trust' | 'timing' | 'competitor' | 'other'

export interface CopilotResponse {
  exchangeId: string
  objectionId: string
  detectedObjection: string
  category: string
  confidenceLevel: ConfidenceLevel
  confidenceScore: number
  recommendedResponse: string
  whyThisWorks: string
  nextQuestion: string
  avoidSaying: string
  scriptId?: string
  isLowConfidence: boolean
  hasMatch: boolean
}

export interface CopilotSession {
  sessionId: string
  candidateId?: string
  advisorId?: string
  outcomeStatus: OutcomeStatus
  outcomeReason?: LostReason
  recordedAt?: string
  exchanges: CopilotResponse[]
}

export interface CopilotFeedbackPayload {
  exchangeId: string
  objectionId: string
  rating: 'HELPFUL' | 'NEUTRAL' | 'UNHELPFUL'
}
