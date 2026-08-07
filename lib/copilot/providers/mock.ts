import type { ICopilotAIProvider } from './types'
import type { CopilotResponse, OutcomePayload } from '../types'
import { findMatchingObjectionCategory, buildResponseLevelOptions } from '../scripts-library-adapter'

/**
 * Mock Copilot AI Provider — Reconciled Zero-Hardcoding Implementation
 *
 * All classification, verbatim script responses, coaching explanations, follow-up questions,
 * and refusal paths are derived directly from metadata and `lib/scripts-registry.ts`.
 */
export class MockCopilotProvider implements ICopilotAIProvider {
  async analyzeObjection(input: string): Promise<CopilotResponse> {
    const { category, scripts, primaryScript, confidence, isRefusal, refusalReason } =
      findMatchingObjectionCategory(input)

    // Handle Refusal Path
    if (isRefusal || !category) {
      return {
        exchangeId: `ex-${Date.now()}`,
        objectionId: 'unclassified',
        objectionTitle: 'Unclassified Objection',
        confidence: 'low',
        recommendedResponse: '',
        whyItWorks: '',
        nextQuestion: '',
        avoidSaying: [],
        isRefusal: true,
        refusalReason:
          refusalReason ||
          'I am unable to confidently classify this statement against approved Sales Academy objection categories.',
      }
    }

    const levelOptions = buildResponseLevelOptions(scripts)

    const recommendedResponse =
      levelOptions[0]?.response ||
      primaryScript?.recommendedAnswer ||
      primaryScript?.entry.prompt ||
      "I completely respect that you want to evaluate this carefully before taking the next step."

    const whyItWorks =
      primaryScript?.whyThisWorks ||
      primaryScript?.managerTip ||
      category.whyItWorks

    const nextQuestion = category.defaultNextQuestion

    return {
      exchangeId: `ex-${Date.now()}`,
      objectionId: category.id,
      objectionTitle: category.name,
      confidence,
      recommendedResponse,
      whyItWorks,
      nextQuestion,
      avoidSaying: category.prohibitedResponsePatterns,
      matchedScriptId: primaryScript?.scriptId,
      levelOptions,
      selectedLevel: 1,
      isRefusal: false,
    }
  }

  async recordOutcome(payload: OutcomePayload): Promise<{ success: boolean }> {
    console.log('[MockCopilotProvider] Outcome recorded:', payload)
    return { success: true }
  }
}
