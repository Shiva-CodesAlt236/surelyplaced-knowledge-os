import type { CopilotResponse, SecondaryObjectionInfo } from './types'
import { COPILOT_OBJECTION_CATEGORIES } from './objection-categories'
import { getScriptsForObjectionCategory, buildResponseLevelOptions } from './scripts-library-adapter'
import { calculateReconciledConfidence, CategoryScoreSignal } from './confidence'
import { scanContentSafety } from './content-scanner'

export interface PipelineOptions {
  contextModuleId?: string
  previousObjectionId?: string
}

// Category intrinsic severity weights per docs/SALES_COPILOT_COMPOUND_OBJECTIONS.md & Phase 5C Specs
const SEVERITY_WEIGHTS: Record<string, number> = {
  'explicit-refusal': 2.0,
  'upfront-payment-resistance': 1.35,
  'information-request-deferral': 1.25,
  'price-objection': 1.2,
  'trust-and-credibility': 1.2,
  'already-applying-myself': 1.15,
  'already-working-with-consultancy': 1.15,
  'not-interested': 1.1,
  'parents-spouse-approval': 1.0,
  'need-time-to-think': 0.95,
}

// Explicit Hard Refusal Patterns for Deterministic Pre-Check
const HARD_REFUSAL_PATTERNS = [
  'stop calling',
  "don't call me",
  "dont call me",
  'remove my number',
  'take me off your list',
  'do not contact me',
  'definitely not interested',
  "don't ask me again",
  "not interested and i don't want to discuss",
  'take my number off',
  'stop contacting me',
  'remove my details',
]

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
    const pLower = phrase.toLowerCase().trim()
    if (text.includes(pLower)) {
      exactMatches += 1
    }
  }

  const keywordsMap: Record<string, string[]> = {
    'explicit-refusal': ['stop calling', 'remove number', 'do not contact', 'stop contact', 'off your list'],
    'upfront-payment-resistance': ['upfront', 'pay before', 'after placement', 'once placed', 'pay once', 'risk upfront', 'pay after'],
    'information-request-deferral': ['email me', 'send details', 'mail me', 'send info', 'send information', 'text details', 'review later'],
    'price-objection': ['expensive', 'cost', 'price', 'budget', 'fee', 'discount'],
    'trust-and-credibility': ['trust', 'scam', 'guarantee', 'proof', 'real', 'legit', 'company', 'fake', 'reviews', 'reputation'],
    'need-time-to-think': ['think', 'time to decide', 'call back tomorrow', 'need a few days', 'not ready today', 'call after two weeks', 'maybe later'],
    'already-applying-myself': ['myself', 'own', 'linkedin', 'apply online', 'try myself', 'apply myself', 'independently', 'on my own'],
    'already-working-with-consultancy': ['another consultancy', 'placement company', 'another service', 'someone helping me', 'other consultancy'],
    'parents-spouse-approval': ['parent', 'parents', 'spouse', 'family', 'husband', 'wife', 'father', 'mother'],
    'not-interested': ['not interested', 'no thanks', 'nah i\'m good', 'nah im good', 'not right now', 'don\'t think i need'],
  }

  const categoryKeywords = keywordsMap[categoryId] || []
  for (const kw of categoryKeywords) {
    if (text.includes(kw.toLowerCase())) {
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
 * Sales Copilot Grounded Reasoning Pipeline — Phase 5C Live Objection Hotfix
 */
export async function runCopilotPipeline(
  input: string,
  options: PipelineOptions = {}
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

  // Step 2: Deterministic Hard Refusal Pre-Check (Section 6)
  const isHardRefusalPattern = HARD_REFUSAL_PATTERNS.some((pat) => text.includes(pat))
  if (isHardRefusalPattern) {
    const explicitMeta = COPILOT_OBJECTION_CATEGORIES['explicit-refusal']
    const scripts = getScriptsForObjectionCategory('explicit-refusal')
    const primaryScript = scripts[0] || null

    return {
      exchangeId,
      objectionId: 'explicit-refusal',
      objectionTitle: explicitMeta?.name || 'Explicit Refusal / Do-Not-Contact',
      confidence: 'high',
      numericConfidence: 0.98,
      confidenceBand: 'high',
      recommendedResponse:
        primaryScript?.recommendedAnswer ||
        "Understood. Thank you for letting me know. I'll make sure your contact preferences are updated immediately. Have a great day.",
      whyItWorks:
        primaryScript?.whyThisWorks ||
        explicitMeta?.whyItWorks ||
        'Acknowledges explicit candidate refusal immediately with zero persuasion and clean professional exit.',
      nextQuestion: '', // No persuasive next question on hard refusal
      avoidSaying: explicitMeta?.prohibitedResponsePatterns || [],
      matchedScriptId: primaryScript?.scriptId,
      primaryObjection: {
        objectionId: 'explicit-refusal',
        objectionTitle: explicitMeta?.name || 'Explicit Refusal / Do-Not-Contact',
      },
      secondaryObjections: undefined, // No secondary objections on hard refusal
      isRefusal: false,
      isPersonalized: false,
      safetyFallback: false,
    }
  }

  // Step 3: Score all taxonomy categories for Multi-Signal Matching & Compound Objections
  const categoryKeys = Object.keys(COPILOT_OBJECTION_CATEGORIES)
  const signals = categoryKeys.map((key) => scoreCategoryMatch(text, key))
  const validSignals = signals.filter((s) => s.providerScore > 0.35)

  // Step 4: Reconcile Confidence
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

  let selectedCategoryId = confidenceResult.categoryId

  // Step 5: Repeated Soft-Refusal Escalation Check (Section 7)
  // If previousObjectionId === 'not-interested' AND current utterance independently classifies as soft 'not-interested'
  if (
    options.previousObjectionId === 'not-interested' &&
    selectedCategoryId === 'not-interested'
  ) {
    selectedCategoryId = 'explicit-refusal'
  }

  const primaryCategory = COPILOT_OBJECTION_CATEGORIES[selectedCategoryId] || COPILOT_OBJECTION_CATEGORIES['explicit-refusal']

  // Step 6: Extract Secondary Objections for Compound Statements
  const secondaryObjections: SecondaryObjectionInfo[] = []
  if (primaryCategory.id !== 'explicit-refusal') {
    const sortedSignals = [...validSignals].sort((a, b) => b.providerScore - a.providerScore)
    if (sortedSignals.length > 1) {
      const topScore = sortedSignals[0].providerScore
      for (let i = 1; i < sortedSignals.length; i++) {
        const signal = sortedSignals[i]
        if (topScore - signal.providerScore <= 0.35 && signal.categoryId !== primaryCategory.id && signal.categoryId !== 'explicit-refusal') {
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
  }

  // Step 7: Grounded Script Retrieval & Deterministic Response Variation (Section 11 & 12)
  const scripts = getScriptsForObjectionCategory(primaryCategory.id)
  const levelOptions = primaryCategory.id === 'explicit-refusal' ? [] : buildResponseLevelOptions(scripts)

  // Deterministic variation selection based on input phrase hash so identical input yields identical output
  let scriptIndex = 0
  if (scripts.length > 1) {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i)
      hash |= 0
    }
    scriptIndex = Math.abs(hash) % scripts.length
  }

  const selectedScript = scripts[scriptIndex] || scripts[0] || null

  let recommendedResponse =
    selectedScript?.recommendedAnswer ||
    selectedScript?.entry.prompt ||
    levelOptions[0]?.response ||
    "I completely respect that you want to evaluate this carefully before taking the next step."

  // Hard exit override for explicit refusal
  if (primaryCategory.id === 'explicit-refusal') {
    recommendedResponse =
      selectedScript?.recommendedAnswer ||
      "Understood. Thank you for letting me know. I'll make sure your contact preferences are updated immediately. Have a great day."
  }

  // Step 8: Safety Scanning on Response
  let safetyFallback = false
  const isPersonalized = false

  const contentSafety = scanContentSafety(recommendedResponse)
  if (!contentSafety.isSafe) {
    safetyFallback = true
    if (selectedScript?.recommendedAnswer) {
      recommendedResponse = selectedScript.recommendedAnswer
    }
  }

  // Step 9: Grounded Coaching Assembly
  const whyItWorks =
    selectedScript?.whyThisWorks ||
    selectedScript?.managerTip ||
    primaryCategory.whyItWorks

  // Hard refusal MUST NOT have a persuasive next question
  const nextQuestion = primaryCategory.id === 'explicit-refusal' ? '' : primaryCategory.defaultNextQuestion

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
    matchedScriptId: selectedScript?.scriptId,
    levelOptions: levelOptions.length > 0 ? levelOptions : undefined,
    selectedLevel: levelOptions.length > 0 ? 1 : undefined,
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
