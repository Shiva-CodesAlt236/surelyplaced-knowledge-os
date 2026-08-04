# Content Manifest

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** The complete, per-module manifest specification a future frontend/backend implementation would consume to render every module and collection already published under `content/docs/`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies the manifest record every module and Role Collection should produce — the shape, not the values. Where a field's value already exists in the live repository (folder names, `meta.json` pages arrays, `ROLE_CLASSIFICATION.mdx` codes), this document states that value directly, verified against the live repository at the time of writing. Where a field is proposed metadata that hasn't been authored yet (Difficulty, Learning Objectives, and the rest), this document states that explicitly rather than inventing a value. This manifest does not itself alter any file under `content/docs/` — it specifies what a future build step or enrichment sprint would read from, or add to, that tree.

## Relationship to Prior Documents

This document does not redefine any field. It is the implementation-ready manifest record built from fields already specified elsewhere:

- **Module ID, Module Name, Parent, Children, Description, Navigation Order** — new structural fields this document defines, since no prior document specified a manifest record shape.
- **Difficulty, Estimated Reading Time, Learning Objectives** — defined in `docs/MODULE_INDEX_STANDARD.md` and `docs/MODULE_METADATA_STANDARD.md`; not redefined here.
- **Search Categories, AI Categories, Role Categories** — defined in `docs/SEARCH_TAXONOMY.md` as Module Categories, AI Retrieval Categories, and Role Categories respectively; this document maps them onto the manifest record.
- **Status** — new field this document defines, distinct from a `content/docs/` article's own `status` frontmatter field (per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3), which tracks an individual article's editorial state, not a module's platform-integration state.
- **Future Metadata Fields** — a pointer list to every proposed-but-not-yet-added field from `docs/MODULE_METADATA_STANDARD.md`, so the manifest record has a stable place to grow into.

## Manifest Record Shape

Every module or Role Collection produces one manifest record with the following fields:

| Field | Source | Populated Today? |
|---|---|---|
| Module ID | New — this document | Yes, derived from folder name |
| Module Name | New — this document | Yes, derived from `overview.mdx` title or folder name |
| Parent | New — this document | Yes, derived from folder nesting |
| Children | New — this document | Yes, derived from `meta.json` "pages" |
| Description | Existing — module's `overview.mdx` frontmatter `description` | Yes |
| Navigation Order | New — this document | Yes, derived from `meta.json` "pages" array order |
| Difficulty | `docs/MODULE_INDEX_STANDARD.md` | No — proposed field, not yet in any frontmatter |
| Estimated Reading Time | `docs/MODULE_INDEX_STANDARD.md`, `docs/MODULE_METADATA_STANDARD.md` | No — proposed, computed field |
| Learning Objectives | `docs/MODULE_INDEX_STANDARD.md` | No — proposed field |
| Search Categories | `docs/SEARCH_TAXONOMY.md` Module Categories | Yes, for the sixteen module-level categories already listed there |
| AI Categories | `docs/SEARCH_TAXONOMY.md` AI Retrieval Categories | Partially — the taxonomy exists; per-module tagging does not |
| Role Categories | `docs/SEARCH_TAXONOMY.md` Role Categories, sourced from `ROLE_CLASSIFICATION.mdx` | Yes, for Role Collections; not applicable to cross-cutting modules |
| Status | New — this document | Yes, computed from live repository state |
| Future Metadata Fields | Pointer list — see below | N/A, informational |

## Field Definitions

**Module ID.** A stable, machine-readable identifier equal to the module's folder name under `content/docs/` (e.g. `resume-intelligence`) for a top-level module, or the folder path relative to `content/docs/candidate-intelligence/` for a Role Collection (e.g. `candidate-intelligence/software-engineering`). Folder names are already lowercase kebab-case per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5, so Module ID requires no separate encoding step — it is the folder name.

**Module Name.** The human-readable display name. For a Sales Academy or `*-intelligence` module, this is the module's own title as it appears in its `overview.mdx` frontmatter `title` field. For a Role Collection, this is the collection's subject name as written in `docs/ROLE_REGISTRY.md`'s Naming Convention section (e.g. "Software Engineering," not the raw folder name "software-engineering").

**Parent.** `null` for a top-level module under `content/docs/`. `candidate-intelligence` for every Role Collection and for `reference-profile`. This is a direct read of existing folder nesting — no new data required.

