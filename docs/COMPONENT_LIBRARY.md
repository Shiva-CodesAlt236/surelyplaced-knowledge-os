# Component Library

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** Every UI component required to build the screens in `docs/SCREEN_INVENTORY.md` and the page templates in `docs/PAGE_TEMPLATES.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document lists every component the Academy platform requires, at a behavioral and data-dependency level — what a component shows and what it needs, never visual design (no colors, spacing, typography, or code), consistent with `docs/UI_NAVIGATION_BLUEPRINT.md`'s own stated scope boundary. Every component below traces to a specific screen, feature, or navigation element already specified in a prior document; this document does not introduce a new product concept, only the reusable building block for one that already exists.

## Cards

| Component | Purpose | Data Dependency | Used In |
|---|---|---|---|
| `ModuleCard` | Summarizes one module or Role Collection for a list view | `docs/CONTENT_MANIFEST.md` manifest record | Browse, Search results |
| `PathCard` | Summarizes one Learning Path | `docs/LEARNING_PATHS.md` path definition | Learning Paths Landing Page |
| `ContinueLearningCard` | The Dashboard's primary card | Progress state, per `docs/STATE_MANAGEMENT.md` | Career Advisor Dashboard |
| `RecommendedContentCard` | A single recommended-next-article suggestion | Recommended Learning Graph, per `docs/KNOWLEDGE_GRAPH.md` | Dashboard, Module Landing Page completion |
| `BookmarkCard` | A single bookmarked article preview | Bookmarks state | Dashboard, Bookmarks Page |
| `RecentActivityCard` | A single recently viewed article entry | History state, per `docs/BOOKMARK_SYSTEM.md`'s History concept | Dashboard |
| `MilestoneCard` | A single Learning Path milestone's status | `docs/LEARNING_PATHS.md` milestone definitions, Progress state | Learning Path Detail Page |

## Buttons

| Component | Purpose | Notes |
|---|---|---|
| `PrimaryActionButton` | The single dominant action on a screen (Start Module, Continue, Submit) | One per screen, per standard product-design convention this document assumes but doesn't re-derive |
| `SecondaryActionButton` | A supporting action (bookmark, mark complete) | May appear multiple times per screen |
| `IconButton` | A compact, icon-only action (open Ask AI, open Search Overlay, close a panel) | Requires an accessible label even without visible text, per `docs/DEPLOYMENT_READINESS_CHECKLIST.md`'s accessibility gate |

## Search

| Component | Purpose | Data Dependency |
|---|---|---|
| `SearchInput` | The text entry field, shared by the Search Overlay and Search Results Page | None until a query is typed |
| `SearchOverlay` | The keyboard-accessible overlay defined in `docs/UI_NAVIGATION_BLUEPRINT.md` | `docs/SEARCH_INDEX_MANIFEST.md`'s search index |
| `FacetFilterPanel` | Renders the Module, Topic, Role, and (Post-MVP) Problem facets as selectable chips | `docs/SEARCH_INDEX_MANIFEST.md`'s Filters |
| `SearchResultCard` | A single result, per `docs/SEARCH_INDEX_MANIFEST.md`'s Result Cards spec | Article Document schema |
| `AutocompleteDropdown` | Live suggestions as a learner types | `docs/SEARCH_INDEX_MANIFEST.md`'s Autocomplete |
| `RecentSearchesList` | The learner's own past queries | Search state, per `docs/STATE_MANAGEMENT.md` |

## Sidebar

| Component | Purpose | Data Dependency |
|---|---|---|
| `SidebarTree` | Renders the Browse-mode full content hierarchy | `meta.json` "pages" arrays, existing Fumadocs behavior |
| `SidebarPathView` | Renders the Path-mode scoped view | `docs/LEARNING_PATHS.md`, active enrollment state |
| `SidebarModeToggle` | Switches between Browse and Path mode | Active Learning Path state |
| `CompletionIndicator` | A small status marker (not started / in progress / complete) attached to a Sidebar entry | Progress state |

## Progress

| Component | Purpose | Data Dependency |
|---|---|---|
| `ProgressBar` | A linear completion indicator (e.g., "7 of 13 modules") | Progress state, aggregated per `docs/LEARNING_PATHS.md`'s completion order |
| `MilestoneTracker` | A sequence of milestone markers with current-position indicator | `docs/LEARNING_PATHS.md` milestones, Progress state |
| `CompletionBadge` | A binary or three-state (not started / in progress / complete) badge | Progress state |
| `MarkCompleteControl` | The explicit action a learner uses to confirm article completion | Per `docs/MODULE_EXPERIENCE.md`'s Completion section |

## Assessment

| Component | Purpose | Data Dependency |
|---|---|---|
| `KnowledgeCheckRunner` | Presents and scores a short per-article assessment | `docs/ASSESSMENT_FRAMEWORK.md`'s Knowledge Checks |
| `QuizRunner` | Presents and scores a per-module assessment | `docs/ASSESSMENT_FRAMEWORK.md`'s Quizzes |
| `ScenarioTestRunner` | Presents a situation-based assessment and captures a free-form or categorical response | `docs/ASSESSMENT_FRAMEWORK.md`'s Scenario Tests |
| `RolePlayRunner` | Runs a simulated practice conversation, advisor or manager variant | `docs/ASSESSMENT_FRAMEWORK.md`'s Role Plays, existing Composite Case Studies |
| `FormativeFeedbackPanel` | Displays reasoning-based feedback rather than a bare score | Per `docs/ASSESSMENT_FRAMEWORK.md`'s Scoring Philosophy |
| `CertificateView` | Displays and allows download of an earned certificate | Certification Exam result, path name, completion date only — no numeric score, per `docs/FEATURE_SPECIFICATIONS.md`'s Certificates entry |

## Bookmarks

| Component | Purpose | Data Dependency |
|---|---|---|
| `BookmarkToggle` | The save/unsave control on a Lesson Page | Bookmarks state |
| `BookmarkList` | The full filterable list on the Bookmarks Page | Bookmarks state, `docs/SEARCH_TAXONOMY.md` filter categories |
| `ReadingListEditor` | Creates and edits a named grouping of bookmarks | Per `docs/BOOKMARK_SYSTEM.md`'s Reading Lists |
| `PinnedArticleIndicator` | Marks a temporarily pinned article | Per `docs/BOOKMARK_SYSTEM.md`'s Pinned Articles |

## AI

| Component | Purpose | Data Dependency |
|---|---|---|
| `AskAIPanel` | The primary conversation surface, persistent or slide-over | `docs/AI_RETRIEVAL_MANIFEST.md`'s pipeline |
| `AIMessageBubble` | A single turn in the conversation, learner or Assistant | Conversation state |
| `CitationList` | Renders the sources an Assistant response cites, as real links | Per `docs/AI_RETRIEVAL_MANIFEST.md`'s Citation Rules |
| `SuggestedPromptChip` | A context-aware suggested question | Per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Suggested Prompts |
| `UnknownAnswerNotice` | The explicit deferral shown when the Assistant can't answer | Per `docs/AI_RETRIEVAL_MANIFEST.md`'s Refusal Behaviour |
| `ConversationHistoryList` | Past conversations, per the AI Conversation History Page | Conversation Memory state |

## Knowledge Cards

| Component | Purpose | Data Dependency |
|---|---|---|
| `KnowledgeSummaryCard` | A condensed, scannable preview of an article's Key Takeaways section | Existing `## Key Takeaways` content, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6 |
| `RelatedArticlesList` | Renders an article's existing Related Articles section as navigable cards | Existing `## Related Articles` and `related` frontmatter |
| `CrossModuleAlignmentBanner` | Surfaces an article's existing Cross-Module Alignment content prominently | Existing `## Cross-Module Alignment` section |

