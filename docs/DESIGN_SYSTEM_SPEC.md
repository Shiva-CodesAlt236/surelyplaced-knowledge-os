# Design System Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** The shared visual and interaction system every component in this sprint's specifications (`docs/APP_LAYOUT_SPEC.md` through `docs/MANAGER_COMPONENT_SPEC.md`) is built from
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies the structural design system — a token architecture and its governing rules — not a finished visual identity. No specific color value, font family, or pixel measurement is asserted below as a decided brand fact, since no prior document in this repository establishes Surely Placed's actual brand system, and inventing one here would violate the same non-invention discipline `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` applies throughout. Where a specific value is genuinely needed to build against, this document proposes a structural default (a scale, a ratio, a naming convention) explicitly flagged as a placeholder-structure pending actual brand input — never a specific value presented as if already decided.

## Design System Pending Note

Every section below follows the same convention already established for policy figures in `docs/ASSESSMENT_FRAMEWORK.md` and `docs/RELEASE_STRATEGY.md`: a structural framework is specified in full, while the actual brand-specific values that populate it (Surely Placed's logo colors, chosen typeface, and so on) are marked **Brand Input Pending** and left for a design team or brand stakeholder to supply, not invented by this document.

## Typography

**Structure.** A type scale of a small, fixed number of named steps (for example: Display, Heading 1–3, Body, Caption, Label), each mapped to a size and line-height token rather than a hard-coded pixel value used inline throughout components. Every component specification in this sprint (e.g., `docs/DASHBOARD_COMPONENT_SPEC.md`'s card titles, `docs/LEARNING_COMPONENT_SPEC.md`'s article headings) references these named steps, never a raw size.

**Font family.** Brand Input Pending. This document proposes the system use exactly one primary typeface (for body and UI text) and, if brand identity calls for it, one distinct display typeface for large headings only — a small, disciplined set rather than an unconstrained mix, consistent with how `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` disciplines content structure.

**Heading hierarchy mapping.** The type scale's steps are proposed to map directly onto the `##`-based heading structure every article already uses per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6, so a Lesson Page's rendered article headings (Purpose, Scope, Core Content, and so on) inherit consistent styling without per-article typography decisions.

## Spacing

**Structure.** A single spacing scale (a fixed multiple sequence, e.g. a base unit and its multiples) used for every margin, padding, and gap value across every component in this sprint's specifications, rather than ad hoc per-component spacing values. This is the scale `docs/APP_LAYOUT_SPEC.md`'s shell regions, `docs/COMPONENT_LIBRARY.md`'s cards, and `docs/PAGE_TEMPLATES.md`'s layouts all draw from.

**Density.** Two density modes are proposed: a default density for most surfaces, and a compact density for information-dense surfaces named explicitly elsewhere in this sprint (`docs/MANAGER_COMPONENT_SPEC.md`'s Team Overview row list, `docs/SEARCH_COMPONENT_SPEC.md`'s result lists) — not a per-component ad hoc decision, but a system-level choice of which named density a given component uses.

## Colors

**Structure.** A token system organized by role, not by literal color name: Primary, Secondary, Success, Warning, Error/Destructive, Neutral (a full grayscale ramp for text/background/border), and Surface (background elevation levels). Every component in this sprint's specifications references a role token (e.g., "Error" for `docs/ASSESSMENT_COMPONENT_SPEC.md`'s failed-submission states) rather than a literal color value.

**Actual color values.** Brand Input Pending. This document does not assign a single hex, RGB, or named color to any role above, since no prior document in this repository establishes Surely Placed's brand palette. A future design phase supplies the actual palette; this document's contribution is the role structure every component already assumes exists.

**Non-color-alone rule.** Repeated throughout this sprint's component specifications (`docs/LEARNING_COMPONENT_SPEC.md`'s Progress Bar, `docs/DASHBOARD_COMPONENT_SPEC.md`'s Assessments widget, and elsewhere): no component state is conveyed by color alone. This is a design-system-level rule stated once here — every color role above must have a text or icon-shape equivalent available wherever it's used, per the Accessibility section below.

## Icons

**Structure.** A single icon set (one visual style — outline, filled, or duotone — applied consistently) rather than mixing icon families, referenced by semantic name (e.g., "bookmark," "search," "ai-assistant") rather than a specific icon library's internal identifier, so the underlying icon set can be swapped without touching component code.

**Actual icon set.** Brand Input Pending, or an implementation-team choice of a standard open-source icon library — this document does not select one, since that's an implementation detail rather than a product-design decision.

## Cards

**Structure.** One base card primitive (a bounded, elevated or bordered container with consistent internal padding from the Spacing scale) that every card component across this sprint's specifications extends — `docs/DASHBOARD_COMPONENT_SPEC.md`'s widget cards, `docs/COMPONENT_LIBRARY.md`'s Knowledge Cards, Role Cards, and Analytics Cards, `docs/SEARCH_COMPONENT_SPEC.md`'s `SearchResultCard` — rather than each defining its own container styling independently.

**Elevation.** A small number of named elevation levels (e.g., resting, raised, overlay) rather than an unconstrained range, with overlay-level elevation reserved for the Search Overlay and Ask AI Panel per `docs/APP_LAYOUT_SPEC.md`.

## Tables

