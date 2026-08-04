# Repository State

**Status:** Canonical reference — live repository inventory map
**Applies to:** Anyone needing to know what exists in this repository and which document owns that answer
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document is a map, not a ledger. It tells you what category of information exists about this repository and which document is the authoritative source for it — it deliberately does not restate counts, statuses, or other values that belong to a living document elsewhere. A value copied here would drift the moment the owning document changes; a pointer doesn't. Where this document and an owning document disagree about who owns what, the owning document's own stated purpose governs.

## Repository Architecture

Two top-level trees: `content/docs/`, the Fumadocs content tree containing every advisor-facing article, and `docs/`, the engineering/standards documentation tree, never rendered as site content. Full definition: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §4, §18; summarized in `docs/AI_CONTEXT_PACK.md` §2.

## Current Module Inventory

The live list of top-level Sales Academy modules under `content/docs/` — which ones exist, in what order they were added — is not restated here. Confirm it by listing `content/docs/` directly, or by reading `docs/PROJECT_ROADMAP.md`'s "Architecture Overview" section, which names each module as of its last update.

## Candidate Intelligence Collections

The live list of completed and pending Role Collections, their sprint numbers, priorities, dependencies, and integration status is owned entirely by `docs/ROLE_REGISTRY.md`. The count of completed collections (Reference Profile plus however many Role Collections) is owned by `docs/PROJECT_ROADMAP.md`'s "Repository Metrics" table. Neither figure is restated here.

## Sales Academy Modules

Each Sales Academy module (Discovery, Discussion, Closing, Objections, Visa Playbooks, Industry Playbooks, Pricing, Sales Operations, Sales Coaching, Sales Constitution, Interview Intelligence, and any added after this document's last update) is registered in `content/docs/meta.json`'s `pages` array, which is the structural source of truth for which modules exist and are wired into navigation. `docs/PROJECT_ROADMAP.md` describes their intended sequence and relationship to one another.

## Engineering Documents

The full set of locked and living engineering documents lives in `docs/`. `docs/AI_CONTEXT_PACK.md` §19 ("Reference Map") is the authoritative index of what each one governs and when to read it — this document does not duplicate that index, only points to it.

## Total Article and meta.json Counts

Both figures are owned by `docs/PROJECT_ROADMAP.md`'s "Repository Metrics" table, recomputed and restated there at the end of every sprint that changes the content tree. This document intentionally never states a specific number, since any number written here would go stale the moment the next sprint runs.

## Folder Hierarchy

```
content/docs/
  <sales-academy-module>/       one folder per module, lowercase-kebab-case
    *.mdx
    meta.json
  candidate-intelligence/
    <FRAMEWORK_FILE>.mdx        UPPERCASE_SNAKE_CASE schema/taxonomy files
    reference-profile/          the single Gold Standard illustrative profile
    <role-collection>/          one folder per Role Collection, lowercase-kebab-case
    meta.json

docs/
  <ENGINEERING_STANDARD>.md     locked standards and living registry/roadmap/state documents
```

This shape is fixed. It does not change as the repository grows — see `docs/FUTURE_EXPANSION_GUIDE.md` for how scaling to many more collections and modules happens inside this same hierarchy rather than by redesigning it.

## Repository Ownership

Full ownership boundaries — what the Documentation Engineer (Claude) may touch, what only Antigravity may touch, what requires manual/human review — are defined once in `docs/REPOSITORY_OWNERSHIP.md`. This document doesn't restate that matrix.

## Current Expansion Phase

The repository's actual current phase (which modules and collections are complete, which are next) is described in `docs/PROJECT_ROADMAP.md`'s "Current Sprint" and "Upcoming Collections" sections and `docs/ROLE_REGISTRY.md`'s "Future Collection Queue." Read both directly; this document does not summarize a phase that would go stale on the next sprint.

## Naming Conventions

Folder and file naming rules are defined once in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5 and restated for Role Collections specifically in `docs/ROLE_REGISTRY.md`'s "Naming Convention" section and `docs/COLLECTION_BOOTSTRAP.md`. In short: lowercase, kebab-case, concise, named after the subject family rather than a tool or employer, with `UPPERCASE_SNAKE_CASE` reserved exclusively for Candidate Intelligence Framework schema files.

## Build Architecture

The site is a Fumadocs/Next.js application. The build, lint, and deployment pipeline — what commands run, in what order, and who's responsible for each step — is owned entirely by `docs/ANTIGRAVITY_PIPELINE_STANDARD.md`. The Documentation Engineer role does not execute any part of that pipeline and this document does not restate it.

## Documentation Ownership

Every `.mdx` article and every engineering document has a stated `owner` (frontmatter field for content, a header field for engineering documents). Content ownership conventions are defined in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3. Repository-level ownership — which role owns which class of document or update — is defined in `docs/REPOSITORY_OWNERSHIP.md`.

## Last Known Repository Snapshot

The most recent point-in-time snapshot of repository statistics lives in `docs/PROJECT_ROADMAP.md`'s "Current Repository Statistics" and "Repository Metrics" sections, dated by that document's own "Last updated" field. There is no separate snapshot maintained here — a second snapshot would only create a second value to keep synchronized, which `docs/REPOSITORY_SYNCHRONIZATION.md` exists specifically to prevent.

## What Documents Own Which Information

| Information | Owning Document |
|---|---|
| Live article count, `meta.json` count, module count, current sprint | `docs/PROJECT_ROADMAP.md` |
| Role Collection status, priority, sequencing, dependencies, naming convention | `docs/ROLE_REGISTRY.md` |
| Frontmatter schema, linking rules, disclaimer rules, non-invention rules | `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` |
| The 14-file Role Collection pattern | `docs/ROLE_COLLECTION_TEMPLATE.md` |
| Condensed Role Collection bootstrap + batch rules | `docs/COLLECTION_BOOTSTRAP.md` |
| Sprint process, QA sequence, delivery format | `docs/SPRINT_GENERATION_TEMPLATE.md` |
| Build/lint/Git pipeline | `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` |
| Index across all of the above | `docs/AI_CONTEXT_PACK.md` |
| Engineering-level health signals (lint, build, duplicate scan, links, known issues) | `docs/REPOSITORY_HEALTH.md` |
| Ownership boundaries between roles | `docs/REPOSITORY_OWNERSHIP.md` |
| How future collections/modules get added and scaled | `docs/FUTURE_EXPANSION_GUIDE.md` |
| How the living documents stay synchronized with each other | `docs/REPOSITORY_SYNCHRONIZATION.md` |
| The full QA process, in depth | `docs/MASTER_QA_PLAYBOOK.md` |

## Future Expansion Strategy

Full detail lives in `docs/FUTURE_EXPANSION_GUIDE.md`. In short: new Role Collections and new Sales Academy modules are added inside the folder hierarchy defined above, without changing that hierarchy's shape, whether the repository has 14 collections or 100.
