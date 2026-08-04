# Frontend Build Guide

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** How a future frontend implementation should be organized, built from every specification produced across this and the prior Implementation Sprint
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document describes organizational conventions — folder structure, component hierarchy, naming, and state/API usage patterns — for a future frontend build. It does not select a specific framework version, build tool, or package beyond what `docs/IMPLEMENTATION_BACKLOG.md` and this sprint's documents already assume (a Next.js-based implementation, consistent with the existing Fumadocs site per `docs/AI_CONTEXT_PACK.md` §2). Every convention below exists so an implementation team has a consistent structure to build against, not so this document dictates code it will never write.

## Folder Structure

Proposed top-level organization, additive to the existing `content/docs/` and `docs/` trees rather than replacing either:

```
app/                    Routes, per docs/ROUTE_REGISTRY.md — one folder or file per route segment
  (auth)/                Authentication routes
  dashboard/
  learning/
  browse/
  bookmarks/
  notes/
  assessments/
  search/
  ai/
  manager/
  trainer/
  settings/
  admin/
components/             Shared, reusable components — see Component Hierarchy below
  layout/                docs/APP_LAYOUT_SPEC.md components (Header, Sidebar, Right TOC, Footer)
  dashboard/              docs/DASHBOARD_COMPONENT_SPEC.md components
  learning/               docs/LEARNING_COMPONENT_SPEC.md components
  search/                 docs/SEARCH_COMPONENT_SPEC.md components
  ai/                     docs/AI_CHAT_COMPONENT_SPEC.md components
  assessment/             docs/ASSESSMENT_COMPONENT_SPEC.md components
  profile/                docs/PROFILE_COMPONENT_SPEC.md components
  manager/                docs/MANAGER_COMPONENT_SPEC.md components
  ui/                     docs/DESIGN_SYSTEM_SPEC.md primitives (Card, Button, Table, Dialog, and the rest)
hooks/                  Reusable hooks — see Reusable Hooks below
lib/                    Non-component logic: API client functions (per docs/API_CONTRACTS.md), the Content Manifest reader (per docs/CONTENT_MANIFEST.md), retrieval-pipeline client code (per docs/AI_RETRIEVAL_MANIFEST.md)
content/docs/           Existing, untouched — the Fumadocs content tree
docs/                   Existing, untouched — this repository's engineering and specification documents
```

This structure mirrors this sprint's own document boundaries deliberately — a `components/dashboard/` folder maps directly onto `docs/DASHBOARD_COMPONENT_SPEC.md`'s component list, so a developer can locate the implementation of any component this sprint specified without a separate cross-reference document.

## Component Hierarchy

Three tiers, consistent with the distinction already implicit across `docs/COMPONENT_LIBRARY.md`, `docs/PAGE_TEMPLATES.md`, and `docs/ROUTE_REGISTRY.md`:

1. **Primitives** (`components/ui/`) — the Design System's base elements (Card, Button, Table, Dialog, form controls), per `docs/DESIGN_SYSTEM_SPEC.md`. No feature-specific logic; only visual and interaction structure.
2. **Feature components** (`components/dashboard/`, `components/learning/`, and the rest) — the components specified in `docs/DASHBOARD_COMPONENT_SPEC.md` through `docs/MANAGER_COMPONENT_SPEC.md`, each composed from primitives plus its own data dependency, per that component's own Inputs/Props/State/Events contract.
3. **Templates and routes** (`app/`) — `docs/PAGE_TEMPLATES.md`'s layouts, each composing feature components into the region structure that document already defines, rendered at the routes `docs/ROUTE_REGISTRY.md` assigns.

A component never skips a tier inward — a route composes templates and feature components, never reaches directly into a primitive; a feature component composes primitives, never duplicates one. This mirrors the same "reference rather than restate" discipline `docs/AI_CONTEXT_PACK.md` §9 already applies to documentation.

## Shared Components

