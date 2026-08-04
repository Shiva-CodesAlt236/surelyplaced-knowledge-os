# Master QA Playbook

**Status:** Canonical reference — the standing QA handbook
**Applies to:** Every future sprint, batch, and repository-wide review in this repository
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This is not a QA run. This is the manual a QA run follows. It consolidates the QA steps already defined in `docs/SPRINT_GENERATION_TEMPLATE.md` §4–8 and `docs/COLLECTION_BOOTSTRAP.md`'s QA Sequence into one handbook, adds the acceptance/failure criteria and recovery steps those documents assume but don't spell out, and defines the tiers of QA (per-sprint, per-batch, full-repository, release, regression) that apply at different points in this repository's life. It does not redefine any check those documents already own — it points to them and adds the operational detail around running them.

## The Repository QA Sequence

Run in this order, per `docs/SPRINT_GENERATION_TEMPLATE.md` §4:

1. Frontmatter check
2. Required-sections check
3. Internal link validation
4. meta.json validation
5. Duplicate-content scan
6. AI filler scan
7. Invented-content scans
8. Sprint-specific constraint checks

Each step's method is defined in `docs/SPRINT_GENERATION_TEMPLATE.md` §5–8 and this document does not restate that method — it defines what "pass" and "fail" mean for each step and what to do on failure.

## Duplicate Scan

**Method:** per `docs/SPRINT_GENERATION_TEMPLATE.md` §6 — strip frontmatter, split into sentences, flag any 10+-word sentence repeated verbatim across files, excluding the standardized boilerplate allowlist in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §15.
**Acceptance criteria:** zero duplicate groups introduced by the current sprint or batch. Pre-existing duplicate groups not touched by the current sprint are recorded in `docs/REPOSITORY_HEALTH.md`'s Known Issues, not treated as a new failure.
**Failure criteria:** any 10+-word verbatim sentence shared between two files, at least one of which is new or modified in the current sprint, that isn't on the boilerplate allowlist.
**Recovery:** reword the offending sentence(s) independently in each affected file — never by deleting content wholesale or by copying a third phrasing into both files, which just creates a new duplicate pair. Re-run the scan after every fix, not just once at the end.

## Build Verification

**Method:** owned entirely by Antigravity — `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build --webpack`, per `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §1–2.
**Acceptance criteria:** clean install, zero lint violations, successful build.
**Failure criteria:** any of the three steps fails.
**Recovery:** owned by Antigravity per `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §1 — a failed lint or build halts the pipeline before any Git write. The Documentation Engineer is not positioned to fix a build/lint failure and instead corrects the underlying content defect in the next sprint if the failure traces to a documentation issue (e.g. malformed MDX).

## Link Validation

**Method:** per `docs/SPRINT_GENERATION_TEMPLATE.md` §7 — extract every `/docs/...` link from every `.mdx` file, resolve case-sensitively against the actual file tree.
**Acceptance criteria:** zero broken links, repository-wide.
**Failure criteria:** any link that doesn't resolve to an existing file.
**Recovery:** fix the link (correct the path) or the target (create the missing file, if it was supposed to exist) before delivery. Zero tolerance — per `docs/SPRINT_GENERATION_TEMPLATE.md` §7, a broken link is never delivered as a known issue.

## Naming Validation

**Method:** confirm every module and Role Collection folder name matches `^[a-z0-9]+(-[a-z0-9]+)*$`, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5, with the UPPERCASE_SNAKE_CASE exception reserved exclusively for Candidate Intelligence Framework schema files.
**Acceptance criteria:** zero non-conforming names.
**Failure criteria:** any folder or schema-adjacent file name outside the pattern.
**Recovery:** per `docs/ROLE_REGISTRY.md`'s Naming Convention section, a naming defect is corrected via a dedicated rename-only correction sprint — never by regenerating the collection's content, and never silently inside an unrelated sprint.

## Meta Validation

**Method:** per `docs/SPRINT_GENERATION_TEMPLATE.md` §8 — for each folder with `.mdx` files, compare its `meta.json` "pages" set against actual filenames; confirm every folder is registered in its parent's `meta.json`.
**Acceptance criteria:** exact match, repository-wide, with every folder reachable from the root.
**Failure criteria:** any mismatch, or any folder missing from its parent's `meta.json`.
**Recovery:** update the `meta.json` to match reality. A pre-existing mismatch not introduced by the current sprint (e.g. the long-standing `_template` gap in the root `content/docs/meta.json`) is recorded as a Known Issue rather than silently fixed outside its own scoped correction, consistent with how this repository has handled it in every prior sprint.

## Search Index Validation

