# App Layout Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** The global application shell every page in `docs/PAGE_TEMPLATES.md` renders inside
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies the application shell itself — the persistent frame every page template from `docs/PAGE_TEMPLATES.md` fills its regions inside. It does not redefine Header, Sidebar, Right TOC, or Footer content, which are already specified in `docs/NAVIGATION_MANIFEST.md`; it specifies each element's structural role, responsive behavior, and component contract. Every color, spacing, and typography value referenced below is a token name defined once in `docs/DESIGN_SYSTEM_SPEC.md`, never restated as a literal value here.

## Global Application Shell

**Purpose.** The persistent outer frame — Header, Sidebar, primary content region, optional Right TOC, Footer — that every authenticated route in `docs/ROUTE_REGISTRY.md` renders inside, so navigation state (which module is open, whether a Learning Path is active) persists across page transitions without a full reload of shell chrome.

**Responsibilities.** Own the responsive breakpoint decision (desktop vs. mobile layout, defined below), own Sidebar open/closed state on mobile, and host the Search Overlay and Ask AI Panel as shell-level overlays rather than page-level elements, since both are reachable from any page per `docs/INFORMATION_ARCHITECTURE.md`'s Global Navigation.

**Inputs.** Current route (for Header/Sidebar active-state highlighting), Authentication state (per `docs/STATE_MANAGEMENT.md`), current Learning Path enrollment (for Sidebar mode).

**Outputs.** None beyond rendering; the shell is a layout container, not a data producer.

