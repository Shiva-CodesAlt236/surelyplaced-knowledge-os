import type { ICopilotAIProvider } from './types'
import type { CopilotResponse, OutcomePayload } from '../types'
import { runCopilotPipeline } from '../pipeline'

/**
 * Production Copilot AI Provider Placeholder
 *
 * Delegates to the grounded reasoning pipeline while production model vendor selection is finalized.
 */
export class ProductionCopilotProvider implements ICopilotAIProvider {
  async analyzeObjection(input: string): Promise<CopilotResponse> {
    return await runCopilotPipeline(input)
  }

  async recordOutcome(payload: OutcomePayload): Promise<{ success: boolean }> {
    console.log('[ProductionCopilotProvider] Outcome recorded:', payload)
    return { success: true }
  }
}
