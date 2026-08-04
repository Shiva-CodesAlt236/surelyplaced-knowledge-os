# Academy Product Vision

**Status:** Design proposal — not yet built
**Applies to:** The product-level vision for the Career Advisor Academy, refining `docs/CAREER_ADVISOR_ACADEMY.md` into a product-management lens
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document restates nothing already defined in `docs/CAREER_ADVISOR_ACADEMY.md` — it takes that document's vision as given and adds the product-management framing (mission, business outcomes, experience-by-persona) a product team would need to actually build against it. Where the two documents appear to overlap, `docs/CAREER_ADVISOR_ACADEMY.md` remains the source of truth for philosophy and architecture; this document is the source of truth for product framing specifically.

## Mission

Turn the Knowledge OS content library — already comprehensive, already QA'd, already trusted — into something a Career Advisor actively progresses through rather than only consults reactively. The mission is adoption of structure on top of existing trust, not a new content initiative.

## Vision

A Career Advisor's first ninety days are guided by a clear path rather than a folder they have to explore unassisted. A Sales Manager can see, at a glance, where their team stands without reconstructing that picture from memory or side conversations. Every advisor, regardless of tenure, has a single place to ask a question and get an answer grounded in the same material the company already stands behind — never a generic, ungrounded response.

## Target Users

Restated by reference to `docs/CAREER_ADVISOR_ACADEMY.md`'s Target Users and Terminology Note, extended here with two additional platform-facing roles this document introduces for product-design purposes:

- **Career Advisor** — the primary learner, referred to as "Admissions Advisor" in the underlying content corpus per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3.
- **Sales Manager** — oversees a team of Career Advisors, per `docs/CAREER_ADVISOR_ACADEMY.md`.
- **Sales Executive** — a broader commercial role, per `docs/CAREER_ADVISOR_ACADEMY.md`, whose scope that document leaves for a future sprint to define in detail.
- **Trainer** — a new role this document introduces: someone responsible for assigning Learning Paths, building custom sequences, and reviewing cohort-level (not just individual) progress. Distinct from a Sales Manager, who oversees people; a Trainer oversees curriculum and cohorts, which may or may not report to them directly.
- **Admin** — a new role this document introduces: someone responsible for platform configuration (user accounts, role assignment, permissions) rather than either coaching or curriculum. Distinct from the Documentation Architect role defined in `docs/REPOSITORY_OWNERSHIP.md`, which owns content and engineering documents, not platform accounts.

Trainer and Admin are platform-operational roles, not content-authoring roles — neither is proposed to have write access to `content/docs/` or `docs/` through the product itself; content and documentation continue to be authored through the sprint process defined in `docs/SPRINT_GENERATION_TEMPLATE.md`, entirely outside this product layer.

## Career Advisor Experience

A Career Advisor's experience centers on a Dashboard (`docs/DASHBOARD_EXPERIENCE.md`) showing where they are in their active Learning Path, a Module Experience (`docs/MODULE_EXPERIENCE.md`) that turns each module into a structured lesson rather than a flat article list, a grounded AI Experience (`docs/AI_EXPERIENCE.md`) for in-the-moment questions, and a Search Product (`docs/SEARCH_PRODUCT.md`) for everything outside their current path. The full journey is detailed in `docs/USER_JOURNEYS.md`.

## Sales Manager Experience

A Sales Manager's experience centers on visibility into their team's progress and coaching tools built from the same content their advisors use — never a separate, parallel curriculum. Their dashboard view and the coaching-oriented Role Play mechanics are specified in `docs/FEATURE_SPECIFICATIONS.md`'s Manager Dashboard and Roleplays sections, and their journey is detailed in `docs/USER_JOURNEYS.md`.

## Business Outcomes

This document intentionally does not state a specific target number (a completion-rate percentage, a ramp-time reduction, a retention figure) for any business outcome, since no such figure has been measured or approved by Sales Leadership — inventing one here would violate the same non-invention discipline `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §13 applies throughout the content corpus. Proposed, directional outcomes this product is designed to support:

- More consistent onboarding — a new Career Advisor's path through foundational material is the same regardless of who trained them, reducing variance introduced by whichever colleague happened to onboard them informally.
- Better visibility for Sales Managers — team progress becomes something a manager can see directly rather than infer.
- Fewer repeated, ungrounded answers — a grounded AI Assistant, per `docs/AI_ASSISTANT_BLUEPRINT.md`, reduces reliance on asking a colleague something already documented, without ever answering from outside the repository.

Any specific numeric target for these outcomes is a decision for Sales Leadership to set once the platform exists and can actually be measured, per the same "proposed, pending approval" discipline `docs/ASSESSMENT_FRAMEWORK.md` already applies to its own policy figures.

## Platform Philosophy

Three commitments carried forward from `docs/CAREER_ADVISOR_ACADEMY.md`'s Learning Philosophy, restated here as product commitments:

- **Content stays the source of truth.** The product never forks, duplicates, or paraphrases `content/docs/` into a separate product-owned copy. Every screen renders or links to the real article.
- **Nothing is invented on the platform's behalf.** Not a reading-time statistic presented as measured fact before it is, not a business outcome number, not an AI answer beyond what the repository actually supports.
- **The product earns trust the same way the content already has.** By being honest about what it doesn't know — an empty state, a "not yet built" status, an AI Assistant that defers — rather than papering over gaps with a plausible-sounding placeholder.

## Related Documents

- `docs/CAREER_ADVISOR_ACADEMY.md` — the underlying vision and philosophy this document builds a product lens onto
- `docs/USER_JOURNEYS.md` — the detailed journeys for every persona named above
- `docs/DASHBOARD_EXPERIENCE.md` and `docs/MODULE_EXPERIENCE.md` — the Career Advisor experience in detail
- `docs/IMPLEMENTATION_BACKLOG.md` — how this vision translates into a buildable sequence
