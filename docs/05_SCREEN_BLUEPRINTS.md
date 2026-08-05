# SurelyPlaced Sales Academy — Screen Blueprints (05_SCREEN_BLUEPRINTS.md)

**Role:** Chief Product Designer & Staff UX Engineer  
**Status:** Comprehensive Layout, Component & Responsive Screen Specifications  
**Scope:** 14 Primary Screen & Interface Specifications  

---

## 1. Screen Blueprints Inventory

| Screen ID | Name | Path / Context | Target Audience |
|---|---|---|---|
| `SCR-01` | Academy Home | `/docs` | All Advisors |
| `SCR-02` | Dashboard | `/` | Career Advisors & Managers |
| `SCR-03` | Module Overview | `/docs/[module]` | All Advisors |
| `SCR-04` | Lesson Page | `/docs/[module]/[slug]` | All Advisors |
| `SCR-05` | Conversation Viewer Interface | MDX Component | All Advisors |
| `SCR-06` | Roleplay Simulation Screen | MDX Component | All Advisors |
| `SCR-07` | Practice Exercise Screen | MDX Component | All Advisors |
| `SCR-08` | Progress & Analytics | Dashboard Widget / Page | Advisors & Managers |
| `SCR-09` | Search Overlay (Cmd+K) | Global Modal | All Advisors |
| `SCR-10` | Bookmarks & Reading Lists | `/bookmarks` | All Advisors |
| `SCR-11` | Personal Notes Workspace | `/notes` | All Advisors |
| `SCR-12` | Complete Sales Call Walkthrough | `/docs/sales-coaching/*` | Senior Advisors |
| `SCR-13` | Future AI Coach Portal | `/ai` (Future Spec) | All Advisors |
| `SCR-14` | Future Voice Practice Studio | Assessment Studio (Future Spec) | All Advisors |

---

## 2. Detailed Screen Specifications

### `SCR-01`: Academy Home (`/docs`)
- **Purpose:** Primary entry point for structured sales training. Replaces developer documentation with the 8-step Sales Academy pathway.
- **Layout:** Centered single-column fluid layout with max-width `max-w-6xl`.
- **Components:** `LearningJourneyStepper`, `QuickReferencePanel` (Core Principles), Sidebar navigation tree.
- **Primary CTA:** `"Start Step 1: Discovery Calls"`
- **Secondary CTA:** `"Browse Candidate Intelligence Collections"`
- **Desktop/Tablet/Mobile Layout:**
  - *Desktop (`>=1024px`):* 2-column layout (Sidebar + Stepper & Cheat Sheet).
  - *Tablet (`640px - 1023px`):* Drawer sidebar, full-width stepper.
  - *Mobile (`<640px`):* Touch-optimized vertical step list with collapsible step descriptions.
- **Accessibility:** `h1` heading hierarchy, ARIA milestone indicators.

---

### `SCR-02`: Dashboard (`/`)
- **Purpose:** Advisor home base for active progress tracking, recent activity, and quick tools access.
- **Layout:** 3-column dashboard grid (2 cols main content, 1 col quick tools sidebar).
- **Components:** Top Welcome Banner with AI trigger, `ContinueLearningCard`, `LearningJourneyStepper`, `KnowledgeCheckCard` (Featured Check), `QuickActionsCard`, `KnowledgeCheckSummaryCard`, `RecentActivityCard`.
- **Primary CTA:** `"Ask AI Assistant"`
- **Secondary CTA:** `"Search Academy (Cmd+K)"`

---

### `SCR-04`: Lesson Page (`/docs/[module]/[slug]`)
- **Purpose:** Primary learning view for reading frameworks, interacting with scripts, and practicing responses.
- **Layout:** Standard Fumadocs document container wrapped in `LessonViewer` chrome.
- **Components:** `ModuleHeader`, `EstimatedTime`, `ConversationTimeline`, `ConversationViewer`, `DecisionPoint`, `RoleplayCard`, `PracticeBox`, `CallScorecard`, `MistakesPanel`, `QuickReferencePanel`, `ModuleCompletion`, Lesson Navigation Footer, `NotesPanel`.
- **Primary CTA:** `"Next: [Next Module Name]"` in navigation footer.
- **Secondary CTA:** `"Bookmark Article"` / `"Add Personal Note"`.

---

### `SCR-06`: Roleplay Simulation Screen
- **Purpose:** Interactive 2-stage response simulation.
- **Layout:** Full-width embedded card with colored top accent bar.
- **Components:** Difficulty badge, role indicator cards (*You Play* vs *They Play*), objective box, success criteria box, response text input, progressive hints list, recommended response card, coach explanation panel.
- **Primary CTA:** `"Submit & Compare Response"` (Step 1) / `"Try Roleplay Again"` (Step 2).

---

### `SCR-09`: Search Overlay (`Cmd+K`)
- **Purpose:** Instant global search powered by Orama search index across all 345 content articles.
- **Layout:** Fixed backdrop blur modal (`fixed inset-0 bg-background/80 backdrop-blur-sm`).
- **Components:** Search input with icon, category filter pills (*All*, *Discovery*, *Objections*, *Pricing*), result items list with highlighted title & snippet matches, keyboard shortcut hints (`Esc` to close, `Enter` to open).
- **Primary CTA:** `"Open Selected Article"`