**Structure.** One base table primitive used wherever tabular data appears — `docs/MANAGER_COMPONENT_SPEC.md`'s Team Overview, `docs/PROFILE_COMPONENT_SPEC.md`'s Learning Progress list — with consistent row density (per the Spacing scale's density modes), header treatment, and a defined empty-state row pattern reused from the Empty States section below rather than redefined per table.

**Responsive treatment.** A wide table on mobile is proposed to either scroll horizontally within its container or collapse into a stacked card-per-row layout — this document names both as acceptable patterns without mandating one, since the right choice may differ by table (Team Overview likely favors stacking; a denser Reports export favors horizontal scroll).

## Buttons

**Structure.** Restated by reference to `docs/COMPONENT_LIBRARY.md`'s Buttons category (`PrimaryActionButton`, `SecondaryActionButton`, `IconButton`) — this section adds the design-system-level constraint that all three share one underlying button primitive differing only in emphasis level (visual weight), never in interaction behavior, so a button's accessible role and keyboard behavior is identical regardless of its visual emphasis.

**States.** Every button defines default, hover/focus, active, disabled, and loading states as a matter of system-level convention, so no individual component specification in this sprint needs to redefine what a disabled or loading button looks like — only when to use one, which each component's own Error/Loading States sections already specify.

## Forms

**Structure.** A shared set of form primitives (text input, select, checkbox, radio group, textarea) used consistently across every form surface in this sprint — `docs/PROFILE_COMPONENT_SPEC.md`'s preference controls, `docs/ASSESSMENT_COMPONENT_SPEC.md`'s response inputs, `docs/MANAGER_COMPONENT_SPEC.md`'s Assignments recommendation form.

**Validation and error display.** A consistent inline-error pattern (error message positioned adjacent to its field, not only in a page-level banner) so every form-error state described across this sprint's component specifications (e.g., a failed preference save) renders predictably.

## Dialogs

**Structure.** One modal-dialog primitive, used by the Search Overlay (`docs/SEARCH_COMPONENT_SPEC.md`) and any future confirmation dialog (e.g., "delete this Reading List," "delete this conversation" per `docs/AI_CHAT_COMPONENT_SPEC.md`'s Conversation History), sharing the same focus-trap and `Escape`-to-close behavior specified once here rather than redefined per usage.

**Confirmation pattern.** A destructive action (deleting a Note, a Bookmark, a conversation) is proposed to use a confirmation dialog before committing, consistent with treating a learner's own data (Notes, Bookmarks, History) as something the system doesn't discard casually.

## Notifications

**Structure.** A toast/inline-notification primitive for transient system feedback (a successful save, a failed action not severe enough to warrant a full error state) distinct from the persistent Error Handling states already specified per component throughout this sprint (`docs/AI_CHAT_COMPONENT_SPEC.md`'s Error Handling, `docs/ASSESSMENT_COMPONENT_SPEC.md`'s submission-preservation pattern).

**Persistence.** Transient notifications auto-dismiss after a brief period; a notification reporting an unresolved problem (e.g., "your note failed to save") is proposed to persist until the underlying issue is resolved or the learner dismisses it explicitly, rather than disappearing while the problem remains.

## Empty States

**Structure.** Restated by reference to the empty-state discipline already established throughout this repository's design documents — `docs/DASHBOARD_EXPERIENCE.md`'s Empty States, `docs/LEARNING_ANALYTICS.md`'s Data Discipline — and applied system-wide here: every empty state pairs a brief explanation of why the surface is empty with, where applicable, a specific next action (bookmark an article, start a path), never a bare "no data" message and never a fabricated placeholder that could be mistaken for real content.

## Loading States

**Structure.** Restated by reference to `docs/APP_LAYOUT_SPEC.md`'s three-tier Loading States section (shell-level, region-level, action-level) — this section confirms that tiering is a system-wide convention, not specific to the shell, and that every component's own Loading States entry throughout this sprint's specifications should be read as an instance of one of those three tiers.

## Accessibility

**Baseline.** Every component specified across this sprint's documents targets keyboard operability, correct semantic structure or ARIA-equivalent labeling, and the non-color-alone rule stated under Colors above, as a baseline requirement rather than a later add-on — consistent with `docs/DEPLOYMENT_READINESS_CHECKLIST.md`'s UI and Navigation Readiness gate, which already requires Dark Mode, Keyboard Shortcuts, and the Search Overlay to be tested for basic accessibility before deployment.

**Conformance target.** This document does not assert a specific conformance level (e.g., a WCAG level) as already achieved, since no accessibility audit has occurred — that remains a `docs/DEPLOYMENT_READINESS_CHECKLIST.md` gate item to satisfy during implementation, not a claim this design document makes preemptively.

## Dark Mode

**Structure.** Restated by reference to `docs/UI_NAVIGATION_BLUEPRINT.md`'s Dark Mode proposal — this section adds the token-level implementation implication: every color role defined under Colors above requires both a light-mode and dark-mode value, so Dark Mode is a token-swap at the theme level, not a separate parallel component system requiring its own maintenance.

**Actual values.** Brand Input Pending, same as Colors above.

## Related Documents

- `docs/UI_NAVIGATION_BLUEPRINT.md` — the Dark Mode and Keyboard Shortcuts proposals this document extends into token structure
- `docs/APP_LAYOUT_SPEC.md` — the shell that references this document's spacing and breakpoint tokens by name
- `docs/COMPONENT_LIBRARY.md` — the components every primitive in this document (Cards, Buttons, Forms, Dialogs) underlies
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md` — the accessibility testing gate this document's Accessibility section defers actual conformance verification to