**Method:** owned by Antigravity — the search index is a build-time artifact, verified as part of the Manual Testing Checklist in `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §6.
**Acceptance criteria:** new content is discoverable in the built site's search after a successful build.
**Failure criteria:** new content missing from search after a clean build.
**Recovery:** owned by Antigravity; typically traces to a missing `meta.json` registration, which the Meta Validation step above should already have caught before build.

## Cross-Reference Validation

**Method:** per `docs/SPRINT_GENERATION_TEMPLATE.md` §5 and `docs/COLLECTION_BOOTSTRAP.md`'s Internal Linking Rules — confirm new articles link to the specific parent/sibling articles the sprint instruction named as required foundations, and that at least one structurally-equivalent prior collection or module is cross-referenced where one exists.
**Acceptance criteria:** every named foundational dependency is actually linked from the new content, not just mentioned.
**Failure criteria:** a sprint instruction names a required foundation that the delivered content never links to.
**Recovery:** add the missing cross-reference before delivery.

## Content Integrity Validation

**Method:** the invented-content scans in `docs/SPRINT_GENERATION_TEMPLATE.md` §7 (pricing, guarantees, statistics, salaries, employer/candidate names) plus the AI filler scan in §6, applied to every new or modified file.
**Acceptance criteria:** zero matches for any never-allowed content category defined in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §10–14 and `docs/COLLECTION_BOOTSTRAP.md`'s Never-Allowed Content section.
**Failure criteria:** any invented figure, guarantee, statistic, policy, or AI-filler phrase found in new content.
**Recovery:** rewrite the offending passage to defer explicitly (e.g. "the latest approved internal process," "Operational Policy Pending") rather than trimming the fact out and leaving a gap.

## Engineering Documentation Validation

**Method:** distinct from advisor-facing content QA above — applies to `docs/*.md` files themselves. Confirm: every cross-reference between engineering documents points to a document that exists and actually contains what's referenced; no engineering document restates another's rule text verbatim (beyond a short paraphrase or quoted term); every living document's stated values are consistent with the single-source-of-truth assignments in `docs/REPOSITORY_SYNCHRONIZATION.md`; no two documents claim ownership of the same field, per `docs/REPOSITORY_OWNERSHIP.md`.
**Acceptance criteria:** zero broken references, zero verbatim rule-text duplication, zero ownership conflicts, zero unflagged contradictions between living documents.
**Failure criteria:** any of the above found.
**Recovery:** for a broken reference or duplication introduced by the current sprint, fix it before delivery. For a contradiction found in a pre-existing living document (e.g. a stale statistic, a contradictory registry row), record it as a finding rather than silently correcting it, per the pattern established across this repository's audits — correction is a deliberately scoped sprint or Manual Review, not a QA-step side effect.

## Batch QA

For a batch of multiple collections or modules generated together: run the full Repository QA Sequence once, after every file in the batch is written, scoped per `docs/COLLECTION_BOOTSTRAP.md`'s Batch QA Rules — the batch itself, structurally equivalent articles across all prior collections, and anything the new content explicitly references. A full repository re-scan remains an acceptable and safer superset of this scope.

## Full Repository QA

A complete, unscoped run of every check in the Repository QA Sequence above against the entire repository, not just new or recently modified files. Appropriate at the start of an infrastructure sprint like this one, or on request, rather than as a routine part of every content sprint — a routine content sprint's batch-scoped QA (see Batch QA above) is sufficient day to day because it already treats a full re-scan as an acceptable default when in doubt.

## Release QA

The QA state that must be true immediately before a sprint's output reaches `Repository Ready`: every check in the Repository QA Sequence passing, a complete Delivery Manifest and QA Report per `docs/SPRINT_GENERATION_TEMPLATE.md` §9–10, and zero unresolved failures — a Release QA pass never ships with a known, fixable failure marked as a known issue instead of being fixed.

## Regression QA

A check, after any correction sprint (naming rename, duplicate-content fix, contradiction correction), that the fix didn't introduce a new failure elsewhere — for example, confirming a renamed folder's old path isn't still referenced anywhere, or that a reworded duplicate sentence doesn't now duplicate a third file. Regression QA is the same Repository QA Sequence, re-run specifically against the files touched by the correction plus anything that referenced them.

## Future AI QA

Whichever agent performs a future sprint runs this same playbook unchanged — this document doesn't assume a specific AI system, only the Documentation Engineer role boundaries defined in `docs/REPOSITORY_OWNERSHIP.md`. A future agent encountering a check here it cannot execute directly (for example, an environment without the standard Python scanning scripts available) should reconstruct the check from its stated method and acceptance criteria rather than skip it.

## Acceptance and Failure Summary

A sprint, batch, or repository-wide review is QA-complete only when every check above that's in scope for it reports a pass, and every finding that couldn't be fixed within the current scope is explicitly recorded — never omitted, never silently deferred without a written record. This is the same standard `docs/SPRINT_GENERATION_TEMPLATE.md` §4 already sets for individual sprints; this document exists so that standard applies identically at batch, full-repository, release, and regression scope.