## Role Cards

| Component | Purpose | Data Dependency |
|---|---|---|
| `RoleCollectionCard` | Summarizes a Role Collection for the Collections Browse sub-view, per `docs/INFORMATION_ARCHITECTURE.md` | `docs/CONTENT_MANIFEST.md` Role Collection entries |
| `RoleCategoryBadge` | A compact `ROLE-*` code badge | `content/docs/candidate-intelligence/ROLE_CLASSIFICATION.mdx` |

## Analytics Cards

| Component | Purpose | Data Dependency |
|---|---|---|
| `MetricEmptyState` | The honest "no data yet" display, per `docs/LEARNING_ANALYTICS.md`'s Data Discipline | Used whenever a metric has no real data to show — the default state for nearly every analytics component until real usage exists |
| `CompletionMetricCard` | Displays a real, computed Completion figure once data exists | Completion state, per `docs/LEARNING_ANALYTICS.md` |
| `KnowledgeGapPanel` | Surfaces detected Knowledge Gaps | Per `docs/LEARNING_ANALYTICS.md`'s Knowledge Gap Detection |
| `WeakAreasList` | The learner-facing counterpart to Knowledge Gap Detection | Per `docs/LEARNING_ANALYTICS.md`'s Weak Areas |
| `MilestoneRecognitionFeed` | The non-comparative recognition view proposed in place of a leaderboard | Per `docs/LEARNING_ANALYTICS.md`'s Leaderboard reconciliation note |

## Manager Widgets

| Component | Purpose | Data Dependency |
|---|---|---|
| `TeamProgressSummary` | Aggregate team-level Progress and Completion, on the Manager Dashboard | Team-scoped Progress state |
| `AdvisorProgressRow` | A single advisor's status in a team list | Per-advisor Progress state |
| `ManagerRolePlayReviewPanel` | Presents a recorded or simulated conversation for manager review | Per `docs/ASSESSMENT_FRAMEWORK.md`'s manager Role Plays |
| `ManagerNoteEditor` | Captures a manager's own annotation about an advisor | Per `docs/NOTES_SYSTEM.md`'s Manager Notes — gated on the Sensitivity note's unresolved policy question before this component collects or displays anything |

## Career Advisor Widgets

| Component | Purpose | Data Dependency |
|---|---|---|
| `PersonalProgressSummary` | The Career Advisor's own Progress and Completion view | Personal Progress state |
| `PersonalWeakAreasWidget` | The Career Advisor's own Weak Areas view | Personal Quiz Results |
| `PersonalNoteEditor` | Captures a Personal Note from the Lesson Page | Per `docs/NOTES_SYSTEM.md`'s Personal Notes |
| `NoteVisibilityToggle` | Marks a Personal Note as Shared with a manager | Per `docs/NOTES_SYSTEM.md`'s Private vs. Shared visibility model |

## What This Document Does Not Do

This document does not specify a component library framework (React, Vue, or otherwise), a design system, styling approach, or prop-level API for any component above — those are implementation decisions for whichever engineering team builds this platform, informed by this document's behavioral and data-dependency specification but not dictated by it.

## Related Documents

- `docs/PAGE_TEMPLATES.md` — the layouts these components are assembled into
- `docs/SCREEN_INVENTORY.md` — the screens each component group ultimately serves
- `docs/STATE_MANAGEMENT.md` — the state each component's data dependency reads from
- `docs/CONTENT_MANIFEST.md`, `docs/SEARCH_INDEX_MANIFEST.md`, `docs/AI_RETRIEVAL_MANIFEST.md` — the underlying data schemas several component groups depend on
