import type { ICopilotAIProvider } from './types'
import type { CopilotResponse, OutcomePayload } from '../types'

/**
 * Production Copilot AI Provider Placeholder
 *
 * UNCONFIGURED PLACEHOLDER: Throws an explicit configuration error until
 * a production LLM vendor (e.g. Gemini, OpenAI, Anthropic) is chosen and configured.
 */
export class ProductionCopilotProvider implements ICopilotAIProvider {
  async analyzeObjection(_input: string): Promise<CopilotResponse> {
    throw new Error(
      "ProductionCopilotProvider is not configured. Please set COPILOT_AI_PROVIDER=mock or configure a production model vendor."
    )
  }

  async recordOutcome(_payload: OutcomePayload): Promise<{ success: boolean }> {
    throw new Error(
      "ProductionCopilotProvider is not configured. Please set COPILOT_AI_PROVIDER=mock or configure a production model vendor."
    )
  }
}
