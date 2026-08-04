# Learning Component Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** Every component behind the Module Landing Page, Lesson Page, and Learning Path screens
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document gives full component contracts to the learning-flow elements already specified in `docs/MODULE_EXPERIENCE.md`, `docs/PAGE_TEMPLATES.md`'s Lesson and Learning Templates, and `docs/COMPONENT_LIBRARY.md`. It does not redesign page-level behavior — `docs/MODULE_EXPERIENCE.md` remains authoritative for what a Landing Page or Lesson Page does; this document specifies the components that make that behavior real.

## Module Page

**Purpose.** Implementation contract for the Module Landing Page, per `docs/MODULE_EXPERIENCE.md`'s Landing Page section and `docs/PAGE_TEMPLATES.md`'s Lesson Template header region.

**Responsibilities.** Render the module's Overview article unchanged; render populated `docs/MODULE_INDEX_STANDARD.md` fields (Learning Objectives, Reading Time, Difficulty, Related Modules) where a future enrichment sprint has added them, omitting each field entirely where it hasn't, per that document's stated empty-state discipline; render the primary Start/Continue Module action.

**Inputs:** Module ID (route parameter, per `docs/ROUTE_REGISTRY.md`), Content Manifest record (per `docs/CONTENT_MANIFEST.md`), Progress state (for Completion Status and the primary action's label).

**Outputs:** Navigation intent into the first incomplete Lesson Page in `meta.json` order.

**Props:** `moduleId`.

**State:** None locally — entirely derived from the inputs above.

**Events:** `onStartOrContinue()`.

**Dependencies:** `docs/CONTENT_MANIFEST.md`, `docs/STATE_MANAGEMENT.md` Progress state, `docs/API_CONTRACTS.md` Progress contract.

**Responsive behavior:** Metadata fields (Learning Objectives, Reading Time, Difficulty) stack vertically on mobile rather than the desktop's row layout.

**Accessibility:** The primary action's label changes between "Start Module" and "Continue Module" based on Completion Status, and this label change is the accessible signal of state — not a color change alone.

**Error states:** A `moduleId` that doesn't resolve to a real module (per `docs/CONTENT_MANIFEST.md`'s live inventory) routes to `/404`, per `docs/ROUTE_REGISTRY.md`'s Error Pages.

**Loading states:** Skeleton matching the eventual header-plus-metadata shape while the manifest record loads.

