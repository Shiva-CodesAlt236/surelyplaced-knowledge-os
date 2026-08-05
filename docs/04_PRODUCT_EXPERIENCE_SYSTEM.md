# SurelyPlaced Sales Academy — Product Experience System (04_PRODUCT_EXPERIENCE_SYSTEM.md)

**Role:** Chief Product Designer & Staff UX Engineer  
**Status:** Canonical End-to-End Experience & State System Blueprint  
**Scope:** Complete Behavioral, State, Transition, and Interaction Design System  

---

## 1. Executive Summary & Product Architecture

The SurelyPlaced Sales Academy Product Experience System defines the behavioral mechanics, interface states, transition choreography, and interactive contracts across the entire Knowledge OS ecosystem.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SURELYPLACED SALES ACADEMY                            │
├──────────────────────────────────────┬──────────────────────────────────────────┤
│           LEARNER EXPERIENCE         │          ACADEMY ENGINE & STATES         │
├──────────────────────────────────────┼──────────────────────────────────────────┤
│ • Onboarding & Start Pathway         │ • State Stores (Progress/Notes/Bookmarks)│
│ • Interactive Lesson Flow            │ • Step-by-Step Simulation Engine         │
│ • Active Roleplay & Practice         │ • Orama Search Gateway (Cmd+K)           │
│ • Grounded AI Copilot Assistance     │ • Grounded Context Vector Pipeline       │
│ • Certification & Completion Track   │ • Responsive Fluid Viewport Grid         │
└──────────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 2. Global State & Interaction Architecture

### A. Screen Hierarchy & Transitions
- **Dashboard (`/`) $\rightarrow$ Academy Home (`/docs`):** Instant client routing with skeleton loader fallbacks; smooth header accent transition.
- **Academy Home $\rightarrow$ Module Lesson (`/docs/[module]/[lesson]`):** Page fade-in (`150ms ease-out`), header metadata hydration, active step highlights in sidebar.
- **In-Lesson Progression:** Scroll-anchored navigation banner update, state store synchronization without page refresh.

### B. Interactive States Definition

| State Type | Trigger | UI/UX Representation | Feedback Mechanism |
|---|---|---|---|
| **Empty State** | Zero progress, no notes, or empty search | MetricEmptyState card with icon, clear text, primary CTA button | Clean visual illustration, zero dead ends |
| **Loading State** | Initial page load or AI query fetching | Pulse skeleton loaders for text/cards, glowing spinner for AI response | Eliminates layout cumulative shift (CLS) |
| **Completion State** | Module finished or quiz passed | Emerald badge animation, checkmark indicator, progress bar increment | Immediate visual reward feedback |
| **Search State** | Press `Cmd+K` or click search bar | Backdrop blur overlay modal, instant keystroke search results | Instant highlighted keyword matches |
| **AI State** | Click "Ask AI Assistant" | Slide-over drawer with grounded context badge and stream bubble | Real-time response streaming |
| **Practice State** | Type in `PracticeBox` | Word count ticker, active border ring focus | Self-rating evaluation buttons upon reveal |
| **Roleplay State** | Interact with `RoleplayCard` | 2-step simulation card: Practice Input $\rightarrow$ Coach Evaluation | Compare response & retry capability |
| **Certification State** | Complete 8-step journey | Golden badge display, composite case study evaluation scorecard | Exportable PDF completion record |

---

## 3. End-to-End Interaction Flows

### Flow 1: Daily Learning Loop
1. Advisor opens Dashboard (`/`) or Academy Home (`/docs`).
2. Advisor clicks **Start Step** or **Continue Learning** card.
3. System loads active lesson with `EstimatedTime` badge, `ConversationTimeline` stage, and script examples.
4. Advisor completes `DecisionPoint` reflection and `PracticeBox` exercises.
5. Advisor reviews `CallScorecard` and clicks **Next Lesson** in navigation banner.
6. Progress store persists completion status instantly to client `localStorage`.

### Flow 2: On-Demand Objections Lookup
1. Advisor encounters candidate objection on a live call.
2. Advisor hits `Cmd+K` to launch Orama search.
3. Advisor types `"already working with consultancy"`.
4. Search overlay returns instant links to `/docs/objections/already-working-with-a-consultancy`.
5. Advisor views `ConversationViewer` script and `QuickReferencePanel` cheat sheet within seconds.

---

## 4. Call-To-Action (CTA) Hierarchy Standard

- **Primary CTA (`variant="primary"`):** Standard fill button (`bg-fd-primary text-fd-primary-foreground`). Used once per view for primary progression actions (*Start Step*, *Submit Response*, *Ask AI*).
- **Secondary CTA (`variant="secondary"`):** Surface fill button (`bg-fd-secondary text-fd-secondary-foreground`). Used for secondary flow actions (*Review*, *Hide Hints*, *Copy Script*).
- **Ghost/Outline CTA (`variant="outline"` / `"ghost"`):** Border or text-only buttons. Used for optional actions (*Reset Exercise*, *View Source*, *Previous Lesson*).
