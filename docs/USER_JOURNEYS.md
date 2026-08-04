# User Journeys

**Status:** Design proposal — not yet built
**Applies to:** The complete proposed journey through the Academy product for each of five personas
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document designs five end-to-end journeys. It does not introduce any new persona beyond the five named in `docs/ACADEMY_PRODUCT_VISION.md`'s Target Users section, and every screen or feature referenced below is specified in more detail in `docs/SCREEN_INVENTORY.md` and `docs/FEATURE_SPECIFICATIONS.md` rather than redefined here.

## Journey 1: New Career Advisor

**Goals:** Get oriented quickly, build foundational skill without feeling overwhelmed by the full breadth of `content/docs/`, and know what "done" looks like for onboarding.

**Entry Point:** First login, proposed to trigger an onboarding prompt recommending the New Career Advisor Learning Path from `docs/LEARNING_PATHS.md`.

**Navigation:** Primarily path-driven rather than sidebar-driven at this stage — the Dashboard's Continue Learning card (`docs/DASHBOARD_EXPERIENCE.md`) is the dominant navigation surface, with the full sidebar (`docs/INFORMATION_ARCHITECTURE.md`) available but not the primary route through content yet.

**Learning:** Moves through the New Career Advisor path's modules in the completion order `docs/LEARNING_PATHS.md` defines, using the Module Experience (`docs/MODULE_EXPERIENCE.md`) for each one, hitting the path's four milestones in sequence.

**Search:** Used narrowly at this stage — mostly to look up a specific term encountered in a module rather than broad exploration, per the Module Search facet in `docs/SEARCH_PRODUCT.md`.

**AI:** Used heavily for clarifying questions within the current module ("what does Operational Policy Pending mean?"), leaning on the AI Experience's Context and Suggested Questions (`docs/AI_EXPERIENCE.md`) scoped to whatever module the advisor is currently in.

**Completion:** The path's Certification Exam and Milestone completion state, per `docs/LEARNING_PATHS.md` and `docs/ASSESSMENT_FRAMEWORK.md`, surfaced as a Certificate per `docs/FEATURE_SPECIFICATIONS.md`.

## Journey 2: Experienced Career Advisor

**Goals:** Deepen expertise in a specific area (a Role Collection relevant to their book of business, or a specialization like International Student Specialist), and use the platform as an on-demand reference more than a guided course.

**Entry Point:** Direct navigation to a specific module or a Learning Path recommendation surfaced on the Dashboard based on the advisor's current book of business — this document does not specify the recommendation logic in technical detail; see `docs/DASHBOARD_EXPERIENCE.md`'s Recommended Content section.

**Navigation:** Sidebar- and Search-driven rather than path-driven — an experienced advisor more often knows what they're looking for and goes directly to it.

**Learning:** Selective rather than sequential — completing specific modules from the Senior Career Advisor, Technical Hiring Specialist, or International Student Specialist paths (`docs/LEARNING_PATHS.md`) as relevant to a live situation, not necessarily in the path's full defined order.

**Search:** Primary navigation tool — Problem Search and Role Search (`docs/SEARCH_PRODUCT.md`) used frequently to find the specific article relevant to a live candidate conversation.

**AI:** Used for synthesis across modules ("how does this candidate's visa situation affect their resume framing") more than basic clarification, drawing on the AI Experience's cross-module retrieval (`docs/AI_ASSISTANT_BLUEPRINT.md`).

**Completion:** Certification for whichever specialization path they pursue, plus ongoing use with no further "completion" state — the platform remains a working reference indefinitely, not something an experienced advisor "finishes."

## Journey 3: Sales Manager

**Goals:** See team progress, identify who needs support, and use coaching content (Role Plays) without duplicating the advisor curriculum for themselves.

**Entry Point:** A Manager Dashboard, distinct from the Career Advisor Dashboard, per `docs/FEATURE_SPECIFICATIONS.md`'s Manager Dashboard section.

**Navigation:** Team-progress-driven — the Manager Dashboard surfaces which team members are on which path and at what stage, and navigation from there typically drills into an individual advisor's progress rather than into content directly.

**Learning:** The Sales Manager path from `docs/LEARNING_PATHS.md`, completed once as part of onboarding into the manager role, then revisited selectively — primarily the coaching-oriented Role Play mechanics rather than the full advisor curriculum.

**Search:** Used to locate specific coaching material (a composite case study, the coach-review framework) rather than broad exploration.

**AI:** Used in a coaching-support capacity — for example, asking the AI Assistant to summarize what a specific module covers before discussing it with a team member, rather than asking it questions to answer live candidate situations directly.

**Completion:** No fixed completion state — a Sales Manager's use of the platform is ongoing team oversight, punctuated by their own initial Sales Manager path certification.

## Journey 4: Trainer

**Goals:** Assign Learning Paths to cohorts, optionally build a custom sequence for a specific training need, and review cohort-level (not individual-level) completion patterns.

**Entry Point:** A Trainer-specific view, proposed as a variant of the Manager Dashboard scoped to cohorts rather than direct reports — see `docs/SCREEN_INVENTORY.md` for the proposed distinct screen.

**Navigation:** Path- and cohort-driven — a Trainer's primary actions are assigning an existing Learning Path (`docs/LEARNING_PATHS.md`) to a group, or, where the product eventually supports it, sequencing existing modules into a custom path without authoring new content (custom path *sequencing* is a proposed platform feature; authoring new *content* remains entirely outside this product layer, per `docs/ACADEMY_PRODUCT_VISION.md`'s Target Users section).

**Learning:** A Trainer is expected to have completed the relevant Learning Paths themselves before assigning them, but this document does not propose a formal prerequisite gate on the Trainer role — that's a policy decision for a future sprint.

**Search:** Used to locate specific modules when assembling a custom sequence.

**AI:** Used to answer a Trainer's own questions about module content while preparing a cohort assignment — the same grounded AI Experience every other persona uses, with no Trainer-specific AI behavior proposed.

**Completion:** No individual completion state — a Trainer's "completion" is a cohort reaching its assigned path's completion criteria, visible in aggregate.

## Journey 5: Admin

**Goals:** Manage user accounts, role assignment, and platform-level configuration — no learning-content interaction implied by this role.

**Entry Point:** An Admin console, entirely separate from the learner-facing Dashboard, per `docs/SCREEN_INVENTORY.md`.

**Navigation:** Account- and configuration-driven — user lists, role assignment, and platform settings, not content navigation.

**Learning:** Not applicable — the Admin role is not proposed to have a Learning Path of its own, since it's an operational rather than advisory function. An Admin who is also a Career Advisor would use the two roles' experiences independently.

**Search:** Used to locate a specific user account or configuration setting, not content — a proposed Admin-scoped search distinct from the learner-facing Search Product in `docs/SEARCH_PRODUCT.md`.

**AI:** Not proposed for the Admin role in this design — the grounded AI Assistant is a learning-support feature; account and configuration management don't need a content-grounded assistant, and this document doesn't propose extending one to that surface.

**Completion:** Not applicable — Admin is an ongoing operational role with no path or certification.

## Related Documents

- `docs/ACADEMY_PRODUCT_VISION.md` — the personas these journeys are built for
- `docs/SCREEN_INVENTORY.md` — the specific screens each journey moves through
- `docs/FEATURE_SPECIFICATIONS.md` — the specific features (Manager Dashboard, Roleplays, and the rest) each journey relies on
- `docs/LEARNING_PATHS.md` — the underlying paths the Career Advisor and Sales Manager journeys traverse
