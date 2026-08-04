# Dashboard Component Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** Every card and widget rendered on the Career Advisor Dashboard and its Manager/Career-Advisor-specific variants
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document gives each Dashboard widget already named in `docs/DASHBOARD_EXPERIENCE.md` and `docs/COMPONENT_LIBRARY.md` a full implementation contract. It does not redesign widget content or Dashboard layout — `docs/DASHBOARD_EXPERIENCE.md` remains the authoritative source for what appears and why; this document specifies how each widget behaves as a component.

## Continue Learning

**Purpose.** The Dashboard's primary, highest-visual-weight card, per `docs/DASHBOARD_EXPERIENCE.md`'s Layout section.

**Responsibilities.** Show the single most likely next action: resume the last-viewed article, or — for a new learner — the Onboarding recommendation.

**Inputs:** History state (last-viewed article), active Learning Path enrollment (per `docs/STATE_MANAGEMENT.md` Career Advisor state), Progress state.

**Outputs:** Navigation intent to the relevant Lesson Page or Onboarding flow.

**Props:** None — this widget reads directly from account state rather than being parameterized by a parent, since it is Dashboard-specific and not reused elsewhere.

**State:** None locally; derives its display entirely from the state domains above.

**Events:** `onResume()`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Progress and Career Advisor state, `docs/API_CONTRACTS.md` Progress contract.

**Responsive behavior:** Full-width on mobile; largest card in the desktop grid, per `docs/DASHBOARD_EXPERIENCE.md`.

**Accessibility:** The resume action is a single, clearly labeled primary button — not an entire card surface as an ambiguous click target — so a screen-reader user encounters one unambiguous action, not a card-wide link competing with any secondary text inside it.

**Error states:** If History or Progress state fails to load, the card falls back to the Onboarding recommendation rather than showing a broken or empty primary card, since a next-best action is more useful than a visible failure in the Dashboard's most prominent position.

**Loading states:** A skeleton matching this card's eventual shape (title bar, one action button) while state resolves.

**Future extensibility:** Could surface a Trainer-assigned next module (Post-MVP custom sequencing, per `docs/IMPLEMENTATION_SEQUENCE.md` Phase 3) without changing this component's contract, since "what's next" is already an input the component receives rather than something it computes independently.

## Recent Activity

**Purpose.** A short, automatic list of recently viewed articles, per `docs/INFORMATION_ARCHITECTURE.md`'s Recent section.

**Responsibilities.** Render a bounded, truncated slice of History state; link each entry to its article.

**Inputs:** History state.

**Outputs:** Navigation intent per entry.

**Props:** `limit` (the truncation count; a display parameter, not a data field this document invents a specific value for — left to `docs/DESIGN_SYSTEM_SPEC.md`'s spacing/density conventions and an implementation team's own judgment).

**State:** None.

**Events:** `onSelectEntry(articleId)`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` History state (a derived, truncated read — this widget never writes History).

**Responsive behavior:** Reduces to a shorter list on mobile to preserve vertical scroll length, per the general mobile-density principle in `docs/APP_LAYOUT_SPEC.md`.

**Accessibility:** Rendered as an ordered list (most recent first), announced as such to assistive technology.

**Error states:** Empty History (new learner) renders the honest empty state defined in `docs/DASHBOARD_EXPERIENCE.md`'s Empty States section — an explanation of what will appear once the learner has activity, never a fabricated example entry.

**Loading states:** Skeleton rows matching the eventual list shape.

**Future extensibility:** None proposed beyond its current scope.

## Bookmarks

**Purpose.** A compact preview of the learner's most recently bookmarked articles, per `docs/DASHBOARD_EXPERIENCE.md`.

**Responsibilities.** Render a small subset of Bookmarks state; link to the full Bookmarks Page.

**Inputs:** Bookmarks state.

**Outputs:** Navigation intent per entry, and to the Bookmarks Page.

**Props:** `limit` (display parameter, as above).

**State:** None.

**Events:** `onSelectBookmark(articleId)`, `onViewAll()`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Bookmarks state, `docs/API_CONTRACTS.md` Bookmarks contract.

**Responsive behavior:** Collapses to fewer visible entries on mobile.

**Accessibility:** Each entry exposes its bookmark status so a learner using assistive technology can distinguish this widget's list from the visually similar Recent Activity list.

**Error states:** Empty Bookmarks renders an honest empty state explaining how to bookmark an article, per the same discipline as Recent Activity above.

**Loading states:** Skeleton rows.

**Future extensibility:** Could surface Favorites specifically (per `docs/BOOKMARK_SYSTEM.md`) rather than most-recent, as a configurable display mode, without changing the component's data dependency.

## Assessments

**Purpose.** A Dashboard entry point into in-progress or newly available assessments, extending `docs/DASHBOARD_EXPERIENCE.md`'s widget set with the Assessments feature named in `docs/FEATURE_SPECIFICATIONS.md`.

**Responsibilities.** Surface any in-progress Knowledge Check, Quiz, or Scenario Test attempt, and any newly unlocked assessment tied to a just-completed module.

**Inputs:** Assessment Attempt state (per `docs/API_CONTRACTS.md` Assessments contract), Progress state (to determine newly unlocked assessments).

**Outputs:** Navigation intent to the relevant Assessment Template screen (`docs/PAGE_TEMPLATES.md`).

**Props:** None.

**State:** None locally.

**Events:** `onResumeAttempt(attemptId)`, `onStartAssessment(assessmentId)`.

**Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`, `docs/API_CONTRACTS.md` Assessments.

