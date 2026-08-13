/**
 * Sales Copilot — Objection Taxonomy & Category Metadata
 *
 * Grounded in docs/OBJECTION_INTELLIGENCE_LIBRARY.md and content/docs/objections/.
 *
 * NOTE: This file stores TAXONOMY METADATA ONLY (definitions, common phrases,
 * hidden concern patterns, prohibited patterns, strategy explanations, and next questions).
 *
 * It DOES NOT store advisor response text or sales scripts. All script responses
 * are read live from `lib/scripts-registry.ts` via `lib/copilot/scripts-library-adapter.ts`.
 */

export interface ObjectionCategoryMetadata {
  id: string
  name: string
  description: string
  examplePhrases: string[]
  hiddenConcernPatterns: string[]
  prohibitedResponsePatterns: string[]
  mappingScriptIds: string[]
  whyItWorks: string
  defaultNextQuestion: string
}

export const COPILOT_OBJECTION_CATEGORIES: Record<string, ObjectionCategoryMetadata> = {
  'price-objection': {
    id: 'price-objection',
    name: 'Price / Investment Concern',
    description: 'Candidate hesitates over program fees, payment structure, or overall investment requirement.',
    examplePhrases: [
      "It's too expensive",
      "I don't have the budget right now",
      "The fee is higher than I expected",
      "Can I get a discount?",
      "It's too expensive for my budget",
      "I have no budget right now",
      "too expensive",
      "I can't afford that",
      "I cannot afford that",
      "I don't have the money right now",
      "My budget is very low",
      "This is outside my budget",
      "I can't spend that much",
      "I cannot spend that much",
      "Why is it so expensive?",
    ],
    hiddenConcernPatterns: [
      'Fear of unrecovered investment',
      'Unsure if career salary lift offsets program fee',
      'Comparing program to low-cost self-serve courses',
    ],
    prohibitedResponsePatterns: [
      "Don't offer unauthorized discounts or price concessions.",
      "Don't apologize for our program pricing.",
      "Don't make unverified placement refund promises.",
    ],
    mappingScriptIds: [
      '/docs/objections/price-objection#roleplay-1',
      '/docs/objections/price-objection#roleplay-2',
      '/docs/objections/price-objection#roleplay-3',
    ],
    whyItWorks:
      'Reframes program fee from a sunk expense into an asset-backed career investment with measurable ROI timelines.',
    defaultNextQuestion:
      'If budget wasn\'t a constraint, do you feel this is the exact skill transformation you need right now?',
  },

  'upfront-payment-resistance': {
    id: 'upfront-payment-resistance',
    name: 'Upfront Payment Resistance',
    description: 'Candidate objects specifically to paying an upfront fee before job outcome or placement.',
    examplePhrases: [
      "I don't want to pay any upfront",
      "I won't pay before I get a job",
      "I'll pay after placement",
      "Pay after placement only",
      "I don't want to pay before I get placed",
      "Can I pay once I get a job?",
      "I don't want to take the risk upfront",
      "I don't want to pay any upfront.",
      "I'll pay once I get placed",
      "pay after placement",
      "pay once placed",
      "pay when I get a job",
      "No advance payment from my side",
      "I won't make an advance payment",
      "I don't want to risk money before getting results",
      "I don't want to pay before getting results",
      "I only pay after I join",
      "I'll pay after I get a job",
      "I'll pay once I start earning",
      "Why should I pay before getting placed?",
      "Can I pay after placement?",
    ],
    hiddenConcernPatterns: [
      'Risk aversion regarding paying before job placement',
      'Desire for deferred outcome-based payment model',
      'Uncertainty about active mentorship value prior to hire',
    ],
    prohibitedResponsePatterns: [
      "Don't offer unauthorized pay-after-placement or zero-upfront deals.",
      "Don't promise Income Share Agreements (ISAs) or unapproved refund guarantees.",
      "Don't invent unauthorized discounts to bypass upfront payment policy.",
    ],
    mappingScriptIds: [
      '/docs/objections/upfront-payment-resistance#roleplay-1',
      '/docs/objections/upfront-payment-resistance#roleplay-2',
      '/docs/objections/upfront-payment-resistance#roleplay-3',
    ],
    whyItWorks:
      'Differentiates dedicated 1-on-1 mentorship resources from commission recruiters and offers approved installment structures for upfront enrollment.',
    defaultNextQuestion:
      'Would looking at an installment schedule for the upfront fee help make this manageable for you?',
  },

  'information-request-deferral': {
    id: 'information-request-deferral',
    name: 'Information Request Deferral',
    description: 'Candidate requests written details (email, WhatsApp, brochure) to review offline.',
    examplePhrases: [
      "Can you please email me the details so that I can review them and get back to you?",
      "Can you email me the details?",
      "Send me the details",
      "Mail me something",
      "Can you send me information?",
      "Let me review it and get back to you",
      "Send it to me and I'll check",
      "Text me the details",
      "I'll review the information later",
      "send me something",
      "mail me details",
      "I'll check and tell you",
      "email me the details",
      "Send me everything on WhatsApp",
      "Send me the pricing first",
      "Send me the agreement",
      "Send me the information",
      "Share the information and I'll decide",
      "I'll go through the information",
      "Send me something to review",
      "I want everything written first",
    ],
    hiddenConcernPatterns: [
      'Feeling overwhelmed or rushed on live call',
      'Desire to evaluate details independently',
      'Polite attempt to move conversation off live call',
    ],
    prohibitedResponsePatterns: [
      "Don't refuse to send requested written information.",
      "Don't dump generic uncustomized email blasts.",
      "Don't pressure the candidate to stay on call when they explicitly defer.",
    ],
    mappingScriptIds: [
      '/docs/objections/information-request-deferral#roleplay-1',
      '/docs/objections/information-request-deferral#roleplay-2',
      '/docs/objections/information-request-deferral#roleplay-3',
    ],
    whyItWorks:
      'Agrees to candidate information requests promptly while diagnosing specific focus areas to keep the evaluation productive.',
    defaultNextQuestion:
      'To make sure I include the exact details most relevant to you, what specific area are you hoping to review—mentorship, placement, or installment options?',
  },

  'trust-and-credibility': {
    id: 'trust-and-credibility',
    name: 'Trust / Program Clarity',
    description: 'Candidate questions program legitimacy, placement statistics, or company credibility.',
    examplePhrases: [
      'How do I know this isn\'t a scam?',
      'How do I know your company is real?',
      'Is your company legit?',
      'Can you guarantee me a job?',
      'How many students actually get hired?',
      'Is there proof your placement rate is real?',
      'I got scammed already',
      'how do I know this is real?',
      'How do I know this is genuine?',
      'I was scammed before',
      'I\'ve been cheated by agencies before',
      'I don\'t trust consultancies',
      'Can you prove this works?',
      'How do I know your recruiters are real?',
      'I have seen fake placement companies',
      'Is this legit?',
      'Do you have real success stories?',
    ],
    hiddenConcernPatterns: [
      'Prior bad experience with recruitment consultancies',
      'Fear of false guarantees or fake promises',
      'Need for verified candidate testimonials and placement proof',
    ],
    prohibitedResponsePatterns: [
      "Don't make 100% placement guarantees or timeframe promises.",
      "Don't invent success statistics or fake client claims.",
      "Don't give legal or visa guarantees.",
    ],
    mappingScriptIds: [
      '/docs/objections/trust-and-credibility#roleplay-1',
      '/docs/objections/trust-and-credibility#roleplay-2',
      '/docs/objections/trust-and-credibility#roleplay-3',
      '/docs/objections/no-guarantee-concern#roleplay-1',
    ],
    whyItWorks:
      'Establishes credibility by placing candidate outcomes, verified program structure, and transparent candidate-first values first.',
    defaultNextQuestion:
      'What specific detail about our mentorship or placement process would be most helpful to review together?',
  },

  'need-time-to-think': {
    id: 'need-time-to-think',
    name: 'Need Time To Think',
    description: 'Candidate defers decision, asking for time to think about it before enrolling.',
    examplePhrases: [
      'I want to think about it',
      'Let me call you back tomorrow',
      'I need a few days to decide',
      'I\'m not ready to make a payment today',
      'call after two weeks',
      'I\'ll think about it',
      'not now',
      'maybe later',
      'I need some time',
      'Call me next week',
      'Call me next month',
      'Not today',
      'I\'m busy right now',
      'Let me decide later',
      'I\'ll get back to you',
      'I need time to decide',
      'I\'ll decide tomorrow',
    ],
    hiddenConcernPatterns: [
      'Unresolved hidden objection (price, spouse approval, or timing)',
      'Hesitation to commit without isolating the real blocker',
      'Fear of making a hasty career decision',
    ],
    prohibitedResponsePatterns: [
      "Don't manufacture fake urgency or claim seats close today.",
      "Don't badger or pressure the candidate aggressively.",
      "Don't ignore their request for reflection.",
    ],
    mappingScriptIds: [
      '/docs/objections/need-time-to-think#roleplay-1',
      '/docs/objections/need-time-to-think#roleplay-2',
      '/docs/objections/need-time-to-think#roleplay-3',
    ],
    whyItWorks:
      'Acknowledges the candidate\'s process respectfully while isolating whether "thinking about it" is genuine reflection or a mask for hidden concerns.',
    defaultNextQuestion:
      'When you think about taking this step, what is the single biggest question still on your mind?',
  },

  'already-applying-myself': {
    id: 'already-applying-myself',
    name: 'Already Applying Myself',
    description: 'Candidate believes cold applying on job portals independently is sufficient.',
    examplePhrases: [
      'I\'m already applying on LinkedIn myself',
      'I get plenty of responses on my own',
      'Why do I need a consultancy if I can apply online?',
      'I want to try on my own for some time.',
      'I want to try on my own',
      'I\'ll try myself',
      'I\'ll apply myself first',
      'I want to see how it goes myself',
      'Give me some time to try myself',
      'I\'m already applying on LinkedIn',
      'I don\'t need help yet',
      'I\'m applying independently',
      'I want to see if I can get interviews myself',
      'let me try myself',
      'I\'m already getting interviews',
      'I\'m doing fine myself',
      'I\'m already applying myself',
      'I am already applying myself',
      'I\'m applying on my own',
      'I\'m doing applications myself',
      'I\'ll try myself first',
      'I think I can do it on my own',
      'I\'ll give myself another month',
      'I already have interviews',
      'I\'ve been doing applications myself',
      'I\'m handling the job search myself',
    ],
    hiddenConcernPatterns: [
      'Underestimating low applicant portal callback rates (<3%)',
      'Unaware of hiring manager referral networks vs cold portal applications',
    ],
    prohibitedResponsePatterns: [
      "Don't insult their current job hunt effort or resume.",
      "Don't claim cold applying never works.",
    ],
    mappingScriptIds: [
      '/docs/objections/already-applying-myself#roleplay-1',
      '/docs/objections/already-applying-myself#roleplay-2',
      '/docs/objections/already-applying-myself#roleplay-3',
    ],
    whyItWorks:
      'Contrasts low-yield direct applicant portals against structured candidate intelligence and direct hiring partner referrals.',
    defaultNextQuestion:
      'Out of your recent direct applications, how many hiring manager interviews have you secured so far?',
  },

  'already-working-with-consultancy': {
    id: 'already-working-with-consultancy',
    name: 'Already Working With a Consultancy',
    description: 'Candidate is already engaged with another program, recruiter, or consultancy.',
    examplePhrases: [
      "I'm already working with another consultancy",
      "I already have a placement company",
      "I'm already paying another service",
      "I already have someone helping me",
      "working with another consultancy",
      "already hired a consultancy",
      "already in another program",
      "I'm already working with a consultancy",
      "I have another recruiter helping me",
      "I already paid another company",
      "I'm already enrolled somewhere else",
      "Another company is doing this for me",
      "I already signed up with another service",
      "I am already using another placement company",
      "I already hired someone for my job search",
    ],
    hiddenConcernPatterns: [
      'Comparison shopping across multiple placement providers',
      'Uncertainty about program overlap or exclusivity policy',
      'Prior underwhelming experience with a competitor',
    ],
    prohibitedResponsePatterns: [
      "Don't criticize a named or unnamed competitor.",
      "Don't guess or improvise an answer on exclusivity/overlap rules.",
      "Don't make unsubstantiated claims of being objectively better.",
    ],
    mappingScriptIds: [
      '/docs/objections/already-working-with-a-consultancy#roleplay-1',
      '/docs/objections/already-working-with-a-consultancy#roleplay-2',
      '/docs/objections/already-working-with-a-consultancy#roleplay-3',
    ],
    whyItWorks:
      'Responds to competitor disclosures with genuine curiosity rather than defensiveness or comparative claims.',
    defaultNextQuestion:
      'What has that experience been like so far—anything working well, or anything that feels missing?',
  },

  'parents-spouse-approval': {
    id: 'parents-spouse-approval',
    name: 'Parent / Spouse Approval',
    description: 'Candidate needs clearance or agreement from family or financial decision-makers.',
    examplePhrases: [
      'I need to talk to my parents first',
      'My spouse handles our financial decisions',
      'I can\'t enroll until my family agrees',
      'my parents won\'t agree',
      'I need to talk to my parents',
      'My father will decide',
      'I need to discuss it with my husband',
      'I need to ask my wife',
      'My family won\'t agree',
      'My parents need to approve this',
      'My father wants to review it',
    ],
    hiddenConcernPatterns: [
      'Family risk aversion regarding career investments',
      'Candidate needs structured data to present to family decision-maker',
    ],
    prohibitedResponsePatterns: [
      "Don't tell the candidate 'You are an adult, decide for yourself'.",
      "Don't dismiss the role of family in career decisions.",
    ],
    mappingScriptIds: [
      '/docs/objections/parents-spouse-approval#roleplay-1',
      '/docs/objections/parents-spouse-approval#roleplay-2',
      '/docs/objections/parents-spouse-approval#roleplay-3',
    ],
    whyItWorks:
      'Validates family involvement and arms the candidate with verified, objective documentation to present confidently to decision-makers.',
    defaultNextQuestion:
      'What is the main outcome or reassurance your family will be looking for when you discuss this?',
  },

  'not-interested': {
    id: 'not-interested',
    name: 'Soft Disinterest / Brush-off',
    description: 'Candidate gives a soft initial brush-off or mild disinterest expression.',
    examplePhrases: [
      "I'm not interested",
      "No thanks",
      "Nah I'm good",
      "Not right now",
      "I don't think I need this",
      "I'm okay",
      "nah I'm good",
      "not interested right now",
      "I'm not interested in this program",
      "I'm not interested in your program",
      "I'm not interested in this service",
      "I'm not interested in your service",
      "I'm not interested in this package",
      "I'm not interested in signing up",
      "I'm not interested in enrolling",
      "I'm not interested in moving forward",
      "I'm not interested in this offer",
    ],
    hiddenConcernPatterns: [
      'Reflexive initial phone call deflection',
      'Unclear value proposition or timing uncertainty',
      'Hesitation to engage in sales discussion',
    ],
    prohibitedResponsePatterns: [
      "Don't pressure, guilt, or badger the candidate.",
      "Don't use artificial urgency or claim 'you'll regret it'.",
      "Don't execute more than ONE diagnostic question probe.",
    ],
    mappingScriptIds: [
      '/docs/objections/not-interested#roleplay-1',
      '/docs/objections/not-interested#roleplay-2',
      '/docs/objections/not-interested#roleplay-3',
    ],
    whyItWorks:
      'Acknowledges candidate boundary politely and uses ONE diagnostic question to identify whether a real objection exists.',
    defaultNextQuestion:
      'Just so I don\'t keep you on the phone unnecessarily, is it mainly because you\'re handling the job search yourself, or is it about timing right now?',
  },

  'explicit-refusal': {
    id: 'explicit-refusal',
    name: 'Explicit Refusal / Do-Not-Contact',
    description: 'Candidate explicitly demands to stop calls, remove number, or firmly refuses further contact.',
    examplePhrases: [
      "Please stop calling",
      "Don't call me again",
      "Remove my number",
      "Take me off your list",
      "Do not contact me",
      "I already said I'm not interested",
      "I'm definitely not interested",
      "Don't ask me again",
      "I'm not interested and I don't want to discuss it",
      "Please stop calling me.",
      "don't call me again",
      "remove my number",
      "take me off your list",
      "Don't contact me.",
      "Do not message me again.",
      "I already told you not to call.",
      "Stop calling me.",
      "Do not call me.",
      "Do not call me again.",
      "Don't message me.",
      "Do not message me.",
      "Stop contacting me.",
      "Stop messaging me.",
      "Remove me from your list.",
      "I already said don't call me.",
    ],
    hiddenConcernPatterns: [
      'Explicit demand for contact cessation',
      'Zero openness to further dialogue',
    ],
    prohibitedResponsePatterns: [
      "DO NOT ask any secondary questions or diagnostic probes.",
      "DO NOT perform any sales pitch or persuasion.",
      "DO NOT push back or argue in any way.",
    ],
    mappingScriptIds: [
      '/docs/objections/explicit-refusal#roleplay-1',
      '/docs/objections/explicit-refusal#roleplay-2',
      '/docs/objections/explicit-refusal#roleplay-3',
    ],
    whyItWorks:
      'Acknowledges explicit candidate refusal immediately with zero persuasion, zero secondary questions, and a clean professional exit.',
    defaultNextQuestion: '',
  },
}
