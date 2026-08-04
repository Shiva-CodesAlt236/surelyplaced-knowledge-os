# Implementation Backlog

**Status:** Design proposal — not yet built
**Applies to:** The implementation-ready backlog derived from every Phase 3 product document
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document organizes everything specified across `docs/ACADEMY_PRODUCT_VISION.md` through `docs/AI_EXPERIENCE.md` into a buildable sequence. It introduces no new feature or screen — every row below traces back to a specific sibling document. Estimated Complexity uses relative sizing (S / M / L / XL) rather than a fabricated hour or story-point figure, consistent with this repository's non-invention discipline; a real estimate should come from whichever engineering team eventually scopes implementation.

## Epic 1: Learner Foundations

The minimum experience a Career Advisor needs to use the platform at all.

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Progress tracking | Must exist first | None | M | MVP |
| Career Advisor Dashboard | Core screen | Progress | M | MVP |
| Module Landing Page | Core screen | `docs/MODULE_INDEX_STANDARD.md` fields | S | MVP |
| Lesson / Article Page | Core screen | Module Landing Page | M | MVP |
| Role Collection Landing Page | Core screen | Module Landing Page pattern | S | MVP |
| Continue Learning | Depends on Progress | Progress | S | MVP |
| Onboarding / First-Run Screen | Entry flow | Learning Paths (structure only) | S | MVP |
| Admin Console (minimal) | Required to provision any user | None | M | MVP |

## Epic 2: Learning Paths

Structured journeys through existing content.

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Learning Paths Landing Page | Core screen | `docs/LEARNING_PATHS.md` | S | MVP |
| Learning Path Detail / Progress Page | Core screen | Progress, Learning Paths | M | MVP |
| Path-scoped Sidebar mode | Navigation refinement | `docs/INFORMATION_ARCHITECTURE.md` | S | Post-MVP |
| Trainer-assigned custom sequencing | New capability | Learning Paths, Trainer role | L | Post-MVP |
| Trainer Cohort Dashboard | New screen | Custom sequencing | M | Future |

## Epic 3: Search

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Search Overlay (Global + facets) | Core screen | Existing Orama index per `docs/REPOSITORY_HEALTH.md` | M | MVP |
| Module / Topic / Role facets | Filters on existing data | `tags` frontmatter, folder structure | S | MVP |
| Problem Search facet | Filter | Existing `*-red-flags.mdx` pattern | S | Post-MVP |
| Candidate Search facet | Filter | New archetype metadata (not yet defined) | L | Future |
| Search Results Page | Secondary screen | Search Overlay | S | Post-MVP |
| Smart Search / query understanding | Ranking enhancement | Search Overlay | L | Post-MVP |
| AI Search hybrid mode | New capability | Smart Search, AI Assistant | L | Future |

## Epic 4: AI Assistant

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Ask AI Panel (single-turn, grounded) | Core screen | `docs/AI_ASSISTANT_BLUEPRINT.md` grounding + retrieval | L | MVP |
| Citations and Sources display | Required alongside Ask AI | Ask AI Panel | S | MVP |
| Unknown-Answer Behaviour | Required alongside Ask AI | Ask AI Panel | M | MVP |
| Context Selection (per-module scoping) | Enhancement | Ask AI Panel, Module Experience | M | Post-MVP |
| Conversation Memory | Enhancement | Ask AI Panel | M | Post-MVP |
| AI Conversation History Page | New screen | Conversation Memory | S | Post-MVP |
| Escalation flow | New capability | Unknown-Answer Behaviour | M | Post-MVP |

## Epic 5: Personal Tools

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Bookmarks (save/view/remove) | Core feature | None beyond content links | S | MVP |
| Bookmarks Page | Core screen | Bookmarks feature | S | MVP |
| Notes (per-article) | New feature | Lesson Page | M | Post-MVP |
| Notes Page | New screen | Notes feature | S | Post-MVP |
| Profile / Settings Screen | New screen | None | S | Post-MVP |
| Dark Mode | UI enhancement | None | S | Post-MVP |

