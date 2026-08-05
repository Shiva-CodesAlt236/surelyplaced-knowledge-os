/**
 * Canonical sequential ordering of all Sales Academy lessons across the 8-step pathway.
 * Serves as the single source of truth for Previous Lesson, Next Lesson,
 * Previous Module, and Next Module navigation calculations in LessonViewer.
 */

export interface AcademyLessonItem {
  slug: string
  title: string
  moduleName: string
  moduleId: string
  stepNumber: number
}

export const ACADEMY_LESSON_SEQUENCE: AcademyLessonItem[] = [
  // ── Step 1: Discovery Calls ──
  { slug: "/docs/discovery/opening-the-discovery-call", title: "Opening the Discovery Call", moduleName: "Discovery Calls", moduleId: "discovery", stepNumber: 1 },
  { slug: "/docs/discovery/building-rapport", title: "Building Candidate Rapport", moduleName: "Discovery Calls", moduleId: "discovery", stepNumber: 1 },
  { slug: "/docs/discovery/understanding-candidate-goals", title: "Understanding Candidate Goals", moduleName: "Discovery Calls", moduleId: "discovery", stepNumber: 1 },
  { slug: "/docs/discovery/candidate-qualification", title: "Candidate Qualification Framework", moduleName: "Discovery Calls", moduleId: "discovery", stepNumber: 1 },
  { slug: "/docs/discovery/discovery-call-checklist", title: "Discovery Call Checklist", moduleName: "Discovery Calls", moduleId: "discovery", stepNumber: 1 },

  // ── Step 2: Discussion Calls ──
  { slug: "/docs/discussion/structuring-the-discussion-call", title: "Structuring the Discussion Call", moduleName: "Discussion Calls", moduleId: "discussion", stepNumber: 2 },
  { slug: "/docs/discussion/presenting-surely-placed", title: "Presenting Surely Placed Solutions", moduleName: "Discussion Calls", moduleId: "discussion", stepNumber: 2 },
  { slug: "/docs/discussion/explaining-the-process", title: "Explaining the Delivery Process", moduleName: "Discussion Calls", moduleId: "discussion", stepNumber: 2 },
  { slug: "/docs/discussion/discussing-investment", title: "Discussing Investment & ROI", moduleName: "Discussion Calls", moduleId: "discussion", stepNumber: 2 },
  { slug: "/docs/discussion/discussion-call-checklist", title: "Discussion Call Checklist", moduleName: "Discussion Calls", moduleId: "discussion", stepNumber: 2 },

  // ── Step 3: Closing Calls ──
  { slug: "/docs/closing/asking-for-the-commitment", title: "Asking for the Commitment", moduleName: "Closing Calls", moduleId: "closing", stepNumber: 3 },
  { slug: "/docs/closing/handling-final-hesitation", title: "Handling Final Hesitation", moduleName: "Closing Calls", moduleId: "closing", stepNumber: 3 },
  { slug: "/docs/closing/decision-to-enrollment", title: "Decision to Enrollment", moduleName: "Closing Calls", moduleId: "closing", stepNumber: 3 },
  { slug: "/docs/closing/payment-and-agreement-process", title: "Payment & Agreement Process", moduleName: "Closing Calls", moduleId: "closing", stepNumber: 3 },
  { slug: "/docs/closing/closing-call-checklist", title: "Closing Call Checklist", moduleName: "Closing Calls", moduleId: "closing", stepNumber: 3 },

  // ── Step 4: Objection Handling ──
  { slug: "/docs/objections/objection-handling-framework", title: "Objection Handling Framework", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/price-objection", title: "Price & Budget Objections", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/need-time-to-think", title: "Need Time to Think Objections", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/parents-spouse-approval", title: "Spouse & Family Approval Objections", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/already-working-with-a-consultancy", title: "Existing Consultancy Objections", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/already-applying-myself", title: "Applying Myself Objections", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/no-guarantee-concern", title: "No Guarantee Concerns", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/trust-and-credibility", title: "Trust & Credibility Objections", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },
  { slug: "/docs/objections/objection-handling-checklist", title: "Objection Handling Checklist", moduleName: "Objection Handling", moduleId: "objections", stepNumber: 4 },

  // ── Step 5: Pricing & Investment ──
  { slug: "/docs/pricing/investment-psychology", title: "Investment Psychology", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/presenting-investment-confidently", title: "Presenting Investment Confidently", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/roi-conversations", title: "ROI & Career Impact Conversations", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/handling-price-objections", title: "Handling Price Objections", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/financial-decision-makers", title: "Engaging Financial Decision Makers", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/discount-guidelines", title: "Discount & Concession Guidelines", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/payment-conversations", title: "Payment Plan Conversations", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/pricing-red-flags", title: "Pricing Red Flags & Warnings", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },
  { slug: "/docs/pricing/pricing-playbook-checklist", title: "Pricing Playbook Checklist", moduleName: "Pricing & Value", moduleId: "pricing", stepNumber: 5 },

  // ── Step 6: Sales Coaching & Case Studies ──
  { slug: "/docs/sales-coaching/reading-a-sales-conversation", title: "Reading a Sales Conversation", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/coach-review-framework", title: "Coach Review Framework", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/call-self-review-checklist", title: "Call Self-Review Checklist", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/common-sales-mistakes", title: "Common Sales Mistakes", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/price-negotiation-case-study", title: "Case Study: Price Negotiation", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/consultancy-comparison-case-study", title: "Case Study: Consultancy Comparison", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/composite-case-study-healthcare", title: "Case Study: Healthcare Candidate", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/composite-case-study-supply-chain", title: "Case Study: Supply Chain Candidate", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/composite-case-study-opt-software-engineer", title: "Case Study: OPT Software Engineer", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },
  { slug: "/docs/sales-coaching/sales-coaching-checklist", title: "Sales Coaching Checklist", moduleName: "Sales Coaching", moduleId: "sales-coaching", stepNumber: 6 },

  // ── Step 7: Sales Constitution ──
  { slug: "/docs/sales-constitution/advisor-mindset", title: "Advisor Mindset & Identity", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/what-we-believe", title: "What We Believe", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/trust-before-technique", title: "Trust Before Technique", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/candidate-first-selling", title: "Candidate-First Selling", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/consultative-selling-framework", title: "Consultative Selling Framework", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/ethical-selling", title: "Ethical Selling Mandates", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/things-we-never-say", title: "Things We Never Say", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/decision-making-principles", title: "Decision Making Principles", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/surely-placed-differentiation", title: "Surely Placed Differentiation", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },
  { slug: "/docs/sales-constitution/sales-constitution-checklist", title: "Sales Constitution Checklist", moduleName: "Sales Constitution", moduleId: "sales-constitution", stepNumber: 7 },

  // ── Step 8: Complete Sales Call Walkthrough (Graduate Step) ──
  { slug: "/docs/sales-coaching/complete-sales-call-walkthrough", title: "Complete Sales Call Walkthrough", moduleName: "Sales Academy Graduation", moduleId: "complete-call", stepNumber: 8 },
]

export function getLessonNavigation(currentSlug: string) {
  const normalized = currentSlug.endsWith('/') ? currentSlug.slice(0, -1) : currentSlug
  const idx = ACADEMY_LESSON_SEQUENCE.findIndex((item) => item.slug === normalized)

  if (idx === -1) {
    return {
      current: null,
      prevLesson: null,
      nextLesson: null,
      prevModule: null,
      nextModule: null,
      currentPosition: 0,
      totalCount: ACADEMY_LESSON_SEQUENCE.length,
    }
  }

  const current = ACADEMY_LESSON_SEQUENCE[idx]
  const prevLesson = idx > 0 ? ACADEMY_LESSON_SEQUENCE[idx - 1] : null
  const nextLesson = idx < ACADEMY_LESSON_SEQUENCE.length - 1 ? ACADEMY_LESSON_SEQUENCE[idx + 1] : null

  // Find previous module's first lesson
  const prevModuleIdx = ACADEMY_LESSON_SEQUENCE.findLastIndex((item) => item.moduleId !== current.moduleId && ACADEMY_LESSON_SEQUENCE.indexOf(item) < idx)
  const prevModule = prevModuleIdx !== -1 ? ACADEMY_LESSON_SEQUENCE.find((item) => item.moduleId === ACADEMY_LESSON_SEQUENCE[prevModuleIdx].moduleId) : null

  // Find next module's first lesson
  const nextModule = ACADEMY_LESSON_SEQUENCE.find((item) => item.moduleId !== current.moduleId && ACADEMY_LESSON_SEQUENCE.indexOf(item) > idx) ?? null

  return {
    current,
    prevLesson,
    nextLesson,
    prevModule,
    nextModule,
    currentPosition: idx + 1,
    totalCount: ACADEMY_LESSON_SEQUENCE.length,
  }
}
