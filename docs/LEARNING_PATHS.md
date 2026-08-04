# Learning Paths

**Status:** Design proposal — not yet built
**Applies to:** The five proposed learner journeys through existing `content/docs/` modules
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document designs five learning journeys through content that already exists. It creates no new articles and modifies no existing module — every module named below is a real, already-published folder under `content/docs/`. Where a path references a module, confirm the module's actual current file list directly rather than assuming this document's description of it stays current as the repository grows.

## How to Read "Estimated Learning Hours"

No usage or completion-time data exists yet for any module, because the Academy platform hasn't been built. Every hour estimate below is a **planning estimate**, computed from a stated, transparent assumption — not a measured fact. The assumption: roughly 8 minutes of reading per standard seven-section article, roughly 15 minutes per checklist or framework article, and roughly 20 minutes per proposed knowledge check (see `docs/ASSESSMENT_FRAMEWORK.md`). These figures exist so a path has a usable planning number, and should be replaced with real measured data the moment the Academy platform can actually collect it — per `docs/REPOSITORY_SYNCHRONIZATION.md`'s general principle that a placeholder value should never be mistaken for a live one.

## Path 1: New Career Advisor

**Prerequisites:** None — this is the default entry path for a newly onboarded Career Advisor.

**Recommended modules, in completion order:**

1. `content/docs/sales-constitution/` — foundational philosophy before any tactical content
2. `content/docs/discovery/`
3. `content/docs/discussion/`
4. `content/docs/candidate-intelligence/reference-profile/` — the framework and Gold Standard illustrative profile
5. `content/docs/objections/`
6. `content/docs/pricing/`
7. `content/docs/closing/`
8. `content/docs/resume-intelligence/`
9. `content/docs/linkedin-intelligence/`
10. `content/docs/interview-intelligence/`
11. `content/docs/visa-playbooks/` — foundational awareness, deepened later in the International Student Specialist path
12. `content/docs/sales-operations/`
13. `content/docs/sales-coaching/` — self-review framework, to close the path

**Estimated learning hours:** approximately 22–26 hours, per the planning assumption stated above, across roughly 60 articles spanning these thirteen modules.

**Milestones:**
- *Foundations Complete* — after sales-constitution, discovery, and discussion
- *Candidate-Facing Skills Complete* — after reference-profile, objections, pricing, and closing
- *Candidate Artifact Literacy* — after resume-intelligence, linkedin-intelligence, and interview-intelligence
- *Operational Readiness* — after visa-playbooks, sales-operations, and sales-coaching

**Completion criteria:** a knowledge check per module (see `docs/ASSESSMENT_FRAMEWORK.md`) and one capstone scenario test drawing on discovery through closing. This path does not include a certification exam — certification is proposed to begin at the Senior Career Advisor path.

## Path 2: Senior Career Advisor

**Prerequisites:** New Career Advisor path complete, or equivalent tenure as determined by a Sales Manager.

**Recommended modules, in completion order:**

1. `content/docs/candidate-intelligence/` — the Role Collections relevant to the advisor's actual book of business (as many as apply; the framework does not require completing every collection)
2. `content/docs/industry-playbooks/`
3. `content/docs/recruiter-intelligence/`
4. `content/docs/hiring-intelligence/`
5. `content/docs/sales-coaching/` — revisited at a deeper level, focused on `coach-review-framework.mdx` and the composite case studies
6. `content/docs/sales-constitution/` — revisited as a deeper review rather than an introduction

**Estimated learning hours:** approximately 18–24 hours, varying with how many Role Collections the advisor's book of business requires, per the planning assumption stated above.

**Milestones:**
- *Role Collection Fluency* — after completing the Role Collections relevant to the advisor's book of business
- *Full Candidate Journey Mastery* — after recruiter-intelligence and hiring-intelligence, extending the journey view past what the New Career Advisor path covers
- *Advanced Judgment Review* — after the deeper pass through sales-coaching and sales-constitution

**Completion criteria:** a scenario test per completed Role Collection and a certification exam covering the full candidate journey from discovery through hiring decision, per `docs/ASSESSMENT_FRAMEWORK.md`.

