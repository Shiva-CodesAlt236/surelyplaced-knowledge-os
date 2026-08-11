import type { CopilotResponse } from '../types'

export interface ICopilotAIProvider {
  analyzeObjection(input: string): Promise<CopilotResponse>
}
