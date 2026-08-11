import type { ICopilotAIProvider } from './types'
import type { CopilotResponse } from '../types'
import { runCopilotPipeline } from '../pipeline'

/**
 * Mock Copilot AI Provider — Phase 3 Pipeline Delegate
 *
 * Executes the server-side grounded reasoning pipeline completely offline and deterministically.
 */
export class MockCopilotProvider implements ICopilotAIProvider {
  async analyzeObjection(input: string): Promise<CopilotResponse> {
    return await runCopilotPipeline(input)
  }
}
