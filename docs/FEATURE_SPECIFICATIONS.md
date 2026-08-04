# Feature Specifications

**Status:** Design proposal — not yet built
**Applies to:** Every product feature proposed for the Academy platform
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies twelve features at a product-behavior level — what a feature does, for whom, and what it depends on. It does not specify implementation (no code, no schema, no API), consistent with this sprint's scope. Where a feature's mechanics are already defined in a Phase 2 document, this document references that definition rather than restating it.

## Search

**Description:** Full-text and faceted search across all published `content/docs/` content.
**Behavior:** A learner opens the Search Overlay or Search Results Page, enters a query, optionally applies a facet, and selects a result to navigate directly to that article.
**Dependencies:** `docs/SEARCH_PRODUCT.md` for full product detail; the existing Orama search index per `docs/REPOSITORY_HEALTH.md` as the underlying baseline.
**Priority:** MVP.

## Bookmarks

**Description:** A per-account, deliberate saved-article list.
**Behavior:** A learner bookmarks an article from the Lesson Page; bookmarks are visible from the Bookmarks Page and filterable there; a bookmark is a pointer to the real article, never a stored copy.
**Dependencies:** `docs/MODULE_INDEX_STANDARD.md`'s Bookmarks field; `docs/INFORMATION_ARCHITECTURE.md`'s Bookmarks navigation entry.
**Priority:** MVP.

## Progress

**Description:** Per-learner, per-module, and per-path completion tracking.
**Behavior:** A module or article's Completion Status (not started / in progress / complete) updates as a learner engages with it; a Learning Path's overall progress is computed by aggregating its modules' status, per `docs/LEARNING_PATHS.md`'s completion order.
**Dependencies:** `docs/MODULE_INDEX_STANDARD.md`'s Completion Status field; `docs/UI_NAVIGATION_BLUEPRINT.md`'s Progress element.
**Priority:** MVP — nearly every other feature (Dashboard, Learning Paths, Manager Dashboard) depends on Progress existing first.

## Continue Learning

**Description:** A persistent shortcut back to a learner's most recent activity.
**Behavior:** Surfaces on the Dashboard and as a Quick Access item, pointing to the last-viewed article, or — where a Learning Path is active — the next recommended module in that path's sequence.
**Dependencies:** Progress; `docs/DASHBOARD_EXPERIENCE.md`'s Continue Learning card.
**Priority:** MVP.

## Notes

**Description:** Private, per-learner notes attached to a specific article.
**Behavior:** A learner adds a note from the Lesson Page; notes are visible on the dedicated Notes Page, grouped by article or module, and linked back to their source article.
**Dependencies:** Lesson Page (`docs/MODULE_EXPERIENCE.md`).
**Priority:** Post-MVP — valuable but not required for a first usable release, since a learner can work without personal annotation initially.

## AI Assistant

**Description:** A grounded, citation-producing conversational assistant scoped strictly to `content/docs/`.
**Behavior:** Fully specified in `docs/AI_ASSISTANT_BLUEPRINT.md` (design) and `docs/AI_EXPERIENCE.md` (product UX). This entry exists so the feature list is complete; it does not restate either document's content.
**Dependencies:** `docs/AI_ASSISTANT_BLUEPRINT.md`, `docs/AI_EXPERIENCE.md`, Search (shares the same underlying content index).
**Priority:** MVP for a basic, single-turn grounded Q&A version; Post-MVP for Conversation Memory and cross-session history.

## Learning Paths

**Description:** Structured, sequenced journeys through existing modules.
**Behavior:** Fully specified in `docs/LEARNING_PATHS.md`. A learner enrolls (or is assigned, by a Trainer), progresses through the defined completion order, and reaches milestones and completion criteria.
**Dependencies:** `docs/LEARNING_PATHS.md`, Progress.
**Priority:** MVP for the five defined paths' structure and navigation; Post-MVP for Trainer-assigned custom sequencing.

## Certificates

**Description:** A record and viewable/downloadable artifact confirming a learner completed a Learning Path's certification requirements.
**Behavior:** Generated automatically once a learner passes a Certification Exam (`docs/ASSESSMENT_FRAMEWORK.md`); viewable and downloadable from the Certificate View Screen (`docs/SCREEN_INVENTORY.md`). A Certificate is proposed to state the path name and completion date only — it does not state a numeric score, and it never implies a guaranteed sales outcome, consistent with `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §12.
**Dependencies:** Assessments, Learning Paths.
**Priority:** Post-MVP.

## Roleplays

**Description:** Simulated practice conversations built from existing Composite Case Studies.
**Behavior:** Fully specified in `docs/ASSESSMENT_FRAMEWORK.md`'s Role Plays section — both the advisor variant (practicing a conversation) and the manager variant (reviewing one). This entry exists so the feature list is complete; the mechanics live in that document.
**Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`, existing composite case studies in `content/docs/sales-coaching/`.
**Priority:** Post-MVP.

## Assessments

**Description:** The umbrella feature covering Knowledge Checks, Quizzes, Scenario Tests, and Certification Exams.
**Behavior:** Fully specified in `docs/ASSESSMENT_FRAMEWORK.md`. This entry exists so the feature list is complete and so `docs/IMPLEMENTATION_BACKLOG.md` has a single feature name to reference across all four assessment types.
**Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`.
**Priority:** MVP for Knowledge Checks specifically (the lowest-complexity form); Post-MVP for Quizzes, Scenario Tests, and Certification Exams.

## Live Chat Scripts

**Description:** A browsable library of chat-specific conversation scripts, once written.
**Behavior:** Fully specified in `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md`. As that document states explicitly, no script exists yet and `content/docs/live-chat-scripts/` has not been created — this feature has no content to serve until a properly scoped content sprint populates it.
**Dependencies:** `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md`, a future content sprint following `docs/SPRINT_GENERATION_TEMPLATE.md`.
**Priority:** Future.

## Manager Dashboard

**Description:** A Sales Manager's team-progress overview and coaching entry point.
**Behavior:** Surfaces per-advisor Progress across a manager's direct reports, with drill-down into the Team Progress Detail Screen (`docs/SCREEN_INVENTORY.md`) and a launch point into the manager variant of Roleplays.
**Dependencies:** Progress, Roleplays, `docs/USER_JOURNEYS.md`'s Sales Manager journey.
**Priority:** Post-MVP.

## Feature Priority Summary

| Feature | MVP Scope | Post-MVP / Future Scope |
|---|---|---|
| Search | Full-text + facets | Search Results Page, saved searches |
| Bookmarks | Core save/view/remove | — |
| Progress | Core tracking | — |
| Continue Learning | Core shortcut | — |
| Notes | — | Full feature is Post-MVP |
| AI Assistant | Single-turn grounded Q&A | Conversation Memory, cross-session history |
| Learning Paths | Five defined paths, navigation | Trainer custom sequencing |
| Certificates | — | Full feature is Post-MVP |
| Roleplays | — | Full feature is Post-MVP |
| Assessments | Knowledge Checks | Quizzes, Scenario Tests, Certification Exams |
| Live Chat Scripts | — | Full feature is Future, pending content |
| Manager Dashboard | — | Full feature is Post-MVP |

## Related Documents

- `docs/IMPLEMENTATION_BACKLOG.md` — how these features are organized into epics and sequenced
- `docs/SCREEN_INVENTORY.md` — the screens each feature is rendered through
- `docs/ASSESSMENT_FRAMEWORK.md`, `docs/SEARCH_PRODUCT.md`, `docs/AI_EXPERIENCE.md`, `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md` — the detailed specifications several of these features reference rather than restate
