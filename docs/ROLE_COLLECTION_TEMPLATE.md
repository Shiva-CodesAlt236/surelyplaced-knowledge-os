# Role Collection Template

**Status:** Canonical reference
**Applies to:** `content/docs/candidate-intelligence/<role-collection>/`
**Established by:** Sprint 13 (Software Engineering), confirmed by Sprint 14 (Data & AI) and Sprint 15 (Cybersecurity)
**Owner:** Documentation Architect
**Last updated:** 2026-07-31

This document is the canonical template for every Candidate Intelligence Role Collection. Every future role collection (Cloud/DevOps, QA/Testing, Healthcare IT, Supply Chain, Business Analyst, Project Manager, and any role currently marked `ROLE-PENDING` in `ROLE_CLASSIFICATION.mdx`) must follow this structure exactly. Deviating from it breaks navigation consistency and cross-collection comparison.

## 1. Folder Layout

```
content/docs/candidate-intelligence/<role-collection>/
  overview.mdx
  <working-pattern-1>.mdx
  <working-pattern-2>.mdx
  <working-pattern-3>.mdx
  <working-pattern-4>.mdx
  technology-ecosystem.mdx
  candidate-behaviour.mdx
  buying-patterns.mdx
  discovery-guide.mdx
  presentation-guide.mdx
  objection-guide.mdx
  closing-guide.mdx
  advisor-coaching.mdx
  role-checklist.mdx
  meta.json
```

Fourteen `.mdx` files plus `meta.json`, always. The four working-pattern filenames are the only names that vary by role family (e.g. `backend-specializations` / `data-engineer` / `soc-analyst`); the remaining ten filenames are identical across every collection.

## 2. Purpose of Every Article

**overview.mdx** — Entry point. States which `ROLE-*` code(s) this collection covers, names the four working patterns, and positions the collection relative to the Candidate Intelligence Framework and any prior collections.

**Four working-pattern articles** — Each documents one recognizable specialization within the role family: typical background, how that background reads to an advisor, and what distinguishes it from the other three patterns in the same collection. Never a technical how-to; always sales-relevant framing.

**technology-ecosystem.mdx** — Names representative tools/technologies for the role family as category-illustrative examples only. Never a standalone deep dive on a single named product. Where a constraint against comparing or ranking tools applies (see Sprint 15), every named tool is explicitly marked as non-comparative.

**candidate-behaviour.mdx** — Describes this role family's characteristic mindset and communication style as it shows up in a sales conversation, anchored to a single differentiating theme distinct from every other collection's theme.

**buying-patterns.mdx** — Extends `candidate-behaviour.mdx` into what that mindset predicts about buying signals, hesitation patterns, and decision style, using the `BUYER_PERSONA_SCHEMA.mdx` taxonomy.

**discovery-guide.mdx, presentation-guide.mdx, objection-guide.mdx, closing-guide.mdx** — Apply the four core sales-stage modules (`content/docs/discovery/`, `discussion/`, `objections/`, `closing/`) to this specific role family, routing to the matching Visa Playbook and Industry Playbook where relevant. Each stage guide builds on its corresponding core module rather than inventing new technique.

**advisor-coaching.mdx** — Sets coaching review priorities specific to this role family, extending `COACHING_SIGNALS.mdx`, with one illustrative (never real) coaching-note example.

**role-checklist.mdx** — Closing completeness and compliance checklist for the whole collection, structurally identical to every other collection's checklist, adapted only for role-specific risk items (e.g. the never-compare/never-recommend item unique to Cybersecurity).

**meta.json** — Pages list exactly matching the 14 filenames above (minus extension), in the same order as the folder layout.

## 3. Required Sections

Every article in a Role Collection uses the standard seven-section shape defined in `KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`: `## Purpose`, `## Scope`, `## Core Content`, `## Cross-Module Alignment`, `## Advisor Guidance`, `## Related Articles`, `## Key Takeaways`. No collection may substitute a different section structure.

## 4. Cross-Link Expectations

- `overview.mdx` links forward to all four working-pattern articles and to `technology-ecosystem.mdx`.
- Each working-pattern article links back to `overview.mdx` and sideways to `technology-ecosystem.mdx` where relevant.
- `candidate-behaviour.mdx` and `buying-patterns.mdx` link to each other and to `BUYER_PERSONA_SCHEMA.mdx`.
- The four stage guides link to their corresponding core sales-stage module, to the preceding and following stage guide within the collection, and to the relevant Visa Playbook or Industry Playbook where the guidance is visa- or industry-specific.
- `advisor-coaching.mdx` links to `COACHING_SIGNALS.mdx` and to `closing-guide.mdx` (the preceding article) and `role-checklist.mdx` (the following article).
- `role-checklist.mdx` links to `overview.mdx`, `advisor-coaching.mdx`, and `PROFILE_QA_GUIDELINES.mdx`.
- Every article should also name the structurally equivalent article in at least one prior Role Collection (e.g. "the structural parallel in the Data & AI collection"), so collections stay comparable without duplicating content.

## 5. Relationship with Candidate Intelligence Framework

Every Role Collection is an application of the framework defined in `README.mdx`, `PROFILE_SCHEMA.mdx`, `ROLE_CLASSIFICATION.mdx`, `VISA_MAPPING.mdx`, `INDUSTRY_MAPPING.mdx`, `TECHNOLOGY_MAPPING.mdx`, `BUYER_PERSONA_SCHEMA.mdx`, and `COACHING_SIGNALS.mdx`. A collection must use the existing taxonomy codes (`ROLE-*`, `VISA-*`, `PERSONA-*`, `COACH-*`) rather than inventing new ones. The single Gold Standard reference profile in `reference-profile/` is the worked illustrative example the Role Collection pattern was generalized from — collections describe a role family in aggregate; they do not create additional named candidate profiles.

## 6. Relationship with Industry Playbooks

Role Collections operate one level more granular than Industry Playbooks (`content/docs/industry-playbooks/`). Each Role Collection maps to exactly one Industry Playbook (Software Engineering → `software-engineering-playbook.mdx`, Data & AI → `data-and-ai-playbook.mdx`, Cybersecurity → `cybersecurity-playbook.mdx`) and should defer broader industry-level guidance to that playbook rather than restating it.

## 7. Relationship with Sales Academy

Role Collections are additive, not duplicative, to the core Sales Academy modules (Discovery, Discussion, Closing, Objections, Pricing, Sales Operations, Sales Coaching, Sales Constitution). They apply existing technique to a role family; they never introduce new sales technique. Any new technique belongs in the core modules, not inside a Role Collection.

## 8. Non-Invention Discipline

Role Collections carry the same non-invention rules as the rest of the repository (see `KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, sections 11–14), with particular attention to: no invented hiring statistics, salaries, or employer-specific expectations per role family; no invented candidate history; and, where a collection names specific tools or vendors, no comparison, ranking, or recommendation between them unless a future sprint explicitly authorizes otherwise.
