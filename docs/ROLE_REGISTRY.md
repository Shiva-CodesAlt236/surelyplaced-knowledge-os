# Role Registry

**Status:** Canonical reference
**Owner:** Documentation Architect (content fields) / Antigravity (integration fields — see Rules)
**Last updated:** 2026-07-31 (Sprint 18 — integrated by Antigravity)

# Purpose

This document is the single source of truth for every Role Collection inside the Knowledge OS — which ones exist, which are pending, in what priority order, and what each depends on. It is distinct from [Project Roadmap](/docs/PROJECT_ROADMAP.md): the Roadmap tracks sprint-by-sprint repository progress across the whole project (modules, statistics, current sprint); this registry tracks Role Collections specifically — their naming, status, sequencing, and integration state. Where the two overlap (e.g. a completed Role Collection appearing in both the Roadmap's "Completed Collections" list and this registry's table), this document is the authoritative detail view and the Roadmap is the summary view.

# Naming Convention

Every Role Collection folder under `content/docs/candidate-intelligence/` follows the canonical naming convention already defined in [Knowledge OS Documentation Standard](/docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md) and [Role Collection Template](/docs/ROLE_COLLECTION_TEMPLATE.md):

- lowercase
- kebab-case (hyphen-separated)
- concise — no unnecessary words
- named after the role family, not a specific tool, employer, or certification

Canonical examples (existing and planned):

```
software-engineering
data-and-ai
cybersecurity
cloud-devops
qa-testing
business-analysis
project-management
healthcare
supply-chain
salesforce
sap
servicenow
network-engineering
embedded-systems
robotics
game-development
ui-ux
product-management
```

...and so on for any future collection. A folder name that doesn't follow this pattern is a naming defect to correct via a folder-rename-only correction sprint, per the process already demonstrated for this repository — never by regenerating the collection's content.

---

# Role Registry

| Role Collection | Status | Sprint | Priority | Dependencies | Completion % | Owner | Git Commit |
|---|---|---|---|---|---|---|---|
| Software Engineering | Completed | Sprint 13 | Completed | Candidate Intelligence Framework, Reference Candidate Profile, Software Engineering Playbook | 100% | Documentation Architect | `759847d` |
| Data & AI | Completed | Sprint 14 | Completed | Candidate Intelligence Framework, Reference Candidate Profile, Data and AI Playbook, Software Engineering Collection | 100% | Documentation Architect | `cede3e6` |
| Cybersecurity | Completed | Sprint 15 | Completed | Candidate Intelligence Framework, Reference Candidate Profile, Cybersecurity Playbook, Software Engineering Collection, Data & AI Collection | 100% | Documentation Architect | `bf432e3` |
| Cloud & DevOps | Completed | Sprint 16 | Completed | Candidate Intelligence Framework, Reference Candidate Profile, Cloud & DevOps Playbook, Software Engineering Collection, Data & AI Collection, Cybersecurity Collection | 100% | Documentation Architect | `03ae7e7` |
| QA Testing | Completed | Sprint 18 | Completed | Candidate Intelligence Framework, Reference Candidate Profile, QA Testing Playbook | 100% | Documentation Architect | `6bf6876` |
| Business Analysis | Pending | Not yet scheduled | 2 | Candidate Intelligence Framework, Reference Candidate Profile, Business Analyst Playbook | 0% | Unassigned | To be populated by Antigravity |
| Project Management | Pending | Not yet scheduled | 3 | Candidate Intelligence Framework, Reference Candidate Profile, Project Manager Playbook | 0% | Unassigned | To be populated by Antigravity |
| Supply Chain | Pending | Not yet scheduled | 4 | Candidate Intelligence Framework, Reference Candidate Profile, Supply Chain Playbook | 0% | Unassigned | To be populated by Antigravity |
| Healthcare | Pending | Not yet scheduled | 5 | Candidate Intelligence Framework, Reference Candidate Profile, Healthcare Playbook | 0% | Unassigned | To be populated by Antigravity |
| Salesforce | Pending | Not yet scheduled | 6 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| SAP | Pending | Not yet scheduled | 7 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| ServiceNow | Pending | Not yet scheduled | 8 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Network Engineering | Pending | Not yet scheduled | 9 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Embedded Systems | Pending | Not yet scheduled | 10 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Robotics | Pending | Not yet scheduled | 11 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Game Development | Pending | Not yet scheduled | 12 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| UI/UX | Pending | Not yet scheduled | 13 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Product Management | Pending | Not yet scheduled | 14 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Oracle | Pending | Not yet scheduled | 15 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Linux Administration | Pending | Not yet scheduled | 16 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| Database Administration | Pending | Not yet scheduled | 17 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| ERP | Pending | Not yet scheduled | 18 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| CRM | Pending | Not yet scheduled | 19 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped | 0% | Unassigned | To be populated by Antigravity |
| DevSecOps | Pending | Not yet scheduled | 20 | Candidate Intelligence Framework, Reference Candidate Profile, Industry Playbook not yet scoped, likely overlap with Cybersecurity and Cloud & DevOps Collections to review for duplication risk | 0% | Unassigned | To be populated by Antigravity |

Notes on Dependencies: QA Testing, Business Analysis, Project Management, Supply Chain, and Healthcare already have a corresponding `ROLE-*` code and Industry Playbook per [Role Classification](/docs/candidate-intelligence/ROLE_CLASSIFICATION), so they carry no scoping prerequisite beyond the standard framework dependencies. Every collection below priority 5 does not yet have a corresponding Industry Playbook or `ROLE-*` code — scoping one is a prerequisite before a Role Collection sprint can begin for any of them, consistent with [Project Roadmap](/docs/PROJECT_ROADMAP.md).

---

# Future Collection Queue

Ordered by priority:

1. QA Testing
2. Business Analysis
3. Project Management
4. Supply Chain
5. Healthcare
6. Salesforce
7. SAP
8. ServiceNow
9. Network Engineering
10. Embedded Systems
11. Robotics
12. Game Development
13. UI/UX
14. Product Management
15. Oracle
16. Linux Administration
17. Database Administration
18. ERP
19. CRM
20. DevSecOps

This ordering reflects sequencing priority only, not a commitment to a specific sprint number. A collection's position in this queue may be revisited as the repository grows, but this document should not be reordered casually — see Rules below.

---

# Rules

- Only Antigravity updates the **Status**, **Sprint**, **Completion %**, and **Git Commit** columns in the Role Registry table above, once a collection has actually been integrated (built, linted, and pushed) per [Antigravity Pipeline Standard](/docs/ANTIGRAVITY_PIPELINE_STANDARD.md).
- The Documentation Engineer role may add new rows to the Role Registry and Future Collection Queue, update **Dependencies**, **Priority**, and **Owner** fields, and update the Naming Convention section — but never sets a **Git Commit** hash, and never marks **Status** as "Completed" or **Completion %** above 0% on its own authority.
- Historical entries are never edited by the Documentation Engineer once Antigravity has recorded a Status, Sprint, Completion %, or Git Commit value against them. If a historical entry appears to need correction, flag it rather than editing it directly.
- This document is updated alongside [Project Roadmap](/docs/PROJECT_ROADMAP.md) at the end of any sprint that completes, begins, or re-prioritizes a Role Collection, but the two documents are never merged into one.
