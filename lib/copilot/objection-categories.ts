export interface ObjectionCategoryDefinition {
  id: string
  name: string
  description: string
  keywords: string[]
  prohibitedPatterns: string[]
  hiddenConcernSignals: string[]
  scriptTags: string[]
  defaultLessonSlug?: string
}

export const OBJECTION_CATEGORIES: ObjectionCategoryDefinition[] = [
  {
    id: 'OBJ_THINK_ABOUT_IT',
    name: 'Need Time To Think / Delayed Decision',
    description: 'Candidate hesitates to commit immediately, expressing a desire to ponder or delay.',
    keywords: [
      'think about it',
      'think it over',
      'decide tomorrow',
      'sleep on it',
      'need time',
      'not ready yet',
      'let you know later',
      'hold off',
      'give me a day'
    ],
    prohibitedPatterns: [
      'What is there to think about?',
      'Why wait when you can start now?',
      'If you leave today the offer expires.'
    ],
    hiddenConcernSignals: [
      'Fear of failure',
      'Unspoken price objection',
      'Lack of internal conviction'
    ],
    scriptTags: ['thinking-over', 'decision-delay', 'objections'],
    defaultLessonSlug: '/docs/objections/overview'
  },
  {
    id: 'OBJ_TOO_EXPENSIVE',
    name: 'Price / Budget Concern',
    description: 'Candidate expresses hesitation over program fees or upfront investment.',
    keywords: [
      'too expensive',
      "can't afford",
      'costs too much',
      'high price',
      'no money',
      'budget issue',
      'out of my budget',
      'price is high'
    ],
    prohibitedPatterns: [
      'I can give you a 50% discount right now.',
      'We are cheaper than any competitor.',
      'Money shouldn\'t matter for your career.'
    ],
    hiddenConcernSignals: [
      'Unsure of ROI',
      'Risk aversion',
      'Cash flow limitations'
    ],
    scriptTags: ['price', 'pricing', 'roi', 'budget'],
    defaultLessonSlug: '/docs/pricing/overview'
  },
  {
    id: 'OBJ_JOB_GUARANTEE',
    name: 'Trust / Placement Guarantee Concern',
    description: 'Candidate demands job guarantees or questions organizational legitimacy.',
    keywords: [
      'guarantee a job',
      'guarantee placement',
      'job guarantee',
      "what if i don't get a job",
      'is it guaranteed',
      'promise a job',
      'how do i know this works'
    ],
    prohibitedPatterns: [
      '100% placement guaranteed.',
      'We guarantee you will be hired in 30 days.',
      'No one ever fails our program.'
    ],
    hiddenConcernSignals: [
      'Past bad experience with consultancies',
      'Skepticism of placement promises',
      'Need for accountability'
    ],
    scriptTags: ['trust', 'guarantee', 'proof', 'results'],
    defaultLessonSlug: '/docs/objections/overview'
  },
  {
    id: 'OBJ_TALK_TO_PARENTS',
    name: 'Family / Spouse / Advisor Approval',
    description: 'Candidate requires external approval from parents, spouse, or family members.',
    keywords: [
      'talk to my parents',
      'discuss with my spouse',
      'ask my husband',
      'ask my wife',
      'consult my family',
      'parents approval',
      'discuss with parents'
    ],
    prohibitedPatterns: [
      'You are an adult, why do you need your parents\' permission?',
      'Don\'t tell them until after you enroll.',
      'They don\'t understand tech anyway.'
    ],
    hiddenConcernSignals: [
      'Financial dependence',
      'Fear of family disapproval',
      'Shared decision-making structure'
    ],
    scriptTags: ['family', 'spouse', 'parents', 'decision-maker'],
    defaultLessonSlug: '/docs/objections/overview'
  },
  {
    id: 'OBJ_SELF_STUDY',
    name: 'DIY / Self-Study Alternative',
    description: 'Candidate believes they can achieve placement independently via free resources.',
    keywords: [
      'apply on my own',
      'do it myself',
      'free resources',
      'self study',
      "don't need help",
      'youtube tutorials',
      'apply directly'
    ],
    prohibitedPatterns: [
      'Self-study never works.',
      'You will fail on your own.',
      'YouTube is useless.'
    ],
    hiddenConcernSignals: [
      'Underestimating hiring difficulty',
      'Pride in independence',
      'Reluctance to invest'
    ],
    scriptTags: ['self-study', 'diy', 'applying-myself', 'independent'],
    defaultLessonSlug: '/docs/objections/overview'
  }
]

export function getCategoryById(id: string): ObjectionCategoryDefinition | undefined {
  return OBJECTION_CATEGORIES.find((cat) => cat.id === id)
}
