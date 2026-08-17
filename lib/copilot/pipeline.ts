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

// Explicit Hard Refusal Patterns for Deterministic Pre-Check (Phase 5E Expanded DNC Coverage)
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
  // Phase 5E DNC Natural Wording Expansion
  "don't reach out again",
  "dont reach out again",
  'do not reach out again',
  "don't reach out to me",
  "dont reach out to me",
  'do not reach out to me',
  'stop reaching out',
  "don't text me anymore",
  "dont text me anymore",
  'do not text me anymore',
  "don't text me again",
  "dont text me again",
  'do not text me again',
  'stop texting me',
  'no more calls',
  'take me off the calling list',
  'delete my contact',
  'remove me from your database',
  'remove me from the database',
]

// Phase 5E: Tech-context indicators that can make ambiguous refusal patterns non-person-directed
const TECH_CONTEXT_INDICATORS = [
  'the api', 'this api', 'an api',
  'this function', 'the function', 'a function',
  'the screen share', 'screen share',
]

// Phase 5E: Person-directed signals that override tech-context suppression
const PERSON_DIRECTED_REFUSAL_SIGNALS = [
  'contact me', 'reach out to me', 'reach out again',
  'message me', 'text me', 'call me', 'calling me',
  'my number', 'my contact', 'your list', 'the calling list',
  'your database', 'the database', 'off your list', 'off list',
  'off the list', "don't contact", 'do not contact',
  "don't message", 'do not message', "don't reach out",
  'do not reach out', 'stop contacting', 'stop messaging',
  'stop reaching', 'no more calls', 'remove my',
  'delete my', 'take me off',
]

/**
 * Phase 5E: Generate family decision keywords from typed deterministic templates.
 * Uses interaction templates ("talk to my {family}") and subject templates ("my {family} has to approve")
 * to produce auditable, grammatically valid combinations with symmetric family coverage.
 */
