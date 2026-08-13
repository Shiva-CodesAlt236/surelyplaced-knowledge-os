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

// Explicit Hard Refusal Patterns for Deterministic Pre-Check (Phase 5D Expanded Coverage)
const HARD_REFUSAL_PATTERNS = [
  'stop calling',
  "don't call me",
  "dont call me",
  'do not call me',
  'remove my number',
  'remove me from your list',
  'remove me from list',
  'take me off your list',
  'take me off list',
  'take off your list',
  'do not contact me',
  "don't contact me",
  "dont contact me",
  'do not message me',
  "don't message me",
  "dont message me",
  'stop contacting me',
  'stop messaging me',
  'definitely not interested',
  "don't ask me again",
  "dont ask me again",
  "do not ask me again",
  "not interested and i don't want to discuss",
  "not interested and i dont want to discuss",
  'take my number off',
  'remove my details',
  'told you not to call',
  "said don't call me",
  "said dont call me",
  "said do not call me",
  "already told you not to call",
  "already said don't call",
  "already said dont call",
  "already said do not call",
  "already said i'm not interested",
  "already said im not interested",
  "already said i am not interested",
]

/**
 * Calculates candidate match score for a given category based on phrase matching and keyword density.
 */
function scoreCategoryMatch(text: string, categoryId: string): CategoryScoreSignal {
  const meta = COPILOT_OBJECTION_CATEGORIES[categoryId]
  if (!meta) {
    return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
  }

  // --- CATEGORY SAFETY FILTERS & EXCLUSION GUARDS (Phase 5D Precision) ---

  // 1. Explicit Refusal Near-Miss Safety
  if (categoryId === 'explicit-refusal') {
    const matchesHardRefusal = HARD_REFUSAL_PATTERNS.some((pat) => text.includes(pat))
    if (!matchesHardRefusal) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }
  }

  // 2. Not-Interested Contextual Precision Guard (Section 8, 9, 10, 28)
  if (categoryId === 'not-interested') {
    // Exclusion 2A: positive interest phrases ("i am interested", "i'm interested but", "am interested")
    if (
      text.includes('i am interested') ||
      text.includes("i'm interested but") ||
      text.includes('im interested but') ||
      text.includes('am interested')
    ) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }

    // Exclusion 2B: "not interested in <object>" contextual guard
    if (text.includes('not interested in')) {
      const allowedTargets = [
        'this program',
        'your program',
        'this service',
        'your service',
        'this package',
        'your package',
        'this offer',
        'signing up',
        'enrolling',
        'moving forward',
        'joining',
        'participating',
        'working with you',
        'using your service',
        'this consultancy',
        'your consultancy',
      ]
      const hasAllowedTarget = allowedTargets.some((target) => text.includes(`not interested in ${target}`))
      if (!hasAllowedTarget) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
    }
  }

  // 3. Parents / Spouse Approval Decision Context Guard (Section 24)
  if (categoryId === 'parents-spouse-approval') {
    const familyWords = ['parents', 'parent', 'spouse', 'husband', 'wife', 'father', 'mother', 'family']
    const hasFamilyWord = familyWords.some((w) => text.includes(w))
    if (hasFamilyWord) {
      const decisionVerbs = [
        'talk',
        'discuss',
        'ask',
        'agree',
        'decide',
        'approve',
        'review',
        'clearance',
        'permission',
        'decision',
        'handles',
        'approval',
        'wants to',
        'won\'t',
        'wont',
        'need',
      ]
      const hasDecisionContext = decisionVerbs.some((v) => text.includes(v))
      if (!hasDecisionContext) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
    }
  }

  // 4. Already-Applying-Myself DIY Context Guard (Section 19 & 20)
  if (categoryId === 'already-applying-myself') {
    const bareMyselfOrOwn = text.includes('myself') || text.includes('own')
    if (bareMyselfOrOwn) {
      const diyJobSearchContext = [
        'apply',
        'applying',
        'application',
        'interview',
        'linkedin',
        'portal',
        'job search',
        'try',
        'get interviews',
        'doing fine',
        'need help',
        'independently',
        'on my own',
        'give myself',
        'another month',
      ]
      const hasJobSearchContext = diyJobSearchContext.some((c) => text.includes(c))
      if (!hasJobSearchContext) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
    }
  }

  // 5. Information-Request Deferral Logistical Exchange Guard (Section 16)
  if (categoryId === 'information-request-deferral') {
    const logisticalTerms = [
      'calendar invite',
      'meeting link',
      'my resume',
      'zoom link',
      'interview schedule',
      'phone number',
      'your phone number',
    ]
    if (logisticalTerms.some((t) => text.includes(t))) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }
  }

  // 6. Need-Time-To-Think Non-Sales Task Guard (Section 18)
  if (categoryId === 'need-time-to-think') {
    const nonSalesTimeTerms = [
      'finish my assignment',
      'complete my project',
      'time to cook',
      'interview time',
      'call time',
    ]
    if (nonSalesTimeTerms.some((t) => text.includes(t))) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }
  }

  // 7. Upfront-Payment Resistance Non-Program Context Guard (Section 14)
  if (categoryId === 'upfront-payment-resistance') {
    const nonProgramPaymentTerms = ['laptop', 'apartment', 'electricity bill', 'rent']
    if (nonProgramPaymentTerms.some((t) => text.includes(t))) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }
  }

  // --- MATCHING EXECUTION ---

  let exactMatches = 0
  let keywordMatches = 0

  for (const phrase of meta.examplePhrases) {
    const pLower = phrase.toLowerCase().trim()
    if (text.includes(pLower)) {
      exactMatches += 1
    }
  }

  const keywordsMap: Record<string, string[]> = {
    'explicit-refusal': ['stop calling', 'remove number', 'do not contact', 'stop contact', 'off your list', 'dont call', 'do not call', 'stop messaging'],
    'upfront-payment-resistance': [
      'pay upfront',
      'no upfront',
      'upfront fee',
      'upfront payment',
      'paying upfront',
      'pay before',
      'after placement',
      'once placed',
      'pay once',
      'risk upfront',
      'pay after',
      'advance payment',
      'no advance payment',
      'pay after i get a job',
      'pay after i join',
      'pay once i start earning',
      'risk money before',
      'pay before getting',
      'can i pay after',
    ],
    'information-request-deferral': [
      'email me the details',
      'send details',
      'mail me details',
      'mail me the details',
      'send info',
      'send information',
      'text details',
      'review later',
      'email me details',
      'send me the details',
      'send everything on whatsapp',
      'send me the pricing',
      'send me the agreement',
      'share the information',
      'go through the information',
      'everything written first',
      'send me something to review',
    ],
    'price-objection': [
      'expensive',
      'cost',
      'price',
      'budget',
      'fee',
      'discount',
      'can\'t afford',
      'cannot afford',
      'too much money',
      'don\'t have the money',
      'no budget',
      'low budget',
      'outside my budget',
      'can\'t spend that much',
      'cannot spend that much',
      'why is it so expensive',
      'too expensive',
    ],
    'trust-and-credibility': [
      'trust',
      'scam',
      'guarantee',
      'proof',
      'real',
      'legit',
      'fake',
      'reviews',
      'reputation',
      'cheated',
      'scammed',
      'fraud',
      'genuine',
      'is this real',
      'isn\'t a scam',
      'is it a scam',
      'trust consultancies',
      'real recruiters',
      'fake placement',
      'success stories',
    ],
    'need-time-to-think': [
      'think about it',
      'time to decide',
      'call back tomorrow',
      'need a few days',
      'not ready today',
      'call after two weeks',
      'maybe later',
      'need some time',
      'call me next week',
      'call me next month',
      'not today',
      'busy right now',
      'decide later',
      'get back to you',
      'decide tomorrow',
      'need time to decide',
    ],
    'already-applying-myself': [
      'apply on my own',
      'doing applications myself',
      'try myself',
      'apply myself',
      'applying myself',
      'already applying myself',
      'already applying',
      'independently',
      'on my own',
      'apply online',
      'applying on linkedin',
      'already getting interviews',
      'already have interviews',
      'handling the job search myself',
      'applying independently',
      'do it on my own',
      'try on my own',
      'don\'t need help yet',
      'dont need help yet',
      'doing fine myself',
      'give myself another month',
      'give myself',
      'don\'t think i need help',
      'dont think i need help',
    ],
    'already-working-with-consultancy': [
      'another consultancy',
      'placement company',
      'another service',
      'someone helping me',
      'other consultancy',
      'another recruiter',
      'paid another company',
      'enrolled somewhere else',
      'another company is doing',
      'already signed up',
      'using another placement',
      'hired someone for my job search',
    ],
    'parents-spouse-approval': [
      'talk to my parents',
      'talk to my spouse',
      'talk to my husband',
      'talk to my wife',
      'talk to my family',
      'father will decide',
      'discuss it with my husband',
      'discuss with my wife',
      'discuss with my parents',
      'discuss it with my father',
      'discuss with my father',
      'ask my wife',
      'ask my husband',
      'ask my parents',
      'family won\'t agree',
      'family wont agree',
      'parents won\'t agree',
      'parents wont agree',
      'parents need to approve',
      'father wants to review',
      'mother wants to review',
      'spouse handles',
      'family agrees',
      'family decision',
    ],
    'not-interested': [
      'not interested',
      'no thanks',
      'nah i\'m good',
      'nah im good',
      'not right now',
      'don\'t think i need',
      'not interested in this program',
      'not interested in your program',
      'not interested in this service',
      'not interested in your service',
      'not interested in this package',
      'not interested in signing up',
      'not interested in enrolling',
      'not interested in moving forward',
    ],
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
 * Sales Copilot Grounded Reasoning Pipeline — Phase 5D Precision & Coverage Upgrade
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
        "Understood. Thank you for letting me know. I'll leave it there. Have a great day.",
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

  if (primaryCategory.id === 'explicit-refusal') {
    recommendedResponse =
      selectedScript?.recommendedAnswer ||
      "Understood. Thank you for letting me know. I'll leave it there. Have a great day."
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
