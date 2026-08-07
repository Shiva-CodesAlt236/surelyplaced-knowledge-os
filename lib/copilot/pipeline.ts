import type { CopilotResponse } from './types'
import { getCopilotAIProvider } from './providers'
import { getScriptForObjection } from './scripts-library-adapter'
import { scanContentSensitivity } from './content-scanner'
import { verifyProtectedSpans } from './protected-spans'

export interface PipelineOptions {
  candidateName?: string
  difficulty?: 'Foundational' | 'Intermediate'
}

/**
 * Six-Step AI Reasoning Pipeline
 *
 * 1. Input Normalization
 * 2. Classification (AI Provider)
 * 3. Retrieval (Knowledge OS Scripts Library Adapter — NO SCRIPT DUPLICATION)
 * 4. Personalization & Protected-Span Verification
 * 5. Content Sensitivity Scan
 * 6. Final Output Assembly
 */
export async function runCopilotPipeline(
  input: string,
  options: PipelineOptions = {}
): Promise<CopilotResponse> {
  const provider = getCopilotAIProvider()

  // Step 1 & 2: Classify input via provider
  const baseResult = await provider.analyzeObjection(input, options.candidateName)

  // Step 3: Retrieve real script reference from Knowledge OS Scripts Library Adapter
  const scriptResult = getScriptForObjection(baseResult.objectionId, options.difficulty || 'Foundational')

  // Step 4: Personalize & verify protected spans
  let finalResponseText = baseResult.recommendedResponse
  if (scriptResult.script && scriptResult.script.recommendedAnswer) {
    const rawAnswer = scriptResult.script.recommendedAnswer
    finalResponseText = options.candidateName ? `Hi ${options.candidateName}, ${rawAnswer}` : rawAnswer
  }

  const spanCheck = verifyProtectedSpans(baseResult.recommendedResponse, finalResponseText)
  if (!spanCheck.isVerbatimValid && spanCheck.fallbackText) {
    finalResponseText = spanCheck.fallbackText
  }

  // Step 5: Final Content Sensitivity Scan
  const scanResult = scanContentSensitivity(finalResponseText)
  if (!scanResult.isCompliant) {
    // Fall back to original safe template if forbidden terms detected
    finalResponseText = baseResult.recommendedResponse
  }

  // Step 6: Assemble final response contract
  return {
    ...baseResult,
    recommendedResponse: finalResponseText,
    scriptId: scriptResult.sourceScriptId || undefined,
  }
}
