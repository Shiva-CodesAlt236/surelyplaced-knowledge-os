# Page Templates

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** The reusable layout structure behind every screen in `docs/SCREEN_INVENTORY.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies ten reusable page layouts, each assembled from the components in `docs/COMPONENT_LIBRARY.md` and rendered at the routes in `docs/ROUTE_REGISTRY.md`. A layout here describes region placement and which component occupies each region — not visual design. Several distinct screens in `docs/SCREEN_INVENTORY.md` share one template where their structure is genuinely the same; this document says so explicitly rather than treating every screen as needing its own bespoke layout.

## Dashboard Template

**Used by:** Career Advisor Dashboard.

**Regions:**
- **Primary (largest, topmost)** — `ContinueLearningCard`
- **Secondary grid (below or beside primary)** — `RecommendedContentCard` (multiple), `BookmarkCard` (compact preview), `RecentActivityCard` (list)
- **Quick Actions strip** — `IconButton` row: Search, Ask AI, current Learning Path

**Empty state:** Where no Progress or History exists yet, Primary renders the Onboarding recommendation instead of a resume point, and the Secondary grid renders `MetricEmptyState` in place of each widget, per `docs/DASHBOARD_EXPERIENCE.md`'s Empty States.

**Responsive behavior:** Single column on mobile, multi-column on desktop, per `docs/DASHBOARD_EXPERIENCE.md`'s Layout section.

## Learning Template

**Used by:** Learning Paths Landing Page, Learning Path Detail / Progress Page.

**Regions:**
- **Landing variant:** a grid of `PathCard`, one per path defined in `docs/LEARNING_PATHS.md`.
- **Detail variant:** header (path name, prerequisites, estimated hours), `MilestoneTracker`, an ordered list of module entries (reusing `ModuleCard` in a compact row form) reflecting the path's completion order, `ProgressBar` for overall path completion.

**Empty state:** A learner not yet enrolled in any path sees the Landing variant only, with no Detail variant reachable until enrollment.

## Lesson Template

**Used by:** Lesson / Article Page (both the standard and Role Collection variants, per `docs/MODULE_EXPERIENCE.md`).

**Regions:**
- **Left** — `SidebarTree` or `SidebarPathView`, per `docs/NAVIGATION_MANIFEST.md`'s Sidebar modes
- **Center** — Breadcrumbs, the article's unchanged content, `MarkCompleteControl`, `BookmarkToggle`
- **Right** — Right Navigation TOC (scroll-synced, generated from the article's own headings)
- **Bottom** — `RelatedArticlesList`, then the three action points (Practice, Quiz, Checklist) per `docs/MODULE_EXPERIENCE.md`, shown only where the underlying content or assessment exists, then Module Navigation (Previous / Next / Continue Learning)
- **Persistent, not a region** — an Ask AI entry point, pre-scoped to the current article

This same template renders the Module Landing Page's own overview article, so a Landing Page is this template plus one additional header region (see Learning Template's ModuleCard equivalent, rendered larger) rather than a wholly separate layout.

## Search Template

**Used by:** Search Results Page. The Search Overlay reuses this template's Center and Right regions only, rendered over the current page rather than as its own route, per `docs/UI_NAVIGATION_BLUEPRINT.md`.

**Regions:**
- **Left** — `FacetFilterPanel`
- **Center** — `SearchInput` at top, then a list of `SearchResultCard`
- **Right (Search Overlay only)** — `RecentSearchesList`, suggested searches

**Empty state:** No query yet: `RecentSearchesList` and Suggested Searches only. Query with zero results: an honest "no results" message with a suggestion to broaden the query or ask the AI Assistant instead — never a fabricated near-match.

## Assessment Template

**Used by:** Quiz / Knowledge Check Screen, Scenario Test Screen, Certification Exam Screen, Practice / Role Play Screen.

**Regions:**
- **Header** — assessment name, originating module or path, attempt/retake status per `docs/ASSESSMENT_FRAMEWORK.md`'s Completion Rules
- **Center** — the active runner component (`KnowledgeCheckRunner`, `QuizRunner`, `ScenarioTestRunner`, or `RolePlayRunner`, per assessment type)
- **Footer** — submit/next controls, and after submission, `FormativeFeedbackPanel`

**Certificate variant:** Certification Exam's completion state routes to `CertificateView` rather than `FormativeFeedbackPanel`, per `docs/FEATURE_SPECIFICATIONS.md`'s Certificates entry.

## Bookmarks Template

**Used by:** Bookmarks Page.

**Regions:**
- **Left** — filter controls (Module, Topic, Role, per `docs/SEARCH_TAXONOMY.md`), and Reading Lists navigation
- **Center** — `BookmarkList`, or `ReadingListEditor` when a specific Reading List is open

**Empty state:** No bookmarks yet — an explanation of how to bookmark an article from a Lesson Page, never a fabricated example bookmark.

## Notes Template

**Used by:** Notes Page.

**Regions:**
- **Left** — grouping controls (by article, by module)
- **Center** — a list of notes, each linking back to its source article, using `PersonalNoteEditor` for editing in place

**Manager variant:** Where a Sales Manager views Manager Notes about an advisor (via the Team Progress Detail Screen rather than this route directly), the same Center region reuses `ManagerNoteEditor` instead — gated on the unresolved Sensitivity policy per `docs/NOTES_SYSTEM.md`, so this variant renders nothing until that policy is resolved per `docs/RELEASE_STRATEGY.md`'s Manager Beta gate.

## AI Chat Template

**Used by:** Ask AI Panel, AI Conversation History Page.

**Regions:**
- **Panel variant:** a persistent or slide-over column — message history (`AIMessageBubble`, stacked), `SuggestedPromptChip` row (shown only at conversation start or after a topic shift), input field, and `CitationList` attached to each Assistant message
- **History variant:** a list of past conversations, each summarized, linking into the Panel variant with that conversation reloaded

**Empty state:** A new conversation shows context-aware `SuggestedPromptChip` options and no message history, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Suggested Prompts.

## Role Collection Template

**Used by:** Role Collection Landing Page, and its Lesson pages via the Lesson Template's Role Collection variant.

**Regions:** Identical to the Module Landing Page portion of the Lesson Template, with one addition: a `RoleCategoryBadge` in the header, and the Related Modules section specifically surfacing cross-collection references per `docs/MODULE_EXPERIENCE.md`'s Role Collection Variant.

This document does not define a separate structural template for Role Collections beyond this one addition — per `docs/AI_CONTEXT_PACK.md` §6, every Role Collection article already uses the same seven-section shape as any other module, so no new layout logic is required.

## Candidate Collection Template

**Used by:** the Candidate Intelligence Framework's schema-file landing (`/browse/candidate-intelligence`) and each schema file's own page (README, PROFILE_SCHEMA, ROLE_CLASSIFICATION, and the rest).

**Regions:**
- **Landing** — a list of the ten schema files plus links into `reference-profile` and the Collections Browse sub-view (per `docs/INFORMATION_ARCHITECTURE.md`'s Collections section)
- **Schema file page** — reuses the Lesson Template's Center and Right regions unchanged, since a schema file is still a standard MDX document; the only distinction from an ordinary Lesson page is that its Sidebar entry displays in `UPPERCASE_SNAKE_CASE` per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5's stated exception

## Template Reuse Summary

| Template | Distinct Screens Served |
|---|---|
| Dashboard | 1 |
| Learning | 2 |
| Lesson | 3 (standard Lesson, Module Landing, Role Collection Lesson) |
| Search | 2 (Search Results Page, Search Overlay) |
| Assessment | 4 |
| Bookmarks | 1 |
| Notes | 1 (plus Manager variant) |
| AI Chat | 2 |
| Role Collection | 1 (plus shares Lesson Template underneath) |
| Candidate Collection | 2 |

This reuse is deliberate: `docs/SCREEN_INVENTORY.md` names more individual screens than this document defines templates for, because several screens are genuinely the same layout with a different data source — exactly the kind of implementation efficiency this manifest exists to make explicit rather than leaving to be rediscovered during a future build.

## Related Documents

- `docs/SCREEN_INVENTORY.md` — the screens these templates render
- `docs/COMPONENT_LIBRARY.md` — the components assembled into each template's regions
- `docs/ROUTE_REGISTRY.md` — the routes each template is rendered at
- `docs/NAVIGATION_MANIFEST.md` — the Sidebar and Right Navigation regions shared across most templates
