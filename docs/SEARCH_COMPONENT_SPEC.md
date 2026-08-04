# Search Component Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** Every component behind the Search Overlay and Search Results Page
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document gives full component contracts to the search elements already specified in `docs/SEARCH_EXPERIENCE.md`, `docs/SEARCH_PRODUCT.md`, and `docs/SEARCH_INDEX_MANIFEST.md`. It does not redesign ranking, schema, or facet logic — those remain fully specified in `docs/SEARCH_INDEX_MANIFEST.md`; this document specifies the components that expose that logic to a learner.

## Search Overlay

**Purpose.** The keyboard-accessible overlay presenting the full faceted search experience without navigating away from the current page, per `docs/UI_NAVIGATION_BLUEPRINT.md`.

**Responsibilities.** Own overlay open/close state; compose `SearchInput`, `FacetFilterPanel`, `SearchResultCard` list, `AutocompleteDropdown`, and `RecentSearchesList`; return focus to the triggering element on close.

**Inputs:** The triggering context (e.g., opened from Header vs. Dashboard's Search widget, per `docs/DASHBOARD_COMPONENT_SPEC.md`) for Suggested Searches' context-awareness, per `docs/SEARCH_PRODUCT.md`.

**Outputs:** Navigation intent to a selected result, or a transition into the full Search Results Page ("view all results").

**Props:** `initialContext` (optional; e.g. an active module, for Suggested Searches).

**State:** Current query string, applied filters, whether Autocomplete or full results are showing.

**Events:** `onQueryChange(query)`, `onApplyFilter(facet, value)`, `onSelectResult(articleId)`, `onClose()`, `onViewAllResults()`.

**Dependencies:** `docs/SEARCH_INDEX_MANIFEST.md` (schema, ranking, facets), `docs/API_CONTRACTS.md` Search contract, `docs/APP_LAYOUT_SPEC.md` (shell-level overlay hosting).

**Responsive behavior:** Centered modal on desktop; full-screen takeover on mobile, per `docs/APP_LAYOUT_SPEC.md`'s Mobile Behaviour.

**Accessibility:** Traps focus while open (per standard modal-dialog accessibility pattern), labeled as a `dialog` with an accessible name, closes on `Escape`, restores focus to the triggering element on close.

**Error states:** A failed query (index unreachable) shows an explicit "search unavailable" message with a retry action, never a silent empty result list indistinguishable from a genuine zero-match query.

**Loading states:** A brief in-progress indicator on the result list region only, while Header/Sidebar/other overlay chrome remains static — per `docs/APP_LAYOUT_SPEC.md`'s region-level loading pattern.

**Future extensibility:** The AI Search hybrid mode (Future tier, per `docs/IMPLEMENTATION_SEQUENCE.md` Phase 5) would add an optional per-result AI-generated relevance explanation without changing this component's structure, since `docs/SEARCH_PRODUCT.md` already proposes AI Search as a toggle on the ordinary search experience, not a separate component.

## Search Page

**Purpose.** Implementation contract for the Search Results Page, the full-page, more spacious counterpart to the Search Overlay, per `docs/SCREEN_INVENTORY.md`.

**Responsibilities.** Render `FacetFilterPanel` and `SearchResultCard` list with all facets simultaneously visible, per `docs/PAGE_TEMPLATES.md`'s Search Template; support saving a search or bookmarking multiple results at once, per that screen's stated Actions.

**Inputs:** Query and filters from the URL (per `docs/ROUTE_REGISTRY.md`'s `/search?q=...&module=...` pattern), so a search is shareable and reloadable.

**Outputs:** Navigation intent per result, bookmark-write intent (multi-select), filter-change intent (reflected back into the URL).

**Props:** None — reads entirely from route/query parameters.

**State:** Multi-select selection set (for bulk bookmarking), sort order if offered.

**Events:** `onQueryChange(query)`, `onApplyFilter(facet, value)`, `onSelectResult(articleId)`, `onBulkBookmark(articleIds)`.

**Dependencies:** Same as Search Overlay; additionally `docs/API_CONTRACTS.md` Bookmarks contract for bulk-bookmarking.

**Responsive behavior:** Facets collapse into a togglable panel on mobile rather than a persistent left column, consistent with the Overlay's Left region becoming secondary on narrow viewports.

**Accessibility:** Filter state changes are announced to assistive technology (e.g., via a live region reporting updated result count), since a sighted user sees the list change but a screen-reader user needs an explicit announcement.

**Error states:** Same as Search Overlay.

**Loading states:** Same pattern as Search Overlay, applied to the full-page result region.

**Future extensibility:** Saved searches (implied by "saving a search" in `docs/SCREEN_INVENTORY.md`'s stated Actions) would add a new state domain and API operation without changing this component's rendering contract.

## Autocomplete

**Purpose.** Implementation contract for `docs/SEARCH_INDEX_MANIFEST.md`'s Autocomplete section.

**Responsibilities.** Suggest matching `title` and `tags` values as a learner types a partial query.

**Inputs:** The current partial query string.

**Outputs:** A suggestion-selected event, which either submits that suggestion as the query or navigates directly if the suggestion is itself a specific article.

**Props:** `query` (the current partial input).

**State:** The current suggestion list.

**Events:** `onSelectSuggestion(suggestion)`.

**Dependencies:** `docs/SEARCH_INDEX_MANIFEST.md` Autocomplete, same index as full search.

**Responsive behavior:** Renders as a dropdown beneath `SearchInput` on both breakpoints; no structural change.

**Accessibility:** Implements the standard combobox pattern — arrow-key navigation through suggestions, `Enter` to select, announced via `aria-activedescendant` or equivalent.

**Error states:** No matches: renders nothing (falls through to ordinary full-search behavior on submit) rather than an empty dropdown shell.

**Loading states:** A brief debounce period between keystrokes and suggestion fetch is expected; no visible loading indicator is proposed for this specific sub-100-character-typically-fast interaction, distinct from the heavier Loading States used for full result sets.

**Future extensibility:** Could incorporate Synonyms (`docs/SEARCH_INDEX_MANIFEST.md`) once that mapping is seeded from real query data.

## Facets

**Purpose.** Implementation contract for `docs/SEARCH_INDEX_MANIFEST.md`'s Facets section — the facet groups themselves, distinct from Filters (the UI treatment) below.

**Responsibilities.** Enumerate the available facet groups (Module, Topic, Role, Problem, and Future-tier Candidate) and their possible values, sourced from `docs/SEARCH_TAXONOMY.md`.

**Inputs:** `docs/SEARCH_TAXONOMY.md`'s category values.

**Outputs:** The available facet-value pairs, consumed by the Filters component below.

**Props:** None — this is a data-shaping concern more than an interactive component; it may be implemented as a shared data hook rather than a rendered element, per `docs/FRONTEND_BUILD_GUIDE.md`'s Reusable Hooks conventions.

**Dependencies:** `docs/SEARCH_TAXONOMY.md`.

**Future extensibility:** A new Module Category (as the repository grows, per `docs/FUTURE_EXPANSION_GUIDE.md`) requires no code change here, since facet values are sourced from the live taxonomy, not hard-coded.

## Filters

**Purpose.** Implementation contract for `docs/SEARCH_INDEX_MANIFEST.md`'s Filters section — `FacetFilterPanel`.

**Responsibilities.** Render each facet group as selectable chips or a filter panel; support combining filters across facet groups.

**Inputs:** Facet groups and values (from Facets above), currently applied filter selections.

**Outputs:** Filter-change events.

**Props:** `facets` (available groups/values), `applied` (currently selected values).

**State:** None locally — controlled by the parent (Search Overlay or Search Page).

**Events:** `onToggleFilter(facet, value)`, `onClearFilters()`.

**Dependencies:** Facets component above.

**Responsive behavior:** Chips wrap on narrow viewports; a full filter panel (Search Page) collapses into a togglable drawer on mobile.

**Accessibility:** Each filter chip is a toggle button with `aria-pressed` state, not a checkbox styled to look like a chip without the matching semantics.

**Error states:** Not applicable.

**Loading states:** Not applicable — facet values are typically available immediately from the taxonomy, independent of the current query's result loading.

**Future extensibility:** Candidate Search facet (Future tier) adds a new facet group once its archetype metadata is designed, without changing this component's contract.

## Highlighting

**Purpose.** Implementation contract for in-result term highlighting, implied by `docs/SEARCH_INDEX_MANIFEST.md`'s Result Cards ("a short snippet from `body`, centered on the matched query terms").

**Responsibilities.** Emphasize the matched query terms within a result's title and snippet.

**Inputs:** The query string, the result's `title` and `body` snippet.

**Outputs:** None — a display-only transformation.

**Props:** `text` (string), `query` (string).

**State:** None.

**Events:** None.

**Dependencies:** None beyond the query and text already available to `SearchResultCard`.

**Responsive behavior:** No change across breakpoints.

**Accessibility:** Highlighted terms use a semantic emphasis element (not color alone) so the emphasis is conveyed to assistive technology as well as visually.

**Error states:** A query term that doesn't literally appear in the snippet (a semantic/Smart Search match) simply renders no highlight for that term, rather than a misleading highlight on unrelated text.

**Loading states:** Not applicable.

**Future extensibility:** Smart Search's semantic matches (`docs/SEARCH_PRODUCT.md`) may not have a literal term to highlight — this component's contract already tolerates that (no highlight rendered) rather than assuming every result has a literal match.

## Suggestions

**Purpose.** Implementation contract for `docs/SEARCH_EXPERIENCE.md`'s Suggested Searches, shown before a query is typed.

**Responsibilities.** Render a small set of context-aware suggested queries, differing by entry point per `docs/SEARCH_PRODUCT.md`'s product detail (Dashboard-context vs. module-context).

**Inputs:** The triggering context (same as Search Overlay's `initialContext` prop).

**Outputs:** A selected-suggestion event, equivalent to submitting that suggestion as a query.

**Props:** `context` (module ID or "dashboard").

**State:** None.

**Events:** `onSelectSuggestion(query)`.

**Dependencies:** No fixed suggestion list is proposed, per `docs/SEARCH_EXPERIENCE.md`'s explicit deferral — this document does not invent one either; the suggestion source is left to be derived from actual query patterns once the platform exists.

**Responsive behavior:** Wraps or truncates to fewer suggestions on mobile.

**Accessibility:** Rendered as a labeled group of buttons.

**Error states:** No suggestions available (no query-pattern data yet): renders nothing rather than a fabricated example suggestion.

**Loading states:** Not applicable — suggestions, where available, are expected to be pre-computed rather than fetched per overlay-open.

**Future extensibility:** Once real query data exists, this component's suggestion source can be replaced without changing its props or events.

## Recent Searches

**Purpose.** Implementation contract for `docs/SEARCH_EXPERIENCE.md`'s Recent Searches and `docs/COMPONENT_LIBRARY.md`'s `RecentSearchesList`.

**Responsibilities.** Render the learner's own recent queries as quick-repeat shortcuts.

**Inputs:** Search state's Recent Searches log, per `docs/STATE_MANAGEMENT.md`.

**Outputs:** A selected-query event, equivalent to re-submitting that query.

**Props:** None — reads directly from Search state.

**State:** None locally.

**Events:** `onSelectRecentSearch(query)`, `onClearHistory()`.

**Dependencies:** `docs/STATE_MANAGEMENT.md` Search state, `docs/API_CONTRACTS.md` Search contract.

**Responsive behavior:** Truncates to fewer entries on mobile.

**Accessibility:** Rendered as an ordered list, most recent first.

**Error states:** Empty Recent Searches (new account or cleared history): renders nothing, deferring to Suggestions instead, rather than an empty list header with no content.

**Loading states:** Not applicable — expected to load with overlay open, fast enough not to require a skeleton.

**Future extensibility:** None beyond its current scope.

## Empty State

**Purpose.** Not a single component but the shared empty-result pattern every search surface above uses when a query returns zero matches — specified once here rather than restated per component.

**Responsibilities.** Show an honest "no results" message, distinct from a loading or error state, with a suggestion to broaden the query, adjust filters, or ask the AI Assistant instead.

**Inputs:** The current query and applied filters (to inform the specific suggestion shown, e.g. "try removing the Role filter").

**Outputs:** Filter-clear intent, or a hand-off event into the AI Chat component (`docs/AI_CHAT_COMPONENT_SPEC.md`).

**Props:** `query`, `appliedFilters`.

**Events:** `onClearFilters()`, `onAskAI(query)`.

**Dependencies:** `docs/AI_CHAT_COMPONENT_SPEC.md` for the hand-off action.

**Responsive behavior:** No structural change across breakpoints.

**Accessibility:** Announced via a live region so a screen-reader user is informed the search completed with zero results, not left assuming the search is still loading.

**Error states:** N/A — this is itself one of the states a search surface can be in, not a component with its own further error condition.

**Loading states:** N/A.

**Future extensibility:** None beyond its current scope.

## Related Documents

- `docs/SEARCH_EXPERIENCE.md`, `docs/SEARCH_PRODUCT.md` — the product behavior this document gives component contracts to
- `docs/SEARCH_INDEX_MANIFEST.md` — the schema, ranking, and facet data every component above depends on
- `docs/SEARCH_TAXONOMY.md` — the facet values sourced by the Facets component
- `docs/AI_CHAT_COMPONENT_SPEC.md` — the complementary AI experience this document's Empty State hands off to
