# Repository Ownership

**Status:** Canonical reference — ownership matrix
**Applies to:** Every file and field in this repository
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document draws one clean line per file or field: who is allowed to write it. It doesn't restate what each role does day to day — that's `docs/AI_CONTEXT_PACK.md` and the standards it indexes. It exists so no two roles ever believe they own the same field at once. Where a more specific document already states an ownership rule (e.g. the Role Registry's own Rules section), this document defers to it rather than restating it with different wording — see each row's reference.

## Ownership Principle

Every file or field in this repository has exactly one owner at any given time. "Owner" means: the only role authorized to write that value. Any role may *read* any file. Only the owner may *write* it. An ownership conflict — two roles both authorized to set the same field — is treated as a defect in this document to correct, not something a sprint should resolve ad hoc.

## Claude (Documentation Engineer) Owns

- Every `.mdx` article and `meta.json` file under `content/docs/`, within the scope a given sprint instruction defines. Per `docs/SPRINT_GENERATION_TEMPLATE.md` §2, no file outside that scope is touched.
- The full documentation-QA process defined in `docs/SPRINT_GENERATION_TEMPLATE.md` §4 and its Delivery Manifest / QA Report output.
- Locked engineering standards, at creation time only: `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/SPRINT_GENERATION_TEMPLATE.md`, `docs/ANTIGRAVITY_PIPELINE_STANDARD.md`, `docs/COLLECTION_BOOTSTRAP.md`. Once locked, these are referenced, not edited, per `docs/COLLECTION_BOOTSTRAP.md`'s Repository Ownership Rules.
- The living-document fields `docs/ROLE_REGISTRY.md` and `docs/PROJECT_ROADMAP.md` explicitly assign to the Documentation Engineer: new rows, Dependencies, Priority, Owner, and the Naming Convention section in the Role Registry; the Completed/Upcoming Collections lists and descriptive sections of the Roadmap at the end of a sprint that changes them. See `docs/ROLE_REGISTRY.md`'s Rules section and `docs/PROJECT_ROADMAP.md`'s Document Ownership section for the exact boundary.
- The standing index and infrastructure documents this role has authored: `docs/AI_CONTEXT_PACK.md`, `docs/REPOSITORY_STATE.md`, `docs/REPOSITORY_OWNERSHIP.md`, `docs/FUTURE_EXPANSION_GUIDE.md`, `docs/REPOSITORY_SYNCHRONIZATION.md`, `docs/MASTER_QA_PLAYBOOK.md`, and the documentation-QA fields of `docs/REPOSITORY_HEALTH.md` (Duplicate Scan, Broken Links, Meta Validation, Naming Validation, Known Issues, Technical Debt at the documentation layer).

## Antigravity Owns

- `git pull`, `git status`, `git add`, `git commit`, `git push`, and commit hash reporting — never performed by the Documentation Engineer, per `docs/SPRINT_GENERATION_TEMPLATE.md` §13 and `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §1.
- `pnpm install`, `pnpm lint`, `pnpm build` and their reported results, per `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §2.
- In `docs/ROLE_REGISTRY.md`: the **Status**, **Sprint**, **Completion %**, and **Git Commit** columns — set only once a collection is actually integrated, per that document's Rules section.
- In `docs/PROJECT_ROADMAP.md`: the **Latest Git Commit** field and any statement that a sprint's output has been integrated into `main`.
- In `docs/REPOSITORY_HEALTH.md`: Lint Status, Build Status, Search Index, and the rendered-navigation confirmation in Navigation — all populated only after an actual pipeline run, never assumed by the Documentation Engineer.
- The Manual Testing Checklist in `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §6, jointly with Manual Review where a human reviewer is the one executing it.

## Manual Review Owns

- Final judgment on any flagged data-quality defect that spans a living document's historical entries — for example, a contradictory or duplicate row in `docs/ROLE_REGISTRY.md`, or a stale figure in `docs/PROJECT_ROADMAP.md` — once the Documentation Engineer has surfaced it as a finding rather than corrected it silently. Correcting such an entry is a deliberately scoped correction sprint, not a byproduct of an unrelated sprint, per the precedent already established in this repository's history.
- Manual confirmation, alongside or in place of Antigravity, of the Manual Testing Checklist in `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §6 (sidebar rendering, MDX rendering, link resolution in the built site, no visual regression).
- Any judgment call a sprint instruction explicitly reserves for a human — for example, confirming that a genuinely new non-invention constraint (a new regulated domain, a new sensitive topic) is scoped correctly before content is generated against it.

## Future AI Owns

Reserved. Whichever agent performs the Documentation Engineer role in a future sprint inherits everything under "Claude (Documentation Engineer) Owns" above unchanged — this section exists so a change in which AI system executes that role never requires restructuring this matrix. If a future role is introduced that isn't a direct continuation of the Documentation Engineer role, its ownership boundaries are added as a new section here rather than blended into an existing one.

## No Overlap Rule

If any future document, sprint instruction, or correction appears to grant two roles write authority over the same field, that is an ownership-matrix defect. It is corrected by editing this document to name a single owner — never by allowing both roles to write the field in practice. Report such a conflict as a finding rather than resolving it silently, consistent with how `docs/ROLE_REGISTRY.md`'s own Rules section already treats ambiguous historical entries.