**Future extensibility:** The Role Collection Landing Page variant (per `docs/MODULE_EXPERIENCE.md`'s Role Collection Variant) reuses this same component with an additional Related Modules treatment, rather than requiring a separate component.

## Lesson Page

**Purpose.** Implementation contract for the Lesson / Article Page, per `docs/MODULE_EXPERIENCE.md`'s Lesson Page section.

**Responsibilities.** Render the article's actual, unchanged content; render the surrounding chrome (Sidebar, Right TOC, Related Articles, action points, Module Navigation); expose the AI entry point pre-scoped to this article.

**Inputs:** Module ID and article slug (route parameters), the article's rendered MDX content, Progress state, Bookmarks state (for `BookmarkToggle`).

**Outputs:** Navigation intent (Previous/Next, Related Articles, action points), completion-write intent (Mark Complete), bookmark-write intent.

**Props:** `moduleId`, `articleSlug`.

**State:** None locally beyond transient UI state (e.g., whether the mobile Right-TOC-equivalent in-page outline is expanded, where offered).

**Events:** `onMarkComplete()`, `onToggleBookmark()`, `onNavigatePrevNext(direction)`, `onOpenAI()`.

**Dependencies:** `docs/CONTENT_MANIFEST.md`, `docs/STATE_MANAGEMENT.md` Progress and Bookmarks state, `docs/API_CONTRACTS.md` Progress and Bookmarks contracts, `docs/AI_CHAT_COMPONENT_SPEC.md` for the AI entry point's target experience.

**Responsive behavior:** Right TOC hidden per `docs/APP_LAYOUT_SPEC.md`'s Mobile Behaviour; action points and Module Navigation stack full-width.

**Accessibility:** The article's own heading structure (`##` sections) is preserved as real heading elements, not styled `div`s, so screen-reader users retain the same section-jump capability the Right TOC gives sighted users.

**Error states:** An `articleSlug` not present in the target module's `meta.json` routes to `/404`.

**Loading states:** Skeleton for chrome (Sidebar, TOC placeholders) while article content loads; the article content itself is proposed to load before the page is considered interactive, since a Lesson Page's core value is the article text.

**Future extensibility:** The Practical Scenario and Sales Conversation fields proposed in `docs/LESSON_STRUCTURE_STANDARD.md` would render as additional chrome within this same component once a future "Lesson" wrapper (distinct from the current plain article view) is built — this component's contract already reserves the structural position for that blueprint without committing to it today.

## Progress Bar

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `ProgressBar`.

**Responsibilities.** Render a linear completion indicator for a given scope (module or path).

**Inputs:** Completed count, total count (both derived server-side from Progress state per `docs/API_CONTRACTS.md`'s stated derived-state principle — this component never computes the aggregate itself from raw records).

**Outputs:** None — a read-only display component.

**Props:** `completed` (number), `total` (number), `label` (string, e.g. "modules" or "articles").

**State:** None.

**Events:** None.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Progress state (indirectly, via the parent component that supplies `completed`/`total`).

**Responsive behavior:** Scales width to container; no structural change across breakpoints.

**Accessibility:** Exposed with an accessible value (`aria-valuenow`/`aria-valuemin`/`aria-valuemax` or equivalent) and a text equivalent ("7 of 13"), never relying on visual fill percentage alone.

**Error states:** `total` of zero (a module with no defined completion scope) renders no bar rather than a divide-by-zero or empty-looking full bar.

**Loading states:** A skeleton bar (indeterminate, no numeric claim) while `completed`/`total` load.

**Future extensibility:** None beyond its current scope — deliberately kept minimal so it can be reused across Dashboard, Module Landing Page, and Learning Path Detail Page without variant-specific logic.

## Breadcrumbs

**Purpose.** Implementation contract for `docs/NAVIGATION_MANIFEST.md`'s Breadcrumbs section.

**Responsibilities.** Render the current page's position in the content hierarchy, per the patterns table already defined in `docs/NAVIGATION_MANIFEST.md`.

**Inputs:** Current route, resolved Module Name and Article Title (per `docs/CONTENT_MANIFEST.md` and the article's own frontmatter).

**Outputs:** Navigation intent per breadcrumb segment.

**Props:** `segments` (an ordered list of `{label, route}` pairs, computed by the parent page from route and manifest data — this component itself performs no resolution).

**State:** None.

**Events:** `onNavigateToSegment(route)`.

**Dependencies:** `docs/CONTENT_MANIFEST.md`, `docs/ROUTE_REGISTRY.md`.

**Responsive behavior:** Truncates middle segments on narrow viewports (showing first and last segment with an ellipsis indicator) rather than wrapping to multiple lines, to preserve vertical space above the article content.

**Accessibility:** Rendered as a `nav` landmark with `aria-label="Breadcrumb"`, using an ordered list semantically, per standard breadcrumb accessibility pattern.

**Error states:** Not applicable — Breadcrumbs render from already-resolved data; an unresolvable route has already been redirected to `/404` upstream.

**Loading states:** Not applicable — Breadcrumbs render synchronously with the page shell, before article content itself loads.

**Future extensibility:** None beyond its current scope.

## Previous / Next

**Purpose.** Implementation contract for `docs/NAVIGATION_MANIFEST.md`'s Module Navigation Previous/Next.

**Responsibilities.** Navigate to the adjacent article in the current module's `meta.json` order.

**Inputs:** Current module's ordered article list, current article slug.

**Outputs:** Navigation intent.

**Props:** `previousArticle` (`{title, slug} | null`), `nextArticle` (`{title, slug} | null`).

**State:** None.

**Events:** `onNavigatePrevious()`, `onNavigateNext()`.

**Dependencies:** `docs/CONTENT_MANIFEST.md` Children ordering.

**Responsive behavior:** Stacks as two full-width buttons on mobile rather than a side-by-side pair.

**Accessibility:** Each control's accessible label includes the target article's title ("Next: Resume Red Flags"), not a bare "Next," so a screen-reader user knows the destination before activating it.

**Error states:** At the first or last article in a module, the corresponding control is omitted (not rendered disabled), consistent with not implying a nonexistent adjacent article exists.

**Loading states:** Not applicable — resolved synchronously from already-loaded module data.

**Future extensibility:** Where a Learning Path is active, this component's `nextArticle` prop could resolve across a module boundary to the path's next module's first article rather than stopping at the current module's end — a future enhancement layered onto Continue Learning (per `docs/NAVIGATION_MANIFEST.md`'s explicit note that this may differ from in-module Previous/Next) rather than a change to this component itself.

## Knowledge Checks

**Purpose.** Implementation contract for the Knowledge Check entry point on a Lesson Page, per `docs/MODULE_EXPERIENCE.md`'s Quiz action point and `docs/ASSESSMENT_FRAMEWORK.md`.

**Responsibilities.** Render a link into the article's Knowledge Check where one exists; the assessment itself is rendered by `docs/ASSESSMENT_COMPONENT_SPEC.md`'s Quiz Layout, not duplicated here.

**Inputs:** Whether a Knowledge Check exists for the current article.

**Outputs:** Navigation intent to the Assessment route per `docs/ROUTE_REGISTRY.md`.

**Props:** `knowledgeCheckId` (`string | null`).

**State:** None.

**Events:** `onStartKnowledgeCheck()`.

**Dependencies:** `docs/ASSESSMENT_COMPONENT_SPEC.md`, `docs/API_CONTRACTS.md` Assessments contract.

**Responsive behavior:** Standard action-point stacking on mobile, per Lesson Page.

**Accessibility:** Standard labeled-button pattern.

**Error states:** No Knowledge Check exists: the action point is omitted, per `docs/MODULE_EXPERIENCE.md`'s "present only where the underlying content exists" rule.

**Loading states:** Not applicable — existence is resolved with the rest of the Lesson Page's initial data.

**Future extensibility:** None beyond its current scope.

## Completion Logic

**Purpose.** Not a rendered component but the shared logic every completion-aware component above (Module Page, Lesson Page, Progress Bar) depends on — specified once here to avoid restating it in each component's own entry.

**Responsibilities.** Determine when an article moves from "in progress" to "complete," per `docs/MODULE_EXPERIENCE.md`'s Completion section: either automatic detection (reaching the end of the article, where reliably detectable) or the explicit `MarkCompleteControl` action — both available, never automatic detection alone. Determine when a module is complete (its last article completes) and when a path milestone is reached (its constituent modules complete), per `docs/LEARNING_PATHS.md`'s milestone definitions.

**Inputs:** Scroll position or viewport-intersection signal (for automatic detection, where used), explicit Mark Complete action.

**Outputs:** A Progress state write, per `docs/API_CONTRACTS.md`'s Progress contract.

**Dependencies:** `docs/API_CONTRACTS.md` Progress contract (server-side aggregation, per its stated derived-state principle).

**Error states:** A failed completion write is retried or surfaced to the learner as a save failure — never silently discarded, since an unrecorded completion would desynchronize the Progress Bar and Sidebar's `CompletionIndicator` from the learner's actual activity.

**Future extensibility:** None beyond its current scope — this logic is deliberately centralized so any future completion-aware feature (a Certificate's completion criteria, a Trainer's cohort completion view) reads from the same source rather than reimplementing detection.

## Learning Paths

**Purpose.** Implementation contract for the Learning Paths Landing Page and Learning Path Detail / Progress Page, per `docs/PAGE_TEMPLATES.md`'s Learning Template.

**Responsibilities.** Landing: render `PathCard` for each of the five paths in `docs/LEARNING_PATHS.md`. Detail: render `MilestoneTracker`, the path's ordered module list, and overall `ProgressBar`.

**Inputs:** `docs/LEARNING_PATHS.md` path definitions (structure only — module names, order, milestones; prerequisites are read, not enforced client-side beyond a visible note), Progress state scoped to the path's modules, enrollment state.

**Outputs:** Navigation intent (into a path's detail, or into a specific module from the detail view), enrollment-write intent.

**Props:** `pathId` (Detail variant only).

**State:** None locally.

**Events:** `onEnroll(pathId)`, `onSelectModule(moduleId)`.

**Dependencies:** `docs/LEARNING_PATHS.md`, `docs/STATE_MANAGEMENT.md` Progress and Career Advisor state, `docs/API_CONTRACTS.md` Progress contract.

**Responsive behavior:** Landing's card grid collapses to a single column on mobile; Detail's module list remains a single column at all breakpoints.

**Accessibility:** Milestone markers include text state ("complete," "in progress," "not started"), not color-only indicators.

**Error states:** A `pathId` not matching one of the five defined paths routes to `/404`.

**Loading states:** Skeleton cards (Landing) or skeleton milestone/module list (Detail).

**Future extensibility:** Trainer-assigned custom sequencing (Post-MVP) would introduce a sixth, cohort-specific "path" instance built from existing modules — this component's contract already generalizes to "an ordered module list with milestones," so a custom sequence is a new data source feeding the same component, not a new component.

## Related Documents

- `docs/MODULE_EXPERIENCE.md`, `docs/LEARNING_PATHS.md` — the behavior this document gives component contracts to
- `docs/ASSESSMENT_COMPONENT_SPEC.md` — the full Knowledge Check / Quiz runner specification this document points to rather than duplicates
- `docs/CONTENT_MANIFEST.md`, `docs/STATE_MANAGEMENT.md`, `docs/API_CONTRACTS.md` — the data every component above depends on
- `docs/APP_LAYOUT_SPEC.md` — the Sidebar and Right TOC shell elements a Lesson Page renders inside
