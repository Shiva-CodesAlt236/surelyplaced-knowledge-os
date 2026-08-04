# Learning Analytics

**Status:** Design proposal — not yet built; contains zero measured figures
**Applies to:** The proposed analytics layer supporting the Career Advisor and Manager Dashboards
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

Every metric named in this document is a proposed *category* of data the platform would compute once real usage exists — never a stated figure. No completion rate, average time, or score appears anywhere in this document as if it were already known, consistent with this sprint's zero-invented-business-metrics requirement and the same discipline `docs/DASHBOARD_EXPERIENCE.md`'s Metrics section already applies to the individual learner's own dashboard.

## Progress

The foundational metric everything else in this document is computed from — per-learner, per-module, per-path Completion Status, already defined in `docs/MODULE_INDEX_STANDARD.md` and `docs/FEATURE_SPECIFICATIONS.md`. Not redefined here.

## Completion

An aggregate view of Progress — the proportion of a Learning Path's modules a learner (or, for a manager, a team) has completed. Computed live from real Progress data; this document proposes no target completion figure.

## Average Reading Time

A proposed aggregate of the per-article Estimated Reading Time already defined in `docs/MODULE_METADATA_STANDARD.md`, compared against actual measured time once the platform can collect it. This metric only becomes meaningful once real usage data exists — before that, this document treats it as an empty, not-yet-computable category, the same way `docs/DASHBOARD_EXPERIENCE.md` treats an empty state as more honest than a fabricated placeholder.

## Knowledge Gap Detection

A proposed pattern-recognition category: where a Knowledge Check or Quiz result (`docs/ASSESSMENT_FRAMEWORK.md`) shows a learner or a team consistently missing questions tied to a specific Learning Objective or Skill Covered (`docs/MODULE_METADATA_STANDARD.md`), that pattern is surfaced as a gap rather than left buried in individual quiz results. This document does not specify the detection method (a simple threshold, a more advanced pattern-matching approach) — that's an implementation decision for a future technical design.

## Module Drop-off

A proposed category tracking where in a module's sequence learners most commonly stop before completing it. Useful as a content-quality signal (a module with unusually high drop-off at a specific article may need revision) but explicitly proposed as a *content improvement signal for the Documentation Architect role*, not a learner-performance metric — a learner stopping partway through isn't itself a judgment about that learner.

## Quiz Results

Per-learner and aggregate Knowledge Check and Quiz outcomes, per `docs/ASSESSMENT_FRAMEWORK.md`. Consistent with that document's Scoring Philosophy, Quiz Results are proposed to remain formative (explaining reasoning) at the individual level — this document only adds the *aggregation* view (a Manager or Trainer seeing team-level patterns), not a change to how an individual result is presented to the learner who took it.

## Weak Areas

The learner-facing counterpart to Knowledge Gap Detection: a proposed personal view, visible only to the learner themselves (and their manager, per the Manager Dashboard permissions this document doesn't fully specify), showing which topics their own Quiz Results suggest could use review — framed constructively, as a "here's what to revisit" list, never as a deficiency score.

## Leaderboard

**Reconciliation note:** `docs/ASSESSMENT_FRAMEWORK.md`'s Scoring Philosophy explicitly states no leaderboard or comparative scoring is proposed, since assessment exists to confirm a learner's own understanding, never to rank learners against each other. This document does not override that — it can't, since Milestone 3B's own requirements state existing engineering documents are never redefined. What's proposed here instead, under the same requested heading, is a **non-comparative recognition view**: a list of completion milestones reached (a path finished, a certification earned) with no score, rank, or comparison attached — closer to a shared activity feed than a competitive leaderboard. Whether to build this at all, and whether to make it opt-in, is a product decision a future sprint should make deliberately rather than this document assuming it.

## Manager Dashboard

The manager-facing surface for team-level Completion, aggregate Quiz Results, and team-level Knowledge Gap Detection — already named as a screen in `docs/SCREEN_INVENTORY.md` and a feature in `docs/FEATURE_SPECIFICATIONS.md`. This document adds the specific analytics categories that dashboard would display; it does not redefine the screen or feature themselves.

## Career Advisor Dashboard

The learner-facing surface for personal Progress, Completion, and Weak Areas — already fully specified in `docs/DASHBOARD_EXPERIENCE.md`. This document's analytics categories are what populate that dashboard's Metrics widget; it does not redefine the dashboard's layout or other widgets.

## Data Discipline

No analytics category in this document is proposed to ever display a fabricated or estimated figure as if it were measured. Where real data doesn't exist yet (which is true for all of it, since the platform isn't built), the correct display is an honest empty state, per `docs/DASHBOARD_EXPERIENCE.md`'s Empty States precedent — never a placeholder number.

## Related Documents

- `docs/DASHBOARD_EXPERIENCE.md` — the Career Advisor–facing surface these analytics populate
- `docs/ASSESSMENT_FRAMEWORK.md` — the Scoring Philosophy this document's Leaderboard section reconciles with rather than overrides
- `docs/MODULE_METADATA_STANDARD.md` — Estimated Reading Time and Skills Covered, the fields several metrics here are computed from
- `docs/FEATURE_SPECIFICATIONS.md` — the Manager Dashboard feature this document's team-level metrics support
