# Search Taxonomy

**Status:** Design proposal — not yet built
**Applies to:** The category system underlying `docs/SEARCH_PRODUCT.md`'s facets and `docs/MODULE_METADATA_STANDARD.md`'s Search Tags and AI Retrieval Tags
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document defines the actual category values behind the facets `docs/SEARCH_EXPERIENCE.md` and `docs/SEARCH_PRODUCT.md` already designed conceptually. Every category value below is drawn from real, already-existing repository structure — no category is invented independent of the content it describes, and this document does not create any new taxonomy file inside `content/docs/`.

## Module Categories

Drawn directly from the current top-level folders under `content/docs/` (confirm directly against the live repository before relying on this list, since it grows over time per `docs/FUTURE_EXPANSION_GUIDE.md`):

`discovery` · `discussion` · `closing` · `objections` · `visa-playbooks` · `industry-playbooks` · `pricing` · `sales-operations` · `sales-coaching` · `sales-constitution` · `candidate-intelligence` · `interview-intelligence` · `resume-intelligence` · `linkedin-intelligence` · `recruiter-intelligence` · `hiring-intelligence`

This is the same set `docs/SEARCH_PRODUCT.md`'s Module Search facet filters against, and the same set registered in the root `content/docs/meta.json`.

## Role Categories

Drawn directly from `content/docs/candidate-intelligence/ROLE_CLASSIFICATION.mdx`'s existing classification codes: `ROLE-SWE`, `ROLE-DATA`, `ROLE-SEC`, `ROLE-CLOUD`, `ROLE-QA`, `ROLE-HEALTH`, `ROLE-SUPPLY`, `ROLE-BA`, `ROLE-PM`, and `ROLE-PENDING` (used honestly for a Role Collection without a dedicated code, per that document's own Author Guidelines — the precedent already established for the Salesforce, SAP, ServiceNow, and Oracle collections). This document does not add, remove, or redefine any code — it points to the existing taxonomy as the Role Search facet's data source.

## Problem Categories

Drawn from the repository's existing `*-red-flags.mdx` pattern, present in `content/docs/visa-playbooks/`, `content/docs/industry-playbooks/`, `content/docs/interview-intelligence/`, `content/docs/resume-intelligence/`, `content/docs/linkedin-intelligence/`, `content/docs/recruiter-intelligence/`, and `content/docs/hiring-intelligence/`, plus the objection categories in `content/docs/objections/`. Proposed top-level Problem Categories, one per red-flags article's general domain: Visa/Authorization Concerns, Industry-Specific Concerns, Interview Concerns, Resume Concerns, LinkedIn Concerns, Recruiter Concerns, Hiring/Offer Concerns, and Objections. This document doesn't invent a new problem beyond what these existing articles already document.

## Industry Categories

Drawn directly from `content/docs/industry-playbooks/`'s existing playbooks: Software Engineering, Data & AI, Cybersecurity, Cloud & DevOps, QA Testing, Healthcare, Supply Chain, Business Analyst, Project Manager — plus the platform-focused categories from the Salesforce, SAP, ServiceNow, and Oracle Role Collections, consistent with how `docs/ROLE_REGISTRY.md`'s Naming Convention section already lists them.

## Technology Categories

Drawn from each Role Collection's existing `technology-ecosystem.mdx` article's tool groupings. Consistent with `docs/COLLECTION_BOOTSTRAP.md`'s Never-Allowed Content rule, this taxonomy is strictly categorical (grouping, never ranking) — a Technology Category is a label like "cloud infrastructure tools" or "CRM platforms," never a specific product ranked above another.

## Career Stage

Drawn from `docs/ACADEMY_PRODUCT_VISION.md`'s Target Users: Career Advisor (new), Career Advisor (experienced), Sales Manager, Trainer, Admin. This is the same persona set `docs/USER_JOURNEYS.md` defines journeys for.

## Learning Stage

Drawn from the milestone structure already defined per-path in `docs/LEARNING_PATHS.md` — for example, the New Career Advisor path's four milestones (Foundations Complete, Candidate-Facing Skills Complete, Candidate Artifact Literacy, Operational Readiness). Learning Stage is path-specific, not a single repository-wide scale, since different paths define different milestones.

## Difficulty

Already defined in `docs/MODULE_INDEX_STANDARD.md` — the three-tier Foundational / Intermediate / Advanced taxonomy. Not redefined here; referenced as one of the facets this taxonomy document organizes alongside the others.

## Question Types

Proposed categories for how a query or an assessment item is phrased, relevant to both Search (`docs/SEARCH_PRODUCT.md`'s Smart Search) and Assessment (`docs/ASSESSMENT_FRAMEWORK.md`): Factual ("what is Operational Policy Pending"), Situational ("candidate says X, what do I do"), Definitional ("what's the difference between a recruiter and a hiring manager"), and Red-Flag Identification ("is this a concern or ordinary"). These map directly onto the existing content patterns already found across the repository — a definitional question tends to be answered by an Overview article, a situational one by a red-flags or objection article.

## AI Retrieval Categories

The taxonomy `docs/MODULE_METADATA_STANDARD.md`'s AI Retrieval Tags would draw values from, and the categorization `docs/AI_ASSISTANT_BLUEPRINT.md`'s Retrieval step would use to narrow which content to weight most heavily for a given question. Proposed to mirror Question Types above (Factual, Situational, Definitional, Red-Flag Identification) plus a Cross-Module tag for content that deliberately spans more than one module's territory (for example, `content/docs/resume-intelligence/international-student-resumes.mdx`, which spans Resume Intelligence and Visa Playbooks).

## How These Categories Relate

Module Categories, Role Categories, and Industry Categories describe *where* content lives. Problem Categories and Question Types describe *what a learner is trying to do*. Career Stage and Learning Stage describe *who's asking and where they are in their journey*. Difficulty and Technology Categories are cross-cutting descriptors applied within any of the above. AI Retrieval Categories are the machine-facing counterpart to Question Types, tuned for retrieval rather than human browsing.

## Related Documents

- `docs/SEARCH_PRODUCT.md` — the facets this taxonomy supplies values for
- `docs/MODULE_METADATA_STANDARD.md` — Search Tags and AI Retrieval Tags, the fields this taxonomy governs
- `content/docs/candidate-intelligence/ROLE_CLASSIFICATION.mdx` — the authoritative source for Role Categories
- `docs/ASSESSMENT_FRAMEWORK.md` — where Question Types also apply, to assessment item design
