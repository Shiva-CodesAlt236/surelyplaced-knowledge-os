# Manager Component Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** Every component behind the Manager Dashboard and its team-facing screens
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document gives full component contracts to the Manager-facing surfaces already named in `docs/FEATURE_SPECIFICATIONS.md`'s Manager Dashboard entry, `docs/SCREEN_INVENTORY.md`'s Manager and Trainer Screens, and `docs/LEARNING_ANALYTICS.md`'s Manager Dashboard analytics categories. It does not redesign what a Sales Manager sees or why — those documents remain authoritative; this document specifies the components.

## Dashboard

**Purpose.** The Sales Manager's home screen, distinct from the Career Advisor Dashboard, per `docs/FEATURE_SPECIFICATIONS.md`'s Manager Dashboard section and `docs/USER_JOURNEYS.md`'s Journey 3.

**Responsibilities.** Compose Team Overview, Knowledge Gaps, and Quick Actions into team-progress-driven navigation, per Journey 3's stated pattern of drilling into an individual advisor's progress rather than into content directly.

**Inputs:** Team-scoped Progress state (per `docs/STATE_MANAGEMENT.md` Manager state), the manager's direct-report list.

**Outputs:** Navigation intent into Team Overview detail or Coaching flows.

**Props:** None — reads the current manager's own team.

**State:** None locally.

**Events:** `onSelectAdvisor(advisorId)`, `onOpenCoaching()`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Manager state, `docs/API_CONTRACTS.md` Analytics contract (Manager scope).

**Responsive behavior:** Multi-column desktop grid collapsing to single column on mobile, consistent with the Career Advisor Dashboard's own layout pattern in `docs/DASHBOARD_COMPONENT_SPEC.md`.

**Accessibility:** Same landmark and labeling conventions as the Career Advisor Dashboard.

**Error states:** A manager with zero direct reports (a data/provisioning gap, not a normal state) shows an explicit "no team members assigned" message pointing to the Admin Console, rather than an empty dashboard that looks like a loading failure.

**Loading states:** Skeleton grid, per `docs/APP_LAYOUT_SPEC.md`'s region-level loading pattern.

**Future extensibility:** A Trainer Cohort Dashboard (Future tier) is a structurally parallel but distinct screen — cohort-scoped rather than direct-report-scoped — specified separately below rather than as a variant of this component, since `docs/USER_JOURNEYS.md` Journey 4 describes a genuinely different relationship (curriculum oversight, not people oversight).

## Team Overview

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `TeamProgressSummary` and `AdvisorProgressRow`, and the Team Progress Detail Screen per `docs/SCREEN_INVENTORY.md`.

**Responsibilities.** Summary: render aggregate team-level Progress and Completion (computed live from each direct report's own Progress state, never separately entered, per `docs/STATE_MANAGEMENT.md` Manager state's explicit derived-state note). Detail: drill into one advisor's module-by-module status, assessment results, and — where shared — their notes.

**Inputs:** Team-scoped Progress state (Summary), a single advisor's full Progress and Assessment history (Detail).

**Outputs:** Navigation intent from Summary into Detail; navigation intent from Detail into Manager Review (`docs/ASSESSMENT_COMPONENT_SPEC.md`) for a specific Role Play.

**Props:** `advisorId` (Detail variant only).

**State:** None locally.

**Events:** `onSelectAdvisor(advisorId)` (Summary), `onViewRolePlayReview(attemptId)` (Detail).

**Dependencies:** `docs/API_CONTRACTS.md` Analytics and Assessments contracts, `docs/ASSESSMENT_COMPONENT_SPEC.md` Manager Review.

**Responsive behavior:** Summary renders as a row-per-advisor list, condensing to fewer visible columns on mobile; Detail stacks its sections vertically at all breakpoints.

**Accessibility:** Each advisor row's status is stated in text (module counts, completion state), not conveyed by color-coded status alone.

**Error states:** An advisor row with incomplete data (e.g., not yet started their path) renders an honest "not started" state rather than an error.

**Loading states:** Skeleton rows (Summary) or skeleton section blocks (Detail).

**Future extensibility:** The Detail view's notes section is explicitly gated on `docs/NOTES_SYSTEM.md`'s Sensitivity policy resolution, per `docs/SCREEN_INVENTORY.md`'s own stated caveat ("where an advisor has made notes shareable — a proposed permission this document does not fully specify") — this component renders nothing in that section until the policy is resolved, consistent with `docs/RELEASE_STRATEGY.md`'s Manager Beta gate.

