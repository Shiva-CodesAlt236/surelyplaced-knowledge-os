# Knowledge OS Project Roadmap

**Status:** Canonical reference — permanent executive dashboard
**Owner:** Documentation Architect
**Last updated:** 2026-07-31 (Sprint 16)

## Project Overview

Surely Placed Knowledge OS is the internal sales training academy for Admissions Advisors at Surely Placed, a company placing IT candidates who already hold valid work authorization into jobs in the US, Canada, and the UK. It is built as a Fumadocs/Next.js documentation site and is developed sprint by sprint by a Documentation Engineer role scoped strictly to documentation — no architecture changes, no platform code, no Git operations.

## Repository Purpose

The repository exists to give advisors a consistent, non-improvised reference for discovery, discussion, objection handling, closing, pricing conversations, visa considerations, industry context, sales operations, coaching, the company's stated sales philosophy, and — as of Sprint 11 onward — a structured framework for reasoning about candidate profiles by role, visa category, and buyer persona. Where the repository does not contain an authoritative answer, articles explicitly defer to "the latest approved internal process" rather than inventing one.

## Architecture Overview

```
content/docs/                 Fumadocs content tree — all advisor-facing articles
  <module>/                   Sales Academy modules (discovery, discussion, closing, objections,
                               pricing, sales-operations, sales-coaching, sales-constitution,
                               visa-playbooks, industry-playbooks)
  candidate-intelligence/      Candidate Intelligence Framework
    <FRAMEWORK_FILES>.mdx      Taxonomy and schema (UPPERCASE)
    reference-profile/         Single Gold Standard illustrative profile
    <role-collection>/         Role Collections (Software Engineering, Data & AI,
                               Cybersecurity, Cloud & DevOps, ...)

docs/                          Engineering / standards documentation (this file and its siblings) —
                               not rendered as site content
```

Every content folder carries its own `meta.json` for sidebar navigation, and every folder is registered in its parent's `meta.json`. Full conventions are defined in [Knowledge OS Documentation Standard](/docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md), the Role Collection pattern is defined in [Role Collection Template](/docs/ROLE_COLLECTION_TEMPLATE.md), and the sprint process is defined in [Sprint Generation Template](/docs/SPRINT_GENERATION_TEMPLATE.md).

## Current Repository Statistics

(Counted directly from the repository at the time of this update — see Section "Repository Metrics" for the same figures presented as a dashboard.)

- Total `.mdx` articles: 167
- Total `meta.json` files: 17
- Top-level modules under `content/docs/`: 11
- Role Collections completed under `candidate-intelligence/`: 5 (Reference Profile + 4 role collections)

## Current Sprint

Sprint 16 — Cloud & DevOps Role Collection + Project Roadmap.

## Latest Git Commit

`70c672d` — "docs: add Knowledge OS documentation standards" (the last commit known to this Documentation Engineer role at the time of writing). This reflects the last completed Antigravity integration, not necessarily the current working-tree state — the Documentation Engineer does not perform Git operations, so any sprint delivered after this commit (including Sprint 16 itself) remains uncommitted until Antigravity integrates it. Update this placeholder with the actual hash after each integration, per [Antigravity Pipeline Standard](/docs/ANTIGRAVITY_PIPELINE_STANDARD.md).

## Repository Version

`1.0` — no repository-wide version bump has occurred; individual articles carry their own `version` frontmatter field per [Knowledge OS Documentation Standard](/docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md).

---

## Completed Collections

- [x] Discovery
- [x] Discussion
- [x] Closing
- [x] Objections
- [x] Visa Playbooks
- [x] Industry Playbooks
- [x] Pricing
- [x] Sales Operations
- [x] Sales Coaching
- [x] Sales Constitution
- [x] Candidate Intelligence Framework
- [x] Reference Candidate Profile
- [x] Software Engineering Collection
- [x] Data & AI Collection
- [x] Cybersecurity Collection
- [x] Cloud & DevOps Collection
- [x] Documentation Infrastructure

---

## Upcoming Collections

- [ ] QA / Testing
- [ ] Business Analyst
- [ ] Project Management
- [ ] Healthcare
- [ ] Supply Chain
- [ ] Salesforce
- [ ] SAP
- [ ] Networking
- [ ] Product Management
- [ ] UI/UX
- [ ] Embedded Systems
- [ ] *(reserved for additional collections not yet scoped)*
- [ ] *(reserved for additional collections not yet scoped)*
- [ ] *(reserved for additional collections not yet scoped)*

Of these, QA/Testing, Business Analyst, Project Management, Healthcare, and Supply Chain already have a corresponding Industry Playbook and `ROLE-*` classification code in [Role Classification](/docs/candidate-intelligence/ROLE_CLASSIFICATION), making them the most direct candidates for the next Role Collection sprints. Salesforce, SAP, Networking, Product Management, UI/UX, and Embedded Systems do not yet have a corresponding Industry Playbook or `ROLE-*` code — scoping one is a prerequisite before a Role Collection sprint for any of them.

---

## Repository Metrics

| Metric | Value |
|---|---|
| Total Modules (top-level `content/docs/` folders) | 11 |
| Total Collections (Role Collections under `candidate-intelligence/`, including Reference Profile) | 5 |
| Total Articles (`.mdx` files) | 167 |
| Total `meta.json` files | 17 |
| Repository Status | Active — sprint-by-sprint delivery |
| Latest Sprint | Sprint 16 — Cloud & DevOps Role Collection + Project Roadmap |
| Completion % | 44% of classified role categories have a Role Collection (4 of 9 non-pending `ROLE-*` codes in [Role Classification](/docs/candidate-intelligence/ROLE_CLASSIFICATION): Software Engineering, Data & AI, Cybersecurity, Cloud & DevOps completed; QA & Testing, Healthcare, Supply Chain, Business Analyst, Project Manager remaining) |
| GitHub Repository | *(placeholder — repository URL not recorded in this documentation; add when confirmed)* |

---

## Future Improvements

*(Reserved section. No improvements are proposed here — this section exists so future sprints or stakeholders can record planned improvements without restructuring this document. Do not populate with invented items.)*

-
-
-

---

## Document Ownership

This roadmap is maintained by the Documentation Engineer role as part of each sprint's delivery and should be updated at the end of every sprint that adds a module, collection, or standards document. It is descriptive of the repository's actual current state at time of writing, not a forward-looking commitment beyond what's listed in Upcoming Collections.
