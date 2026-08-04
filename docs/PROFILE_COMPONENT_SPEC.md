# Profile Component Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** Every component behind a learner's own Profile / Settings Screen and its persona-specific variants
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document gives full component contracts to the Profile / Settings Screen named in `docs/SCREEN_INVENTORY.md` and extends it with persona-specific profile variants implied by `docs/ACADEMY_PRODUCT_VISION.md`'s Target Users. It does not introduce a new persona beyond the five already named there (Career Advisor, Sales Executive, Sales Manager, Trainer, Admin); it specifies how the three learner-facing roles' own profile view differs.

## Career Advisor Profile

**Purpose.** The default profile view — a Career Advisor's own account settings plus a summary of their own learning activity.

**Responsibilities.** Render account/display preferences (per `docs/SCREEN_INVENTORY.md`'s Profile / Settings Screen), plus summary links into Learning Progress, Achievements, Bookmarks, Notes, and History (each specified below).

**Inputs:** Authentication state (identity), Career Advisor state (per `docs/STATE_MANAGEMENT.md`), Progress state summary.

**Outputs:** Preference-write intent, navigation intent into each summary section's full view.

**Props:** None — reads the current session's own identity, since a Career Advisor views only their own profile, never another advisor's, per `docs/USER_JOURNEYS.md`'s Journey 3 explicitly routing a manager's advisor-level visibility through the separate Team Progress Detail Screen instead.

**State:** In-progress, unsaved preference edits.

**Events:** `onUpdatePreference(key, value)`, `onNavigateToSection(section)`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Career Advisor and Progress state, `docs/API_CONTRACTS.md`.

**Responsive behavior:** Summary sections stack vertically on mobile rather than the desktop's grid arrangement.

**Accessibility:** Preference controls (including the Dark Mode toggle, per `docs/UI_NAVIGATION_BLUEPRINT.md`) use native form controls or correctly labeled ARIA equivalents, with a clear saved/unsaved state announced on change.

**Error states:** A failed preference save preserves the attempted value in the form and shows an explicit retry prompt, rather than silently reverting without explanation.

**Loading states:** Skeleton matching the settings-plus-summary layout while account state loads.

**Future extensibility:** A Sales Executive, once that role's scope is defined by a future sprint per `docs/CAREER_ADVISOR_ACADEMY.md`'s Target Users, would likely reuse this same profile shape rather than requiring a fourth variant, since that role's use of the Academy is described as cross-functional literacy rather than a structurally different relationship to the content.

## Sales Executive Profile

**Purpose.** Placeholder-scope entry, not a built variant. `docs/CAREER_ADVISOR_ACADEMY.md`'s Target Users section explicitly states the Sales Executive role's scope is not yet defined by any existing module and defers detailed definition to a future sprint.

**Responsibilities.** This document does not specify a distinct component for this profile variant, since doing so would require inventing role-specific behavior no prior document has actually scoped. Until that future sprint defines the role, a Sales Executive account is proposed to use the Career Advisor Profile component unchanged, per `docs/ACADEMY_PRODUCT_VISION.md`'s own note that Sales Executive is a broader commercial role without yet-defined platform-specific behavior.

**Dependencies:** `docs/CAREER_ADVISOR_ACADEMY.md` Target Users, `docs/ACADEMY_PRODUCT_VISION.md` Target Users.

**Future extensibility:** Once a future sprint defines this role's scope, this section should be revised to specify its actual profile variant rather than deferring to the Career Advisor Profile by default.

## Sales Manager Profile

**Purpose.** A Sales Manager's own account settings, distinct from the Manager Dashboard (which is team-facing, per `docs/MANAGER_COMPONENT_SPEC.md`) — this is specifically the manager's own personal preferences and own learning history from having completed the Sales Manager Learning Path.

**Responsibilities.** Render the same account/display preferences as Career Advisor Profile, plus the manager's own Learning Progress, Achievements, Bookmarks, Notes, and History from their own path completion — never team-level data, which belongs to the Manager Dashboard.

**Inputs:** Same as Career Advisor Profile, scoped to the manager's own account.

**Outputs:** Same as Career Advisor Profile.

**Props:** None — own-account only, same principle as Career Advisor Profile.

**State:** Same as Career Advisor Profile.

**Events:** Same as Career Advisor Profile, plus a navigation shortcut into the Manager Dashboard for team-facing needs.

**Dependencies:** Same as Career Advisor Profile, plus `docs/MANAGER_COMPONENT_SPEC.md` for the Dashboard hand-off link only.

**Responsive behavior:** Same as Career Advisor Profile.

**Accessibility:** Same as Career Advisor Profile.

**Error states:** Same as Career Advisor Profile.

**Loading states:** Same as Career Advisor Profile.

**Future extensibility:** A Trainer's own profile, if it diverges from this pattern, would follow the same reasoning — own settings plus own learning history, team/cohort data handled by the Trainer Cohort Dashboard instead.

## Learning Progress

**Purpose.** The profile's own summary of Progress state, distinct from the Dashboard's Progress widget (`docs/DASHBOARD_COMPONENT_SPEC.md`) in that this view is comprehensive (every module and path ever engaged with) rather than the Dashboard's current-focus summary.

**Responsibilities.** Render a full list of every module and path the learner has started, in progress, or completed.

**Inputs:** Full Progress state, per `docs/STATE_MANAGEMENT.md`.

**Outputs:** Navigation intent into any listed module or path.

**Props:** None — own-account read.

**State:** Filter/sort selection, if offered (e.g., filter to completed only).

**Events:** `onSelectModule(moduleId)`, `onFilterChange(filter)`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Progress state, `docs/API_CONTRACTS.md` Progress contract.

**Responsive behavior:** List view at all breakpoints, condensing row detail on mobile.

**Accessibility:** Rendered as a structured list/table with clear column or field labeling (module name, status, date).

**Error states:** Empty Progress (no activity yet): an honest empty state, consistent with `docs/DASHBOARD_EXPERIENCE.md`'s established pattern.

**Loading states:** Skeleton list.

**Future extensibility:** None beyond its current scope.

## Achievements

**Purpose.** Implementation contract for the non-comparative recognition view proposed in `docs/LEARNING_ANALYTICS.md`'s Leaderboard reconciliation note — a list of the learner's own completion milestones and certifications, with no score, rank, or comparison to any other learner.

**Responsibilities.** Render completed milestones (per `docs/LEARNING_PATHS.md`'s per-path milestone definitions) and earned Certificates.

**Inputs:** Progress state (milestone completion), Certification records.

**Outputs:** Navigation intent into a Certificate View Screen (per `docs/COMPONENT_LIBRARY.md`'s `CertificateView`).

**Props:** None — own-account read.

**State:** None locally.

**Events:** `onViewCertificate(certificateId)`.

**Dependencies:** `docs/LEARNING_ANALYTICS.md` Leaderboard reconciliation note, `docs/LEARNING_PATHS.md` milestones, `docs/API_CONTRACTS.md` Analytics contract.

**Responsive behavior:** Grid of achievement entries on desktop, single column on mobile.

**Accessibility:** Each achievement's date and path/module context is stated as text, not conveyed by a badge icon alone.

**Error states:** Empty Achievements: an honest empty state explaining that milestones appear here as paths are completed, never a fabricated example achievement.

**Loading states:** Skeleton grid.

**Future extensibility:** Explicitly does not extend into a comparative or ranked view, per the Leaderboard reconciliation note this component implements — any future request for cross-learner comparison on this surface would need its own reconciliation against `docs/ASSESSMENT_FRAMEWORK.md`'s Scoring Philosophy, the same way `docs/LEARNING_ANALYTICS.md` already reconciled the original request.

## Bookmarks

**Purpose.** The profile's entry point into the full Bookmarks Page, restated by reference to `docs/BOOKMARK_SYSTEM.md` and the `BookmarkList` component already specified in `docs/COMPONENT_LIBRARY.md`. This entry exists so the Profile component family is complete; it does not redefine Bookmarks behavior.

**Dependencies:** `docs/BOOKMARK_SYSTEM.md`, `docs/COMPONENT_LIBRARY.md` `BookmarkList`.

## Notes

**Purpose.** The profile's entry point into the full Notes Page, restated by reference to `docs/NOTES_SYSTEM.md`. This entry exists so the Profile component family is complete; it does not redefine Notes behavior, including the still-unresolved Manager Notes Sensitivity policy question, which remains exactly as gated as `docs/NOTES_SYSTEM.md` and `docs/STATE_MANAGEMENT.md` already state.

**Dependencies:** `docs/NOTES_SYSTEM.md`.

## History

**Purpose.** The profile's entry point into the learner's full History log, distinct from the Dashboard's truncated Recent Activity, per `docs/BOOKMARK_SYSTEM.md`'s explicit History/Recent distinction.

**Responsibilities.** Render the complete, unbounded log of viewed articles.

**Inputs:** Full History state, per `docs/STATE_MANAGEMENT.md`.

**Outputs:** Navigation intent per entry.

**Props:** None — own-account read.

**State:** Pagination or infinite-scroll position, given History is explicitly unbounded.

**Events:** `onSelectEntry(articleId)`, `onLoadMore()`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` History state.

**Responsive behavior:** Standard list collapse on mobile.

**Accessibility:** Rendered as an ordered, dated list.

**Error states:** Empty History: honest empty state.

**Loading states:** Skeleton rows, with a loading indicator for incremental pagination distinct from initial load.

**Future extensibility:** None beyond its current scope.

## Related Documents

- `docs/SCREEN_INVENTORY.md` — the Profile / Settings Screen this document expands into persona-specific variants
- `docs/CAREER_ADVISOR_ACADEMY.md`, `docs/ACADEMY_PRODUCT_VISION.md` — the Target Users this document's three profile variants (and one deferred variant) are built for
- `docs/LEARNING_ANALYTICS.md` — the Leaderboard reconciliation note this document's Achievements component implements
- `docs/BOOKMARK_SYSTEM.md`, `docs/NOTES_SYSTEM.md` — the systems this document's Bookmarks and Notes entries point to rather than redefine