## Knowledge Gaps

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `KnowledgeGapPanel`, per `docs/LEARNING_ANALYTICS.md`'s Knowledge Gap Detection.

**Responsibilities.** Surface a pattern where the team consistently misses questions tied to a specific Learning Objective or Skill Covered, per `docs/MODULE_METADATA_STANDARD.md`.

**Inputs:** Aggregate Quiz Results across the manager's team, per `docs/LEARNING_ANALYTICS.md`.

**Outputs:** Navigation intent into the relevant module (to review the source content) or into Coaching (to address the gap directly).

**Props:** None — team-scoped to the current manager.

**State:** None locally.

**Events:** `onViewModule(moduleId)`, `onOpenCoaching(gapContext)`.

**Dependencies:** `docs/LEARNING_ANALYTICS.md` Knowledge Gap Detection, `docs/API_CONTRACTS.md` Analytics contract.

**Responsive behavior:** List layout at all breakpoints.

**Accessibility:** Each detected gap states its associated Learning Objective or Skill Covered as text, with the affected team-member count stated numerically (a real, computed count — never an estimated or illustrative figure) rather than a vague severity indicator alone.

**Error states:** No detection method is specified by `docs/LEARNING_ANALYTICS.md` beyond "an implementation decision for a future technical design" — this component's contract accommodates either a simple threshold or a more advanced method without a structural change, since it consumes a detected-gap list regardless of how that list was produced.

**Loading states:** Skeleton list.

**Future extensibility:** None beyond its current scope, pending the detection-method decision `docs/LEARNING_ANALYTICS.md` explicitly defers.

## Reports

**Purpose.** A structured, exportable or printable view of Team Overview and Knowledge Gaps data, for a manager's own record-keeping or upward reporting — a new component this document introduces, composed entirely from data already specified above rather than a new data source.

**Responsibilities.** Compile a snapshot of current Team Overview and Knowledge Gaps data into a single, reviewable view.

**Inputs:** Same as Team Overview and Knowledge Gaps.