## Path 3: Sales Manager

**Prerequisites:** Senior Career Advisor path complete, or equivalent management-track experience as determined by Sales Leadership.

**Recommended modules, in completion order:**

1. `content/docs/sales-coaching/` — the full module, read through a coaching-others lens rather than the self-review lens the New Career Advisor path applies to it
2. `content/docs/sales-operations/` — read for team-workflow oversight rather than individual daily practice
3. `content/docs/sales-constitution/`
4. A breadth pass across every Role Collection under `content/docs/candidate-intelligence/` and every `*-intelligence` module — overview and checklist articles specifically, favoring breadth of awareness over the depth a Senior Career Advisor pursues in their own book of business

**Estimated learning hours:** approximately 16–20 hours, per the planning assumption stated above, weighted toward the breadth pass in step 4.

**Milestones:**
- *Coaching Framework Fluency* — after sales-coaching and sales-operations
- *Cross-Portfolio Awareness* — after the breadth pass across all Role Collections and `*-intelligence` modules
- *Team Enablement Readiness* — the path's completion state

**Completion criteria:** no scenario test in the advisor sense — instead, a proposed coaching-simulation assessment (see Role Plays in `docs/ASSESSMENT_FRAMEWORK.md`) where the manager reviews a composite case study the way they would review an advisor's actual call.

## Path 4: Technical Hiring Specialist

**Prerequisites:** New Career Advisor path complete.

**Recommended modules, in completion order:**

1. The technical Role Collections under `content/docs/candidate-intelligence/` — `software-engineering/`, `data-and-ai/`, `cybersecurity/`, `cloud-devops/`, `qa-testing/`, and any platform-focused collection (`salesforce/`, `sap/`, `servicenow/`, `oracle/`) relevant to the specialist's focus
2. `content/docs/resume-intelligence/technical-resume-analysis.mdx`
3. `content/docs/recruiter-intelligence/technical-recruiters.mdx`
4. `content/docs/interview-intelligence/technical-interviews.mdx`, `coding-interviews.mdx`, and `system-design-interviews.mdx`

**Estimated learning hours:** approximately 14–18 hours, per the planning assumption stated above, varying with how many technical and platform Role Collections are included.

**Milestones:**
- *Technical Vocabulary Fluency* — after the selected Role Collections' technology-ecosystem articles
- *Technical Candidate Journey Mastery* — the path's completion state, after all four steps

**Completion criteria:** a scenario test built from a composite technical case study and a knowledge check on the platform-neutrality and never-compare-tools discipline already established in `docs/COLLECTION_BOOTSTRAP.md`, to confirm the specialist internalizes that constraint rather than just the technical vocabulary.

## Path 5: International Student Specialist

**Prerequisites:** New Career Advisor path complete.

**Recommended modules, in completion order:**

1. `content/docs/visa-playbooks/` — the full module, all playbooks
2. `content/docs/candidate-intelligence/VISA_MAPPING.mdx`
3. `content/docs/resume-intelligence/international-student-resumes.mdx`
4. The visa- and authorization-related sections already present in `content/docs/recruiter-intelligence/recruiter-red-flags.mdx` and `content/docs/hiring-intelligence/hiring-red-flags.mdx`

**Estimated learning hours:** approximately 10–13 hours, per the planning assumption stated above.

**Milestones:**
- *Visa Category Fluency* — after visa-playbooks and VISA_MAPPING.mdx
- *International Candidate Journey Mastery* — the path's completion state

**Completion criteria:** a scenario test built from the visa-specific red-flags content, and an explicit knowledge check confirming the specialist routes authorization-specific questions to qualified immigration counsel rather than answering them directly — reinforcing the standing rule in `content/docs/visa-playbooks/visa-red-flags.mdx` rather than treating specialization as license to answer those questions personally.

## Related Documents

- `docs/CAREER_ADVISOR_ACADEMY.md` — the vision these paths implement
- `docs/MODULE_INDEX_STANDARD.md` — the metadata each module in these paths should eventually expose
- `docs/ASSESSMENT_FRAMEWORK.md` — the mechanics behind every "Completion Criteria" section above
