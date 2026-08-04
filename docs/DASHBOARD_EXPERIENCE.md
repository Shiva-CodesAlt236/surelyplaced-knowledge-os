# Dashboard Experience

**Status:** Design proposal — not yet built
**Applies to:** The Career Advisor Dashboard specifically — the Manager and Trainer dashboards are specified separately in `docs/FEATURE_SPECIFICATIONS.md` and `docs/SCREEN_INVENTORY.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document designs the layout and content of the Career Advisor Dashboard, the screen named first in `docs/SCREEN_INVENTORY.md`'s Learner Screens section. It describes what appears and why, not how it's built.

## Layout

Proposed as a single-column-on-mobile, multi-column-on-desktop card layout, with the Continue Learning card given the most visual weight (largest, topmost) since it's the single most likely next action for a returning learner, per `docs/USER_JOURNEYS.md`'s journeys. Supporting widgets — Recommended Content, Bookmarks, Recent Activity, Quick Actions — are proposed as smaller cards below or beside it, not competing for the same visual priority.

## Widgets

The Dashboard is composed of six proposed widgets, each specified below. No widget on this Dashboard is proposed to duplicate content from `content/docs/` — every widget either links to real content or displays the learner's own real usage data.

## Metrics

The only metrics proposed for this Dashboard are the learner's own: modules completed, current Learning Path progress (e.g., "7 of 13 modules," computed live from Progress data per `docs/FEATURE_SPECIFICATIONS.md`), and current streak or recency of activity, if the platform tracks that. This document does not propose any aggregate, cross-learner, or company-wide benchmark metric (an average completion time, a comparison to peers) on this screen — that class of metric, if ever built, belongs to a Manager or Trainer view where the ownership and context are appropriate, not a self-facing Dashboard, and even there would need to be real measured data rather than an invented figure.

## Cards

**Continue Learning.** The primary card. Shows the last-viewed article or the next module in the learner's active Learning Path, with a single clear action to resume.

**Recommended Content.** A secondary card proposing what to look at next, drawn from the learner's active Learning Path's completion order (per `docs/LEARNING_PATHS.md`) or, once a path is fully complete, from a Role Collection or `*-intelligence` module relevant to the learner's book of business. This document does not specify a recommendation algorithm in technical detail — it specifies that recommendations are always sourced from real, existing content and the learner's own real progress, never fabricated or generic.

**Bookmarks.** A compact preview of the learner's most recently bookmarked articles, with a link to the full Bookmarks Page.

**AI.** A compact entry point into the Ask AI Panel (`docs/AI_EXPERIENCE.md`), optionally pre-populated with a context-aware suggested question based on the learner's current module, consistent with `docs/AI_ASSISTANT_BLUEPRINT.md`'s Suggested Prompts.

**Recent Activity.** A short list of recently viewed articles, distinct from Bookmarks in that this list is automatic rather than deliberate, per `docs/INFORMATION_ARCHITECTURE.md`'s Recent section.

**Quick Actions.** A small set of one-click shortcuts — open Search, open Ask AI, view current Learning Path — mirroring `docs/INFORMATION_ARCHITECTURE.md`'s Quick Access concept in card form.

## Empty States

A new learner with no history yet (Journey 1 in `docs/USER_JOURNEYS.md`) sees a Dashboard where Continue Learning shows the Onboarding recommendation instead of a resume point, and Recommended Content, Bookmarks, and Recent Activity show an honest empty state — an explanation of what the widget will show once the learner has activity, never a fabricated placeholder that looks like real data.

## Related Documents

- `docs/SCREEN_INVENTORY.md` — this screen's entry in the full inventory
- `docs/FEATURE_SPECIFICATIONS.md` — the Progress, Bookmarks, Continue Learning, and AI Assistant features this Dashboard surfaces
- `docs/USER_JOURNEYS.md` — the journeys this Dashboard is the entry point for
- `docs/AI_EXPERIENCE.md` — the AI card's underlying experience
