# AI Context Pack

**Status:** Canonical reference — primary operating manual for AI agents working on this repository
**Applies to:** Any future AI agent (Claude or otherwise) beginning a sprint on this repository
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document is an index and operating manual, not a replacement for the engineering documents it summarizes. It exists to reduce how much of those documents a future sprint prompt needs to restate. Where this pack and a source document disagree, the source document governs — flag the discrepancy rather than resolving it in either direction. Read this pack first; use the Reference Map (Section 19) and the decision guide (Section 20) to decide which deeper document to read next.

---

## 1. Project Vision

Surely Placed places IT candidates who already hold valid work authorization into jobs in the US, Canada, and the UK. Surely Placed Knowledge OS is the internal sales training academy for its Admissions Advisors — a Fumadocs/Next.js documentation site giving advisors a consistent, non-improvised reference for every stage of the candidate conversation. Where the repository doesn't contain an authoritative answer, articles defer explicitly to "the latest approved internal process" rather than inventing one. Full statement: `docs/PROJECT_ROADMAP.md`, "Project Overview" and "Repository Purpose."

## 2. Repository Architecture

Two top-level trees, never merged:

```
content/docs/     Fumadocs content tree — every advisor-facing article, rendered as site content
docs/              Engineering / standards documentation (this file and its siblings) — never rendered
```

Within `content/docs/`, Sales Academy modules (discovery, discussion, closing, objections, pricing, sales-operations, sales-coaching, sales-constitution, visa-playbooks, industry-playbooks, interview-intelligence, and others as added) sit alongside `candidate-intelligence/`, which holds the framework schema files, the single Gold Standard reference profile, and every Role Collection. Full statement: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §4, §18.

## 3. Current Repository Structure

This pack does not restate the live folder listing — that drifts every sprint and is tracked authoritatively in `docs/PROJECT_ROADMAP.md` ("Architecture Overview" and "Repository Metrics"). At a structural level, expect: one folder per Sales Academy module under `content/docs/`; one folder per Role Collection under `content/docs/candidate-intelligence/`; a `meta.json` in every folder that contains `.mdx` files; and every folder registered in its parent's `meta.json`. Before creating anything, inspect the actual current tree rather than assuming this pack's description is current.

## 4. Folder Naming Rules

Module and Role Collection folders: lowercase, kebab-case, concise, named after the role or subject family — never a tool, employer, or certification. Candidate Intelligence Framework schema files are the sole exception and use `UPPERCASE_SNAKE_CASE` to visually separate taxonomy from narrative content. A folder that doesn't follow this pattern is a naming defect, corrected only via a rename-only correction sprint, never by regenerating content. Full statement: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5, `docs/ROLE_REGISTRY.md` "Naming Convention," `docs/COLLECTION_BOOTSTRAP.md` "Naming Conventions."

## 5. Knowledge Module Standards

Every Sales Academy module carries its own internally consistent article template (Discovery, Discussion, Closing, Objections, Visa Playbooks, and Industry Playbooks each established a bespoke section shape at their founding sprint), but all of them share the same frontmatter schema, the same linking conventions, and a `meta.json` whose `pages` array exactly matches the folder's actual files. Where no bespoke template exists for a new module, default to the standard seven-section shape (Purpose, Scope, Core Content, Cross-Module Alignment, Advisor Guidance, Related Articles, Key Takeaways) — the pattern used by Interview Intelligence and every Role Collection article. Full statement: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3, §6, §17.

## 6. Role Collection Standards

Every Role Collection is exactly fourteen `.mdx` files plus `meta.json`: an overview, four working-pattern articles, a technology ecosystem article, candidate behaviour, buying patterns, four advisor-stage guides (discovery, presentation, objection, closing), advisor coaching, and a role checklist. Every article uses the standard seven-section shape. Each collection anchors its candidate-behaviour/buying-patterns pair to a differentiating theme distinct from every other collection's, and never compares, ranks, or recommends a named tool or platform. Full statement: `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/COLLECTION_BOOTSTRAP.md`.

## 7. Engineering Standards

The frontmatter block (title, description, slug, type, category, audience, funnel_stage, countries, version, last_updated, owner, status, tags, related), internal linking rules (root-relative `/docs/<folder>/<slug>` paths, always resolving to a real file), Related Articles conventions, disclaimer labels, and versioning philosophy are all defined once and apply repository-wide. Full statement: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, all sections.

## 8. QA Workflow

Every sprint runs the same eight-step sequence, in order, after all of that sprint's files are generated — never after each individual file: frontmatter check, required-sections check, internal link validation (repo-wide), `meta.json` validation (repo-wide), duplicate-content scan (repo-wide), AI-filler scan, invented-content scans, and any sprint-specific constraint checks. A sprint isn't complete until all eight pass; failures are fixed before delivery, never noted as a known issue and left unresolved. Full statement: `docs/SPRINT_GENERATION_TEMPLATE.md` §4–§8.

