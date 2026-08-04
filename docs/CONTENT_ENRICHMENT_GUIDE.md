# Content Enrichment Guide

**Status:** Canonical reference for future enrichment sprints — not itself a content sprint
**Applies to:** How a future contributor adds the new metadata fields proposed across `docs/MODULE_INDEX_STANDARD.md`, `docs/MODULE_METADATA_STANDARD.md`, and `docs/LESSON_STRUCTURE_STANDARD.md` to existing articles, without breaking anything
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

Several documents in this repository's platform-design layer propose new fields — Learning Objectives, Difficulty, Skills Covered, and the rest — that don't exist in any article's frontmatter yet. This guide is the answer to "how would a future sprint actually add them safely." It is not itself an enrichment sprint; nothing in `content/docs/` has been touched by this document.

## The Core Risk

Enrichment work is different from ordinary new-content sprints in one important way: it touches *already-published, already-QA'd* articles. The two risks that matter most are (1) accidentally changing an article's meaning while adding metadata around it, and (2) reintroducing duplicate content by drafting many new field values from a shared template too literally — the exact failure mode `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §15 and `docs/COLLECTION_BOOTSTRAP.md`'s Duplicate-Content Policy already warn against for new articles, equally applicable here.

## Principle 1: Add, Never Rewrite

An enrichment sprint adds new frontmatter fields (`learning_objectives`, `difficulty`, `skills_covered`, and so on, per `docs/MODULE_INDEX_STANDARD.md` and `docs/MODULE_METADATA_STANDARD.md`) to an article's existing frontmatter block. It never rewrites `## Purpose`, `## Scope`, `## Core Content`, or any other existing section's prose. If a new field's value genuinely requires restating something already said in the body, that's a sign the field should reference the existing section rather than duplicate it — the same discipline `docs/AI_CONTEXT_PACK.md` itself follows relative to the documents it indexes.

## Principle 2: One Field Type Per Pass

Enrich one field across many articles in a single pass, rather than one article fully enriched with every new field before moving to the next. Adding Difficulty across every article in a module, then Skills Covered across the same set, then Learning Objectives, produces more consistent, comparable values than working article-by-article — the same "generate all first, then QA once" discipline `docs/SPRINT_GENERATION_TEMPLATE.md` §6 and `docs/COLLECTION_BOOTSTRAP.md`'s Batch Generation Rules already establish for new content, applied here to enrichment instead.

## Principle 3: Write Each Value Independently

Where a field like Learning Objectives is being added across many structurally similar articles (every article in a Role Collection, for instance), write each article's value independently rather than copying one article's phrasing and editing it for the next — precisely the failure mode that caused the duplicate-content violations documented in this repository's own sprint history (Sprint 14, Batch 2), and precisely the discipline `docs/COLLECTION_BOOTSTRAP.md`'s Duplicate-Content Policy already states explicitly.

## Principle 4: Respect Locked Content

An enrichment sprint never touches a locked engineering standard (`docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, `docs/ROLE_COLLECTION_TEMPLATE.md`, and the rest, per `docs/REPOSITORY_OWNERSHIP.md`), and it treats a completed Role Collection or Sales Academy module the same way any other sprint would — additive metadata only, never a rewrite of a "previously completed collection or module," which `docs/COLLECTION_BOOTSTRAP.md`'s Repository Ownership Rules already prohibits regenerating.

## Principle 5: Run the Same QA, Scoped to What Changed

An enrichment sprint runs the same eight-step QA sequence defined in `docs/SPRINT_GENERATION_TEMPLATE.md` §4, with two adjustments specific to enrichment work: the frontmatter check (step 1) becomes the primary focus, since enrichment is almost entirely a frontmatter change; and the duplicate-content scan (step 5) should specifically compare the new field values against each other across the enriched set, not just against the rest of the repository, since that's where Principle 3's risk actually shows up.

## Principle 6: Report What Changed, Precisely

An enrichment sprint's Delivery Manifest, per `docs/SPRINT_GENERATION_TEMPLATE.md` §9, should state exactly which field was added to exactly which files — not "enriched the Objections module," but the specific field and the specific file list — since a reviewer verifying an enrichment sprint needs to confirm nothing beyond the stated field actually changed.

## What This Guide Does Not Cover

This guide governs *metadata* enrichment specifically. Writing genuinely new content — a new article, a new module — remains governed by `docs/SPRINT_GENERATION_TEMPLATE.md` and `docs/COLLECTION_BOOTSTRAP.md` in full, unchanged by anything in this guide.

## Related Documents

- `docs/MODULE_INDEX_STANDARD.md`, `docs/MODULE_METADATA_STANDARD.md`, `docs/LESSON_STRUCTURE_STANDARD.md` — the proposed fields this guide explains how to add safely
- `docs/SPRINT_GENERATION_TEMPLATE.md` — the underlying QA process this guide adapts for enrichment specifically
- `docs/COLLECTION_BOOTSTRAP.md` — the duplicate-content and locked-content discipline this guide extends
- `docs/AUTHORING_CHECKLIST.md` — the pre-delivery checklist any enrichment sprint, like any other sprint, should run through before delivery
