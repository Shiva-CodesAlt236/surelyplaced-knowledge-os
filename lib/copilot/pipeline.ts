import type { CopilotResponse, SecondaryObjectionInfo } from './types'
import { COPILOT_OBJECTION_CATEGORIES } from './objection-categories'
import { getScriptsForObjectionCategory, buildResponseLevelOptions } from './scripts-library-adapter'
import { calculateReconciledConfidence, CategoryScoreSignal } from './confidence'
import { verifyProtectedSpans } from './protected-spans'
import { scanContentSafety } from './content-scanner'

export interface PipelineOptions {
  contextModuleId?: string
}

// Category intrinsic severity weights per docs/SALES_COPILOT_COMPOUND_OBJECTIONS.md
const SEVERITY_WEIGHTS: Record<string, number> = {
  'price-objection': 1.2,
  'trust-and-credibility': 1.2,
  'need-time-to-think': 1.0,
  'parents-spouse-approval': 1.0,
  'already-applying-myself': 0.9,
}

/**
 * Calculates candidate match score for a given category based on phrase matching and keyword density.
 */
function scoreCategoryMatch(text: string, categoryId: string): CategoryScoreSignal {
  const meta = COPILOT_OBJECTION_CATEGORIES[categoryId]
  if (!meta) {
    return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
  }

  let exactMatches = 0
  let keywordMatches = 0

  for (const phrase of meta.examplePhrases) {
    if (text.includes(phrase.toLowerCase())) {
      exactMatches += 1
    }
  }

  const keywordsMap: Record<string, string[]> = {
    'price-objection': ['expensive', 'cost', 'price', 'budget', 'money', 'fee', 'discount'],
    'trust-and-credibility': ['trust', 'scam', 'guarantee', 'proof', 'real', 'legit', 'company', 'fake', 'reviews', 'reputation'],
    'need-time-to-think': ['think', 'time', 'decide', 'consider', 'call back', 'reflect'],
    'already-applying-myself': ['apply', 'myself', 'own', 'linkedin', 'portal', 'direct'],
    'parents-spouse-approval': ['parent', 'parents', 'spouse', 'family', 'husband', 'wife', 'father', 'mother'],
  }

  const categoryKeywords = keywordsMap[categoryId] || []
  for (const kw of categoryKeywords) {
    if (text.includes(kw)) {
      keywordMatches += 1
    }
  }

  const baseScore = exactMatches > 0 ? 0.95 : keywordMatches > 0 ? Math.min(0.90, 0.40 + keywordMatches * 0.25) : 0.0
  const severity = SEVERITY_WEIGHTS[categoryId] || 1.0
  const finalScore = Number(Math.min(1.0, baseScore * severity).toFixed(2))

  return {
    categoryId,
    providerScore: finalScore,
    vectorScore: finalScore,
    keywordScore: finalScore,
  }
}

/**
 * Sales Copilot Grounded Reasoning Pipeline
 *
 * Phase 3 Architecture:
 * - Deterministic multi-signal classification & compound objection detection
 * - Reconciled confidence calculation & low-confidence refusal gating
 * - Grounded retrieval of verbatim approved scripts from `lib/scripts-registry.ts`
 * - Defense-in-depth protected span & content safety validation on active response
 * - LLM personalization is DEFERRED until production provider vendor integration (isPersonalized: false)
 */
