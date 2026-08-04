# Search Index Manifest

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** The implementation-ready schema and behavior behind `docs/SEARCH_EXPERIENCE.md` and `docs/SEARCH_PRODUCT.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies the search index's document schema and ranking behavior at implementation detail. It does not redesign the search product — every facet, filter, and ranking signal below is already proposed in `docs/SEARCH_EXPERIENCE.md` and `docs/SEARCH_PRODUCT.md`; this document gives each one a concrete field mapping. Per `docs/REPOSITORY_HEALTH.md`, an Orama full-text index already exists at build time across every published page — this manifest specifies the richer, faceted index proposed to sit alongside or extend that baseline, not a replacement for it.

## Search Document Schema

One search document per indexed unit. Two document types, both drawn entirely from existing `content/docs/` data — no field below requires new authoring beyond what a module or article already carries:

**Article Document** (one per `.mdx` file under `content/docs/`, excluding `meta.json`):

| Field | Source | Required |
|---|---|---|
| `id` | The article's route path per `docs/ROUTE_REGISTRY.md` (e.g. `/browse/resume-intelligence/resume-red-flags`) | Yes |
| `title` | Frontmatter `title`, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3 | Yes |
| `description` | Frontmatter `description` | Yes |
| `body` | Full article body text, stripped of MDX syntax, for full-text matching | Yes |
| `headings` | The article's `##` heading text, extracted the same way `docs/UI_NAVIGATION_BLUEPRINT.md`'s Sticky Right TOC extracts them | Yes |
| `moduleId` | Parent Module ID, per `docs/CONTENT_MANIFEST.md` | Yes |
| `tags` | Frontmatter `tags` | Yes |
| `roleCategory` | Role Category, per `docs/SEARCH_TAXONOMY.md`, populated only for Role Collection articles | No |
| `problemCategory` | Populated only for `*-red-flags.mdx` and objection-category articles, per `docs/SEARCH_TAXONOMY.md`'s Problem Categories | No |
| `difficulty` | Module-level Difficulty, per `docs/MODULE_INDEX_STANDARD.md`, once populated by a future enrichment sprint | No — unpopulated today |
| `lastUpdated` | Frontmatter `last_updated` | Yes |
| `type` | Frontmatter `type` | Yes |

**Module Document** (one per module or Role Collection, for a broader match than any single article):

| Field | Source | Required |
|---|---|---|
| `id` | Module ID, per `docs/CONTENT_MANIFEST.md` | Yes |
| `name` | Module Name, per `docs/CONTENT_MANIFEST.md` | Yes |
| `description` | Module Description, per `docs/CONTENT_MANIFEST.md` | Yes |
| `searchCategory` | Per `docs/SEARCH_TAXONOMY.md`'s Module Categories | Yes |
| `roleCategory` | Per `docs/SEARCH_TAXONOMY.md`'s Role Categories, populated for Role Collections only | No |
| `childArticleIds` | The module's Children, per `docs/CONTENT_MANIFEST.md` | Yes |

## Search Weighting

Field-level weight, applied within a single document's relevance score — a match in a higher-weighted field ranks that document higher for the same query, before any document-level ranking signal (see Search Ranking below) is applied:

| Field | Relative Weight |
|---|---|
| `title` | Highest |
| `headings` | High |
| `description` | Medium-high |
| `tags` | Medium |
| `body` | Medium (baseline full-text match) |
| `roleCategory`, `problemCategory` | Medium, only when the query or an applied facet explicitly targets that dimension |

No numeric weight value is proposed for any field — per `docs/SEARCH_PRODUCT.md`'s Search Ranking section, specific tuning is an implementation decision to make once real query and click-through data exists, not asserted here as already decided.

## Ranking

Document-level ranking signals, restated by reference to `docs/SEARCH_PRODUCT.md`'s Search Ranking section and mapped to schema fields here:

- **Relevance** — the field-weighted match score above, the primary signal.
- **Structural weight** — an `overview.mdx` or `*-checklist.mdx` article (identifiable by its `type` field or filename pattern) receives a modest boost for a broad query; a highly specific query is not boosted by this signal, per `docs/SEARCH_PRODUCT.md`.
- **Personal relevance** — a modest boost where a result's `moduleId` or `roleCategory` matches the learner's active Learning Path or book-of-business Role Collection, read from the learner's own account state (`docs/STATE_MANAGEMENT.md`'s Career Advisor state), never a boost based on any other learner's behavior.
- **Recency** — `lastUpdated`, used only as a tiebreaker between otherwise equally relevant results, per `docs/SEARCH_PRODUCT.md`'s explicit statement that recency should not meaningfully outweigh relevance for this repository's content.

