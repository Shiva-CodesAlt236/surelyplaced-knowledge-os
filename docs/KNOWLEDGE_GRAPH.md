# Knowledge Graph

**Status:** Design proposal — not yet built
**Applies to:** How the repository's existing relationships could be modeled as a graph for retrieval and recommendation
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document doesn't introduce new relationships between articles — it explains how relationships that already exist in `content/docs/` (through frontmatter and required sections) can be understood as a graph, and where the genuinely new proposed relationships (Prerequisites, Recommended Next Modules) would add new edges to it. No graph database, schema, or implementation is specified here — this is a conceptual model.

## Article Relationships

The finest-grained existing relationship: every article's `related` frontmatter field and `## Related Articles` section, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §8, already forms a real, directed graph — article A links to article B because it's genuinely relevant, and the standard already requires each link carry a stated reason, not just a bare pointer. This document treats that existing data as the graph's finest edge type, requiring no new authoring to exist.

## Module Relationships

A coarser existing relationship: `## Cross-Module Alignment` sections, present in every article per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6, already connect one module's content to another's at a conceptual level — for example, `content/docs/recruiter-intelligence/overview.mdx` explicitly connecting to `content/docs/interview-intelligence/recruiter-screening.mdx`. This document treats these as a second, coarser edge type, aggregating individual Article Relationships up to the module level.

## Cross References

The general term this document uses for both Article Relationships and Module Relationships together — any link from one piece of content to another, already present throughout `content/docs/` and requiring no new work to inventory, only to model as a graph rather than as scattered inline links.

## AI Retrieval Graph

The graph the AI Assistant's Retrieval step (`docs/AI_ASSISTANT_BLUEPRINT.md`) would traverse when deciding what content to weight for a given question — built from Cross References plus the AI Retrieval Categories defined in `docs/SEARCH_TAXONOMY.md`. Where a question touches a Cross-Module boundary (per that taxonomy's AI Retrieval Categories), this graph is what lets retrieval follow the connection into the second module rather than stopping at the first relevant article.

## Prerequisite Graph

Built from the new Prerequisites field proposed in `docs/MODULE_INDEX_STANDARD.md` and modeled at the Learning Path level in `docs/LEARNING_PATHS.md`'s completion-order sequencing — which, read carefully, is already an explicit prerequisite graph for each of the five paths, expressed as an ordered list rather than a graph structure. This document proposes formalizing that existing ordering as a directed graph (module A must precede module B) rather than introducing new prerequisite relationships beyond what `docs/LEARNING_PATHS.md` already states.

## Recommended Learning Graph

Built from the new Recommended Next Modules field proposed in `docs/MODULE_METADATA_STANDARD.md` — the forward-looking counterpart to the Prerequisite Graph. Where the Prerequisite Graph answers "what must come before this," the Recommended Learning Graph answers "what would a learner naturally want next," and the two are not required to be exact inverses of each other — a module can be a *sensible* next step without being a formal *prerequisite* for anything.

## How the Graph Is Used

- **Search** (`docs/SEARCH_PRODUCT.md`) uses Cross References to surface Related Modules and Related Collections alongside a direct search match.
- **The AI Assistant** (`docs/AI_ASSISTANT_BLUEPRINT.md`, `docs/AI_EXPERIENCE.md`) uses the AI Retrieval Graph specifically to decide what to weight beyond the most obviously matching article, and uses Cross References generally to populate its Related Articles suggestion.
- **Learning Paths** (`docs/LEARNING_PATHS.md`) already encode a Prerequisite Graph informally through completion order; a future implementation could generalize this into the formal graph described above to support Trainer-built custom sequencing (`docs/USER_JOURNEYS.md`'s Trainer journey).
- **The Dashboard's Recommended Content** (`docs/DASHBOARD_EXPERIENCE.md`) would draw on the Recommended Learning Graph once a learner completes their active path.

## What This Document Does Not Do

This document does not require any new frontmatter field to actually exist yet — Prerequisites and Recommended Next Modules remain proposed fields per `docs/MODULE_INDEX_STANDARD.md` and `docs/MODULE_METADATA_STANDARD.md`, not yet added to any article. It does not propose changing how `## Related Articles` or `## Cross-Module Alignment` sections are written — `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §8 and §6 remain fully authoritative, unmodified by this document.

## Related Documents

- `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6, §8 — the existing Cross-Module Alignment and Related Articles rules this graph is built from
- `docs/MODULE_INDEX_STANDARD.md` and `docs/MODULE_METADATA_STANDARD.md` — the Prerequisites and Recommended Next Modules fields feeding the two learning-specific graphs
- `docs/AI_ASSISTANT_BLUEPRINT.md` — where the AI Retrieval Graph is actually used
- `docs/LEARNING_PATHS.md` — the existing, informal Prerequisite Graph this document proposes formalizing
