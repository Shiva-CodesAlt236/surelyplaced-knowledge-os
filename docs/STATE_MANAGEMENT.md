# State Management

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** Every unit of application state the Academy platform would need to track
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies what state exists, who owns it, and what it depends on — not a specific state-management library, store pattern, or persistence technology. Every state domain below traces to a feature or component already specified in a prior document; this document does not introduce a new product capability, only the state backing capabilities that already exist.

## State Ownership Principle

Every state domain below is either **session state** (exists only for the current browser session, lost on close unless explicitly persisted), **account state** (persisted per learner account, available across sessions and devices), or **derived state** (computed from other state, never independently stored). This distinction matters for implementation because account state requires a backend contract (see `docs/API_CONTRACTS.md`) while session state may not.

## Authentication

| Aspect | Detail |
|---|---|
| Type | Account state |
| Contains | Current user identity, role (Career Advisor, Sales Manager, Trainer, Admin — per `docs/ACADEMY_PRODUCT_VISION.md`'s Target Users), session validity |
| Read by | Every route marked Auth Required in `docs/ROUTE_REGISTRY.md`, for route-guarding and role-scoped navigation per `docs/NAVIGATION_MANIFEST.md` |
| Written by | Login and logout actions only |
| Notes | This document does not specify a session mechanism (token, cookie, or otherwise) — an implementation decision outside this sprint's scope, per `docs/ROUTE_REGISTRY.md`'s Authentication section |

## Progress

| Aspect | Detail |
|---|---|
| Type | Account state |
| Contains | Per-article, per-module, and per-path Completion Status (not started / in progress / complete), per `docs/MODULE_INDEX_STANDARD.md` |
| Read by | `ProgressBar`, `CompletionIndicator`, `MilestoneTracker`, `ContinueLearningCard`, Search Ranking's Personal Relevance signal (`docs/SEARCH_INDEX_MANIFEST.md`) |
| Written by | `MarkCompleteControl`, automatic completion detection (per `docs/MODULE_EXPERIENCE.md`'s Completion section) |
| Derived state | Module-level and path-level completion percentages are computed from article-level Progress, never stored independently — avoiding the exact drift `docs/REPOSITORY_SYNCHRONIZATION.md`'s single-source-of-truth principle warns against |

## Bookmarks

| Aspect | Detail |
|---|---|
| Type | Account state |
| Contains | The set of bookmarked article IDs, Favorites (a flagged subset), Pinned Articles (a small, temporary subset), Reading Lists (named groupings) — per `docs/BOOKMARK_SYSTEM.md` |
| Read by | `BookmarkToggle`, `BookmarkList`, `BookmarkCard`, Search's Bookmarks facet |
| Written by | `BookmarkToggle`, `ReadingListEditor` |
| Notes | A bookmark stores only an article ID (a pointer), never article content, per `docs/MODULE_INDEX_STANDARD.md`'s explicit non-duplication rule |

## Notes

| Aspect | Detail |
|---|---|
| Type | Account state |
| Contains | Personal Notes (free text, attached to an article ID, private by default), the Shared visibility flag, Manager Notes (a distinct type, authored by a manager about an advisor) — per `docs/NOTES_SYSTEM.md` |
| Read by | `PersonalNoteEditor`, `ManagerNoteEditor`, Notes Page |
| Written by | `PersonalNoteEditor`, `ManagerNoteEditor` |
| Notes | Manager Notes' visibility and retention behavior remains gated on the unresolved Sensitivity policy question in `docs/NOTES_SYSTEM.md` — this state domain is specified here but not proposed to actually collect Manager Notes data until that policy is resolved, per `docs/RELEASE_STRATEGY.md`'s Manager Beta gate |

## AI

| Aspect | Detail |
|---|---|
| Type | Session state by default; account state where Conversation Memory is enabled, per `docs/AI_ASSISTANT_BLUEPRINT.md` |
| Contains | The current conversation's message history, active context scope (`moduleId`, if any), and — where persisted — past conversations for the AI Conversation History Page |
| Read by | `AskAIPanel`, `AIMessageBubble`, `ConversationHistoryList` |
| Written by | Each AI query/response cycle, per `docs/AI_RETRIEVAL_MANIFEST.md`'s Retrieval Pipeline |
| Notes | Per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Conversation Memory section, this state stores only the conversation itself — it is never treated as a second, informal fact base the Assistant draws on; every response is re-grounded in retrieval each time |

## Search

| Aspect | Detail |
|---|---|
| Type | Session state (current query and applied filters); account state (Recent Searches) |
| Contains | The current query string, applied Filters (Module, Topic, Role, Problem), and a log of past queries |
| Read by | `SearchInput`, `FacetFilterPanel`, `RecentSearchesList`, `AutocompleteDropdown` |
| Written by | `SearchInput`, `FacetFilterPanel` |
| Notes | Distinct from History below — Search state logs searched terms, History logs viewed content, per `docs/BOOKMARK_SYSTEM.md`'s explicit distinction |

## History

| Aspect | Detail |
|---|---|
| Type | Account state |
| Contains | A complete, unbounded log of every article a learner has viewed, per `docs/BOOKMARK_SYSTEM.md`'s History concept |
| Read by | `RecentActivityCard` (a short, truncated view of History's most recent entries, per `docs/INFORMATION_ARCHITECTURE.md`'s Recent section) |
| Written by | Every Lesson Page view |
| Derived state | Recent (the Dashboard widget) is a derived, truncated slice of History, never stored as a second independent log |

## Manager

| Aspect | Detail |
|---|---|
| Type | Account state, scoped to the manager's own team |
| Contains | The Sales Manager's direct-report list, aggregated team Progress and Completion (derived from each report's own Progress state, never independently entered), Manager Notes authored by this manager |
| Read by | `TeamProgressSummary`, `AdvisorProgressRow`, Manager Dashboard |
| Written by | `ManagerNoteEditor`; team-membership data is proposed to be written by the Admin Console, not by the manager directly |
| Notes | Team-level Progress and Completion figures are always computed live from individual advisors' Progress state, per `docs/LEARNING_ANALYTICS.md`'s Data Discipline — never a separately maintained, potentially-stale aggregate |

## Career Advisor

| Aspect | Detail |
|---|---|
| Type | Account state |
| Contains | The learner's own profile-adjacent state relevant to personalization: active Learning Path enrollment, book-of-business Role Collection affiliation (used for Search's Personal Relevance signal and Dashboard's Recommended Content), Difficulty/tenure signal if used for path recommendation |
| Read by | `PathCard` enrollment status, `RecommendedContentCard`, Search Ranking's Personal Relevance signal |
| Written by | Onboarding / First-Run Screen, Learning Path enrollment action |
| Notes | This state domain is deliberately narrow — it does not duplicate Progress, Bookmarks, or History, which are tracked as their own domains above; it exists specifically for personalization inputs not covered elsewhere |

## State Domain Relationships

| Domain | Depends On | Feeds Into |
|---|---|---|
| Progress | Authentication | Dashboard, Manager (aggregated), Search Ranking, Learning Analytics |
| Bookmarks | Authentication | Dashboard, Search's Bookmarks facet |
| Notes | Authentication, Progress (for context) | Notes Page, Manager (Manager Notes only, policy-gated) |
| AI | Authentication (for Conversation Memory only) | AI Conversation History Page |
| Search | None (works pre-authentication for public content, where applicable) | Recent Searches display |
| History | Authentication | Dashboard's Recent Activity |
| Manager | Authentication, Progress (of direct reports) | Manager Dashboard, Team Progress Detail |
| Career Advisor | Authentication | Dashboard personalization, Search Ranking |

## What This Document Does Not Do

This document does not specify a state-management library (Redux, Zustand, React Context, server-side session storage, or otherwise), a specific database schema, or a caching strategy. It specifies what state exists and its ownership and dependency relationships so any implementation approach can be evaluated against a shared, complete picture rather than discovered piecemeal during a future build.

## Related Documents

- `docs/API_CONTRACTS.md` — the backend contracts that read and write the account-state domains above
- `docs/COMPONENT_LIBRARY.md` — the components that read each state domain
- `docs/LEARNING_ANALYTICS.md` — the analytics computed from Progress and Quiz Results state
- `docs/NOTES_SYSTEM.md` — the unresolved Manager Notes policy question this document's Notes domain is gated on