**Responsive behavior:** Standard card collapse on mobile, consistent with other Dashboard widgets.

**Accessibility:** Distinguishes an in-progress attempt from a newly available assessment using text labels, not color alone, per this document's general Accessibility rule.

**Error states:** No assessments available or in progress: an honest empty state, never a fabricated "assessment ready" prompt.

**Loading states:** Skeleton card.

**Future extensibility:** Certification Exam readiness (Post-MVP) surfaces through this same widget once a learner nears a path's completion criteria, without a new widget being required.

## Recommended Modules

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `RecommendedContentCard`, per `docs/DASHBOARD_EXPERIENCE.md`'s Recommended Content card.

**Responsibilities.** Surface what to look at next, sourced from the active Learning Path's completion order or, once a path is complete, from a relevant Role Collection or `*-intelligence` module.

**Inputs:** Active Learning Path state, the Recommended Learning Graph per `docs/KNOWLEDGE_GRAPH.md`, book-of-business Role Collection affiliation (Career Advisor state).

**Outputs:** Navigation intent to the recommended module.

**Props:** None.

**State:** None locally.

**Events:** `onSelectRecommendation(moduleId)`.

**Dependencies:** `docs/LEARNING_PATHS.md`, `docs/KNOWLEDGE_GRAPH.md` Recommended Learning Graph, `docs/CONTENT_MANIFEST.md`.

**Responsive behavior:** Reduces the number of simultaneously visible recommendations on mobile.

**Accessibility:** Each recommendation states its source ("next in your path" vs. "based on your book of business") as visible text, not an icon-only indicator, so the reasoning is available to assistive technology as well as sighted users.

**Error states:** No path active and no book-of-business affiliation set: falls back to the Onboarding recommendation, matching Continue Learning's own fallback, rather than an empty widget duplicating that card's empty state without explanation.

**Loading states:** Skeleton cards.

**Future extensibility:** A more advanced recommendation signal (once real usage data exists) can replace the current path/graph-based source without changing this component's props or events, since recommendation logic is already abstracted behind the `docs/KNOWLEDGE_GRAPH.md` Recommended Learning Graph rather than embedded in this component.

## Search

**Purpose.** The Dashboard's Quick Actions entry into Search, distinct from the Search Overlay's own full specification in `docs/SEARCH_COMPONENT_SPEC.md`.

**Responsibilities.** A single action that opens the Search Overlay, optionally pre-populated with a Dashboard-context-aware Suggested Search per `docs/SEARCH_PRODUCT.md`'s Suggested Searches product detail.

**Inputs:** Active Learning Path (for context-aware suggestion).

**Outputs:** Overlay-open intent, handled at the shell level per `docs/APP_LAYOUT_SPEC.md`.

**Props:** None.

**State:** None.

**Events:** `onOpenSearch()`.

