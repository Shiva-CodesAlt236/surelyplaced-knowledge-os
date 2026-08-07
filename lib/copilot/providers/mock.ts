import type { ICopilotAIProvider } from './types'
import type { CopilotResponse, OutcomePayload } from '../types'
import { findMatchingObjectionCategory } from '../scripts-library-adapter'

/**
 * Mock Copilot AI Provider — Phase 2 Grounded Adapter Integration
 *
 * Classifies student objection input and retrieves response text and coaching
 * metadata directly from `lib/scripts-registry.ts` via `findMatchingObjectionCategory`.
 * Zero duplicate script databases or copied response files.
 */
export class MockCopilotProvider implements ICopilotAIProvider {
  async analyzeObjection(input: string): Promise<CopilotResponse> {
    const { category, primaryScript } = findMatchingObjectionCategory(input)

    // Pull verbatim response from existing SCRIPTS_REGISTRY entry if available
    const recommendedResponse =
      primaryScript?.recommendedAnswer ||
      primaryScript?.entry.prompt ||
      "I completely respect that you want to take time to make the right decision. To help you evaluate clearly, what specific part of the program would you like to reflect on?"

    const whyItWorks =
      primaryScript?.whyThisWorks ||
      primaryScript?.managerTip ||
      category.hiddenConcernPatterns[0] ||
      "Grounds the conversation respectfully while helping isolate the real underlying blocker."

    const nextQuestion =
      category.id === 'price-objection'
        ? "If budget wasn't a constraint, do you feel this is the exact skill transformation you need right now?"
        : category.id === 'parents-spouse-approval'
        ? "What is the main outcome or reassurance your family will be looking for when you discuss this?"
        : category.id === 'already-applying-myself'
        ? "Out of your recent direct applications, how many hiring manager interviews have you secured so far?"
        : "When you think about taking this step, what is the single biggest question still on your mind?"

    return {
      exchangeId: `ex-${Date.now()}`,
      objectionId: category.id,
      objectionTitle: category.name,
      confidence: primaryScript ? 'high' : 'medium',
      recommendedResponse,
      whyItWorks,
      nextQuestion,
      avoidSaying: category.prohibitedResponsePatterns,
      matchedScriptId: primaryScript?.scriptId,
    }
  }

  async recordOutcome(payload: OutcomePayload): Promise<{ success: boolean }> {
    console.log('[MockCopilotProvider] Outcome recorded:', payload)
    return { success: true }
  }
}
