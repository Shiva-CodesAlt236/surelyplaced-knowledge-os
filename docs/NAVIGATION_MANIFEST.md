# Navigation Manifest

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** Every navigation surface the Academy platform would render, mapped to the routes `docs/ROUTE_REGISTRY.md` defines and the elements `docs/UI_NAVIGATION_BLUEPRINT.md` and `docs/INFORMATION_ARCHITECTURE.md` already proposed
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies the concrete contents of each navigation surface — what items appear, in what order, and which route each resolves to. It does not redesign any navigation concept; every surface below is already named in `docs/UI_NAVIGATION_BLUEPRINT.md` or `docs/INFORMATION_ARCHITECTURE.md`, and every route referenced is defined once in `docs/ROUTE_REGISTRY.md`.

## Top Navigation

Fixed, always-visible entries, per `docs/INFORMATION_ARCHITECTURE.md`'s Global Navigation:

| Order | Label | Route | Visible To |
|---|---|---|---|
| 1 | Dashboard | `/dashboard` | All authenticated personas (Manager/Trainer/Admin see their own dashboard variant per role) |
| 2 | Browse | `/browse` | All authenticated personas |
| 3 | Learning Paths | `/learning` | All authenticated personas |
| 4 | Search | `/search` (or opens Search Overlay, see below) | All authenticated personas |
| 5 | Ask AI | `/ai` | All authenticated personas, where the AI Assistant is enabled per `docs/AI_ASSISTANT_BLUEPRINT.md` |

A role-scoped account menu (not itself a navigation item in the sense above) resolves to `/settings`, `/admin` (Admin only), `/manager` (Sales Manager only), `/trainer` (Trainer only), and `/logout`, per each role's routes in `docs/ROUTE_REGISTRY.md`.

## Sidebar

Two proposed modes, per `docs/UI_NAVIGATION_BLUEPRINT.md`'s Left Sidebar and `docs/INFORMATION_ARCHITECTURE.md`'s Sidebar section:

**Browse mode (default).** Renders the full `content/docs/` hierarchy directly from `meta.json` "pages" arrays — already Fumadocs' current, working behavior. Top-level entries match `docs/CONTENT_MANIFEST.md`'s Top-Level Modules table, in that table's Navigation Order. Each entry shows a Completion Status indicator (not started / in progress / complete) once Progress tracking exists, per `docs/MODULE_INDEX_STANDARD.md`.

**Path mode (active only when a learner is inside an enrolled Learning Path).** Shows only that path's modules, in the completion order `docs/LEARNING_PATHS.md` defines for that path, replacing the full Browse tree until the learner exits the path view. Switching between Browse mode and Path mode is a proposed toggle at the top of the Sidebar, not a separate route.

## Breadcrumbs

Rendered on every Lesson and Module Landing Page, derived directly from route structure with no independently authored data:

| Context | Breadcrumb Pattern |
|---|---|
| Sales Academy / `*-intelligence` module article | Browse → [Module Name] → [Article Title] |
| Role Collection article | Browse → Candidate Intelligence → [Collection Name] → [Article Title] |
| Candidate Intelligence schema file | Browse → Candidate Intelligence → [Schema File Title] |
| Learning Path detail | Learning Paths → [Path Name] |
| Assessment screen | [Originating Module or Path] → [Assessment Name] |

Module Name and Article Title values are read from `docs/CONTENT_MANIFEST.md`'s Module Name field and each article's existing frontmatter `title`, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3 — never independently authored for the breadcrumb.

## Right Navigation

The Sticky Right TOC, per `docs/UI_NAVIGATION_BLUEPRINT.md`: rendered only on the Lesson / Article Page, generated at render time from the current article's own `##` headings (Purpose, Scope, Core Content, and so on, per the standard seven-section shape, or a module's bespoke section set). No independently authored table-of-contents data — this is a direct parse of the article's existing structure.

## Footer

Proposed, standard baseline for a documentation-style site: links to `/settings`, a version or last-deployed indicator (sourced from `docs/REPOSITORY_HEALTH.md`'s Build Status once populated by Antigravity, never asserted by this document), and — where applicable — a link back to Surely Placed's primary corporate site. This document does not specify footer visual design, only its content scope.

## Context Navigation

Proposed short-lived navigation specific to the learner's current context, distinct from the persistent Top Navigation and Sidebar:

- On a Lesson Page: the three action points defined in `docs/MODULE_EXPERIENCE.md` — Practice, Quiz, Checklist — shown only where the underlying content or assessment exists to support them.
- On a Search Results Page: the applied Filters (Module, Topic, Role) as removable chips, per `docs/SEARCH_PRODUCT.md`'s Filters section.
- On an Ask AI Panel opened from a specific module: a visible indicator of the current scope (per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Context Selection), with an action to broaden the question to the full repository.

## Module Navigation

Rendered at the bottom of a Lesson Page, per `docs/MODULE_EXPERIENCE.md`:

**Previous / Next.** Sequential navigation to the adjacent article in the current module's `meta.json` "pages" order — a direct read of existing ordering, not a separately authored sequence. Where the learner reached the article via Search or Ask AI rather than in-module browsing, Previous/Next still reflects the article's position within its own module, not the learner's actual navigation history.

**Continue Learning.** Distinct from Previous/Next: a persistent, cross-page shortcut (surfaced on the Dashboard per `docs/DASHBOARD_EXPERIENCE.md` and as a Module Navigation element) pointing to either the learner's last-viewed article generally, or — where a Learning Path is active — specifically the next module in that path's sequence per `docs/LEARNING_PATHS.md`, which may differ from the next article within the current module if the current module is the last one before a path transition.

## Navigation State by Persona

| Persona | Top Navigation | Sidebar Default Mode | Manager/Trainer/Admin Entries |
|---|---|---|---|
| Career Advisor (new) | Full set | Path mode (onboarded into a path per `docs/USER_JOURNEYS.md` Journey 1) | None |
| Career Advisor (experienced) | Full set | Browse mode (per Journey 2's sidebar- and search-driven navigation) | None |
| Sales Manager | Full set, plus Manager Dashboard account-menu entry | Browse mode | Manager Dashboard, Team Progress Detail |
| Trainer | Full set, plus Trainer Cohort Dashboard account-menu entry | Browse mode | Trainer Cohort Dashboard |
| Admin | Dashboard, Browse, Search only — Learning Paths and Ask AI are learner-facing concepts not proposed for the Admin persona per `docs/USER_JOURNEYS.md` Journey 5 | Not applicable — Admin's primary surface is the Admin Console, not content browsing | Admin Console |

## Related Documents

- `docs/UI_NAVIGATION_BLUEPRINT.md` — the underlying UI elements this manifest assigns concrete content to
- `docs/INFORMATION_ARCHITECTURE.md` — the navigational structure this manifest implements
- `docs/ROUTE_REGISTRY.md` — the routes every navigation item resolves to
- `docs/CONTENT_MANIFEST.md` — the Module Name and Navigation Order values this manifest reads from
