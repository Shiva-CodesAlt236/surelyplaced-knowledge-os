# Module Experience

**Status:** Design proposal — not yet built
**Applies to:** How a learner experiences any module or Role Collection, page by page
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies page-level behavior for the two screens named "Module Landing Page" and "Lesson / Article Page" in `docs/SCREEN_INVENTORY.md`. It extends `docs/UI_NAVIGATION_BLUEPRINT.md`'s Module Landing Pages section and `docs/MODULE_INDEX_STANDARD.md`'s field definitions into an actual page-by-page walkthrough, without restating either document's content.

## Landing Page

On load, the Landing Page renders the module's Overview article (already existing, unchanged) alongside the metadata fields proposed in `docs/MODULE_INDEX_STANDARD.md` — Learning Objectives, Reading Time, Difficulty, and Related Modules — where those fields have been populated by a future enrichment sprint. Where a field hasn't been populated yet, the Landing Page omits it rather than showing a placeholder that looks like real data, consistent with the empty-state discipline in `docs/DASHBOARD_EXPERIENCE.md`.

A primary action ("Start Module" or "Continue Module," depending on Completion Status) takes the learner directly into the first incomplete Lesson Page in the module's `meta.json` order.

## Lesson Page

Renders a single article's actual content, unchanged from `content/docs/`, inside a consistent chrome:

- **Sidebar** — either the full module tree or, if the learner is inside an active Learning Path, that path's scoped view, per `docs/INFORMATION_ARCHITECTURE.md`'s Sidebar section.
- **Right TOC** — a scroll-synced table of contents generated from the article's own `##` headings, per `docs/UI_NAVIGATION_BLUEPRINT.md`'s Sticky Right TOC.
- **Related Articles** — rendered directly from the article's existing `## Related Articles` section and `related` frontmatter field, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §8 — no new data required.

At the bottom of the article, three proposed action points, present only where the underlying content exists to support them:

- **Practice** — a link into a Role Play or Scenario Test, where `docs/ASSESSMENT_FRAMEWORK.md` defines one drawing on this article's content.
- **Quiz** — a link into that article's Knowledge Check, where one exists.
- **Checklist** — a link to the module's closing checklist article (already existing in nearly every module, per `docs/MODULE_INDEX_STANDARD.md`), surfaced once the learner reaches the last article in a module rather than on every individual article.

## Completion

An article is proposed to move from "in progress" to "complete" either automatically (reaching the end of the article, where that can be reliably detected) or via an explicit "Mark Complete" action — this document proposes both be available rather than relying on automatic detection alone, since automatic scroll-based completion can be unreliable and shouldn't be the only way a learner can confirm progress. Completing the last article in a module marks the module itself complete, which is what `docs/DASHBOARD_EXPERIENCE.md`'s Continue Learning card and `docs/LEARNING_PATHS.md`'s milestone tracking both read from.

## AI

An Ask AI entry point is proposed on every Lesson Page, pre-scoped to the current article per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Context Selection — a learner's question is answered with this article's content weighted most heavily, without excluding a genuinely relevant answer from elsewhere in the repository. This is the same AI Experience defined in `docs/AI_EXPERIENCE.md`, not a separate, article-specific assistant.

## Role Collection Variant

A Role Collection's Landing and Lesson pages follow the identical pattern described above, with one difference: the Landing Page's Related Modules section is proposed to specifically surface the "structurally equivalent article in a prior collection" cross-references `docs/COLLECTION_BOOTSTRAP.md`'s Internal Linking Rules already require every Role Collection article to include — making that existing cross-collection linking pattern more visually discoverable than it currently is as plain in-text links.

## What This Document Does Not Change

Nothing in this document alters a single word of any existing article. Every behavior described above is either a read of existing content and metadata, or new product-only chrome (progress state, action links, the AI panel) rendered around that unchanged content.

## Related Documents

- `docs/MODULE_INDEX_STANDARD.md` — the metadata fields this experience renders
- `docs/UI_NAVIGATION_BLUEPRINT.md` — the underlying UI elements (Sidebar, Right TOC) this document sequences into a page flow
- `docs/ASSESSMENT_FRAMEWORK.md` — the Practice and Quiz mechanics linked from the Lesson Page
- `docs/AI_EXPERIENCE.md` — the full AI Assistant experience linked from the Lesson Page
