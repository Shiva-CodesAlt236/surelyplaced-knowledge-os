# Information Architecture

**Status:** Design proposal — not yet built
**Applies to:** The proposed complete navigational structure of the Academy product
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies the product's navigational structure. It does not redefine the underlying content hierarchy, which already exists and is authoritative in `docs/REPOSITORY_STATE.md`'s Folder Hierarchy section — this document describes how that existing structure is surfaced and supplemented by product-only concepts (Learning Paths, Bookmarks, Recent) that don't correspond to a `content/docs/` folder.

## Global Navigation

Proposed top-level, always-visible navigation: Dashboard, Browse (the full content hierarchy), Learning Paths, Search, and — where the AI Assistant is enabled — Ask AI. This is a small, fixed set, deliberately not enumerating every module at the global level; module-level navigation happens in the Sidebar once a learner is inside Browse or a specific path.

## Sidebar

Already partially exists: Fumadocs renders sidebar navigation directly from `meta.json` "pages" arrays today, per `docs/UI_NAVIGATION_BLUEPRINT.md`'s Left Sidebar section. This document treats that as the Browse experience's sidebar specifically. Proposed addition at the product layer: a second sidebar mode, active when a learner is inside an assigned Learning Path, that shows only that path's modules in completion order (per `docs/LEARNING_PATHS.md`) rather than the full repository tree — reducing the surface area a New Career Advisor has to navigate on day one, consistent with Journey 1 in `docs/USER_JOURNEYS.md`.

## Hierarchy

The underlying hierarchy is unchanged from what already exists and is authoritative in `docs/REPOSITORY_STATE.md`:

```
content/docs/
  <sales-academy-module>/
  candidate-intelligence/
    <FRAMEWORK_FILE>.mdx
    reference-profile/
    <role-collection>/
```

This document adds one product-only layer on top, which has no corresponding folder in `content/docs/`:

```
Learning Paths (product-only; defined in docs/LEARNING_PATHS.md, not a content folder)
  New Career Advisor
  Senior Career Advisor
  Sales Manager
  Technical Hiring Specialist
  International Student Specialist
```

A Learning Path is a sequence *through* existing folders, never a folder of its own — this preserves the principle in `docs/ACADEMY_PRODUCT_VISION.md` that content stays the single source of truth.

## Modules

Surfaced exactly as they exist under `content/docs/` today — every Sales Academy module and every `*-intelligence` expansion module, browsable through Global Navigation → Browse. No product-only grouping is proposed beyond what the existing root `content/docs/meta.json` already defines.

## Collections

Refers specifically to the Role Collections under `content/docs/candidate-intelligence/`. Proposed to have their own dedicated Browse sub-view (distinct from the flatter Sales Academy module list), reflecting that Role Collections share the fourteen-file structure defined in `docs/ROLE_COLLECTION_TEMPLATE.md` and are more naturally browsed as a set than individually.

## Learning Paths

The product-only layer described under Hierarchy above. Proposed to have its own top-level Global Navigation entry, its own landing view listing all five paths from `docs/LEARNING_PATHS.md`, and — once a learner is enrolled in one — the alternate Sidebar mode described above.

## Quick Access

A proposed small set of shortcuts surfaced from the Global Navigation bar or a keyboard shortcut (per `docs/UI_NAVIGATION_BLUEPRINT.md`'s Keyboard Shortcuts): Continue Learning (jump to the last-viewed article), Ask AI, and Search. This is a subset of Global Navigation optimized for the single most likely next action, not a separate structural layer.

## Bookmarks

A product-only, per-account list with no corresponding content folder — a bookmark is a pointer to an existing article, never a copy of it, per `docs/MODULE_INDEX_STANDARD.md`. Proposed to have its own view, reachable from Global Navigation or the Sidebar, and to be filterable the same way Browse is (by module, by tag).

## Recent

A product-only, per-session or per-account list of recently viewed articles, distinct from Bookmarks (which are deliberate) in that Recent is automatic and unbounded in what it captures. Proposed to appear as a Dashboard widget (`docs/DASHBOARD_EXPERIENCE.md`) and as a facet within Search (`docs/SEARCH_PRODUCT.md`'s Recent Searches, which is a related but distinct concept — Recent here means recently *viewed content*, not recently *searched terms*).

## Search

Global Navigation's Search entry opens the Search Overlay defined in `docs/UI_NAVIGATION_BLUEPRINT.md` and specified in full product detail in `docs/SEARCH_PRODUCT.md`. This document treats Search as a navigational entry point; the search experience itself is defined once, in that sibling document, not restated here.

## AI

Global Navigation's Ask AI entry opens the AI Experience defined in full in `docs/AI_EXPERIENCE.md`. As with Search, this document treats AI as a navigational entry point into an experience specified elsewhere, not a second definition of it.

## Consistency with Existing Structure

Every element in this document either surfaces an existing `content/docs/` structure unchanged, or is explicitly marked "product-only" with no corresponding content folder. Nothing here proposes reorganizing, renaming, or flattening the existing content hierarchy — the naming conventions in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5 and the folder rules in `docs/COLLECTION_BOOTSTRAP.md` remain fully authoritative and unmodified by this document.

## Related Documents

- `docs/REPOSITORY_STATE.md` — the authoritative underlying content hierarchy
- `docs/UI_NAVIGATION_BLUEPRINT.md` — the UI elements (Sidebar, Search Overlay) this architecture organizes
- `docs/SEARCH_PRODUCT.md` and `docs/AI_EXPERIENCE.md` — the full specifications behind this document's Search and AI entries
- `docs/LEARNING_PATHS.md` — the product-only Learning Paths layer
