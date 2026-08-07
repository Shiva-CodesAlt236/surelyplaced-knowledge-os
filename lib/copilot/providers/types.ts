import type { CopilotResponse, OutcomePayload } from '../types'

export interface ICopilotAIProvider {
  analyzeObjection(input: string): Promise<CopilotResponse>
  recordOutcome(payload: OutcomePayload): Promise<{ success: boolean }>
}