Components used across more than one feature area belong in `components/ui/` (if a pure primitive) or a `components/shared/` folder (if feature-aware but reused across multiple feature specs) rather than duplicated per feature folder. Concrete examples already identified across this sprint's specifications:

- `ProgressBar` — specified in `docs/LEARNING_COMPONENT_SPEC.md`, reused by `docs/DASHBOARD_COMPONENT_SPEC.md`'s Progress widget and `docs/MANAGER_COMPONENT_SPEC.md`'s Team Overview.
- `BookmarkCard` / `BookmarkToggle` — specified in `docs/COMPONENT_LIBRARY.md`, reused across `docs/DASHBOARD_COMPONENT_SPEC.md`, `docs/LEARNING_COMPONENT_SPEC.md`'s Lesson Page, and `docs/PROFILE_COMPONENT_SPEC.md`.
- `MetricEmptyState` — specified in `docs/COMPONENT_LIBRARY.md`, reused by every analytics-displaying component across `docs/DASHBOARD_COMPONENT_SPEC.md`, `docs/PROFILE_COMPONENT_SPEC.md`'s Achievements, and `docs/MANAGER_COMPONENT_SPEC.md`'s Analytics.
- The Roleplay component's turn-by-turn conversation layout (`docs/ASSESSMENT_COMPONENT_SPEC.md`) and the AI Chat's Conversation Layout (`docs/AI_CHAT_COMPONENT_SPEC.md`) share a structurally similar (though not identical) turn-based rendering pattern — an implementation team should evaluate whether these merit a shared base component, a decision this document flags but doesn't resolve, since the two remain functionally distinct (exercise-scored vs. AI-retrieval-grounded) per their own specifications.

## Reusable Hooks

Proposed hooks, one per state domain in `docs/STATE_MANAGEMENT.md`, encapsulating that domain's read/write logic against its corresponding `docs/API_CONTRACTS.md` contract so components never call an API contract directly:

| Hook | State Domain | Contract |
|---|---|---|
| `useAuth()` | Authentication | Authentication |
| `useProgress(scope)` | Progress | Progress |
| `useBookmarks()` | Bookmarks | Bookmarks |
| `useNotes(scope)` | Notes | Notes |
| `useAIConversation(context?)` | AI | AI |
| `useSearch()` | Search | Search |
| `useHistory()` | History | (read-only, no dedicated contract beyond Progress-adjacent tracking) |
| `useManagerTeam()` | Manager | Analytics (Manager scope) |
| `useCareerAdvisorProfile()` | Career Advisor | Progress, Career Advisor–specific reads |

