# Bookmark System

**Status:** Design proposal — not yet built
**Applies to:** The complete proposed personal-saving system, extending the Bookmarks feature already named in `docs/FEATURE_SPECIFICATIONS.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

`docs/FEATURE_SPECIFICATIONS.md` already names Bookmarks as a feature and `docs/UI_NAVIGATION_BLUEPRINT.md` and `docs/INFORMATION_ARCHITECTURE.md` already describe where it's rendered. This document is the full specification of that system and its related concepts, several of which are new here.

## Naming Note

This repository already uses "Collections" to mean Role Collections under `content/docs/candidate-intelligence/`, per `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/ROLE_REGISTRY.md`, and `docs/INFORMATION_ARCHITECTURE.md`'s own Collections section. Reusing "Collections" for a user-created bookmark grouping would create exactly the kind of ambiguous, unreconciled terminology this repository's engineering documents have consistently flagged and resolved elsewhere (for example, `docs/CAREER_ADVISOR_ACADEMY.md`'s Terminology Note). This document proposes **Reading Lists** as the product-facing name for a user-created bookmark grouping instead, reserving "Collections" exclusively for its existing meaning.

## Bookmarks

The base feature: a learner saves an article from the Lesson Page (`docs/MODULE_EXPERIENCE.md`); the bookmark is a pointer to the real article, never a copy of it, per `docs/MODULE_INDEX_STANDARD.md`. Visible on the Bookmarks Page (`docs/SCREEN_INVENTORY.md`), filterable by Module, Topic, or Role Category per `docs/SEARCH_TAXONOMY.md`.

## Favorites

A proposed subset of Bookmarks: a learner can mark a small number of bookmarks as Favorites for faster access, surfaced more prominently (for example, in the Dashboard's Bookmarks card, per `docs/DASHBOARD_EXPERIENCE.md`) than the full Bookmarks list. Favoriting requires an article to already be bookmarked — it's a refinement of Bookmarks, not a parallel saving mechanism.

## Continue Reading

Already defined as Continue Learning in `docs/DASHBOARD_EXPERIENCE.md` and `docs/FEATURE_SPECIFICATIONS.md`. Not redefined here — this document notes it only to confirm the Bookmark System doesn't introduce a second, differently named version of the same concept.

## Pinned Articles

A proposed, smaller-scoped variant of Favorites: a single article a learner pins to the top of their Sidebar or Dashboard for the duration of their current task — for example, pinning `content/docs/objections/objection-handling-framework.mdx` during a week where objection handling is the focus. Distinct from Favorites in that a Pinned Article is expected to be temporary and typically limited to one or two at a time, where Favorites is a longer-lived personal list.

## Reading Lists

The renamed concept described in the Naming Note above: a user-created, named grouping of bookmarked articles — for example, a learner creating a "New Candidate Onboarding" Reading List pulling together articles from several different modules. A Reading List is built entirely from existing Bookmarks; it doesn't introduce new content or duplicate article text.

## History

A proposed complete, unbounded log of every article a learner has viewed, distinct from Recent (`docs/INFORMATION_ARCHITECTURE.md`), which is a short, prominent, automatically-truncated subset of History surfaced on the Dashboard. History is the full underlying record; Recent is the quick-access view built from its most recent entries.

## Recent Searches

Already fully defined in `docs/SEARCH_EXPERIENCE.md` and `docs/SEARCH_PRODUCT.md` — a per-session or per-account log of recent queries, distinct from History (which logs viewed *content*, not searched *terms*). Not redefined here.

## How These Concepts Relate

| Concept | Scope | Automatic or Deliberate |
|---|---|---|
| Bookmarks | Any saved article | Deliberate |
| Favorites | A subset of Bookmarks | Deliberate |
| Pinned Articles | One or two articles, temporary | Deliberate |
| Reading Lists | A named group of Bookmarks | Deliberate |
| History | Every viewed article, unbounded | Automatic |
| Recent | A short, recent slice of History | Automatic |
| Recent Searches | Recent search queries, not content | Automatic |

## Related Documents

- `docs/FEATURE_SPECIFICATIONS.md` — the Bookmarks feature entry this document expands into a full system
- `docs/DASHBOARD_EXPERIENCE.md` — where several of these concepts (Bookmarks, Continue Learning, Recent Activity) are rendered
- `docs/SEARCH_EXPERIENCE.md` and `docs/SEARCH_PRODUCT.md` — Recent Searches, and how Reading Lists could be searched within
- `docs/ROLE_COLLECTION_TEMPLATE.md` — the existing, unambiguous meaning of "Collections" this document deliberately avoids overloading