function generateFamilyDecisionKeywords(): string[] {
  const familyNouns = ['parents', 'parent', 'wife', 'husband', 'spouse', 'father', 'mother', 'family']
  const keywords: string[] = []

  // Interaction templates: "... my {family}"
  const interactionPrefixes = [
    'talk to my', 'talk with my', 'talking to my',
    'discuss with my', 'discuss it with my', 'discuss them with my',
    'ask my', 'check with my',
  ]
  for (const prefix of interactionPrefixes) {
    for (const noun of familyNouns) {
      keywords.push(`${prefix} ${noun}`)
    }
  }

  // Family-as-subject templates: "my {family} ..."
  // Include both singular and plural verb forms for coverage
  const subjectSuffixes = [
    'has to approve', 'have to approve',
    'needs to approve', 'need to approve',
    'needs to agree', 'need to agree',
    'wants to review', 'want to review',
    'wants to decide', 'want to decide',
    'handles these decisions', 'handle these decisions',
    'handles the decision', 'handle the decision',
    'will decide',
    "won't agree", 'wont agree',
    "won't approve", 'wont approve',
  ]
  for (const noun of familyNouns) {
    for (const suffix of subjectSuffixes) {
      keywords.push(`my ${noun} ${suffix}`)
    }
  }

  // Context/noun templates (separately scoped)
  for (const noun of familyNouns) {
    keywords.push(`${noun} approval`)
    keywords.push(`${noun} permission`)
  }
  keywords.push('family decision')

  return [...new Set(keywords)] // deduplicate
}

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
    // Phase 5E: Tech-context local guard (Correction #2)
    // Only suppress when ALL matched refusal wording targets a technical object
    // and no independent person-directed DNC statement exists
    const hasTechContext = TECH_CONTEXT_INDICATORS.some((t) => text.includes(t))
    if (hasTechContext) {
      const hasPersonDirected = PERSON_DIRECTED_REFUSAL_SIGNALS.some((p) => text.includes(p))
      if (!hasPersonDirected) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
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
        // Phase 5E: Sales-object coverage expansion
        'the premium package',
        'your elite plan',
        'this placement service',
        'this opportunity',
        'continuing',
        'proceeding',
      ]
      const hasAllowedTarget = allowedTargets.some((target) => text.includes(`not interested in ${target}`))
      if (!hasAllowedTarget) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
    }
  }

  // 3. Parents / Spouse Approval Decision Context Guard (Phase 5E Symmetric Family Coverage)
  if (categoryId === 'parents-spouse-approval') {
    const familyWords = ['parents', 'parent', 'spouse', 'husband', 'wife', 'father', 'mother', 'family']
    const hasFamilyWord = familyWords.some((w) => text.includes(w))
    if (hasFamilyWord) {
      // Decision verbs/concepts that signal family-approval context
      // Loose 'need' excluded per Phase 5D.1 ("My spouse needs a vacation" stays NOT family approval)
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
        'want to',
        'won\'t',
        'wont',
        'check with',
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

  // 6. Need-Time-To-Think Non-Sales Task Guard (Phase 5E: Correction #3 — preserve genuine sales delay)
  if (categoryId === 'need-time-to-think') {
    const nonSalesTimeTerms = [
      'finish my assignment',
      'complete my project',
      'time to cook',
      'interview time',
      'call time',
      // Phase 5E near-miss expansion
      'finish my coding assessment',
      'finish the assessment',
      'interview is next month',
      'call lasts',
      'lasts five minutes',
      'few days to complete the project',
      'few days to complete',
    ]
    if (nonSalesTimeTerms.some((t) => text.includes(t))) {
      // Correction #3: Only suppress if no independent genuine sales-delay signal co-exists
      const genuineDelaySignals = [
        'call me after', 'call me after that', 'call after that', 'call me next', 'reach out next', 'reach out after',
        'then decide', "then i'll decide", "then i\'ll decide",
        'get back to you', 'think about your program', 'think about this program',
        'decide about your program', 'decide about this',
        'talk next month', 'circle back',
        'decide later', 'think about it',
        "i'll decide", "i\'ll decide",
      ]
      const hasGenuineDelay = genuineDelaySignals.some((d) => text.includes(d))
      if (!hasGenuineDelay) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
    }
  }

  // 7. Upfront-Payment Resistance Non-Program Context Guard (Section 14)
  if (categoryId === 'upfront-payment-resistance') {
    const nonProgramPaymentTerms = ['laptop', 'apartment', 'electricity bill', 'rent']
    if (nonProgramPaymentTerms.some((t) => text.includes(t))) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }
  }

  // 8. Price-Objection Factual/Informational Guard (Phase 5E Section 15)
  if (categoryId === 'price-objection') {
    const factualPricePatterns = [
      'what is the price', 'what is the cost', 'what is the fee',
      'what does the fee', 'what does the price', 'what does the cost',
      'what are the fees', 'what are the costs',
      'send me the price', 'send the price',
      'has a price field', 'has a cost field', 'has a fee field',
      'returns a price', 'returns a cost',
      'price field', 'cost field',
      'pricing issue in the database', 'pricing issue in the',
      'training budget', 'project budget',
      'the database has a price', 'the product has a pricing',
    ]
    const isFactualContext = factualPricePatterns.some((p) => text.includes(p))
    if (isFactualContext) {
      const genuinePriceObjectionMarkers = [
        'too expensive', 'too much', 'too high', 'too low',
        'can\'t afford', 'cannot afford', 'can\'t spend', 'cannot spend',
        'outside my budget', 'don\'t have the budget', 'don\'t have the money',
        'do not have the budget', 'do not have the money',
        'no budget', 'financially difficult', 'expensive',
      ]
      const hasGenuineObjection = genuinePriceObjectionMarkers.some((m) => text.includes(m))
      if (!hasGenuineObjection) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
    }
  }

/**
 * Helper to match phrases with word-boundary awareness.
 * Prevents "prove this" from matching inside "approve this" or "improve this".
 */
function hasBoundaryMatch(text: string, phrase: string): boolean {
  const pLower = phrase.toLowerCase().trim()
  const escaped = pLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i')
  return regex.test(text)
}

  // 9. Trust-and-Credibility Neutral Context Guard (Phase 5E Section 19 & Phase 5F Word-Boundary Safety)
  if (categoryId === 'trust-and-credibility') {
    // Non-program guarantee/delivery exclusions ("Can you guarantee delivery by Friday?")
    const nonProgramTerms = ['delivery', 'shipping', 'uptime', 'flight', 'address']
    if (nonProgramTerms.some((t) => text.includes(t))) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }

    const trustQuestioningContext = [
      'scam', 'scammed', 'cheat', 'cheated', 'fraud',
      'fake', 'legit', 'legitimate', 'genuine',
      'don\'t trust', 'do not trust', 'dont trust',
      'is this real', 'is it real', 'are real',
      'how do i know', 'can you prove', 'prove this', 'prove that',
      'bad experience', 'trust consultancies', 'trust placement',
      'isn\'t a scam', 'is it a scam',
      'fake placement', 'success stories',
      'real recruiters', 'real success',
      'proof that', 'proof this', 'need proof before', 'need proof of placement', 'need proof of results',
      'placement guarantee', 'job guarantee', 'guarantee me', 'guarantee a job',
      'guarantee placement', 'guarantee placements', 'guarantee results', 'guarantee interview',
      'placements are real',
    ]

    // Boundary-safe checking: collision-prone phrases ("prove this", "prove that", "proof this")
    // must not match inside larger words like "approve this" or "improve this"
    const collisionPhrases = ['prove this', 'prove that', 'proof this', 'proof that']

    const hasTrustContext = trustQuestioningContext.some((t) => {
      if (collisionPhrases.includes(t)) {
        return hasBoundaryMatch(text, t)
      }
      return text.includes(t)
    })

    if (!hasTrustContext) {
      return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
    }
  }

  // 10. Already-Working-With-Consultancy Employment Context Guard (Phase 5E Section 28)
  if (categoryId === 'already-working-with-consultancy') {
    const employmentContext = [
      'i work at a consultancy',
      'i work at a consulting',
      'i work for a consultancy',
      'i work for a consulting',
      'applying to consulting',
      'applying to consultancies',
      'my company has internal',
      'internal recruiters',
    ]
    const isEmploymentContext = employmentContext.some((e) => text.includes(e))
    if (isEmploymentContext) {
      // Check if there's also a genuine "engaged with another service" signal
      const genuineConsultancySignals = [
        'another consultancy', 'another recruiter', 'another service',
        'another company', 'enrolled somewhere else', 'paid another',
        'hired a recruiter', 'placement agency', 'another agency',
        'using another placement', 'hired someone for',
      ]
      const hasGenuineSignal = genuineConsultancySignals.some((s) => text.includes(s))
      if (!hasGenuineSignal) {
        return { categoryId, providerScore: 0, vectorScore: 0, keywordScore: 0 }
      }
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
    'explicit-refusal': [
      'stop calling', 'remove number', 'do not contact', 'stop contact',
      'off your list', 'dont call', 'do not call', 'stop messaging',
      // Phase 5E DNC keyword expansion
      'stop reaching out', 'reach out again', 'reach out to me',
      'stop texting', 'text me anymore', 'text me again',
      'no more calls', 'calling list', 'delete my contact',
      'remove me from your database', 'remove me from the database',
    ],
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
      // Phase 5E coverage
      'pay before results',
      'pay before getting placed',
      'paying anything upfront',
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
      // Phase 5E coverage expansion
      'email me the agreement',
      'send me the pricing breakdown',
      'send me the brochure',
      'send me the proposal',
      'send me the plan details',
      'send me the information',
      'send me everything in writing',
      'email me the details',
      'email the pricing',
      'email pricing',
      'send the pricing',
    ],
    'price-objection': [
      'expensive',
      'can\'t afford',
      'cannot afford',
      'too much money',
      'don\'t have the money',
      'no budget',
      'low budget',
      'outside my budget',
      'can\'t spend that much',
      'cannot spend that much',
      'can\'t spend this much',
      'cannot spend this much',
      'why is it so expensive',
      'too expensive',
      'too high',
      'too much',
      'too low',
      'costs too much',
      'financially difficult',
      'budget is tight',
      'price is high',
      // Phase 5E: Removed bare 'cost', 'price', 'fee', 'budget', 'discount'
      // to prevent factual/informational false positives.
      // Kept in genuine objection forms above.
      'discount',
      // Phase 5F narrow price coverage
      'don\'t want another fee',
      'do not want another fee',
      'dont want another fee',
      'budget is limited',
      'my budget is limited',
    ],
    'trust-and-credibility': [
      'trust',
      'scam',
      'legit',
      'fake',
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
      // Phase 5E: Removed bare 'guarantee', 'proof', 'real', 'reviews'
      // to prevent neutral false positives. Kept specific compound forms.
      'prove this',
      'prove that',
      'proof that',
      'proof this',
      'need proof before',
      'need proof of placement',
      'proof before paying',
      'placement guarantee',
      'job guarantee',
      'guarantee me',
      'guarantee a job',
      'bad experience',
      'legitimate',
      'placements are real',
      'real success',
      'can you prove',
      'how do i know',
      // Phase 5F guarantee verb phrase additions
      'guarantee placement',
      'guarantee placements',
      'guarantee results',
      'guarantee interview',
      'guarantee interview calls',
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
      // Phase 5E time/delay expansion
      'give me a few days',
      'give me some days',
      'then decide',
      'think about your program',
      'think about this program',
      'talk next month',
      'see how things go',
      'circle back',
      'reach out next month',
      'call me after that',
      'call after that',
      'busy today',
      'occupied today',
      // Phase 5F time additions
      'decide next week',
      'decide next month',
      'i\'ll decide next week',
      'i\'ll decide next month',
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
      // Phase 5E: compound DIY+time support
      'try myself for another',
      'apply myself for',
      'keep applying myself',
      'manage the job search myself',
      'continue on my own',
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
      // Phase 5E consultancy synonym expansion
      'hired a recruiter',
      'placement agency',
      'marketing my profile',
      'another career service',
      'contract with another',
      'another agency',
      'enrolled elsewhere',
    ],
    // Phase 5E: Use generated family decision keywords from deterministic templates
    'parents-spouse-approval': generateFamilyDecisionKeywords(),
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
      // Phase 5E: sales-object coverage expansion
      'not interested in the premium package',
      'not interested in your elite plan',
      'not interested in this placement service',
      'not interested in this opportunity',
      'not interested in continuing',
      'not interested in proceeding',
    ],
  }

  const collisionPhrases = ['prove this', 'prove that', 'proof this', 'proof that']
  const categoryKeywords = keywordsMap[categoryId] || []
  for (const kw of categoryKeywords) {
    const kwLower = kw.toLowerCase()
    const matches = collisionPhrases.includes(kwLower)
      ? hasBoundaryMatch(text, kwLower)
      : text.includes(kwLower)
    if (matches) {
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

  // Step 2: Deterministic Hard Refusal Pre-Check (Phase 5E: with local tech-context guard)
  const isHardRefusalPattern = HARD_REFUSAL_PATTERNS.some((pat) => text.includes(pat))
  let isPersonDirectedRefusal = isHardRefusalPattern
  if (isHardRefusalPattern) {
    // Phase 5E Correction #2: Only suppress when refusal wording targets a technical object
    // AND no independent person-directed DNC statement exists in the same text
    const hasTechContext = TECH_CONTEXT_INDICATORS.some((t) => text.includes(t))
    if (hasTechContext) {
      const hasPersonDirected = PERSON_DIRECTED_REFUSAL_SIGNALS.some((p) => text.includes(p))
      if (!hasPersonDirected) {
        isPersonDirectedRefusal = false
      }
    }
  }
  if (isPersonDirectedRefusal) {
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

  // Step 4.5: Phase 5E Substantive-Over-Soft-Not-Interested Ranking Rule (Correction #4)
  // When primary is soft not-interested and a substantive valid signal exists,
  // promote the highest-scoring substantive category to primary.
  // NOT sort-order dependent — explicit deterministic rule.
  if (selectedCategoryId === 'not-interested') {
    const substantiveSignals = validSignals
      .filter((s) => s.categoryId !== 'not-interested' && s.categoryId !== 'explicit-refusal' && s.providerScore > 0.35)
      .sort((a, b) => b.providerScore - a.providerScore)
    if (substantiveSignals.length > 0) {
      selectedCategoryId = substantiveSignals[0].categoryId
    }
  }

  // Step 4.6: Phase 5F Product Owner Rule for Competitor Payment + Fee Concern (Section 1, 18)
  // "I already paid another company, so I don't want another fee."
  // Competitor commitment is primary, fee objection is secondary.
  if (
    (text.includes('already paid another company') || text.includes('already paid another')) &&
    validSignals.some((s) => s.categoryId === 'already-working-with-consultancy')
  ) {
    selectedCategoryId = 'already-working-with-consultancy'
  }

  // Step 5: Repeated Soft-Refusal Escalation Check (Section 7)
  if (
    options.previousObjectionId === 'not-interested' &&
    selectedCategoryId === 'not-interested'
  ) {
    selectedCategoryId = 'explicit-refusal'
  }

  const primaryCategory = COPILOT_OBJECTION_CATEGORIES[selectedCategoryId] || COPILOT_OBJECTION_CATEGORIES['explicit-refusal']

  // Step 6: Extract Secondary Objections for Compound Statements (Phase 5F Fix #2)
  const secondaryObjections: SecondaryObjectionInfo[] = []
  if (primaryCategory.id !== 'explicit-refusal') {
    const sortedSignals = [...validSignals].sort((a, b) => b.providerScore - a.providerScore)
    if (sortedSignals.length > 1) {
      const topScore = sortedSignals[0].providerScore
      for (const signal of sortedSignals) {
        if (
          signal.categoryId !== primaryCategory.id &&
          signal.categoryId !== 'explicit-refusal' &&
          topScore - signal.providerScore <= 0.35
        ) {
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