**Outputs:** An export or print action (format — PDF, CSV, or otherwise — is an implementation decision this document doesn't fix).

**Props:** `dateRange` (if the implementation supports historical snapshots; otherwise this component reflects current state only).

**State:** None locally.

**Events:** `onExport(format)`.

**Dependencies:** Team Overview, Knowledge Gaps (this component composes them, it doesn't duplicate their data-fetching).

**Responsive behavior:** Optimized for a print/export layout distinct from the interactive Dashboard's responsive grid — a single, linear, printable column regardless of viewport.

**Accessibility:** Exported formats (where PDF) should preserve the same text-based status conventions as the interactive views, not rely on color alone, consistent with this document's general accessibility rule.

**Error states:** An export failure preserves the on-screen report and offers a retry, rather than losing the manager's place.

**Loading states:** An in-progress indicator during export generation.

**Future extensibility:** Scheduled or recurring report delivery (e.g., a weekly emailed summary) is a plausible future enhancement this document doesn't commit to, since it would require a notification/delivery mechanism outside this sprint's scope.

## Leaderboard (if enabled)

**Purpose.** Implementation contract for the same non-comparative recognition view specified in `docs/PROFILE_COMPONENT_SPEC.md`'s Achievements component, at team scope — per `docs/LEARNING_ANALYTICS.md`'s Leaderboard reconciliation note, this is never a ranked or scored comparison between advisors.

**Responsibilities.** Render team members' completion milestones as a shared activity feed (per `docs/LEARNING_ANALYTICS.md`'s own description), with no score, rank, or comparison attached.

**Inputs:** Team-scoped milestone completion data.

**Outputs:** Navigation intent into an advisor's Team Overview detail.

**Props:** None.

**State:** None locally.

**Events:** `onSelectAdvisor(advisorId)`.

**Dependencies:** `docs/LEARNING_ANALYTICS.md` Leaderboard reconciliation note.

**Responsive behavior:** Feed/list layout at all breakpoints.

**Accessibility:** Same as Achievements in `docs/PROFILE_COMPONENT_SPEC.md`.

**Error states:** Empty feed (no recent team milestones): honest empty state.

**Loading states:** Skeleton feed.

**Future extensibility:** The "(if enabled)" qualifier in this component's own name reflects `docs/LEARNING_ANALYTICS.md`'s explicit statement that whether to build this at all, and whether to make it opt-in, is a product decision a future sprint should make deliberately — this component's contract is specified so it's ready either way, without this document deciding that question itself.

## Coaching

**Purpose.** The manager's entry point into Role Play review and general coaching actions, composing `docs/ASSESSMENT_COMPONENT_SPEC.md`'s Manager Review component with Team Overview and Knowledge Gaps context.

**Responsibilities.** Surface which advisors or gaps warrant a coaching conversation; launch a Manager Role Play review; where the Sensitivity policy is resolved, surface relevant shared Manager Notes.

**Inputs:** Team Overview and Knowledge Gaps data, pending Role Play reviews.

**Outputs:** Navigation intent into Manager Review (`docs/ASSESSMENT_COMPONENT_SPEC.md`).

**Props:** None — team-scoped to the current manager.

**State:** None locally.

**Events:** `onStartReview(attemptId)`.

**Dependencies:** `docs/ASSESSMENT_COMPONENT_SPEC.md` Manager Review, Team Overview, Knowledge Gaps.

**Responsive behavior:** List layout at all breakpoints.

**Accessibility:** Same text-based-status conventions as Team Overview.

**Error states:** No pending reviews: honest empty state.

**Loading states:** Skeleton list.

**Future extensibility:** None beyond its current scope.

## Assignments

**Purpose.** A Sales Manager's ability to recommend or note a Learning Path for a specific advisor — distinct from a Trainer's formal cohort-assignment capability (per `docs/USER_JOURNEYS.md` Journey 4), which is a Trainer-role action this document does not extend to Sales Managers.

**Responsibilities.** Allow a manager to flag a recommended path or module for a specific advisor, surfaced on that advisor's own Dashboard as a Recommended Content entry (`docs/DASHBOARD_COMPONENT_SPEC.md`) attributed to the manager, rather than as a formal enrollment override.

**Inputs:** The manager's team list, `docs/LEARNING_PATHS.md` path definitions.

**Outputs:** A recommendation-write intent, distinct from the Trainer's formal assignment write.

**Props:** `advisorId`.

**State:** In-progress recommendation selection.

**Events:** `onRecommendPath(advisorId, pathId)`.

**Dependencies:** `docs/LEARNING_PATHS.md`, `docs/DASHBOARD_COMPONENT_SPEC.md` Recommended Modules (the surface this recommendation feeds).

**Responsive behavior:** Standard form layout, single column at all breakpoints.

**Accessibility:** Standard labeled-form-control conventions.

**Error states:** A failed recommendation save preserves the attempted selection and offers retry.

**Loading states:** In-progress indicator during save.

**Future extensibility:** If a future sprint formalizes Sales Manager assignment authority (beyond a soft recommendation), this component's `onRecommendPath` event would extend to a formal enrollment write — a decision this document doesn't make, consistent with `docs/ACADEMY_PRODUCT_VISION.md`'s Target Users keeping Sales Manager and Trainer authority distinct.

## Analytics

**Purpose.** The Manager Dashboard's own analytics summary, distinct from Reports (an export-oriented compilation) in that this is the live, interactive view — restated by reference to `docs/LEARNING_ANALYTICS.md`'s Manager Dashboard section, which already defines the specific categories (Completion, Quiz Results aggregation, Knowledge Gap Detection) this component surfaces.

**Responsibilities.** Compose `CompletionMetricCard`, `KnowledgeGapPanel`, and team-level Quiz Results into one analytics view, reusing the Analytics Cards components already specified in `docs/COMPONENT_LIBRARY.md` rather than introducing new ones.

**Dependencies:** `docs/LEARNING_ANALYTICS.md`, `docs/COMPONENT_LIBRARY.md` Analytics Cards, `docs/API_CONTRACTS.md` Analytics contract.

**Error states:** Every card in this composition uses `MetricEmptyState` (per `docs/COMPONENT_LIBRARY.md`) wherever real data doesn't yet exist, per `docs/LEARNING_ANALYTICS.md`'s Data Discipline — never a fabricated figure.

**Future extensibility:** None beyond what Knowledge Gaps and Reports above already specify — this section exists to confirm the Analytics requirement in this sprint's instruction is fully covered by components already specified elsewhere in this document, not to introduce an eleventh, redundant component.

## Related Documents

- `docs/FEATURE_SPECIFICATIONS.md`, `docs/USER_JOURNEYS.md` Journey 3 — the Manager Dashboard behavior this document gives component contracts to
- `docs/LEARNING_ANALYTICS.md` — the analytics categories and Leaderboard reconciliation note this document implements
- `docs/ASSESSMENT_COMPONENT_SPEC.md` — the Manager Review component this document's Coaching section composes
- `docs/NOTES_SYSTEM.md` — the Sensitivity policy gating this document's Team Overview notes section and Assignments' relationship to formal Trainer assignment