## Autocomplete

Proposed to suggest matching `title` and `tags` values as a learner types, scoped to the first several characters of a query, distinct from Suggested Searches (see below) in that Autocomplete responds to partial input while Suggested Searches are shown before any input exists. Autocomplete does not propose a fixed suggestion list — it queries the live index the same way a full search does, just against a shorter query string.

## Synonyms

A proposed, small, explicitly maintained mapping between common alternate phrasings and the repository's own terminology — for example, "H-1B" and "H1B" resolving identically, or "resume" and "CV" resolving to the same results. This document does not propose an initial synonym list, since inventing one without real query data risks encoding assumptions about how advisors actually search; the correct process is to seed this list from Smart Search's query-understanding layer (`docs/SEARCH_PRODUCT.md`) once real, anonymized query patterns exist, then maintain it as a simple mapping table reviewed periodically, not a machine-learned model this design specifies.

## Filters

The UI treatment of facets, per `docs/SEARCH_PRODUCT.md`'s Filters section, mapped to schema fields:

| Filter | Schema Field | Combinable |
|---|---|---|
| Module | `moduleId` | Yes, with any other filter |
| Topic | `tags` | Yes |
| Role | `roleCategory` | Yes |
| Problem | `problemCategory` | Yes, Post-MVP per `docs/IMPLEMENTATION_BACKLOG.md`'s Epic 3 |
| Candidate | Not yet indexable — see What This Document Does Not Do | Future, per `docs/IMPLEMENTATION_BACKLOG.md`'s Epic 3 |

## Boosting

Distinct from Ranking above: Boosting refers specifically to deliberate, explicit result promotion — for example, ensuring a module's `overview.mdx` always appears above its other articles for a query matching only the module name. This document proposes Boosting be limited to the Structural Weight signal already defined under Ranking; it does not propose a separate, hand-curated boost list per query, since a hand-curated list would need ongoing manual maintenance disconnected from the actual content and would risk becoming stale the way `docs/REPOSITORY_SYNCHRONIZATION.md`'s single-source-of-truth principle warns against.

## Facets

Restated by reference: the same set as Filters above (Module, Topic, Role, Problem, and eventually Candidate), presented as the selectable facet groups in the Search Overlay and Search Results Page per `docs/SEARCH_PRODUCT.md`. This document does not introduce a facet beyond what that document already names.

## Result Cards

Proposed content per search result, drawn entirely from the Article Document schema above — no new data:

- Title (`title`)
- A short snippet from `body`, centered on the matched query terms where possible
- Module breadcrumb (`moduleId`, resolved to Module Name via `docs/CONTENT_MANIFEST.md`)
- Applicable badges: Role Category, Problem Category, where populated
- A Bookmark action, per `docs/BOOKMARK_SYSTEM.md`

## Recent Searches

Restated by reference to `docs/SEARCH_EXPERIENCE.md`: a per-session or per-account log of the learner's own past queries, stored as account state (`docs/STATE_MANAGEMENT.md`'s Search state) rather than as part of the search index itself — Recent Searches is state about the searcher, not indexed content.

## What This Document Does Not Do

This document does not specify a search engine or vendor beyond noting that an Orama index already exists per `docs/REPOSITORY_HEALTH.md` — whether a future faceted implementation extends Orama or introduces a different engine is an implementation decision outside this sprint's scope. It does not propose Candidate Search's underlying archetype metadata, since `docs/SEARCH_EXPERIENCE.md` already states no existing field tags an article by candidate archetype — that remains a Future-tier capability per `docs/IMPLEMENTATION_BACKLOG.md`, gated on metadata design this document doesn't invent.

## Related Documents

- `docs/SEARCH_EXPERIENCE.md`, `docs/SEARCH_PRODUCT.md` — the facet and ranking design this manifest implements
- `docs/SEARCH_TAXONOMY.md` — the category values populating `roleCategory` and `problemCategory`
- `docs/CONTENT_MANIFEST.md` — the Module ID, Name, and Description values this schema reads from
- `docs/AI_RETRIEVAL_MANIFEST.md` — the related but distinct retrieval pipeline for the AI Assistant, which draws on overlapping but not identical data
