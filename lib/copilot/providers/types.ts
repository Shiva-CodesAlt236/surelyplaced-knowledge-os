import type { CopilotResponse } from '../types'

export interface CopilotAIProvider {
  analyzeObjection(input: string, candidateName?: string): Promise<CopilotResponse>
}
