# Implementation Sequence

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** The actual proposed build order across every asset this Implementation Sprint and the preceding Phase 2/3 design sprints produced
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document sequences real, buildable work. It reorganizes `docs/IMPLEMENTATION_BACKLOG.md`'s nine epics against the implementation assets this sprint added — `docs/CONTENT_MANIFEST.md`, `docs/ROUTE_REGISTRY.md`, `docs/NAVIGATION_MANIFEST.md`, `docs/SEARCH_INDEX_MANIFEST.md`, `docs/AI_RETRIEVAL_MANIFEST.md`, `docs/COMPONENT_LIBRARY.md`, `docs/PAGE_TEMPLATES.md`, `docs/STATE_MANAGEMENT.md`, `docs/API_CONTRACTS.md` — into five concrete phases with explicit dependencies. It introduces no new feature; every phase below is built entirely from work already scoped in a prior document. Complexity sizing (S/M/L/XL) and phase order are relative-priority judgments, not fabricated hour or point estimates, consistent with `docs/IMPLEMENTATION_BACKLOG.md`'s own non-invention discipline.

## How This Sequence Relates to `docs/IMPLEMENTATION_BACKLOG.md`

That document organized every feature and screen into nine epics with MVP/Post-MVP/Future tiers. This document answers a different question: in what actual order would a build team touch these epics, given real technical dependencies (you cannot build Progress-dependent features before Progress itself exists) rather than just priority tier. Where the two documents' orderings agree, this document says so briefly rather than re-deriving the reasoning; where this document sequences something the Backlog didn't order relative to another MVP item, that's this document's specific contribution.

## Phase 1: Foundation

**Goal:** The platform can authenticate a user, render existing content through the new route structure, and track basic Progress. Nothing is usable as a learning product yet, but every later phase depends on this one existing.

| Work Item | Source | Complexity |
|---|---|---|
| Authentication contract and session handling | `docs/API_CONTRACTS.md` Authentication | M |
| Admin Console (minimal) — required to provision any user at all | `docs/IMPLEMENTATION_BACKLOG.md` Epic 1, `docs/API_CONTRACTS.md` Cross-Contract Notes | M |
| Route structure implementation | `docs/ROUTE_REGISTRY.md`, full document | M |
| Content Manifest generation (build-time or on-demand read of `content/docs/` structure) | `docs/CONTENT_MANIFEST.md` | M |
| Module Landing Page and Lesson Page (Lesson Template, unchanged article rendering) | `docs/PAGE_TEMPLATES.md` Lesson Template, `docs/COMPONENT_LIBRARY.md` | M |
| Top Navigation, Sidebar (Browse mode only), Breadcrumbs, Right TOC | `docs/NAVIGATION_MANIFEST.md` | S |
| Progress contract and state — foundational, nearly everything downstream depends on it | `docs/API_CONTRACTS.md` Progress, `docs/STATE_MANAGEMENT.md` Progress | M |
| Mark Complete control and basic Completion Status display | `docs/COMPONENT_LIBRARY.md` `MarkCompleteControl`, `CompletionIndicator` | S |

**Dependencies:** None upstream — this is the starting phase.

## Phase 2: Learner Core Experience

**Goal:** A Career Advisor can use the platform as their primary entry point — Dashboard, Learning Paths, Bookmarks, and a first usable AI Assistant.

