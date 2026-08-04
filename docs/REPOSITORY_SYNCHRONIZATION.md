# Repository Synchronization

**Status:** Canonical reference — single-source-of-truth assignments
**Applies to:** Every living document in this repository that could restate a value another document also states
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

Multiple living documents in this repository describe overlapping ground — repository statistics, collection status, engineering document inventory. Left unmanaged, that overlap drifts: one document gets updated, its sibling doesn't, and the two disagree. This document exists to prevent that by naming exactly one authoritative source per value and describing how the rest point to it instead of restating it.

## The Drift Problem, Concretely

This repository already has at least one live example of the failure this document exists to prevent: `docs/PROJECT_ROADMAP.md`'s "Current Repository Statistics" and "Repository Metrics" sections state the top-level module count as 11, and its "Completed Collections" checklist and "Upcoming Collections" list have not been updated to reflect every Role Collection `docs/ROLE_REGISTRY.md` marks Completed. Both are recorded as findings in this sprint's Engineering Audit Findings rather than corrected here, since correcting historical entries in a living document is outside this sprint's and this document's scope — but they're the reason this document exists.

## Single Source of Truth Assignments

| Value | Single Source of Truth | Every Other Document |
|---|---|---|
| Live `.mdx` article count, `meta.json` count, top-level module count | `docs/PROJECT_ROADMAP.md` — "Current Repository Statistics" / "Repository Metrics" | References it, never restates the number |
| Current sprint, latest Git commit, repository version | `docs/PROJECT_ROADMAP.md` | References it |
| Role Collection status, sprint, completion %, Git commit, priority, dependencies | `docs/ROLE_REGISTRY.md` | References it |
| Naming convention rules and canonical examples | `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5 (rule), `docs/ROLE_REGISTRY.md` (Role Collection example list) | `docs/COLLECTION_BOOTSTRAP.md` and this document point to both rather than restating the rule text |
| The 14-file Role Collection structure and seven-section article shape | `docs/ROLE_COLLECTION_TEMPLATE.md` | `docs/COLLECTION_BOOTSTRAP.md` summarizes it as a numbered list but does not redefine it |
| Sprint process, QA step sequence, delivery format | `docs/SPRINT_GENERATION_TEMPLATE.md` | `docs/COLLECTION_BOOTSTRAP.md` and `docs/MASTER_QA_PLAYBOOK.md` reference it |
| Build/lint/Git pipeline steps | `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` | Every other document references it rather than describing the pipeline |
| Documentation-QA health signals (duplicate scan, broken links, meta/naming validation results) | `docs/REPOSITORY_HEALTH.md` | References it |
| Build/lint/search-index health signals | `docs/REPOSITORY_HEALTH.md`, populated by Antigravity | Same document, different owner — see `docs/REPOSITORY_OWNERSHIP.md` |
| Ownership of any given file or field | `docs/REPOSITORY_OWNERSHIP.md` | References it |
| Full engineering-document index and reading order | `docs/AI_CONTEXT_PACK.md` §19 ("Reference Map") | `docs/REPOSITORY_STATE.md` and this document point to it rather than duplicating it |

## How Documents Stay Synchronized

- A value is written in exactly one document. Every other document that needs it links to that document rather than copying the value.
- When a sprint changes a value (adds a collection, adds a module, completes a piece of content), the Documentation Engineer updates only the single source of truth for that value, within the field boundaries `docs/REPOSITORY_OWNERSHIP.md` defines — it does not propagate the value into other documents as a courtesy copy.
- Where two documents' stated purposes genuinely overlap — `docs/PROJECT_ROADMAP.md` and `docs/ROLE_REGISTRY.md` both mention Role Collections — one is designated the detail view and the other the summary view, per `docs/ROLE_REGISTRY.md`'s own Purpose section, rather than both maintaining independent full detail.
- Engineering documents that summarize other documents (`docs/AI_CONTEXT_PACK.md`, `docs/COLLECTION_BOOTSTRAP.md`, this document) are written to reference and paraphrase, never to restate verbatim rule text — consistent with the duplicate-content discipline `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §15 already applies to advisor-facing content.

## Preventing Duplicated Metrics

Any new engineering document that's tempted to state a live count (article count, collection count, module count) should instead point to `docs/PROJECT_ROADMAP.md`'s Repository Metrics table, following the pattern `docs/REPOSITORY_STATE.md` already established. A hardcoded count in a second document is not just redundant — it's a future contradiction waiting to happen, since nothing forces the second document to be updated the moment the first one changes.

## Preventing Stale Documentation

A value goes stale when the document stating it isn't updated in the same sprint that changes the underlying fact. Two structural defenses exist against this:

1. Minimizing the number of documents that state a given value at all (see Single Source of Truth Assignments above) — a value that's stated in one place can only go stale in one place.
2. Every living document's "Last updated" field should reflect the sprint that most recently changed a value inside it, not just when the document was first created — a mismatch between "Last updated" and the document's actual content is itself a signal worth catching in the next repository-wide audit, per `docs/MASTER_QA_PLAYBOOK.md`.

## What This Document Does Not Do

This document does not correct the drift it identifies in "The Drift Problem, Concretely" above — that correction belongs to a deliberately scoped correction sprint or to Manual Review, per `docs/REPOSITORY_OWNERSHIP.md`. This document's job is to make future drift structurally less likely, not to fix past drift retroactively.
