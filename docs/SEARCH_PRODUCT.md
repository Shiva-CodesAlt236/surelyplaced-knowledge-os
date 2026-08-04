# Search Product

**Status:** Design proposal — not yet built
**Applies to:** The product-level design of search, extending `docs/SEARCH_EXPERIENCE.md` with ranking, filters, and AI-assisted search
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

`docs/SEARCH_EXPERIENCE.md` already defines the six proposed search facets (Global, Module, Topic, Role, Candidate, Problem) and the two session features (Suggested Searches, Recent Searches) plus Bookmarks integration. This document does not restate any of that — it adds the product-level detail (ranking, filters as a UI concept, AI Search specifically) needed to make that design implementation-ready.

## Global Search

Restated by reference only: the default, unscoped entry point across all `content/docs/` content, per `docs/SEARCH_EXPERIENCE.md`.

## Smart Search

A proposed enhancement layer on top of Global Search: query understanding that goes beyond exact keyword matching — for example, a query for "candidate lied about experience" surfacing `content/docs/resume-intelligence/resume-red-flags.mdx` even without an exact keyword match, using the semantic relationship between the query and the article's actual content. This document does not specify the underlying technique (embedding-based retrieval, a specific ranking model, or otherwise) — that's an implementation decision for a future technical design, not a product-architecture one.

## Suggested Searches

Restated by reference: context-aware suggestions surfaced before a query is typed, per `docs/SEARCH_EXPERIENCE.md`. This document adds one product detail: suggestions are proposed to differ by entry point — a Suggested Search from the Dashboard reflects the learner's active Learning Path, while a Suggested Search from within a specific module reflects that module's own common follow-up topics.

## Filters

A proposed UI treatment of the facets already defined in `docs/SEARCH_EXPERIENCE.md` — Module, Topic, Role — presented as selectable filter chips or a filter panel alongside search results, combinable (a learner can filter by both Module and Topic at once). Filters narrow an existing result set; they don't change the underlying ranking logic described below.

## Tags

The underlying data source for the Topic filter, already authored consistently on every article via the `tags` frontmatter field per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3. This document proposes no new tagging work — Topic filtering is built entirely from data that already exists.

## Role Search

Restated by reference: a filter scoped to a specific Role Collection, per `docs/SEARCH_EXPERIENCE.md`. Product detail added here: Role Search results are proposed to be automatically weighted toward that Role Collection's own fourteen articles first, with genuinely relevant results from outside the collection (a shared framework article, a cross-referenced Sales Academy module) still included but ranked lower.

## Problem Search

Restated by reference: a situation-oriented filter, per `docs/SEARCH_EXPERIENCE.md`, well supported by the repository's existing `*-red-flags.mdx` pattern. Product detail added here: Problem Search is the facet Smart Search's query-understanding layer is expected to matter most for, since a "problem" is rarely phrased using the same words the relevant article uses.

## AI Search

A proposed hybrid mode, distinct from both Global Search and the separate Ask AI feature (`docs/AI_EXPERIENCE.md`): rather than returning a ranked list of articles (ordinary search) or a synthesized conversational answer (Ask AI), AI Search returns a ranked list of articles *with* a short, AI-generated explanation of why each result is relevant to the query — still fundamentally a search result list, not a conversation, and still strictly grounded in `content/docs/` per the same discipline `docs/AI_ASSISTANT_BLUEPRINT.md` establishes. This document proposes AI Search as an optional toggle on the ordinary search experience, not a replacement for it — a learner who prefers a plain ranked list should always be able to get one.

## Search Ranking

Proposed ranking signals, described conceptually rather than as a specific formula or algorithm:

- **Relevance** — how closely the query matches an article's title, headings, and body content; the primary signal.
- **Structural weight** — an Overview or Checklist article is proposed to rank slightly higher than a mid-module article for a broad query, reflecting that it's a more useful starting point; a highly specific query is proposed to favor the most specific matching article instead, regardless of its position in the module.
- **Personal relevance** — where a learner has an active Learning Path or a Role Collection tied to their book of business, results from that path or collection are proposed to receive a modest ranking boost, never an exclusion of other relevant results.
- **Recency** — an article's `last_updated` frontmatter field is proposed as a minor tiebreaker signal only, never a dominant one; this repository's content doesn't go stale in the way a news article does, so recency is not proposed to meaningfully outweigh relevance.

No specific numeric weight is proposed for any of these signals — that tuning is an implementation decision to be made once real query and click-through data exists, not asserted here as if it were already decided.

## Related Documents

- `docs/SEARCH_EXPERIENCE.md` — the facet and session-feature design this document extends
- `docs/AI_EXPERIENCE.md` — the complementary, conversational Ask AI feature AI Search is distinct from
- `docs/INFORMATION_ARCHITECTURE.md` — where Search fits into overall navigation