| Work Item | Source | Complexity |
|---|---|---|
| Career Advisor Dashboard, all six widgets including empty states | `docs/PAGE_TEMPLATES.md` Dashboard Template, `docs/COMPONENT_LIBRARY.md` Cards | M |
| Continue Learning shortcut | `docs/COMPONENT_LIBRARY.md` `ContinueLearningCard` | S |
| Learning Paths Landing Page and Learning Path Detail Page, all five paths | `docs/PAGE_TEMPLATES.md` Learning Template, `docs/LEARNING_PATHS.md` | M |
| Path-mode Sidebar | `docs/NAVIGATION_MANIFEST.md` Sidebar, `docs/COMPONENT_LIBRARY.md` `SidebarPathView` | S |
| Onboarding / First-Run Screen | `docs/SCREEN_INVENTORY.md`, `docs/STATE_MANAGEMENT.md` Career Advisor state | S |
| Bookmarks contract, state, Bookmarks Page | `docs/API_CONTRACTS.md` Bookmarks, `docs/PAGE_TEMPLATES.md` Bookmarks Template | S |
| Search index build (Search Document Schema, no Smart Search yet) | `docs/SEARCH_INDEX_MANIFEST.md` Search Document Schema, Ranking, Filters | M |
| Search Overlay and basic facets (Module, Topic, Role) | `docs/PAGE_TEMPLATES.md` Search Template, `docs/COMPONENT_LIBRARY.md` Search components | M |
| Ask AI Panel — single-turn, grounded, with Citation Rules and Refusal Behaviour | `docs/AI_RETRIEVAL_MANIFEST.md` full Retrieval Pipeline, `docs/PAGE_TEMPLATES.md` AI Chat Template | L |
| Knowledge Checks — the lowest-complexity assessment type | `docs/API_CONTRACTS.md` Assessments, `docs/PAGE_TEMPLATES.md` Assessment Template | M |
| Policy figures approval gate (thresholds, retakes) — a governance checkpoint, not a build item | `docs/ASSESSMENT_FRAMEWORK.md` Completion Rules | — |

**Dependencies:** Phase 1 in full (Authentication, routes, Content Manifest, Progress contract).

## Phase 3: Depth and Personalization

**Goal:** The platform becomes genuinely useful for an experienced advisor's day-to-day reference use, not just a guided first path.

| Work Item | Source | Complexity |
|---|---|---|
| Trainer-assigned custom sequencing | `docs/IMPLEMENTATION_BACKLOG.md` Epic 2 | L |
| Problem Search facet, Search Results Page (full-page variant) | `docs/SEARCH_INDEX_MANIFEST.md` Filters, `docs/PAGE_TEMPLATES.md` Search Template | S |
| Smart Search / query understanding | `docs/SEARCH_INDEX_MANIFEST.md` Synonyms, `docs/SEARCH_PRODUCT.md` Smart Search | L |
| Context Selection (per-module AI scoping), Conversation Memory, AI Conversation History Page | `docs/AI_RETRIEVAL_MANIFEST.md` Context Windows, `docs/API_CONTRACTS.md` AI | M |
| Notes (Personal Notes only — Manager Notes remain gated) | `docs/API_CONTRACTS.md` Notes, `docs/PAGE_TEMPLATES.md` Notes Template | M |
| Reading Lists, Favorites, Pinned Articles | `docs/BOOKMARK_SYSTEM.md`, `docs/COMPONENT_LIBRARY.md` `ReadingListEditor` | S |
| Quizzes, Scenario Tests | `docs/API_CONTRACTS.md` Assessments, `docs/ASSESSMENT_FRAMEWORK.md` | L |
| Role Plays (advisor variant) | `docs/ASSESSMENT_FRAMEWORK.md` Role Plays, `docs/COMPONENT_LIBRARY.md` `RolePlayRunner` | L |
| Certification Exams, Certificates | `docs/API_CONTRACTS.md` Assessments, `docs/PAGE_TEMPLATES.md` Assessment Template Certificate variant | L |
| Profile / Settings Screen, Dark Mode | `docs/SCREEN_INVENTORY.md`, `docs/UI_NAVIGATION_BLUEPRINT.md` | S |

**Dependencies:** Phase 2 in full (Knowledge Checks must exist before Quizzes aggregate them; Ask AI Panel must exist before Conversation Memory extends it).

## Phase 4: Oversight

**Goal:** Sales Managers and Trainers gain visibility and coaching tools built from the same content advisors use.

| Work Item | Source | Complexity |
|---|---|---|
| Manager Dashboard, Team Progress Detail Screen | `docs/API_CONTRACTS.md` Analytics (Manager scope), `docs/COMPONENT_LIBRARY.md` Manager Widgets | M |
| Manager Role Play review flow | `docs/ASSESSMENT_FRAMEWORK.md` Role Plays (manager variant) | M |
| Manager Notes — contingent on the Sensitivity policy resolution named in `docs/NOTES_SYSTEM.md` | `docs/API_CONTRACTS.md` Notes (Manager Note operations) | M, gated |
| Trainer Cohort Dashboard | `docs/USER_JOURNEYS.md` Journey 4, `docs/SCREEN_INVENTORY.md` | M |
| Learning Analytics: Completion aggregation, Knowledge Gap Detection, Weak Areas, Milestone Recognition feed | `docs/API_CONTRACTS.md` Analytics, `docs/LEARNING_ANALYTICS.md` | L |

