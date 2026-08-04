# Authoring Checklist

**Status:** Canonical reference — condensed pre-delivery checklist
**Applies to:** Every future documentation sprint, run immediately before delivery
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document introduces no new rule. It is a checkbox-form condensation of `docs/SPRINT_GENERATION_TEMPLATE.md` §4's eight-step QA process and `docs/MASTER_QA_PLAYBOOK.md`'s acceptance criteria, intended as the quick, at-a-glance pass a Documentation Engineer runs through immediately before writing `Repository Ready` — not a replacement for either document, both of which remain the full authoritative methodology.

## Before Writing Anything

- [ ] Read `docs/AI_CONTEXT_PACK.md` first, per its own Quick Start Guide
- [ ] Identify which deeper documents this sprint actually requires, per `docs/AI_CONTEXT_PACK.md` §20
- [ ] Inspect the live repository directly — don't assume a description in an engineering document is still current

## Generation

- [ ] Every file the sprint instruction named has been created
- [ ] Every article uses complete, correctly ordered frontmatter per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3
- [ ] Every article contains its required sections, in order, for its article type
- [ ] Phrasing was written independently for each new file — not copied from a prior file and edited afterward

## QA Sequence (per `docs/SPRINT_GENERATION_TEMPLATE.md` §4 and `docs/MASTER_QA_PLAYBOOK.md`)

- [ ] Frontmatter check passed
- [ ] Required-sections check passed
- [ ] Internal link validation passed, repo-wide, zero broken links
- [ ] `meta.json` validation passed, repo-wide
- [ ] Duplicate-content scan passed, repo-wide, zero new violations
- [ ] AI filler scan passed
- [ ] Invented-content scan passed (pricing, guarantees, statistics, salaries, employers, candidates)
- [ ] Any sprint-specific constraint check named in the sprint instruction has been run and passed

## Scope Discipline

- [ ] No file outside the sprint's stated scope was modified
- [ ] No previously completed collection or module was touched
- [ ] No locked engineering standard was edited
- [ ] Any living document (`docs/PROJECT_ROADMAP.md`, `docs/ROLE_REGISTRY.md`) was updated only within the Documentation Engineer's field boundaries, per `docs/REPOSITORY_OWNERSHIP.md`, and only if the sprint instruction actually calls for it

## Delivery

- [ ] Delivery Manifest produced, in the format `docs/SPRINT_GENERATION_TEMPLATE.md` §9 defines
- [ ] QA Report produced, in the format `docs/SPRINT_GENERATION_TEMPLATE.md` §10 defines, with every finding stated plainly rather than omitted
- [ ] No unresolved, fixable failure delivered as a "known issue" instead of being fixed
- [ ] A genuinely pre-existing, out-of-scope issue is reported as a finding, not silently corrected
- [ ] No Git operation was performed at any point
- [ ] The delivery closes with the literal lines `Repository Ready` and `Waiting for Antigravity Integration`, per `docs/SPRINT_GENERATION_TEMPLATE.md` §11–12

## Related Documents

- `docs/SPRINT_GENERATION_TEMPLATE.md` — the full authoritative sprint process this checklist condenses
- `docs/MASTER_QA_PLAYBOOK.md` — the full QA methodology, including acceptance criteria and recovery steps this checklist doesn't restate
- `docs/CONTENT_ENRICHMENT_GUIDE.md` — the adapted version of this same discipline for enrichment sprints specifically
- `docs/AI_CONTEXT_PACK.md` — where to start before using this checklist at all