**Children.** The ordered list of article slugs belonging to this module, read directly from that module's `meta.json` "pages" array. For `candidate-intelligence` itself, Children is the list of Role Collection folder names plus `reference-profile`, read from `content/docs/candidate-intelligence/meta.json`.

**Description.** The module's own summary, read from its `overview.mdx` (or `README.mdx`, for the Candidate Intelligence Framework schema folder) frontmatter `description` field per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3. Never independently authored for the manifest — always a read of the existing field.

**Navigation Order.** An integer position, derived directly from a module's position within its parent's `meta.json` "pages" array. For top-level modules, this is the module's position within the root `content/docs/meta.json` "pages" array. This field requires no new authoring — it is a computed index over data that already exists.

**Difficulty.** Not redefined here — see `docs/MODULE_INDEX_STANDARD.md`'s Foundational / Intermediate / Advanced taxonomy. The manifest record reserves this field but it remains unpopulated until a future enrichment sprint assigns it per module, following `docs/CONTENT_ENRICHMENT_GUIDE.md`.

**Estimated Reading Time.** Not redefined here — see `docs/MODULE_INDEX_STANDARD.md` and `docs/MODULE_METADATA_STANDARD.md`. Proposed to be computed from word count at build time, never hand-authored per module, consistent with the planning-estimate discipline in `docs/LEARNING_PATHS.md`.

**Learning Objectives.** Not redefined here — see `docs/MODULE_INDEX_STANDARD.md`. The manifest record reserves a `learning_objectives: []` slot per module, unpopulated until enrichment.

**Search Categories.** The module's entry in `docs/SEARCH_TAXONOMY.md`'s Module Categories list. This is a closed, sixteen-value set already grounded in the live folder structure: `discovery`, `discussion`, `closing`, `objections`, `visa-playbooks`, `industry-playbooks`, `pricing`, `sales-operations`, `sales-coaching`, `sales-constitution`, `candidate-intelligence`, `interview-intelligence`, `resume-intelligence`, `linkedin-intelligence`, `recruiter-intelligence`, `hiring-intelligence`. A Role Collection's Search Categories value is `candidate-intelligence`, since a Role Collection is a child of that module rather than a Search Category in its own right.

**AI Categories.** Drawn from `docs/SEARCH_TAXONOMY.md`'s AI Retrieval Categories (Factual, Situational, Definitional, Red-Flag Identification, Cross-Module) — a per-article rather than strictly per-module tagging, aggregated to the module level the same way `docs/MODULE_METADATA_STANDARD.md`'s AI Retrieval Tags field is proposed to work. Unpopulated until a future enrichment sprint tags individual articles.