**Dependencies:** Phase 3's Quizzes and Scenario Tests (Knowledge Gap Detection needs real assessment result data to detect patterns from); `docs/NOTES_SYSTEM.md`'s Sensitivity policy resolution specifically gates the Manager Notes work item, independent of any other Phase 4 item's readiness.

## Phase 5: Extended Capability

**Goal:** Capabilities gated on content that doesn't exist yet or technical capability not yet designed in enough depth to schedule confidently.

| Work Item | Source | Complexity |
|---|---|---|
| Live Chat Scripts content sprint, then Live Chat Script Library screen | `docs/IMPLEMENTATION_BACKLOG.md` Epic 8 — gated on a `content/docs/live-chat-scripts/` content sprint that hasn't happened | — |
| Candidate Search facet | `docs/IMPLEMENTATION_BACKLOG.md` Epic 3 — gated on archetype metadata not yet defined | L |
| AI Search hybrid mode | `docs/SEARCH_PRODUCT.md` AI Search — gated on Smart Search (Phase 3) plus additional design | L |
| Enrichment sprint for `docs/MODULE_INDEX_STANDARD.md` / `docs/MODULE_METADATA_STANDARD.md` proposed fields | `docs/CONTENT_ENRICHMENT_GUIDE.md` | — |

**Dependencies:** Each item's own named gate above; this phase is not proposed to be built in the order listed, since its items don't depend on each other, only on their individual prerequisites clearing.

## Dependencies (Cross-Phase Summary)

- **Progress** (Phase 1) is the single most-depended-on piece of state — Dashboard, Learning Paths, Manager Dashboard, and Learning Analytics all read from it either directly or in aggregate.
- **Content Manifest** (Phase 1) is required before Route Registry's dynamic routes (`[moduleId]`, `[articleSlug]`) can resolve to real content.
- **Knowledge Checks** (Phase 2) must exist before Quizzes (Phase 3) can aggregate them, and before Knowledge Gap Detection (Phase 4) has any result data to analyze.
- **Ask AI Panel single-turn** (Phase 2) must exist before Conversation Memory (Phase 3) can extend it.
- **Manager Notes** (Phase 4) is gated independently of every other Phase 4 item, on a policy decision outside engineering's control per `docs/RELEASE_STRATEGY.md`'s Manager Beta gate.

## Critical Path

The longest true dependency chain, where each item cannot begin before the previous one is functionally complete: Authentication → Content Manifest / Route Registry → Progress contract → Knowledge Checks → Quizzes → Knowledge Gap Detection → Manager Dashboard's Knowledge Gap panel. Every other work item in this document either branches off this path or depends on a shorter chain within it.

## Quick Wins

Work items with low complexity (S) and no dependency beyond Phase 1, suitable for early, visible progress: Continue Learning shortcut, Path-mode Sidebar, Onboarding screen, Bookmarks (core), Reading Lists / Favorites / Pinned Articles, Profile / Settings Screen and Dark Mode, Problem Search facet.

## Future Enhancements

Everything in Phase 5, plus any capability named in a sibling design document but not assigned to a phase above because it has no current path to a concrete build trigger: Trainer Cohort Dashboard's more advanced cohort-comparison views (not specified in `docs/SCREEN_INVENTORY.md` beyond the base screen), and the MCP-compatibility possibility noted in `docs/AI_ASSISTANT_BLUEPRINT.md`'s Future MCP Compatibility section, which that document itself treats as conceptual only.

## Related Documents

- `docs/IMPLEMENTATION_BACKLOG.md` — the epic/feature/priority structure this sequence reorders into phases
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md` — the gate every phase's output must clear before reaching production, per that document's own scope
- `docs/RELEASE_STRATEGY.md` — the rollout stages (Internal Alpha through Production) this build sequence feeds into
- Every other Implementation Sprint document — `docs/CONTENT_MANIFEST.md` through `docs/API_CONTRACTS.md` — the source of every work item listed above