export async function runCopilotPipeline(
  input: string,
  _options: PipelineOptions = {}
): Promise<CopilotResponse> {
  const text = (input || '').toLowerCase().trim()
  const exchangeId = `ex-${Date.now()}`

  // Step 1: Input Validation & Refusal for empty/short statements
  if (!text || text.length < 3) {
    return {
      exchangeId,
      objectionId: 'unclassified',
      objectionTitle: 'Unclassified Objection',
      confidence: 'low',
      numericConfidence: 0.0,
      confidenceBand: 'low',
      recommendedResponse: '',
      whyItWorks: '',
      nextQuestion: '',
      avoidSaying: [],
      isRefusal: true,
      refusalReason: 'Input statement is too short to classify against approved sales scripts.',
    }
  }

  // Step 2: Score all 5 MVP categories for Compound Objection Detection
  const categoryKeys = Object.keys(COPILOT_OBJECTION_CATEGORIES)
  const signals = categoryKeys.map((key) => scoreCategoryMatch(text, key))
  const validSignals = signals.filter((s) => s.providerScore > 0.35)

  // Step 3: Reconcile Confidence
  const confidenceResult = calculateReconciledConfidence(validSignals)

  if (confidenceResult.isLowConfidenceRefusal || !confidenceResult.categoryId) {
    return {
      exchangeId,
      objectionId: 'unclassified',
      objectionTitle: 'Unclassified Objection',
      confidence: 'low',
      numericConfidence: confidenceResult.numericConfidence,
      confidenceBand: 'low',
      recommendedResponse: '',
      whyItWorks: '',
      nextQuestion: '',
      avoidSaying: [],
      isRefusal: true,
      refusalReason:
        confidenceResult.refusalReason ||
        'I am unable to confidently classify this statement against approved Sales Academy objection categories.',
    }
  }

  const primaryCategory = COPILOT_OBJECTION_CATEGORIES[confidenceResult.categoryId]

  // Step 4: Extract Secondary Objections for Compound Statements
  const secondaryObjections: SecondaryObjectionInfo[] = []
  const sortedSignals = [...validSignals].sort((a, b) => b.providerScore - a.providerScore)

  if (sortedSignals.length > 1) {
    const topScore = sortedSignals[0].providerScore
    for (let i = 1; i < sortedSignals.length; i++) {
      const signal = sortedSignals[i]
      if (topScore - signal.providerScore <= 0.35 && signal.categoryId !== primaryCategory.id) {
        const catMeta = COPILOT_OBJECTION_CATEGORIES[signal.categoryId]
        if (catMeta) {
          secondaryObjections.push({
            objectionId: catMeta.id,
            objectionTitle: catMeta.name,
            score: signal.providerScore,
          })
        }
      }
    }
  }

  // Step 5: Approved Script Retrieval (Level 1 & Level 2)
  const scripts = getScriptsForObjectionCategory(primaryCategory.id)
  const levelOptions = buildResponseLevelOptions(scripts)
  const primaryScript = scripts[0] || null

  let recommendedResponse =
    levelOptions[0]?.response ||
    primaryScript?.recommendedAnswer ||
    primaryScript?.entry.prompt ||
    "I completely respect that you want to evaluate this carefully before taking the next step."

  // Step 6: Defense-in-Depth Safety Scanning on Returned Response
  let safetyFallback = false
  const isPersonalized = false // Personalization deferred to production LLM provider integration

  const protectedVerification = verifyProtectedSpans(recommendedResponse, recommendedResponse)
  const contentSafety = scanContentSafety(recommendedResponse)

  if (!protectedVerification.isValid || !contentSafety.isSafe) {
    safetyFallback = true
    if (primaryScript?.recommendedAnswer) {
      recommendedResponse = primaryScript.recommendedAnswer
    }
  }

  // Step 7: Grounded Coaching Assembly
  const whyItWorks =
    primaryScript?.whyThisWorks ||
    primaryScript?.managerTip ||
    primaryCategory.whyItWorks

  const nextQuestion = primaryCategory.defaultNextQuestion

  return {
    exchangeId,
    objectionId: primaryCategory.id,
    objectionTitle: primaryCategory.name,
    confidence: confidenceResult.confidenceBand,
    numericConfidence: confidenceResult.numericConfidence,
    confidenceBand: confidenceResult.confidenceBand,
    recommendedResponse,
    whyItWorks,
    nextQuestion,
    avoidSaying: primaryCategory.prohibitedResponsePatterns,
    matchedScriptId: primaryScript?.scriptId,
    levelOptions,
    selectedLevel: 1,
    primaryObjection: {
      objectionId: primaryCategory.id,
      objectionTitle: primaryCategory.name,
    },
    secondaryObjections: secondaryObjections.length > 0 ? secondaryObjections : undefined,
    isRefusal: false,
    isPersonalized,
    safetyFallback,
  }
}
