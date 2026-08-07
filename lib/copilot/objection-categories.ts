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
    description: 'Candidate hesitates over program fees, payment structure, or upfront investment requirement.',
    examplePhrases: [
      "It's too expensive",
      "I don't have the budget right now",
      "The fee is higher than I expected",
      "Can I get a discount?",
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
    description: 'Candidate believes cold applying on job portals is sufficient to land interviews.',
    examplePhrases: [
      'I\'m already applying on LinkedIn myself',
      'I get plenty of responses on my own',
      'Why do I need a consultancy if I can apply online?',
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

  'parents-spouse-approval': {
    id: 'parents-spouse-approval',
    name: 'Parent / Spouse Approval',
    description: 'Candidate needs clearance or agreement from family or financial decision-makers.',
    examplePhrases: [
      'I need to talk to my parents first',
      'My spouse handles our financial decisions',
      'I can\'t enroll until my family agrees',
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
}