## 9. Duplicate Content Policy

No sentence of ten or more words may appear verbatim in more than one file across `content/docs/`, excluding a fixed allowlist of standardized boilerplate (disclaimer language, "Operational Policy Pending," case-study self-identification labels, and similar). Two articles covering structurally similar ground must be phrased independently from the start — copying a prior article's structure and editing afterward is the most common cause of duplicate-content failures. The repo-wide scan runs once, after every new file in a batch exists, never incrementally. Full statement: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §15, `docs/SPRINT_GENERATION_TEMPLATE.md` §6, `docs/COLLECTION_BOOTSTRAP.md` "Duplicate-Content Policy."

## 10. Repository Ownership Rules

`docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/SPRINT_GENERATION_TEMPLATE.md`, `docs/ANTIGRAVITY_PIPELINE_STANDARD.md`, `docs/COLLECTION_BOOTSTRAP.md`, and this pack are locked engineering standards — referenced by every sprint, edited by none. `docs/PROJECT_ROADMAP.md` and `docs/ROLE_REGISTRY.md` are living documents with field-level ownership split between the Documentation Engineer and Antigravity (see Sections 11–12 below). A sprint touches only the files its own scope requires: new content, the immediate and parent `meta.json`, and — only when explicitly instructed — the two living registry/roadmap documents within the Documentation Engineer's permitted fields. Full statement: `docs/COLLECTION_BOOTSTRAP.md` "Repository Ownership Rules," `docs/ROLE_REGISTRY.md` "Rules."

## 11. Claude Responsibilities

The Documentation Engineer role (any Claude agent working this repository) authors content per the Knowledge OS standard, runs the full QA workflow, and produces one Delivery Manifest and one QA Report per sprint. It never redesigns architecture, never performs a Git operation, never rewrites a locked engineering standard, and never marks a Role Registry row "Completed" or assigns it a commit hash. Its output ends at the literal lines `Repository Ready` and `Waiting for Antigravity Integration`. Full statement: `docs/SPRINT_GENERATION_TEMPLATE.md`, `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §11.

## 12. Antigravity Responsibilities

Antigravity picks up after `Repository Ready`: `git pull`, `git status`, dependency install, lint, build, and — only once lint and build pass cleanly — `git add`, `git commit`, `git push`, and reporting the resulting commit hash. Antigravity also owns the manual testing checklist (sidebar rendering, MDX errors, link resolution in the built site) and is the only party that updates the Status, Sprint, Completion %, and Git Commit fields in `docs/ROLE_REGISTRY.md` and the integration-facing fields in `docs/PROJECT_ROADMAP.md`. Full statement: `docs/ANTIGRAVITY_PIPELINE_STANDARD.md`, all sections.

## 13. Content Creation Rules

No article ever invents pricing, discounts, guarantees, placement or hiring statistics, salaries, employer-specific policy, certifications, market-leadership claims, or a real candidate, employer, or conversation. Any hypothetical example self-identifies as a Composite Case Study, Anonymized Real Conversation, Training Simulation, or Illustrative Only marker as appropriate. Where a specific operational detail isn't documented in this repository, the article uses the standardized **Operational Policy Pending** pattern and directs the reader to the latest approved internal process. Full statement: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §9, §11–14.

## 14. Repository Update Rules

`docs/PROJECT_ROADMAP.md` and `docs/ROLE_REGISTRY.md` are updated at the end of any sprint that adds, completes, or re-prioritizes a module or collection — but field-by-field: the Documentation Engineer may add rows, update Dependencies/Priority/Owner, and describe the sprint's actual output; only Antigravity marks a row Completed or records a commit hash. `meta.json` is updated at every level a new file or folder touches: the immediate folder and its parent, never more broadly than the sprint's actual scope requires. A sprint never modifies a previously completed collection or module. Full statement: `docs/SPRINT_GENERATION_TEMPLATE.md` §2, `docs/ROLE_REGISTRY.md` "Rules," `docs/COLLECTION_BOOTSTRAP.md`.

## 15. Current Repository Status

As of `docs/PROJECT_ROADMAP.md`'s last recorded update (Interview Intelligence Module integration): 304 `.mdx` articles, 27 `meta.json` files, 11 top-level Sales Academy modules by that document's own count, and 14 completed collections under `candidate-intelligence/` (the Reference Profile plus 13 Role Collections). This snapshot will drift with every future sprint — treat `docs/PROJECT_ROADMAP.md`'s "Repository Metrics" table as the live source and this section as a pointer to it, not a substitute for reading it directly.

## 16. Current Roadmap

`docs/PROJECT_ROADMAP.md`'s "Upcoming Collections" section and `docs/ROLE_REGISTRY.md`'s "Future Collection Queue" both track what's next, ordered by priority. Collections with an existing `ROLE-*` code and Industry Playbook in `ROLE_CLASSIFICATION.mdx` carry no scoping prerequisite; collections without one either need an Industry Playbook scoped first, or — as demonstrated by the Salesforce/SAP/ServiceNow/Oracle platform batch — can classify honestly under `ROLE-PENDING` and proceed if a sprint explicitly instructs it. Read both documents directly before starting a new Role Collection; they are updated independently and this pack does not restate their current ordering.

## 17. Future Expansion Strategy

Three expansion paths exist in this repository so far: (1) a new Role Collection under `candidate-intelligence/`, following `docs/ROLE_COLLECTION_TEMPLATE.md` and `docs/COLLECTION_BOOTSTRAP.md` exactly; (2) a new standalone Sales Academy-style module under `content/docs/`, following the generic standard in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` and the closest comparable existing module as a structural reference, as Interview Intelligence did; (3) a batch of several collections or modules generated together, using the established batch pattern — generate everything first, run one consolidated QA pass, produce one Delivery Manifest and one QA Report. Any genuinely new expansion pattern not covered by these three should be treated as a documentation-standards question worth raising, not resolved by inventing a fourth pattern silently.

