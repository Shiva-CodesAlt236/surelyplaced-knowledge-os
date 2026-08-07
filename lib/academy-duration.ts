/**
 * Single source of truth for Sales Academy durations (in minutes).
 *
 * Derived from the authored module overview pages and lesson specifications:
 * - Discovery Calls: 90 min (5 lessons)
 * - Discussion Calls: 100 min (5 lessons)
 * - Closing Calls: 87 min (5 lessons)
 * - Objection Handling: 156 min (9 lessons)
 * - Pricing & Investment: 158 min (9 lessons)
 * - Sales Coaching & Case Studies: 205 min (10 lessons)
 * - Sales Constitution: 180 min (10 lessons)
 * Total Core Academy: 976 minutes (~16.3 hours)
 *
 * Note: Complete Sales Call Walkthrough (30 min) is a capstone/graduation step
 * intentionally treated outside the core academy 7-module total.
 *
 * Note on Sales Coaching: The lesson-level durations sum to 172 min for the 10 lessons.
 * The module-level Overview total of 205 min includes the 33 min graduation walkthrough.
 */

export const MODULE_DURATIONS: Record<string, number> = {
  discovery: 90,
  discussion: 100,
  closing: 87,
  objections: 156,
  pricing: 158,
  'sales-coaching': 205,
  'sales-constitution': 180,
  'complete-call': 30,
}

// Fix 4: Programmatically derive total core academy minutes (excluding capstone complete-call)
const CORE_MODULE_KEYS = [
  'discovery',
  'discussion',
  'closing',
  'objections',
  'pricing',
  'sales-coaching',
  'sales-constitution',
]

export const TOTAL_ACADEMY_MINUTES = CORE_MODULE_KEYS.reduce(
  (sum, key) => sum + (MODULE_DURATIONS[key] ?? 0),
  0
)

export const TOTAL_ACADEMY_HOURS = Math.round((TOTAL_ACADEMY_MINUTES / 60) * 10) / 10

/**
 * Authored reading/practice duration (in minutes) per lesson and overview slug.
 * Exact sums of readingMinutes + practiceMinutes from each lesson's authored <EstimatedTime> widget.
 */
export const LESSON_DURATIONS: Record<string, number> = {
  // ── Fix 1: Module Overview Slugs ──
  '/docs/discovery/overview': 90,
  '/docs/discussion/overview': 100,
  '/docs/closing/overview': 87,
  '/docs/objections/overview': 156,
  '/docs/pricing/overview': 158,
  '/docs/sales-coaching/overview': 205,
  '/docs/sales-constitution/overview': 180,

  // ── Fix 2: Discovery Calls (90 min total) ──
  '/docs/discovery/opening-the-discovery-call': 22,
  '/docs/discovery/building-rapport': 18,
  '/docs/discovery/understanding-candidate-goals': 18,
  '/docs/discovery/candidate-qualification': 18,
  '/docs/discovery/discovery-call-checklist': 14,

  // ── Fix 2: Discussion Calls (100 min total) ──
  '/docs/discussion/structuring-the-discussion-call': 21,
  '/docs/discussion/presenting-surely-placed': 21,
  '/docs/discussion/explaining-the-process': 21,
  '/docs/discussion/discussing-investment': 21,
  '/docs/discussion/discussion-call-checklist': 16,

  // ── Fix 2: Closing Calls (87 min total) ──
  '/docs/closing/asking-for-the-commitment': 17,
  '/docs/closing/handling-final-hesitation': 19,
  '/docs/closing/decision-to-enrollment': 19,
  '/docs/closing/payment-and-agreement-process': 16,
  '/docs/closing/closing-call-checklist': 16,

  // ── Fix 2: Objection Handling (156 min total) ──
  '/docs/objections/objection-handling-framework': 19,
  '/docs/objections/price-objection': 19,
  '/docs/objections/need-time-to-think': 16,
  '/docs/objections/parents-spouse-approval': 16,
  '/docs/objections/already-working-with-a-consultancy': 16,
  '/docs/objections/already-applying-myself': 16,
  '/docs/objections/no-guarantee-concern': 19,
  '/docs/objections/trust-and-credibility': 19,
  '/docs/objections/objection-handling-checklist': 16,

  // ── Fix 2: Pricing & Investment (158 min total) ──
  '/docs/pricing/investment-psychology': 19,
  '/docs/pricing/presenting-investment-confidently': 16,
  '/docs/pricing/roi-conversations': 19,
  '/docs/pricing/handling-price-objections': 21,
  '/docs/pricing/financial-decision-makers': 16,
  '/docs/pricing/discount-guidelines': 16,
  '/docs/pricing/payment-conversations': 16,
  '/docs/pricing/pricing-red-flags': 19,
  '/docs/pricing/pricing-playbook-checklist': 16,

  // ── Fix 2: Sales Coaching & Case Studies (172 min lessons + 33 min graduation) ──
  '/docs/sales-coaching/reading-a-sales-conversation': 19,
  '/docs/sales-coaching/coach-review-framework': 16,
  '/docs/sales-coaching/call-self-review-checklist': 16,
  '/docs/sales-coaching/common-sales-mistakes': 16,
  '/docs/sales-coaching/price-negotiation-case-study': 19,
  '/docs/sales-coaching/consultancy-comparison-case-study': 16,
  '/docs/sales-coaching/composite-case-study-healthcare': 19,
  '/docs/sales-coaching/composite-case-study-supply-chain': 16,
  '/docs/sales-coaching/composite-case-study-opt-software-engineer': 19,
  '/docs/sales-coaching/sales-coaching-checklist': 16,

  // ── Fix 2: Sales Constitution (180 min total) ──
  '/docs/sales-constitution/advisor-mindset': 16,
  '/docs/sales-constitution/what-we-believe': 18,
  '/docs/sales-constitution/trust-before-technique': 16,
  '/docs/sales-constitution/candidate-first-selling': 16,
  '/docs/sales-constitution/consultative-selling-framework': 16,
  '/docs/sales-constitution/ethical-selling': 21,
  '/docs/sales-constitution/things-we-never-say': 19,
  '/docs/sales-constitution/decision-making-principles': 19,
  '/docs/sales-constitution/surely-placed-differentiation': 18,
  '/docs/sales-constitution/sales-constitution-checklist': 21,

  // ── Fix 2: Complete Sales Call Walkthrough (33 min) ──
  '/docs/sales-coaching/complete-sales-call-walkthrough': 33,
}

export function getModuleDuration(moduleId: string): number {
  return MODULE_DURATIONS[moduleId] ?? 60
}

export function getLessonDuration(slug: string): number {
  const normalized = slug.endsWith('/') ? slug.slice(0, -1) : slug
  return LESSON_DURATIONS[normalized] ?? 15
}
