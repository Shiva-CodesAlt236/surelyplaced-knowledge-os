# Sprint Generation Template

**Status:** Canonical reference
**Applies to:** Every future documentation sprint in this repository
**Established by:** Sprints 1–15 (pattern), formalized in Sprint 15.5
**Owner:** Documentation Architect
**Last updated:** 2026-07-31

This document defines how every future sprint should be scoped, executed, validated, and reported. It replaces the need to restate QA steps and delivery format inside every sprint prompt. The Documentation Engineer role is scoped strictly to documentation: no architecture redesign, no platform code changes, no Git operations, ever.

## 1. Expected Inputs

A well-formed sprint instruction should specify:

- A sprint name and number.
- The exact folder path being created or modified under `content/docs/`.
- An explicit file list (filenames, not just a count).
- Which existing modules the new content must build on (named explicitly, e.g. "Candidate Intelligence Framework, Visa Playbooks, Discovery, Discussion").
- Any content this sprint must NOT create (guardrails against scope creep — e.g. "do not create separate tool-specific articles").
- Any new non-invention constraints specific to this sprint's subject matter (beyond the standing rules in `KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`).
- Whether `meta.json` files need creating, updating, or both.

If a sprint instruction omits one of these, the Documentation Engineer should apply the closest established pattern from `ROLE_COLLECTION_TEMPLATE.md` or the relevant prior module rather than inventing a new structure.

## 2. Expected Outputs

- All files listed in the sprint instruction, each conforming to `KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`.
- Any `meta.json` files created or updated so navigation reflects the new content, at both the immediate folder level and, where a new top-level folder is introduced, the root `content/docs/meta.json`.
- No files outside the specified scope are modified. Existing published content is never rewritten as a side effect of a new sprint unless the sprint instruction explicitly calls for a duplicate-content fix.

## 3. Folder Naming

Follows section 5 of `KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`: lowercase-hyphenated for module and role-collection folders, UPPERCASE_SNAKE_CASE reserved exclusively for Candidate Intelligence Framework schema files.

## 4. QA Process (run in this order, every sprint)

1. **Frontmatter check** — every new file has complete, correctly ordered frontmatter; `slug` matches filename; `related` has no self-reference.
2. **Required-sections check** — every new file contains all required headers for its article type (standard seven-section shape, or Layered Model if it is an illustrative candidate profile).
3. **Internal link validation** — repo-wide, not just new files. Every `/docs/...` link resolves to an existing file.
4. **meta.json validation** — repo-wide. Every folder's `meta.json` "pages" set exactly matches its actual `.mdx` filenames; every folder is reachable from its parent's `meta.json`.
5. **Duplicate content scan** — repo-wide. No verbatim 10+ word sentence appears in more than one file, excluding the standardized boilerplate allowlist.
6. **AI filler scan** — new files, grep for generic AI-assistant phrasing.
7. **Invented-content scans** — new files: currency symbols, percentages, "salary of," "placement rate," "hiring rate," "demand for"; contextual check that every "guarantee" mention is a disclaimer, not a claim.
8. **Sprint-specific constraint checks** — anything the sprint instruction added beyond the standing rules (e.g. a never-compare-tools scan).

A sprint is not complete until all eight steps pass. Any failure is fixed before delivery, not noted as a known issue.

## 5. Cross-Link Validation

Beyond raw link resolution (step 3 above), verify that new articles link to the specific parent/sibling articles the sprint instruction named as required foundations (e.g. "must build on Candidate Intelligence Framework, Visa Playbooks, Discovery"), and that at least one prior structurally-equivalent collection or module is cross-referenced where one exists.

## 6. Duplicate Scan

Use the standard repo-wide Python duplicate-sentence scanner (strips frontmatter, splits body into sentences, flags any 10+-word sentence repeated verbatim across files, excluding the standardized boilerplate `ignore_pattern`). Run it after all new files are written, not incrementally — cross-file duplication only shows up once the full new set exists. Where a new file covers structurally similar ground to an existing file (e.g. a new Role Collection's `objection-guide.mdx` versus a prior collection's), write each section's phrasing independently from the start; do not draft by copying a prior file's structure and editing afterward, since that is the primary cause of duplicate-content failures (see Sprint 14).

## 7. Internal Link Validation

Use the standard repo-wide Python script: extract every `/docs/...` link from every `.mdx` file, resolve it against the actual file tree (case-sensitive), and report any that don't resolve. Zero tolerance — any broken link is fixed before delivery.

## 8. meta.json Validation

Use the standard repo-wide Python script: for each folder containing `.mdx` files, load its `meta.json` "pages" array and compare it, as a sorted set, against the actual filenames (minus extension) in that folder. Also confirm each folder is listed in its parent's `meta.json`.

## 9. Delivery Manifest Format

```
## Delivery Manifest — Sprint <N>: <Sprint Name>

**New: `content/docs/<folder>/`**
file-one.mdx · file-two.mdx · ... · meta.json (<count> files + meta.json)

**Modified:**
`content/docs/<parent>/meta.json` — added "<new-folder>"
[any other modified files, listed explicitly]
```

## 10. QA Report Format

A short paragraph or list confirming the result of each of the 8 QA steps in Section 4, plus any sprint-specific constraint checks, stated in plain terms (what was checked, what was found). Failures that were fixed during the sprint may be mentioned as resolved; no unresolved failure is ever delivered silently.

## 11. Repository Ready Format

The literal line `Repository Ready`, on its own line, with no additional commentary attached to it.

## 12. Waiting for Antigravity Integration Format

The literal line `Waiting for Antigravity Integration`, on its own line, immediately following `Repository Ready`. These two lines close every sprint delivery, in this order, with no text after them.

## 13. Explicitly Out of Scope

Git operations (`git add`, `git commit`, `git push`, or any other Git command) are never performed by the Documentation Engineer as part of a sprint. The repository is handed to Antigravity in its working-tree state; Antigravity owns the pipeline described in `ANTIGRAVITY_PIPELINE_STANDARD.md`.
