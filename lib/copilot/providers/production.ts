import type { CopilotAIProvider } from './types'
import type { CopilotResponse } from '../types'
import { mockProvider } from './mock'

/**
 * Production Copilot Provider Placeholder.
 * Shares exact interface with MockCopilotProvider.
 * Falls back gracefully to mockProvider until production vendor credentials are wired.
 */
export class ProductionCopilotProvider implements CopilotAIProvider {
  async analyzeObjection(input: string, candidateName?: string): Promise<CopilotResponse> {
    // Production LLM vendor implementation placeholder
    return mockProvider.analyzeObjection(input, candidateName)
  }
}

export const productionProvider = new ProductionCopilotProvider()
