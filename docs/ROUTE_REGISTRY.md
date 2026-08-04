# Route Registry

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** Every application route the Academy platform would expose, mapped to the screens `docs/SCREEN_INVENTORY.md` already defines
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document assigns a concrete route path to every screen already named in `docs/SCREEN_INVENTORY.md`. It introduces no new screen and no new feature — every row below traces back to that document's Purpose/Actions/Dependencies definition. Where a route serves content that already exists in `content/docs/` (a Lesson Page, a Module Landing Page), the route pattern is designed to read directly from the existing folder and file structure rather than requiring content to be restructured or duplicated to fit the route.

## Routing Conventions

- Route segments use lowercase kebab-case, consistent with the folder-naming convention already established in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5, so a Module or Lesson route segment can be a direct pass-through of an existing folder or file slug rather than a translated identifier.
- A route that renders `content/docs/` content takes the Module ID or article slug directly from `docs/CONTENT_MANIFEST.md`'s Module ID field — no separate route-to-content mapping table is maintained, since that would duplicate data already sourced from the live repository.
- Routes requiring authentication are marked **Auth Required**. Routes additionally requiring a specific role are marked with that role.
- This document does not specify a routing framework, file-based vs. config-based routing, or a specific Next.js App Router convention — that is an implementation decision left to whichever team builds against this registry, not a product-architecture decision this sprint makes.

## Dashboard

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/dashboard` | Career Advisor Dashboard (`docs/DASHBOARD_EXPERIENCE.md`) | Auth Required | Default landing route after login for the Career Advisor role |

## Learning (Learning Paths)

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/learning` | Learning Paths Landing Page | Auth Required | Lists all five paths per `docs/LEARNING_PATHS.md` |
| `/learning/[pathId]` | Learning Path Detail / Progress Page | Auth Required | `pathId` is a stable slug per path, e.g. `new-career-advisor`, `senior-career-advisor`, `sales-manager`, `technical-hiring-specialist`, `international-student-specialist` |

## Module (Browse)

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/browse` | Browse entry point (`docs/INFORMATION_ARCHITECTURE.md`'s Global Navigation → Browse) | Auth Required | Lists all top-level modules per `docs/CONTENT_MANIFEST.md`'s Top-Level Modules table |
| `/browse/[moduleId]` | Module Landing Page | Auth Required | `moduleId` is a Module ID from `docs/CONTENT_MANIFEST.md`, e.g. `resume-intelligence` |
| `/browse/candidate-intelligence` | Candidate Intelligence Framework landing (schema files) | Auth Required | Distinct from a Role Collection landing page — surfaces the ten `UPPERCASE_SNAKE_CASE` schema files per `docs/AI_CONTEXT_PACK.md` §4 |
| `/browse/candidate-intelligence/[collectionId]` | Role Collection Landing Page | Auth Required | `collectionId` is a Role Collection folder name, e.g. `software-engineering` |

## Lesson

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/browse/[moduleId]/[articleSlug]` | Lesson / Article Page | Auth Required | Renders the article unchanged, plus the chrome specified in `docs/MODULE_EXPERIENCE.md` |
| `/browse/candidate-intelligence/[collectionId]/[articleSlug]` | Lesson / Article Page — Role Collection Variant | Auth Required | Per `docs/MODULE_EXPERIENCE.md`'s Role Collection Variant section |

## Bookmarks

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/bookmarks` | Bookmarks Page | Auth Required | Filterable by Module, Topic, or Role Category per `docs/BOOKMARK_SYSTEM.md` |
| `/bookmarks/reading-lists` | Reading Lists view | Auth Required | Per `docs/BOOKMARK_SYSTEM.md`'s Reading Lists concept — Post-MVP, per `docs/IMPLEMENTATION_BACKLOG.md`'s Epic 5 |
| `/bookmarks/reading-lists/[listId]` | A single Reading List's contents | Auth Required | Post-MVP |

## Notes

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/notes` | Notes Page | Auth Required | Post-MVP per `docs/IMPLEMENTATION_BACKLOG.md`'s Epic 5 |
| `/notes/[noteId]` | A single note's detail/edit view | Auth Required | Post-MVP |

## Assessments

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/assessments/quiz/[quizId]` | Quiz / Knowledge Check Screen | Auth Required | MVP for Knowledge Checks specifically, per `docs/FEATURE_SPECIFICATIONS.md`'s Assessments priority |
| `/assessments/scenario/[testId]` | Scenario Test Screen | Auth Required | Post-MVP |
| `/assessments/roleplay/[roleplayId]` | Practice / Role Play Screen (advisor variant) | Auth Required | Post-MVP |
| `/assessments/certification/[pathId]` | Certification Exam Screen | Auth Required | Post-MVP, scoped to a Learning Path per `docs/LEARNING_PATHS.md` |
| `/certificates/[certificateId]` | Certificate View Screen | Auth Required | Post-MVP |

## Search

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/search` | Search Results Page | Auth Required | Post-MVP per `docs/SCREEN_INVENTORY.md`; the Search Overlay itself is not a standalone route since it's an overlay over the current route, per `docs/UI_NAVIGATION_BLUEPRINT.md` |
| `/search?q=[query]&module=[moduleId]&topic=[tag]&role=[roleCode]` | Search Results Page with facets applied | Auth Required | Query parameters map directly to `docs/SEARCH_PRODUCT.md`'s Filters — Module, Topic, Role |

