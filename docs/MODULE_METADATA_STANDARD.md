# Module Metadata Standard

**Status:** Design proposal — not yet built
**Applies to:** The descriptive metadata every learning module should eventually expose
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document is scoped narrowly: it defines *descriptive metadata* — what can be said about a module — not the interactive platform features (Practice, Quiz, Bookmarks, AI Assistant, Completion Status) already defined in `docs/MODULE_INDEX_STANDARD.md`. Where a field below overlaps with something `docs/MODULE_INDEX_STANDARD.md` already defines, this document points to that definition rather than restating it. Nothing here has been added to any actual article's frontmatter — see `docs/CONTENT_ENRICHMENT_GUIDE.md` for how a future sprint would do that safely.

## Relationship to `docs/MODULE_INDEX_STANDARD.md`

That document defines twelve fields, several of which are metadata (Overview, Learning Objectives, Reading Time, Difficulty, Prerequisites, Related Modules) and several of which are interactive features (Practice, Quiz, Checklist, Bookmarks, AI Assistant, Completion Status). This document is the deeper specification of the metadata subset, extended with several new fields that document didn't cover. It does not touch the feature fields at all — those remain fully owned by `docs/MODULE_INDEX_STANDARD.md`.

## Field Definitions

**Difficulty.** Already defined in `docs/MODULE_INDEX_STANDARD.md` — the proposed Foundational / Intermediate / Advanced taxonomy. Not redefined here.

**Estimated Reading Time.** Already proposed in `docs/MODULE_INDEX_STANDARD.md` as a computed, word-count-based figure, consistent with the planning-estimate discipline in `docs/LEARNING_PATHS.md`. Not redefined here.

**Estimated Completion Time.** New. Distinct from Estimated Reading Time: this figure would include any Practice, Quiz, or other assessment time a module's Learning Objectives call for, per `docs/ASSESSMENT_FRAMEWORK.md`, not just the reading itself. Like Reading Time, this is proposed to be computed from a stated formula once real component data exists, never hand-invented per module.

**Learning Objectives.** Already proposed in `docs/MODULE_INDEX_STANDARD.md` as a new frontmatter field. Not redefined here.

**Prerequisites.** Already proposed in `docs/MODULE_INDEX_STANDARD.md`, modeled at the Learning Path level rather than per-module frontmatter. Not redefined here.

**Recommended Next Modules.** New, and distinct from Prerequisites: where Prerequisites looks backward ("complete this before starting"), Recommended Next Modules looks forward ("a natural next step after this"). This is the forward edge of the same relationship `docs/KNOWLEDGE_GRAPH.md` models as a Prerequisite Graph and a Recommended Learning Graph — this field is that graph's data source at the module level.

**Related Collections.** New, and narrower than `docs/MODULE_INDEX_STANDARD.md`'s Related Modules: specifically points to Role Collections under `content/docs/candidate-intelligence/` that share a theme or audience with this module, distinguished the same way `docs/INFORMATION_ARCHITECTURE.md` distinguishes its Modules and Collections navigation sections.

**Skills Covered.** New. A proposed short list of concrete, observable skills a module builds — for example, "reading a resume's technical content for clarity" rather than a restated topic label. This is different from Learning Objectives (which state what a learner should be able to *do*) in that Skills Covered is a shorter, tag-like list intended for scanning and matching, not a full sentence per item.

**Target Role.** New. Where a module (most naturally a Role Collection) is most relevant to a specific candidate-facing role, per the taxonomy already defined in `content/docs/candidate-intelligence/ROLE_CLASSIFICATION.mdx`. A cross-cutting Sales Academy module (like Discovery or Objections) would leave this field empty or unscoped, since it applies across every Target Role rather than one.

**Business Value.** New, and handled carefully: this field is proposed to state *why a module matters to the advisor's actual job* in qualitative terms ("helps an advisor avoid a common trust-damaging mistake early in discovery") — it is explicitly never proposed to state a numeric business outcome, conversion figure, or performance claim, consistent with the zero-invented-business-metrics requirement of this sprint and the no-guarantee discipline in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §12.

**Common Mistakes.** New at the module level, though not new to this repository — several existing articles (for example, every article under `content/docs/objections/`) already carry a `## Common Mistakes` section as part of that module's own bespoke template, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6. This field proposes surfacing that existing pattern as structured, filterable metadata where it already exists in an article's body, not inventing new mistake content. See `docs/LESSON_STRUCTURE_STANDARD.md` for the equivalent field at the individual-lesson level, which this module-level field would aggregate from.

**Practical Application.** New. A proposed short statement connecting a module's content to a concrete moment in an advisor's actual workflow — for example, "use this during a discovery call's first ten minutes." Distinct from Business Value (which explains *why it matters*) by focusing on *when and how it's used*.

**Search Tags.** Already exists in substance: the `tags` frontmatter field every article already carries per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3, aggregated to the module level. Not a new field — this document proposes surfacing existing tag data at the module level for search filtering, per `docs/SEARCH_TAXONOMY.md`.

**AI Retrieval Tags.** New, and distinct from Search Tags: a proposed set of tags specifically tuned for the AI Assistant's retrieval step (`docs/AI_ASSISTANT_BLUEPRINT.md`'s Retrieval section) rather than human-facing search filtering — for example, tags capturing a question's likely phrasing rather than a topic label a human would click as a filter chip. See `docs/SEARCH_TAXONOMY.md`'s AI Retrieval Categories for the taxonomy these tags would draw from.

**Last Updated.** Already exists: the `last_updated` frontmatter field every article already carries per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3, aggregated to the module level as the most recent `last_updated` among its articles. Not a new field.

**Version.** Already exists: the `version` frontmatter field every article already carries per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3 and §19. Not a new field, and not proposed to be aggregated to a single module-level version number, since individual articles within a module can legitimately be at different version numbers.

## Summary Table

| Field | Status |
|---|---|
| Difficulty | Already defined — `docs/MODULE_INDEX_STANDARD.md` |
| Estimated Reading Time | Already defined — `docs/MODULE_INDEX_STANDARD.md` |
| Estimated Completion Time | New — this document |
| Learning Objectives | Already defined — `docs/MODULE_INDEX_STANDARD.md` |
| Prerequisites | Already defined — `docs/MODULE_INDEX_STANDARD.md` |
| Recommended Next Modules | New — this document |
| Related Collections | New — this document |
| Skills Covered | New — this document |
| Target Role | New — this document |
| Business Value | New — this document (qualitative only, never a numeric claim) |
| Common Mistakes | Partially exists — `content/docs/objections/` precedent; new as structured module-level metadata |
| Practical Application | New — this document |
| Search Tags | Already exists — `tags` frontmatter, `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3 |
| AI Retrieval Tags | New — this document |
| Last Updated | Already exists — `last_updated` frontmatter |
| Version | Already exists — `version` frontmatter |

## Related Documents

- `docs/MODULE_INDEX_STANDARD.md` — the platform-feature fields this document doesn't redefine
- `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3 — the existing frontmatter fields this document builds on
- `docs/SEARCH_TAXONOMY.md` — the taxonomy Search Tags and AI Retrieval Tags draw from
- `docs/KNOWLEDGE_GRAPH.md` — how Recommended Next Modules and Prerequisites form a graph
- `docs/CONTENT_ENRICHMENT_GUIDE.md` — how these new fields would actually be added to existing articles