**Dependencies:** `docs/APP_LAYOUT_SPEC.md` shell-level Search Overlay, `docs/SEARCH_COMPONENT_SPEC.md`.

**Responsive behavior:** No change in behavior across breakpoints — always a single action.

**Accessibility:** A labeled button, keyboard-operable, consistent with the Header's own Search entry per `docs/APP_LAYOUT_SPEC.md`.

**Error states:** Not applicable.

**Loading states:** Not applicable.

**Future extensibility:** None beyond its current scope.

## Progress

**Purpose.** The Dashboard's own-progress display, per `docs/DASHBOARD_EXPERIENCE.md`'s Metrics section — modules completed and current Learning Path progress.

**Responsibilities.** Render `ProgressBar` and a short completion summary (e.g., current path's "N of M modules" figure, computed live).

**Inputs:** Progress state, aggregated per active Learning Path.

**Outputs:** Navigation intent to the Learning Path Detail Page for further detail.

**Props:** None.

**State:** None locally.

**Events:** `onViewPathDetail()`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Progress state, `docs/API_CONTRACTS.md` Progress contract.

**Responsive behavior:** Standard card collapse.

**Accessibility:** The progress figure is announced as text ("7 of 13 modules complete"), not conveyed by a bar's visual fill alone.

**Error states:** No active path: renders a prompt to enroll in one, per `docs/DASHBOARD_EXPERIENCE.md`'s empty-state discipline — never an invented or zeroed-out progress bar implying a path exists when none does.

**Loading states:** Skeleton bar.

**Future extensibility:** None beyond its current scope — per `docs/DASHBOARD_EXPERIENCE.md`'s explicit statement that this Dashboard proposes no aggregate, cross-learner, or benchmark metric, this widget is not proposed to grow into a comparative display.

## Manager Widgets

**Purpose.** The Manager Dashboard's own widget set, distinct from but structurally parallel to the Career Advisor Dashboard's — fully specified in `docs/MANAGER_COMPONENT_SPEC.md`. This entry exists so the Dashboard component family is complete in one document; it does not restate that sibling document's content.

**Dependencies:** `docs/MANAGER_COMPONENT_SPEC.md`.

## Career Advisor Widgets

**Purpose.** Confirms, by name, that every widget specified above (Continue Learning through Progress) collectively constitutes the Career Advisor's own widget set — this section is a pointer, not a thirteenth widget.

## Quick Actions

**Purpose.** A small set of one-click shortcuts, per `docs/DASHBOARD_EXPERIENCE.md`'s Cards section and `docs/INFORMATION_ARCHITECTURE.md`'s Quick Access concept.

**Responsibilities.** Render Search, Ask AI, and "view current Learning Path" as compact actions in one row or cluster, distinct from the larger Search widget above in that Quick Actions groups multiple shortcuts together rather than dedicating a full card to one.

**Inputs:** Active Learning Path (to determine the third shortcut's target).

**Outputs:** Overlay-open intent (Search, Ask AI) or navigation intent (Learning Path Detail).

**Props:** None.

**State:** None.

**Events:** `onOpenSearch()`, `onOpenAI()`, `onViewActivePath()`.

**Dependencies:** `docs/APP_LAYOUT_SPEC.md` shell overlays, `docs/AI_CHAT_COMPONENT_SPEC.md`.

**Responsive behavior:** Remains a compact row even on mobile, since its individual actions are already icon-plus-label sized rather than full cards.

**Accessibility:** Each action is independently keyboard-focusable with a distinct accessible label.

**Error states:** Not applicable.

**Loading states:** Not applicable — Quick Actions are static shortcuts, not data-dependent displays.

**Future extensibility:** A fourth shortcut (e.g., "view Certificates" once that feature ships) can be added without restructuring, since this is already a flexible action row rather than a fixed three-item layout.

## Related Documents

- `docs/DASHBOARD_EXPERIENCE.md` — the widget content and layout this document gives component contracts to
- `docs/COMPONENT_LIBRARY.md` — the underlying component names (`ContinueLearningCard` and the rest) this document specifies in full
- `docs/MANAGER_COMPONENT_SPEC.md` — the Manager Dashboard's own widget set
- `docs/STATE_MANAGEMENT.md`, `docs/API_CONTRACTS.md` — the state and contracts every widget above depends on