## Epic 6: Assessment

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Knowledge Checks | Core assessment type | `docs/ASSESSMENT_FRAMEWORK.md` | M | MVP |
| Quiz / Knowledge Check Screen | Core screen | Knowledge Checks | S | MVP |
| Quizzes (module-level aggregation) | Next assessment type | Knowledge Checks | M | Post-MVP |
| Scenario Tests | New assessment type | Existing objection/red-flags categories | L | Post-MVP |
| Role Plays (advisor variant) | New feature | Existing composite case studies | L | Post-MVP |
| Role Plays (manager variant) | New feature | Advisor variant, Manager Dashboard | M | Post-MVP |
| Certification Exams | Capstone assessment | Scenario Tests, Knowledge Checks | L | Post-MVP |
| Certificates (record + view screen) | New feature | Certification Exams | M | Post-MVP |
| Policy figures approval (thresholds, retakes) | Governance, not engineering | Sales Leadership sign-off per `docs/ASSESSMENT_FRAMEWORK.md` | S | MVP-gating |

## Epic 7: Manager and Trainer Tools

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Manager Dashboard | New screen | Progress (team-scoped) | M | Post-MVP |
| Team Progress Detail Screen | New screen | Manager Dashboard | S | Post-MVP |
| Manager Role Play review flow | New feature | Role Plays (manager variant) | M | Post-MVP |

## Epic 8: Live Chat Scripts

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| `content/docs/live-chat-scripts/` content sprint | Content work, not product work | `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md`, `docs/SPRINT_GENERATION_TEMPLATE.md` | — | Future |
| Live Chat Script Library screen | New screen | Populated content above | S | Future |
| Call Scripts field on Module Index | Metadata enhancement | Live Chat Script Library | S | Future |

## Epic 9: Platform Governance

| Feature | Priority | Dependencies | Complexity | Tier |
|---|---|---|---|---|
| Ownership matrix extension | Documentation, not code | `docs/REPOSITORY_OWNERSHIP.md` | S | MVP-gating |
| `docs/AI_CONTEXT_PACK.md` reference update | Documentation, not code | This entire Phase 3 document set | S | MVP-gating |
| Deployment readiness sign-off | Governance | `docs/DEPLOYMENT_READINESS_CHECKLIST.md` | — | MVP-gating |

## MVP Summary

The proposed MVP is Epic 1 in full, Epic 2's first two rows, Epic 3's first two rows, Epic 4's first three rows, Epic 5's first two rows, Epic 6's first two rows plus the policy-approval gate, and Epic 9 in full. Everything else is Post-MVP or Future, per the tiers stated in each table above and consistent with the priorities already assigned in `docs/SCREEN_INVENTORY.md` and `docs/FEATURE_SPECIFICATIONS.md`.

## Post-MVP Summary

The bulk of Epics 2 (Trainer tooling), 3 (advanced search), 4 (conversational depth), 5 (Notes, personalization), 6 (the richer assessment types), and all of Epic 7 (Manager and Trainer tools) — features that meaningfully deepen the product but aren't required for a first usable release to Career Advisors.

## Future Summary

Live Chat Scripts (Epic 8) in full, gated on a content sprint that hasn't happened yet; Candidate Search and AI Search hybrid mode, gated on capabilities (archetype metadata, hybrid ranking) not yet designed in enough technical depth to schedule.

## Related Documents

Every table above references a specific sibling document rather than restating its design:

- `docs/ACADEMY_PRODUCT_VISION.md`, `docs/USER_JOURNEYS.md` — the "why" behind this backlog's priorities
- `docs/SCREEN_INVENTORY.md`, `docs/FEATURE_SPECIFICATIONS.md` — the screen- and feature-level source of truth this backlog reorganizes into epics
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md` — the gate this backlog's MVP tier must clear before shipping
