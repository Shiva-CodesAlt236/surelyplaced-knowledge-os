# UI Navigation Blueprint

**Status:** Design proposal — not yet built
**Applies to:** The proposed documentation UI for the Career Advisor Academy
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document describes proposed UI structure and behavior only — no components, styles, or code. Where an element already exists in the current Fumadocs-based site, this document says so explicitly rather than describing it as new. Where an element is proposed and does not yet exist, this document says that too.

## Left Sidebar

Already exists in some form: Fumadocs renders sidebar navigation directly from each folder's `meta.json` "pages" array, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §4 and §17 — this is the current, working baseline. Proposed addition: a per-module Completion Status indicator (not started / in progress / complete, per `docs/MODULE_INDEX_STANDARD.md`) rendered next to each sidebar entry, and a visual grouping of modules by Learning Path when a learner is actively following one from `docs/LEARNING_PATHS.md`.

## Sticky Right TOC

Proposed: a persistent, scroll-synced table of contents for the current article, generated from that article's own headings (`## Purpose`, `## Scope`, and so on) — no new content structure required, since every article already uses a consistent heading pattern per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6.

## Breadcrumbs

Proposed: a path showing Module → Sub-collection (where applicable, e.g. a specific Role Collection) → Article, derived directly from the existing folder hierarchy in `docs/REPOSITORY_STATE.md`'s Folder Hierarchy section. No new metadata is required to support this; it's a direct rendering of the existing structure.

## Progress

Proposed, new: a per-learner, per-Learning-Path progress indicator (e.g., "7 of 13 modules complete") reflecting the Completion Status field proposed in `docs/MODULE_INDEX_STANDARD.md`, aggregated across a path's modules per `docs/LEARNING_PATHS.md`. This is session/account state, not content — no article changes to support it.

## Bookmarks

Proposed, new: a per-account saved-article feature, accessible from the sidebar and surfaced within `docs/SEARCH_EXPERIENCE.md`'s search results. A bookmark is a pointer to an existing article; it never duplicates or excerpts the article's content.

## Continue Reading

Proposed, new: a persistent shortcut back to the last article a learner was reading, and — where relevant — the next recommended article in their active Learning Path's completion order per `docs/LEARNING_PATHS.md`. This requires tracking a learner's last-viewed article, which is session/account state.

## Module Landing Pages

Already exists in some form: every module's `overview.mdx` already functions as a landing page. Proposed enhancement: a richer landing page view surfacing the full field set proposed in `docs/MODULE_INDEX_STANDARD.md` — Learning Objectives, Reading Time, Difficulty, Prerequisites, and links to the module's Checklist, Practice, and Quiz — rather than the plain article rendering used today.

## Dark Mode

Proposed: a standard light/dark theme toggle, a common baseline feature for a documentation site of this kind. This document does not specify visual design (colors, contrast ratios) — that belongs to an actual design/implementation phase, not this architecture document.

## Search Overlay

Proposed: a keyboard-accessible overlay (see Keyboard Shortcuts below) presenting the full faceted search experience defined in `docs/SEARCH_EXPERIENCE.md` — Global, Module, Topic, Role, Candidate, and Problem search, plus Suggested Searches, Recent Searches, and Bookmarks — without navigating away from the current page.

## Keyboard Shortcuts

Proposed, new: a small, discoverable set of shortcuts — for example, a single key to open the Search Overlay, and standard browser-native shortcuts otherwise left untouched. This document does not assign specific key bindings; that's an implementation detail for a future build phase, and specific bindings should be chosen to avoid conflicting with common browser or screen-reader shortcuts.

## What This Document Does Not Do

This document does not specify colors, typography, component libraries, or any code. It describes what should exist and roughly where, leaving how it's actually built to an implementation phase gated by `docs/DEPLOYMENT_READINESS_CHECKLIST.md`.

## Related Documents

- `docs/MODULE_INDEX_STANDARD.md` — the fields this UI renders (Completion Status, Bookmarks, and others)
- `docs/SEARCH_EXPERIENCE.md` — the full search design the Search Overlay presents
- `docs/LEARNING_PATHS.md` — the path structure Progress and Continue Reading track against
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md` — what must be true before any of this ships
