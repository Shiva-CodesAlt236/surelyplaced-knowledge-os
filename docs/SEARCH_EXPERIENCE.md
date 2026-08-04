# Search Experience

**Status:** Design proposal — not yet built
**Applies to:** The proposed future search experience across the documentation site
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document designs a faceted search experience proposed to sit on top of the site's existing search capability. Per `docs/REPOSITORY_HEALTH.md`'s Search Index section, an Orama full-text search index is already generated at build time across every published page — that baseline already exists and works today. This document proposes a richer, faceted layer on top of that baseline, not a replacement for it.

## Global Search

The proposed default entry point — a single search box, available from anywhere in the site, that queries across every module: Sales Academy content, Candidate Intelligence Role Collections, and the `*-intelligence` expansion modules. This is the closest proposed equivalent to what the existing Orama index already does; the facets below are what would be layered on top of that baseline result set.

## Module Search

A proposed filter that scopes a query to a single module or module family — for example, restricting a search to `content/docs/interview-intelligence/` only. This maps directly onto the existing folder structure and `meta.json` registration already defined in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §4 and §17 — no new taxonomy is required to support it.

## Topic Search

A proposed filter built from the `tags` frontmatter field every article already carries per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3. Because tags are already authored consistently across every article, this facet could largely be built from existing data rather than requiring new content tagging work.

## Role Search

A proposed filter scoped to a specific Role Collection under `content/docs/candidate-intelligence/` — for example, surfacing every article relevant to a Salesforce-focused candidate. This maps directly onto the existing Role Collection folder structure and the taxonomy in `content/docs/candidate-intelligence/ROLE_CLASSIFICATION.mdx`.

## Candidate Search

A proposed filter that searches by candidate archetype or persona rather than by module — for example, "an OPT candidate with limited US work history" surfacing the relevant sections of `content/docs/visa-playbooks/`, `content/docs/resume-intelligence/international-student-resumes.mdx`, and the composite case studies in `content/docs/sales-coaching/`. This is the least structurally grounded of the proposed facets, since no existing field explicitly tags an article by candidate archetype — building it would likely require the archetype-level metadata this document doesn't invent here.

## Problem Search

A proposed filter oriented around a specific situation an advisor is facing rather than a topic — for example, "candidate's offer was rescinded" surfacing `content/docs/hiring-intelligence/hiring-red-flags.mdx` directly. This facet is well supported by the repository's existing pattern of dedicated `*-red-flags.mdx` articles across nearly every module, which already function as situation-indexed content even without a formal Problem Search feature.

## Suggested Searches

A proposed set of common queries surfaced before a learner types anything — for example, common objections, common red-flags topics, or the entry point to whichever Learning Path a learner is currently on (per `docs/LEARNING_PATHS.md`). This document does not propose a specific fixed list of suggestions, since a useful list should be derived from actual query patterns once the platform exists, not guessed at now.

## Recent Searches

A proposed per-session or per-account log of a learner's own recent queries, surfaced as quick shortcuts back to something they were looking at. This is user-session state, not content, and requires no change to any article — described further alongside the platform's other session-state features in `docs/UI_NAVIGATION_BLUEPRINT.md`.

## Bookmarks

A proposed per-account saved-article list, surfaced as its own view within the search experience so a learner can search within only what they've bookmarked. The bookmarking mechanism itself is defined once in `docs/UI_NAVIGATION_BLUEPRINT.md` and `docs/MODULE_INDEX_STANDARD.md`; this document only describes how bookmarks would surface inside search specifically.

## Relationship to the AI Assistant

Search and the AI Assistant proposed in `docs/AI_ASSISTANT_BLUEPRINT.md` are complementary, not the same feature. Search returns a ranked list of existing articles for a learner to read themselves; the AI Assistant synthesizes an answer from repository content and cites its sources. A future implementation might let a learner move from a search result directly into an AI Assistant conversation grounded in that result, but this document doesn't specify that integration in detail — it belongs to `docs/AI_ASSISTANT_BLUEPRINT.md`'s Retrieval section.

## Related Documents

- `docs/MODULE_INDEX_STANDARD.md` — the tags, module structure, and related-article data this search experience is built from
- `docs/UI_NAVIGATION_BLUEPRINT.md` — where the Search Overlay and session-state features (Recent Searches, Bookmarks) are rendered
- `docs/AI_ASSISTANT_BLUEPRINT.md` — the complementary, synthesis-oriented counterpart to search