Additional cross-cutting hooks: `useContentManifest(moduleId)` (reads `docs/CONTENT_MANIFEST.md` data), `useBreakpoint()` (the Desktop/Mobile layout-mode decision per `docs/APP_LAYOUT_SPEC.md`), `useKeyboardShortcut(binding, handler)` (registered at the shell level per that document's Keyboard Shortcuts section).

## Naming Conventions

- **Components:** PascalCase, matching the exact names already used throughout this sprint's specifications and `docs/COMPONENT_LIBRARY.md` (e.g. `ContinueLearningCard`, `AskAIPanel`) — an implementation should not rename a component already named in a specification document, so the specification and the codebase stay directly traceable to each other.
- **Hooks:** camelCase with a `use` prefix, per standard React convention, named after the state domain they encapsulate (see Reusable Hooks above).
- **Routes:** lowercase kebab-case, matching `docs/ROUTE_REGISTRY.md`'s route paths exactly.
- **Files:** one component per file, filename matching the component's PascalCase name (e.g. `ContinueLearningCard.tsx`), consistent with the same one-concept-per-unit discipline `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` applies to content files.

## Coding Conventions

This document does not mandate a specific linting configuration, but proposes the following conventions consistent with the specifications already produced:

- A component's props interface should mirror its specification's Props field exactly, so a specification document remains the source of truth for a component's public contract rather than the two drifting apart over time.
- A component should not fetch data it doesn't render — data fetching belongs in the hooks layer (see above) or a route-level loader, never duplicated inline inside a feature component, consistent with `docs/STATE_MANAGEMENT.md`'s ownership-per-domain principle carried into code structure.
- Every component's Error States and Loading States, as specified throughout this sprint's documents, should be implemented as explicit render branches, not omitted as "not yet handled" — mirroring `docs/MASTER_QA_PLAYBOOK.md`'s standing rule that a known, fixable gap is never delivered as an unresolved known issue.

## State Management Usage

Restated by reference to `docs/STATE_MANAGEMENT.md`'s domain-by-domain specification: this document adds that each domain's corresponding hook (see Reusable Hooks above) is the only sanctioned access point to that domain's data — a component never reads or writes account state directly through a raw API call, always through its domain's hook, so a future change to the underlying transport (REST vs. GraphQL, for instance) touches only the hooks layer, not every consuming component.

## API Usage

Restated by reference to `docs/API_CONTRACTS.md`: this document adds that contract calls are proposed to be centralized in `lib/` (per Folder Structure above), wrapped by the Reusable Hooks layer, never called directly from a component or a page template. This mirrors `docs/API_CONTRACTS.md`'s own framing of contracts as resource/operation specifications independent of transport — centralizing calls in `lib/` is what actually makes that transport-independence real in the codebase, not just in the specification document.

## Future Scalability

**New modules and collections.** Per `docs/FUTURE_EXPANSION_GUIDE.md`, the content tree grows over time. Because this build guide's `app/browse/[moduleId]` route and `docs/CONTENT_MANIFEST.md`'s manifest record are already data-driven rather than hard-coded per module, a new module or Role Collection requires no frontend code change — only the content sprint itself (per `docs/SPRINT_GENERATION_TEMPLATE.md`) and, where applicable, the manifest inventory table in `docs/CONTENT_MANIFEST.md` being regenerated from the live repository.

**New personas.** The Sales Executive role, explicitly deferred in `docs/PROFILE_COMPONENT_SPEC.md`, can be added as a new profile variant and a new entry in `docs/NAVIGATION_MANIFEST.md`'s Navigation State by Persona table without restructuring the shell (`docs/APP_LAYOUT_SPEC.md`), since persona-driven navigation is already data-driven there.

**New assessment types.** `docs/ASSESSMENT_COMPONENT_SPEC.md`'s Quiz, Scenario, and Roleplay layouts already share a common Results/Feedback/Attempts substrate — a future assessment type would most likely reuse that substrate rather than requiring a parallel implementation, though this document doesn't presuppose what that future type might be.

**Design system evolution.** Once `docs/DESIGN_SYSTEM_SPEC.md`'s Brand Input Pending values are supplied, they populate the token layer only — no component specified across this sprint's documents references a literal value directly, so brand finalization is a token-file change, not a component-by-component rewrite.

**MCP and future AI surfaces.** `docs/AI_ASSISTANT_BLUEPRINT.md`'s Future MCP Compatibility possibility, and `docs/AI_CHAT_COMPONENT_SPEC.md`'s note that this Assistant's pipeline is already a thin presentation layer over a pipeline it doesn't own, mean a second consumer of that pipeline (an MCP tool interface) would sit in `lib/` alongside the existing AI hook, not require changes to `components/ai/`.

## Related Documents

- Every component and page specification produced across this sprint and the prior Implementation Sprint — the source of every folder, component, and hook named above
- `docs/IMPLEMENTATION_SEQUENCE.md` — the phased build order this folder structure and component hierarchy would be built against
- `docs/DESIGN_SYSTEM_SPEC.md` — the token layer this guide's components reference rather than hard-code
- `docs/FUTURE_EXPANSION_GUIDE.md` — the content-growth pattern this guide's data-driven routing accommodates without code changes
