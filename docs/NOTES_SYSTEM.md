# Notes System

**Status:** Design proposal — not yet built
**Applies to:** The complete proposed personal-annotation system, extending the Notes feature stub in `docs/FEATURE_SPECIFICATIONS.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

`docs/FEATURE_SPECIFICATIONS.md` names Notes as a Post-MVP feature and `docs/SCREEN_INVENTORY.md` names the Notes Page. This document is the full specification of that system, including the manager-facing variant this sprint introduces.

## Personal Notes

The base concept: free-text annotation a learner attaches to a specific article, entered from the Lesson Page per `docs/MODULE_EXPERIENCE.md`, visible on the dedicated Notes Page per `docs/SCREEN_INVENTORY.md`, grouped by article or module. A Personal Note is private to its author by default — see Private Notes below for how that default relates to visibility more broadly.

## Private vs. Shared: A Visibility Setting, Not a Third Note Type

This document treats "Private" as a visibility attribute every note carries, not a separate note type alongside Personal and Manager Notes. A Personal Note defaults to Private (visible only to its author). A future version of this system could allow a learner to mark a specific note as Shared with their manager — but that remains a Personal Note with its visibility changed, not a conversion into a different kind of note. This avoids the confusing three-way overlap the requested "Personal / Manager / Private" grouping could otherwise imply.

## Manager Notes

A distinct note type, not a visibility variant of Personal Notes: a Sales Manager's own annotation about a specific Career Advisor's progress, written from the Team Progress Detail Screen (`docs/SCREEN_INVENTORY.md`), not from the advisor's own Lesson Page. A Manager Note is about an advisor, authored by the manager — the reverse authorship relationship from a Personal Note, which is by and about the same person.

**Sensitivity note:** Whether a Manager Note is visible to the advisor it's about, how long it's retained, and what governs its appropriate use are real HR and management-policy questions this repository does not define anywhere. Consistent with the **Operational Policy Pending** pattern already established throughout `content/docs/`, this document does not invent an answer — a future sprint should define this policy explicitly, likely in consultation with whatever function owns people-management policy at Surely Placed, before Manager Notes are actually built.

## Pinned Notes

A proposed subset mechanic, parallel to Pinned Articles in `docs/BOOKMARK_SYSTEM.md`: a learner or manager can pin a small number of notes to the top of the Notes Page for quick access, without changing the note's content or visibility.

## Export Notes

A proposed action allowing a learner to export their own Personal Notes (never another person's Manager Notes about them, absent the policy resolution noted above) as a plain document, for their own offline reference. This document doesn't specify a file format — that's an implementation detail.

## Search Notes

A proposed search scoped specifically to a learner's own notes, distinct from the repository-wide Search Product (`docs/SEARCH_PRODUCT.md`) — searching note *content* the learner wrote, not `content/docs/` articles. A Manager's search of their own Manager Notes would work the same way, scoped to notes they authored.

## Relationship to Content

No note of any type is ever stored as part of, or merged into, an actual `content/docs/` article. A note is always a separate, personal annotation pointing at an article, the same way a Bookmark points at one rather than copying it — this preserves the principle in `docs/ACADEMY_PRODUCT_VISION.md` that content stays the single, unforked source of truth.

## Related Documents

- `docs/FEATURE_SPECIFICATIONS.md` — the original Notes feature entry this document expands
- `docs/BOOKMARK_SYSTEM.md` — the parallel Pinned Articles mechanic Pinned Notes is modeled on
- `docs/MODULE_EXPERIENCE.md` — where Personal Notes are authored, from the Lesson Page
- `docs/SCREEN_INVENTORY.md` — the Team Progress Detail Screen where Manager Notes are authored