## Ask AI

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/ai` | Ask AI Panel, unscoped | Auth Required | General entry point, per `docs/AI_EXPERIENCE.md` |
| `/ai?context=[moduleId]` | Ask AI Panel, pre-scoped to a module | Auth Required | Used from a Lesson Page's AI entry point per `docs/MODULE_EXPERIENCE.md`'s AI section |
| `/ai/history` | AI Conversation History Page | Auth Required | Post-MVP |
| `/ai/history/[conversationId]` | A single past conversation | Auth Required | Post-MVP |

## Manager

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/manager` | Manager Dashboard | Auth Required — Sales Manager | Post-MVP per `docs/IMPLEMENTATION_BACKLOG.md`'s Epic 7 |
| `/manager/team/[advisorId]` | Team Progress Detail Screen | Auth Required — Sales Manager | Post-MVP |
| `/manager/roleplay/[roleplayId]/review` | Manager Role Play review flow | Auth Required — Sales Manager | Post-MVP |
| `/trainer` | Trainer Cohort Dashboard | Auth Required — Trainer | Future, per `docs/USER_JOURNEYS.md`'s Journey 4 |
| `/trainer/cohort/[cohortId]` | A single cohort's detail view | Auth Required — Trainer | Future |

## Career Advisor

The Career Advisor's own routes are the Dashboard, Learning, Module, Lesson, Bookmarks, Notes, Assessments, Search, and Ask AI routes above — there is no separate `/career-advisor` route namespace, since the Career Advisor is the platform's default, unprefixed persona. This section exists in this registry only to confirm that explicitly, per `docs/CAREER_ADVISOR_ACADEMY.md`'s Terminology Note treating Career Advisor and Admissions Advisor as the same underlying role.

## Settings

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/settings` | Profile / Settings Screen | Auth Required | Post-MVP; includes Dark Mode toggle per `docs/UI_NAVIGATION_BLUEPRINT.md` |

## Admin

| Route | Screen | Auth | Notes |
|---|---|---|---|
| `/admin` | Admin Console | Auth Required — Admin | MVP (minimal version), per `docs/SCREEN_INVENTORY.md`'s Admin Console priority |
| `/admin/users` | User account list and management | Auth Required — Admin | MVP |
| `/admin/users/[userId]` | A single user account's detail/edit view | Auth Required — Admin | MVP |
| `/admin/settings` | Platform-level configuration | Auth Required — Admin | MVP |

## Error Pages

| Route | Purpose | Auth |
|---|---|---|
| `/404` | Requested route or content does not exist — for example, an `articleSlug` not present in the target module's `meta.json` | None |
| `/403` | Authenticated but lacking the role required for the requested route (e.g. a Career Advisor requesting `/manager`) | None |
| `/500` | Unhandled server error | None |
| `/offline` | Proposed, matching a documentation-site baseline expectation — shown when the client has no network connection; this document does not propose offline-first content caching, only an honest state for the condition | None |

## Authentication

| Route | Purpose | Auth |
|---|---|---|
| `/login` | Sign in | None (redirects to `/dashboard` if already authenticated) |
| `/logout` | Sign out, redirects to `/login` | Auth Required |
| `/onboarding` | Onboarding / First-Run Screen, per `docs/SCREEN_INVENTORY.md` | Auth Required, first login only |

This document does not specify an authentication provider, session mechanism, or password/SSO policy — those are implementation and IT-security decisions outside this sprint's product-design scope, consistent with `docs/DEPLOYMENT_READINESS_CHECKLIST.md` treating account provisioning as an Admin Console concern rather than something this document decides.

## Route-to-Screen Coverage Check

Every screen in `docs/SCREEN_INVENTORY.md` has exactly one route above, with the single deliberate exception of the Search Overlay (an overlay over the current route, not a route of its own, per `docs/UI_NAVIGATION_BLUEPRINT.md`) and the Career Advisor's routes (covered under existing Dashboard/Learning/Module/etc. sections rather than a redundant namespace).

## Related Documents

- `docs/SCREEN_INVENTORY.md` — the screen definitions every route above maps to
- `docs/CONTENT_MANIFEST.md` — the Module ID values used as route parameters
- `docs/NAVIGATION_MANIFEST.md` — how these routes are surfaced in the UI's navigation chrome
- `docs/API_CONTRACTS.md` — the backend contracts several of these routes would call
