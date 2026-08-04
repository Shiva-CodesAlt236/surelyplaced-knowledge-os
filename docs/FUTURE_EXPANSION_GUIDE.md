# Future Expansion Guide

**Status:** Canonical reference — scaling framework
**Applies to:** Every future Role Collection, Sales Academy module, and engineering document added to this repository
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document is the standing answer to "how does this repository grow." It doesn't define new rules — it explains how the rules already established across `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/SPRINT_GENERATION_TEMPLATE.md`, and `docs/COLLECTION_BOOTSTRAP.md` continue to apply unchanged as the repository grows from its current size to many times that size, without the folder hierarchy, naming pattern, or QA process ever needing to be redesigned.

## Adding a New Role Collection

A new Role Collection is added exactly the way every prior one was: a sprint instruction naming the collection, generated per `docs/COLLECTION_BOOTSTRAP.md`'s 14-file structure, under `content/docs/candidate-intelligence/<collection-name>/`, registered in the parent `candidate-intelligence/meta.json`, and added as a new row to `docs/ROLE_REGISTRY.md` within the Documentation Engineer's field boundaries. This process is identical whether it's the next collection or the hundredth — the folder hierarchy defined in `docs/REPOSITORY_STATE.md`'s Folder Hierarchy section doesn't change shape as it grows, it only gets more siblings at the same level.

## Adding a New Sales Academy Module

A new top-level module under `content/docs/` follows `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §4 and §6: its own folder, its own `meta.json`, articles using the standard seven-section shape (or a documented variant, as Interview Intelligence's `funnel_stage: "Post-Enrollment"` precedent shows is possible without a new template), and registration in the root `content/docs/meta.json`. A new module is scoped by its own sprint instruction, the same way Interview Intelligence was.

## Batch Generation at Scale

`docs/COLLECTION_BOOTSTRAP.md`'s Batch Generation Rules and Batch QA Rules already describe how to generate more than one collection at once without a linear increase in QA overhead: generate the full batch's phrasing independently first, then run one consolidated QA pass scoped to the batch plus structurally equivalent prior articles (a full repository re-scan remains the safe default). This scales the same way whether a batch is four collections or forty — the QA scope described there is already batch-size-independent.

## Repository Synchronization at Scale

As more living documents accumulate values that could drift against each other (statistics, statuses, sprint numbers), the single-source-of-truth assignments in `docs/REPOSITORY_SYNCHRONIZATION.md` are what prevent duplication rather than any one document trying to restate every fact. New engineering documents should follow the pattern demonstrated in `docs/REPOSITORY_STATE.md`: point to the owning document for any value that could change, rather than hardcoding it.

## Antigravity Integration at Scale

The pipeline described in `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` doesn't change based on how much content a sprint delivers — it runs the same install/lint/build/commit/push sequence whether the sprint added one file or a hundred. Larger batches simply produce a longer `git status` / `git diff --stat` report at step 4 of that document.

## Roadmap, Registry, and Health Updates

Each sprint or batch that changes the content tree updates `docs/PROJECT_ROADMAP.md` and `docs/ROLE_REGISTRY.md` within the Documentation Engineer's field boundaries (see `docs/REPOSITORY_OWNERSHIP.md`), and the documentation-QA fields of `docs/REPOSITORY_HEALTH.md` at the end of that sprint's QA process. This is a fixed-size update per sprint regardless of repository size — it's always "update the fields this sprint touched," never "recompute everything from scratch."

## Naming and Folder Creation at Scale

`docs/ROLE_REGISTRY.md`'s Naming Convention section already lists more collection names than currently exist under `candidate-intelligence/`, by design — new collections are added by picking the next appropriately-scoped name and following the same lowercase-kebab-case pattern, not by inventing a new naming scheme. The same applies to Sales Academy modules under `content/docs/`.

## Scaling to 100 Collections, 1,000 Documents

Nothing about the architecture in `docs/REPOSITORY_STATE.md`'s Folder Hierarchy section depends on the current count of collections, modules, or articles. It's a flat pattern repeated at two levels (module or collection folder, then article files within it), validated by the same repo-wide QA scripts regardless of how many folders they walk. The only scaling consideration worth flagging proactively is runtime: a repo-wide duplicate-content or link-validation scan against 1,000 files takes longer than one against 300, which is why `docs/MASTER_QA_PLAYBOOK.md` distinguishes a full repository QA pass from a lighter batch-scoped pass for routine sprints.

## When a Genuinely New Category of Constraint Appears

Some future collections will introduce a constraint category that doesn't exist yet in the standing rules — `docs/COLLECTION_BOOTSTRAP.md`'s Batch 2 platform-neutrality rules (no comparing platforms, no market-leadership claims) are the existing precedent for this. Per `docs/COLLECTION_BOOTSTRAP.md`'s Future Scalability Guidance, such a constraint is stated in the sprint instruction that introduces it and treated as additive, not as grounds to rewrite the bootstrap document. If the same constraint recurs across multiple future sprints, that's a signal it should be promoted into the bootstrap document itself as a deliberate revision — not folded in silently.

## What This Document Does Not Cover

This document describes how growth happens inside the existing structure. It does not define the structure itself (that's `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` and `docs/ROLE_COLLECTION_TEMPLATE.md`), the QA process in depth (that's `docs/MASTER_QA_PLAYBOOK.md`), or which document owns which value (that's `docs/REPOSITORY_SYNCHRONIZATION.md` and `docs/REPOSITORY_OWNERSHIP.md`).
