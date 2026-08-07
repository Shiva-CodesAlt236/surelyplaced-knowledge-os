import type { ICopilotAIProvider } from './types'
import type { CopilotResponse, OutcomePayload } from '../types'

/**
 * Production Copilot AI Provider Placeholder
 *
 * Interface placeholder for LLM integration. Will be connected once an
 * AI SDK vendor & credentials are environment configured.
 */
export class ProductionCopilotProvider implements ICopilotAIProvider {
  async analyzeObjection(_input: string): Promise<CopilotResponse> {
    throw new Error('Production Copilot AI provider is not yet wired to a live LLM vendor credentials.')
  }

  async recordOutcome(_payload: OutcomePayload): Promise<{ success: boolean }> {
    throw new Error('Production Copilot persistence not yet connected.')
  }
}
