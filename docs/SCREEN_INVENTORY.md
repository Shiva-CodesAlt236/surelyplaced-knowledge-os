# Screen Inventory

**Status:** Design proposal — not yet built
**Applies to:** Every screen proposed for the Academy product
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document lists every screen the product is proposed to need, each with Purpose, Primary User, Actions, Inputs, Outputs, Dependencies, and Priority. Priority uses the same MVP / Post-MVP / Future tiers `docs/IMPLEMENTATION_BACKLOG.md` organizes work by, so this inventory and that backlog stay in sync rather than stating two different priority schemes.

## Learner Screens

### Career Advisor Dashboard

- **Purpose:** The learner's home screen — orientation to current progress and next actions.
- **Primary User:** Career Advisor
- **Actions:** Resume current module, open a recommended article, open Ask AI, open Bookmarks
- **Inputs:** None from the user beyond navigation clicks; reads the learner's own progress and Recent state
- **Outputs:** Continue Learning card, Recommended Content, Recent Activity, Quick Actions (full detail in `docs/DASHBOARD_EXPERIENCE.md`)
- **Dependencies:** Progress tracking (`docs/MODULE_INDEX_STANDARD.md`'s Completion Status), Learning Paths
- **Priority:** MVP

### Browse / Module Landing Page

- **Purpose:** Entry point into a specific Sales Academy module or `*-intelligence` module.
- **Primary User:** Career Advisor
- **Actions:** Start or resume the module, open its Checklist, open its first Lesson
- **Inputs:** None
- **Outputs:** Module metadata per `docs/MODULE_INDEX_STANDARD.md` (Overview, Learning Objectives, Reading Time, Difficulty, Related Modules)
- **Dependencies:** `docs/MODULE_INDEX_STANDARD.md`'s proposed fields
- **Priority:** MVP

### Role Collection Landing Page

- **Purpose:** Entry point into a specific Role Collection under `content/docs/candidate-intelligence/`.
- **Primary User:** Career Advisor
- **Actions:** Same as Module Landing Page, scoped to a Role Collection's fourteen-file structure
- **Inputs:** None
- **Outputs:** Same metadata set as Module Landing Page
- **Dependencies:** `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/MODULE_INDEX_STANDARD.md`
- **Priority:** MVP

### Lesson / Article Page

- **Purpose:** Renders a single article with the full learning chrome (TOC, related articles, practice/quiz links).
- **Primary User:** Career Advisor
- **Actions:** Mark complete, bookmark, open a related article, open Ask AI scoped to this article, add a Note
- **Inputs:** None beyond navigation and the actions above
- **Outputs:** The article itself (unchanged from `content/docs/`), plus the surrounding chrome specified in `docs/MODULE_EXPERIENCE.md`
- **Dependencies:** `docs/MODULE_EXPERIENCE.md`, Notes feature, Bookmarks feature
- **Priority:** MVP

### Learning Paths Landing Page

- **Purpose:** Lists all five proposed Learning Paths so a learner can browse or enroll.
- **Primary User:** Career Advisor, Trainer (for assignment)
- **Actions:** View a path's detail, enroll (self-service, where permitted), or — for a Trainer — assign to a cohort
- **Inputs:** None for viewing; cohort selection for a Trainer's assignment action
- **Outputs:** Summary card per path (name, prerequisites, estimated hours per `docs/LEARNING_PATHS.md`)
- **Dependencies:** `docs/LEARNING_PATHS.md`
- **Priority:** MVP

### Learning Path Detail / Progress Page

- **Purpose:** Shows a specific path's full module sequence and the learner's progress through it.
- **Primary User:** Career Advisor
- **Actions:** Jump to any module in the sequence, view milestone status
- **Inputs:** None
- **Outputs:** Ordered module list, milestone markers, overall progress indicator
- **Dependencies:** `docs/LEARNING_PATHS.md`, Completion Status tracking
- **Priority:** MVP

### Search Overlay

- **Purpose:** Fast, keyboard-accessible search without leaving the current page.
- **Primary User:** All learner-facing personas
- **Actions:** Type a query, apply a facet filter, select a result
- **Inputs:** Free-text query, optional facet selection
- **Outputs:** Ranked result list (see `docs/SEARCH_PRODUCT.md`)
- **Dependencies:** `docs/SEARCH_PRODUCT.md`, existing Orama search index per `docs/REPOSITORY_HEALTH.md`
- **Priority:** MVP

### Search Results Page

- **Purpose:** A full-page, more spacious version of search results for a longer research session, distinct from the quick Search Overlay.
- **Primary User:** Career Advisor (especially the Experienced Career Advisor journey in `docs/USER_JOURNEYS.md`)
- **Actions:** Same as Search Overlay, plus saving a search or bookmarking multiple results at once
- **Inputs:** Same as Search Overlay
- **Outputs:** Same ranked results, in a full-page layout with all facets visible simultaneously
- **Dependencies:** `docs/SEARCH_PRODUCT.md`
- **Priority:** Post-MVP

### Ask AI Panel

- **Purpose:** The primary AI Assistant conversation surface, available as a persistent panel or slide-over.
- **Primary User:** All learner-facing personas
- **Actions:** Ask a question, follow up, view a suggested question, view cited sources
- **Inputs:** Free-text question
- **Outputs:** Grounded, cited answer or an explicit deferral (see `docs/AI_EXPERIENCE.md`)
- **Dependencies:** `docs/AI_ASSISTANT_BLUEPRINT.md`, `docs/AI_EXPERIENCE.md`
- **Priority:** MVP

### AI Conversation History Page

- **Purpose:** A full list of a learner's past AI conversations, for reference.
- **Primary User:** Career Advisor
- **Actions:** Reopen a past conversation, delete a conversation
- **Inputs:** None beyond selection
- **Outputs:** List of past conversations with timestamps and a short summary
- **Dependencies:** Ask AI Panel, Conversation Memory (`docs/AI_EXPERIENCE.md`)
- **Priority:** Post-MVP

### Bookmarks Page

- **Purpose:** A learner's saved-article list.
- **Primary User:** Career Advisor
- **Actions:** View, filter, remove a bookmark
- **Inputs:** Filter selection
- **Outputs:** List of bookmarked articles
- **Dependencies:** Bookmarks feature (`docs/FEATURE_SPECIFICATIONS.md`)
- **Priority:** MVP

### Notes Page

- **Purpose:** A learner's personal notes, attached to specific articles.
- **Primary User:** Career Advisor
- **Actions:** View, edit, delete a note; jump from a note back to its article
- **Inputs:** Free-text note content, entered from the Lesson Page
- **Outputs:** List of notes grouped by article or module
- **Dependencies:** Notes feature (`docs/FEATURE_SPECIFICATIONS.md`)
- **Priority:** Post-MVP

### Practice / Role Play Screen

- **Purpose:** Runs a Role Play exercise built from an existing Composite Case Study.
- **Primary User:** Career Advisor (advisor role play), Sales Manager (manager role play)
- **Actions:** Start, respond within the exercise, submit, receive narrative feedback
- **Inputs:** The learner's responses during the exercise
- **Outputs:** Narrative feedback per `docs/ASSESSMENT_FRAMEWORK.md`'s Role Plays section
- **Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`, existing composite case studies in `content/docs/sales-coaching/`
- **Priority:** Post-MVP

### Quiz / Knowledge Check Screen

- **Purpose:** Runs a short, per-article or per-module assessment.
- **Primary User:** Career Advisor
- **Actions:** Answer questions, submit, retake
- **Inputs:** Selected answers
- **Outputs:** Result and formative feedback per `docs/ASSESSMENT_FRAMEWORK.md`
- **Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`
- **Priority:** MVP

### Scenario Test Screen

- **Purpose:** Runs a situation-based assessment requiring applied judgment rather than recall.
- **Primary User:** Career Advisor
- **Actions:** Read the scenario, respond, submit
- **Inputs:** The learner's response
- **Outputs:** Result and reasoning-based feedback per `docs/ASSESSMENT_FRAMEWORK.md`
- **Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`
- **Priority:** Post-MVP

### Certification Exam Screen

- **Purpose:** Runs a Learning Path's capstone assessment.
- **Primary User:** Career Advisor
- **Actions:** Complete the combined scenario and knowledge components, submit
- **Inputs:** The learner's responses
- **Outputs:** Pass/retake result per the proposed, pending-approval policy in `docs/ASSESSMENT_FRAMEWORK.md`
- **Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`, `docs/LEARNING_PATHS.md`
- **Priority:** Post-MVP

### Certificate View Screen

- **Purpose:** Displays and allows download of an earned certificate.
- **Primary User:** Career Advisor
- **Actions:** View, download, share (proposed scope of "share" to be defined in a future sprint)
- **Inputs:** None
- **Outputs:** A certificate record tied to a completed Learning Path
- **Dependencies:** Certification Exam Screen, `docs/LEARNING_PATHS.md`
- **Priority:** Post-MVP

### Live Chat Script Library

- **Purpose:** Browses live chat scripts once `content/docs/live-chat-scripts/` exists, per `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md`.
- **Primary User:** Career Advisor
- **Actions:** Browse by category, view a script
- **Inputs:** None
- **Outputs:** Script list and content, once written
- **Dependencies:** `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md` (folder does not yet exist)
- **Priority:** Future

### Onboarding / First-Run Screen

- **Purpose:** A one-time flow that introduces a new account to the platform and recommends a starting Learning Path.
- **Primary User:** Career Advisor (new)
- **Actions:** Confirm role, accept recommended path or choose another, dismiss
- **Inputs:** Role confirmation, path selection
- **Outputs:** An enrolled Learning Path and a redirect to the Dashboard
- **Dependencies:** `docs/LEARNING_PATHS.md`
- **Priority:** MVP

### Profile / Settings Screen

- **Purpose:** A learner's own account settings — display preferences (including Dark Mode), notification preferences.
- **Primary User:** All personas
- **Actions:** Update preferences
- **Inputs:** Preference selections
- **Outputs:** Updated account settings
- **Dependencies:** `docs/UI_NAVIGATION_BLUEPRINT.md`'s Dark Mode
- **Priority:** Post-MVP

## Manager and Trainer Screens

### Manager Dashboard

- **Purpose:** A Sales Manager's home screen — team progress at a glance.
- **Primary User:** Sales Manager
- **Actions:** View team member progress, drill into an individual, launch a manager Role Play
- **Inputs:** None beyond selection
- **Outputs:** Team progress summary, per-advisor status
- **Dependencies:** Completion Status tracking across a team, `docs/FEATURE_SPECIFICATIONS.md`'s Manager Dashboard section
- **Priority:** Post-MVP

### Team Progress Detail Screen

- **Purpose:** A drill-down from the Manager Dashboard into a single advisor's detailed progress.
- **Primary User:** Sales Manager
- **Actions:** View module-by-module status, assessment results, and notes (where an advisor has made notes shareable — a proposed permission this document does not fully specify)
- **Inputs:** None beyond navigation
- **Outputs:** Detailed per-advisor progress view
- **Dependencies:** Manager Dashboard
- **Priority:** Post-MVP

### Trainer Cohort Dashboard

- **Purpose:** A Trainer's home screen — cohort-level (not individual) progress and path-assignment tools.
- **Primary User:** Trainer
- **Actions:** Assign a path to a cohort, view aggregate cohort completion
- **Inputs:** Cohort selection, path selection
- **Outputs:** Cohort progress summary
- **Dependencies:** `docs/LEARNING_PATHS.md`, `docs/USER_JOURNEYS.md`'s Trainer journey
- **Priority:** Future

## Admin Screens

### Admin Console

- **Purpose:** User account management, role assignment, platform configuration.
- **Primary User:** Admin
- **Actions:** Create/edit/deactivate an account, assign a role (Career Advisor, Sales Manager, Trainer, Admin), configure platform-level settings
- **Inputs:** Account and role data
- **Outputs:** Updated account and role records
- **Dependencies:** None from the content layer — entirely a platform-operational surface
- **Priority:** MVP (a minimal version is required before any real users can be provisioned at all)

## Related Documents

- `docs/IMPLEMENTATION_BACKLOG.md` — where these screens are organized into buildable epics and features
- `docs/USER_JOURNEYS.md` — the journeys these screens support
- `docs/FEATURE_SPECIFICATIONS.md` — the feature-level detail behind several screens listed here