**Props:** `children` (the current page template's rendered output).

**State:** Sidebar open/closed (mobile only), Search Overlay open/closed, Ask AI Panel open/closed — all shell-level UI state, not persisted beyond the session, distinct from the account-level state domains in `docs/STATE_MANAGEMENT.md`.

**Events:** Route change (closes any open overlay), breakpoint change (recalculates layout mode).

**Dependencies:** Authentication state (an unauthenticated user sees only the Authentication routes' minimal shell, per `docs/ROUTE_REGISTRY.md`), `docs/NAVIGATION_MANIFEST.md` for Header/Sidebar/Footer content.

**Responsive behavior:** See Mobile Behaviour and Desktop Behaviour below.

**Accessibility:** The shell establishes the page's landmark regions (`header`, `nav`, `main`, `aside`, `footer` in semantic-HTML terms, or their ARIA-role equivalents) exactly once per page, so every page template's content lands inside a consistent, screen-reader-navigable structure without redefining landmarks itself.

**Error states:** A shell-level error boundary catches an unhandled error in the current page's content region and renders the `/500` route's content in place of the broken region, without taking down Header, Sidebar, or Footer — a learner can still navigate away from a broken page.

**Loading states:** See Loading States section below.

**Future extensibility:** A future Trainer-specific shell variant (per `docs/USER_JOURNEYS.md` Journey 4) can add a Trainer-only Header entry without altering this shell's structure, since Header content is already data-driven from `docs/NAVIGATION_MANIFEST.md`'s Navigation State by Persona table rather than hard-coded per role.

## Header

**Purpose.** Hosts Top Navigation (per `docs/NAVIGATION_MANIFEST.md`) and the account menu.

**Responsibilities.** Render Top Navigation items per the current persona's entry set (`docs/NAVIGATION_MANIFEST.md`'s Navigation State by Persona table), highlight the active section, expose the account menu.

**Inputs:** Current persona/role, current route (for active-state highlighting).

**Outputs:** Navigation intent (a route change) or overlay-open intent (Search, Ask AI).

**Props:** `activeRoute`, `persona`.

**State:** Account menu open/closed.

**Events:** `onNavigate(route)`, `onOpenSearch()`, `onOpenAI()`, `onOpenAccountMenu()`.

**Dependencies:** `docs/NAVIGATION_MANIFEST.md` Top Navigation, `docs/ROUTE_REGISTRY.md`.

**Responsive behavior:** On mobile, Top Navigation entries collapse into the Sidebar's mobile drawer (see Mobile Behaviour) rather than remaining inline in the Header, to preserve horizontal space for the Header's Sidebar-toggle control and account menu.

**Accessibility:** Header is a `banner` landmark; the active navigation item is indicated with `aria-current="page"`, not by color alone, per the Accessibility section's general rule below.

**Error states:** If persona/role data fails to load, Header renders the minimal, role-agnostic entry set (Dashboard, Browse, Search) rather than an empty or broken navigation bar.

**Loading states:** A skeleton Header (fixed height, no content) renders during initial Authentication state resolution, replaced once role is known — never a flash of the wrong persona's navigation.

**Future extensibility:** A notification-bell entry could be added to Header without restructuring it, since Header is already a flexible row of navigation entries plus an account menu, not a fixed two-item layout.

## Sidebar

**Purpose.** Restated by reference to `docs/NAVIGATION_MANIFEST.md`'s Sidebar section — this entry specifies its component contract, not its content.

**Responsibilities.** Render either Browse mode (`SidebarTree`) or Path mode (`SidebarPathView`), per `docs/COMPONENT_LIBRARY.md`; expose the mode toggle where a Learning Path is active.

**Inputs:** Current module tree (per `docs/CONTENT_MANIFEST.md`), active Learning Path enrollment, Progress state (for `CompletionIndicator` per entry).

**Outputs:** Navigation intent (a route change to a module or article).

**Props:** `mode` (`browse` | `path`), `activeModuleId`.

**State:** Expanded/collapsed state per tree branch (Browse mode only).

**Events:** `onNavigate(moduleId, articleSlug)`, `onToggleMode()`.

**Dependencies:** `docs/CONTENT_MANIFEST.md` (tree structure), `docs/STATE_MANAGEMENT.md` Progress state, `docs/LEARNING_PATHS.md` (Path mode ordering).

**Responsive behavior:** See Mobile Behaviour — the Sidebar becomes a slide-in drawer on mobile rather than a persistent column.

**Accessibility:** The Sidebar is a `navigation` landmark distinct from Header's; tree expansion/collapse is keyboard-operable (arrow keys within the tree, per standard tree-widget accessibility pattern), not mouse-only.

**Error states:** If the module tree fails to load, Sidebar renders an explicit "navigation unavailable, try Search instead" message rather than an empty column that looks broken without explanation.

**Loading states:** A skeleton tree (a fixed number of placeholder rows, no invented module names) renders while the tree loads.

**Future extensibility:** A Trainer's custom-sequenced cohort view (Post-MVP per `docs/IMPLEMENTATION_BACKLOG.md` Epic 2) would be a third Sidebar mode, added the same way Path mode was added to Browse mode — the component contract above already generalizes to more than two modes.

## Right TOC

**Purpose.** Restated by reference to `docs/UI_NAVIGATION_BLUEPRINT.md`'s Sticky Right TOC — this entry specifies its component contract.

**Responsibilities.** Generate and render a scroll-synced table of contents from the current article's own `##` headings; highlight the currently-in-view section.

**Inputs:** The current article's heading structure (parsed at render time, per `docs/AI_RETRIEVAL_MANIFEST.md`'s Chunk Strategy, which already establishes `##` boundaries as the article's natural structural unit).

**Outputs:** Scroll intent (jump to a section).

**Props:** `headings` (an ordered list extracted from the current article).

**State:** Currently-in-view heading (updates on scroll).

**Events:** `onJumpToSection(headingId)`.

**Dependencies:** None beyond the current article's own content — no new data field required.

**Responsive behavior:** Hidden entirely on mobile and narrow tablet widths (see Mobile Behaviour), since the Right TOC's value depends on horizontal space Header/Sidebar/Center already consume on a small viewport.

**Accessibility:** Rendered as a labeled `navigation` landmark distinct from the primary Sidebar, so screen-reader users can distinguish "jump within this article" from "navigate to a different article."

**Error states:** Not applicable — a parsing failure simply results in an empty TOC (no entries), never a broken or partial list presented as complete.

**Loading states:** Not applicable — the TOC renders synchronously with the article content it's derived from; there is no separate loading state for it.

**Future extensibility:** None proposed beyond its current scope — the Right TOC is deliberately narrow (this article's headings only), not proposed to grow into a cross-article outline.

## Footer

**Purpose.** Restated by reference to `docs/NAVIGATION_MANIFEST.md`'s Footer section.

**Responsibilities.** Render settings link, build/version indicator, and corporate link (where applicable).

**Inputs:** Build/version data, sourced from `docs/REPOSITORY_HEALTH.md`'s Build Status once populated by Antigravity — never asserted by this shell itself.

**Outputs:** Navigation intent (a route change).

**Props:** `buildVersion` (optional; renders nothing if unavailable rather than a placeholder value).

**State:** None.

**Events:** `onNavigate(route)`.

**Dependencies:** `docs/NAVIGATION_MANIFEST.md` Footer.

**Responsive behavior:** Stacks vertically on mobile rather than the desktop's horizontal row, per the general Mobile Behaviour pattern below.

**Accessibility:** A `contentinfo` landmark.

**Error states:** Not applicable.

**Loading states:** Renders immediately with static content; only `buildVersion` may arrive asynchronously, and its absence is an empty state, not a loading spinner.

**Future extensibility:** A future help/support link could be added without restructuring.

## Responsive Layout

The shell uses two layout modes — Desktop and Mobile — with a single breakpoint transition between them, rather than a graduated multi-breakpoint system, consistent with `docs/DASHBOARD_EXPERIENCE.md`'s existing "single-column-on-mobile, multi-column-on-desktop" precedent extended shell-wide. This document does not propose a specific pixel breakpoint value — that is a design-system token defined in `docs/DESIGN_SYSTEM_SPEC.md`, not asserted here.

## Desktop Behaviour

Sidebar renders as a persistent left column. Right TOC renders as a persistent right column on the Lesson Template specifically (per `docs/PAGE_TEMPLATES.md`); other templates leave that column unused rather than filling it with unrelated content. Header's Top Navigation renders inline as a horizontal row. Search Overlay and Ask AI Panel render as centered modal overlays or docked side panels (implementation choice, not fixed by this document) rather than full-page takeovers, since desktop width comfortably accommodates an overlay without obscuring the triggering page.

## Mobile Behaviour

Sidebar becomes a slide-in drawer, triggered by a Header toggle control, closed by a scrim tap or explicit close action, and closed automatically on navigation. Right TOC is hidden; a Lesson Page's in-article navigation relies on ordinary scrolling and the Previous/Next Module Navigation controls (per `docs/NAVIGATION_MANIFEST.md`) instead. Header's Top Navigation entries move into the Sidebar drawer rather than remaining in the Header row. Search Overlay and Ask AI Panel render as full-screen takeovers rather than centered modals, consistent with standard mobile overlay pattern, since a centered modal on a narrow viewport would leave little usable space.

## Keyboard Shortcuts

Restated by reference to `docs/UI_NAVIGATION_BLUEPRINT.md`'s Keyboard Shortcuts section, which proposes a small, discoverable set without assigning specific key bindings. This document adds the implementation contract: shortcuts are proposed to be registered at the shell level (not per-page), so a shortcut like "open Search Overlay" works identically regardless of which page is currently active, and so the shell can guard against a shortcut firing while focus is inside a text input (a search box, a Note editor) where the same key should type a character instead. Specific key bindings remain an implementation-phase decision, chosen to avoid conflicting with common browser or screen-reader shortcuts, per that document's own stated deferral.

## Loading States

Three distinct loading conditions, each with its own proposed treatment, consistent with the empty-state-over-fabricated-data discipline established in `docs/DASHBOARD_EXPERIENCE.md` and `docs/LEARNING_ANALYTICS.md`:

- **Shell-level loading** (Authentication resolving): a minimal, content-free shell — no Sidebar tree, no Header persona-specific entries — shown only for the brief period before identity is known.
- **Region-level loading** (a specific page's content still fetching, shell already rendered): the region shows a skeleton matching that region's eventual layout shape, per each component's own Loading States entry in this document and in `docs/COMPONENT_LIBRARY.md`.
- **Action-level loading** (a button-triggered operation in progress, e.g. Mark Complete): the triggering control shows an in-progress state and is disabled against duplicate submission until the operation resolves.

No loading state is proposed to display placeholder content that could be mistaken for real data — a skeleton is visually and structurally distinct from a populated card, never a fabricated card with fake values.

## Related Documents

- `docs/NAVIGATION_MANIFEST.md` — the content this shell's Header, Sidebar, Right TOC, and Footer render
- `docs/PAGE_TEMPLATES.md` — the page templates that fill this shell's primary content region
- `docs/DESIGN_SYSTEM_SPEC.md` — the token values (breakpoints, spacing, color) this document references by name only
- `docs/COMPONENT_LIBRARY.md` — the `SidebarTree`, `SidebarPathView`, and related components this shell composes
