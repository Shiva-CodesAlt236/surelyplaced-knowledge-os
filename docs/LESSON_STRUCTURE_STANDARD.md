# Lesson Structure Standard

**Status:** Design proposal — not yet built; does not apply to any existing article
**Applies to:** A proposed optional lesson blueprint for future interactive content, layered on top of — never replacing — the locked article standard
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

The seven-section article shape (Purpose, Scope, Core Content, Cross-Module Alignment, Advisor Guidance, Related Articles, Key Takeaways) defined in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6 is locked and remains the standard for every article in `content/docs/`. This document does not change that standard, and no existing article is modified by it. It defines a separate, optional blueprint for how a future "Lesson" — the interactive wrapper `docs/MODULE_EXPERIENCE.md` proposes around an article — could structure supplementary content, most of it already precedented elsewhere in the repository rather than invented here.

## Why a Second Structure

The seven-section shape is optimized for reference — an advisor finding an answer quickly. A Lesson, as proposed in `docs/MODULE_EXPERIENCE.md`, is optimized for guided learning — a newer advisor working through material in sequence with practice built in. The two serve different moments and are proposed to coexist: a Lesson would render the existing article's seven sections unchanged, then add the blueprint below as supplementary structure around it, not instead of it.

## Blueprint Fields

**Learning Goal.** A single-sentence statement of what a learner should walk away able to do, scoped to this one lesson specifically — narrower than a module-level Learning Objective per `docs/MODULE_METADATA_STANDARD.md`, which can span several lessons.

**Key Concepts.** A short, scannable list distilled from the underlying article's `## Core Content` section — not new content, a structured summary of what's already there.

**Real Example.** Maps directly to the existing **Composite Case Study**, **Anonymized Real Conversation**, or **Illustrative Only** patterns already defined in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §9. A Lesson's Real Example field would surface an existing, already-disclaimer-labeled example from the underlying article or a cross-referenced one — it would never introduce a new illustrative scenario without the same disclaimer discipline every other example in this repository already follows.

**Practical Scenario.** A short, situation-framed prompt inviting the learner to consider how the lesson's content applies to a live situation — conceptually adjacent to a Scenario Test (`docs/ASSESSMENT_FRAMEWORK.md`) but lower-stakes and reflective rather than assessed.

**Sales Conversation.** Maps directly to the existing `## Real Conversation Examples` section already used throughout `content/docs/objections/` (for example, `price-objection.mdx`), and the dialogue-formatted examples already used in `content/docs/discussion/presenting-surely-placed.mdx`. Not a new content pattern — a Lesson surfaces this existing dialogue content, where an underlying article has it, in a more visually distinct way than an inline blockquote.

**Common Mistakes.** Maps directly to the existing `## Common Mistakes` section already used throughout `content/docs/objections/` and referenced at the module level in `docs/MODULE_METADATA_STANDARD.md`. A Lesson surfaces this section prominently where it already exists in the underlying article.

**Best Practices.** Maps directly to the existing `## Best Practices` section already used throughout `content/docs/objections/`. Same treatment as Common Mistakes above.

**Summary.** Maps directly to the underlying article's existing `## Key Takeaways` section, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6 — not a new section, a relabeled surface of an existing one for the Lesson context specifically.

**Knowledge Check.** Not part of the article itself — a link into that lesson's Knowledge Check, per `docs/ASSESSMENT_FRAMEWORK.md` and `docs/MODULE_EXPERIENCE.md`'s Quiz action point.

**Related Lessons.** Maps directly to the underlying article's existing `## Related Articles` section and `related` frontmatter field, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §8 — rendered as "Related Lessons" specifically when the learner is inside the Lesson experience rather than plain Browse, for terminology consistency with the surrounding UI.

## Summary Table

| Blueprint Field | Source |
|---|---|
| Learning Goal | New, lesson-scoped narrowing of Learning Objectives |
| Key Concepts | Distilled from existing `## Core Content` |
| Real Example | Existing disclaimer-labeled examples, `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §9 |
| Practical Scenario | New, reflective prompt adjacent to Scenario Tests |
| Sales Conversation | Existing `## Real Conversation Examples` pattern in `content/docs/objections/` |
| Common Mistakes | Existing `## Common Mistakes` pattern in `content/docs/objections/` |
| Best Practices | Existing `## Best Practices` pattern in `content/docs/objections/` |
| Summary | Existing `## Key Takeaways` |
| Knowledge Check | New, links to `docs/ASSESSMENT_FRAMEWORK.md` |
| Related Lessons | Existing `## Related Articles` / `related` frontmatter |

## What This Document Does Not Do

This document does not require every article to eventually have a `## Best Practices` or `## Common Mistakes` section — those remain specific to modules that established them as part of their own bespoke template, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6's explicit allowance for module-specific templates. Where an underlying article lacks one of these mapped sections, the Lesson experience is proposed to simply omit that blueprint field rather than fabricate content to fill it — the same empty-state discipline already established in `docs/DASHBOARD_EXPERIENCE.md`.

## Related Documents

- `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6, §9 — the locked article standard and disclaimer rules this blueprint builds on without altering
- `docs/MODULE_EXPERIENCE.md` — where a Lesson Page would render this blueprint
- `docs/MODULE_METADATA_STANDARD.md` — the module-level Common Mistakes field this document's lesson-level field would aggregate into
- `docs/ASSESSMENT_FRAMEWORK.md` — the Knowledge Check mechanics this blueprint links to