**Role Categories.** For a Role Collection, its `ROLE-*` code, read directly from `content/docs/candidate-intelligence/ROLE_CLASSIFICATION.mdx`. Verified against the live file at the time of writing: `ROLE-SWE` (Software Engineering), `ROLE-DATA` (Data & AI), `ROLE-SEC` (Cybersecurity), `ROLE-CLOUD` (Cloud & DevOps), `ROLE-QA` (QA Testing), `ROLE-HEALTH` (Healthcare), `ROLE-SUPPLY` (Supply Chain), `ROLE-BA` (Business Analysis), `ROLE-PM` (Project Management), and `ROLE-PENDING` (used honestly by Salesforce, SAP, ServiceNow, and Oracle, which have no dedicated code, per that document's own Author Guidelines). A cross-cutting Sales Academy module or `*-intelligence` module leaves this field empty, since it isn't scoped to one candidate role.

**Status.** New field, distinct from an individual article's `status` frontmatter value. Proposed values: `Published` (the module exists in `content/docs/` and is registered in its parent `meta.json` — true for every module and collection listed in this document today), `Enriched` (Published, plus the proposed new metadata fields above have been added by a future enrichment sprint — not yet true for any module), and `Planned` (referenced by a Learning Path or roadmap document but not yet built — not applicable to anything in this manifest, since every module and collection listed below already exists).

**Future Metadata Fields.** Not a data field but a pointer: every module's manifest record reserves space for the remaining fields `docs/MODULE_METADATA_STANDARD.md` proposes and this document doesn't restate — Estimated Completion Time, Recommended Next Modules, Related Collections, Skills Covered, Target Role, Business Value, Common Mistakes, Practical Application, Search Tags, AI Retrieval Tags. None of these twelve fields exist in any manifest record today; this document's job is to name the reserved slot, not to populate it.

## Live Manifest Inventory

The following inventory reflects the actual repository structure at the time of writing, verified directly against `content/docs/meta.json`, `content/docs/candidate-intelligence/meta.json`, and each module's own folder listing. A future implementation should regenerate this table from the live repository rather than trust it as static, per `docs/AI_CONTEXT_PACK.md` §3's standing instruction to inspect the live tree before relying on a document's description of it.

### Top-Level Modules (Parent: `null`)

| Module ID | Module Name | Children (count) | Navigation Order |
|---|---|---|---|
| `discovery` | Discovery Calls | 5 | 1 |
| `discussion` | Discussion Calls | 5 | 2 |
| `closing` | Closing | 5 | 3 |
| `objections` | Objection Handling | 8 | 4 |
| `visa-playbooks` | Visa Playbooks | 9 | 5 |
| `industry-playbooks` | Industry Sales Playbooks | 11 | 6 |
| `pricing` | Pricing & Investment Psychology | 8 | 7 |
| `sales-operations` | Sales Operations | 9 | 8 |
| `sales-coaching` | Sales Coaching & Case Studies | 9 | 9 |
| `sales-constitution` | Sales Constitution | 9 | 10 |
| `candidate-intelligence` | Candidate Intelligence Framework | 23 (10 schema files + reference-profile + 13 Role Collections) | 11 |
| `interview-intelligence` | Interview Intelligence | 10 | 12 |
| `resume-intelligence` | Resume Intelligence | 10 | 13 |
| `linkedin-intelligence` | LinkedIn Intelligence | 10 | 14 |
| `recruiter-intelligence` | Recruiter Intelligence | 10 | 15 |
| `hiring-intelligence` | Hiring Intelligence | 10 | 16 |

Child article counts above exclude each module's own `meta.json`. Verify the exact current count directly against the live folder before an implementation build, since this table is a snapshot rather than a live query.

### Role Collections (Parent: `candidate-intelligence`)

| Module ID | Module Name | Role Category |
|---|---|---|
| `candidate-intelligence/reference-profile` | Gold Standard Reference Profile | N/A — illustrative reference, not a Role Collection |
| `candidate-intelligence/software-engineering` | Software Engineering | `ROLE-SWE` |
| `candidate-intelligence/data-and-ai` | Data & AI | `ROLE-DATA` |
| `candidate-intelligence/cybersecurity` | Cybersecurity | `ROLE-SEC` |
| `candidate-intelligence/cloud-devops` | Cloud & DevOps | `ROLE-CLOUD` |
| `candidate-intelligence/qa-testing` | QA Testing | `ROLE-QA` |
| `candidate-intelligence/business-analysis` | Business Analysis | `ROLE-BA` |
| `candidate-intelligence/project-management` | Project Management | `ROLE-PM` |
| `candidate-intelligence/supply-chain` | Supply Chain | `ROLE-SUPPLY` |
| `candidate-intelligence/healthcare` | Healthcare | `ROLE-HEALTH` |
| `candidate-intelligence/salesforce` | Salesforce | `ROLE-PENDING` |
| `candidate-intelligence/sap` | SAP | `ROLE-PENDING` |
| `candidate-intelligence/servicenow` | ServiceNow | `ROLE-PENDING` |
| `candidate-intelligence/oracle` | Oracle | `ROLE-PENDING` |

## What This Document Does Not Do

This document does not add a single field to any actual file's frontmatter. It specifies the manifest record a future implementation would generate — at build time, from a script, or via a scoped enrichment sprint — never something authored by hand into `content/docs/` article by article. Populating the unpopulated fields above (Difficulty, Learning Objectives, and the rest) remains governed entirely by `docs/CONTENT_ENRICHMENT_GUIDE.md`'s principles, unchanged by this document.

## Related Documents

- `docs/MODULE_INDEX_STANDARD.md`, `docs/MODULE_METADATA_STANDARD.md` — the field definitions this manifest record aggregates
- `docs/SEARCH_TAXONOMY.md` — the source of Search Categories, AI Categories, and Role Categories
- `content/docs/candidate-intelligence/ROLE_CLASSIFICATION.mdx` — the authoritative source for Role Category codes
- `docs/ROUTE_REGISTRY.md` — the routes that would read this manifest record to render a module page
- `docs/CONTENT_ENRICHMENT_GUIDE.md` — how the unpopulated fields above would actually be added