## 18. Quick Start Guide

1. Read this pack in full before doing anything else.
2. Based on the sprint's actual task, read the specific deeper document(s) the Reference Map (Section 19) points to — don't re-read every engineering document for every sprint.
3. Inspect the live repository directly: folder names, an existing `meta.json`, and at least one comparable existing article, before writing anything new.
4. Generate every file the sprint calls for first.
5. Run the full eight-step QA workflow once, after generation is complete.
6. Fix anything QA finds before delivery — never deliver a known, unresolved failure.
7. Produce one Delivery Manifest and one QA Report.
8. Stop at `Repository Ready` / `Waiting for Antigravity Integration`. Perform no Git operation at any point.

## 19. Reference Map

| Document | Governs | Read it when |
|---|---|---|
| `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` | Frontmatter, folder structure, naming, linking, disclaimers, non-invention rules, duplicate-content rule | Writing any new article, or unsure of a formatting/content rule |
| `docs/ROLE_COLLECTION_TEMPLATE.md` | The 14-file Role Collection pattern in full | Building or correcting a Role Collection |
| `docs/COLLECTION_BOOTSTRAP.md` | Condensed bootstrap of the above two, plus batch rules | Any sprint that says "generate according to COLLECTION_BOOTSTRAP.md" |
| `docs/SPRINT_GENERATION_TEMPLATE.md` | Sprint inputs/outputs, the 8-step QA sequence, Delivery Manifest and QA Report format | Every sprint, at the QA and delivery stage |
| `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` | What happens after `Repository Ready` | Understanding the handoff — informational only, never executed by the Documentation Engineer |
| `docs/PROJECT_ROADMAP.md` | Live repository statistics, current sprint, completed/upcoming collections | Checking what already exists before starting new work |
| `docs/ROLE_REGISTRY.md` | Role Collection status, priority, sequencing, naming convention | Determining which Role Collection to build next, or its dependencies |
| `docs/AI_CONTEXT_PACK.md` (this document) | Index and operating manual across all of the above | First, every sprint |

## 20. When to Read Which Engineering Document

- **Starting any sprint at all:** this pack, first, always.
- **Creating or correcting a Role Collection:** `docs/ROLE_COLLECTION_TEMPLATE.md` and `docs/COLLECTION_BOOTSTRAP.md`, plus `docs/ROLE_REGISTRY.md` to confirm priority and dependencies.
- **Creating a new standalone module (not a Role Collection):** `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` for the generic rules, plus direct inspection of the closest existing comparable module for structural precedent.
- **Finishing any sprint (QA, manifest, delivery format):** `docs/SPRINT_GENERATION_TEMPLATE.md`.
- **Checking what's already been built or what's next:** `docs/PROJECT_ROADMAP.md` and `docs/ROLE_REGISTRY.md`, read together — the Roadmap is the summary view, the Registry is the detail view for Role Collections specifically.
- **Any question about Git, builds, or how content actually reaches production:** `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` — for awareness only; none of its steps belong to the Documentation Engineer role.
- **A sprint instruction seems to conflict with a locked standard:** flag the conflict; per every locked document's own stated policy, a conflicting instruction is treated as an error to raise, not a new rule to silently follow.
