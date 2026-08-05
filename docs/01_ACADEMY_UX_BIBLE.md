# SurelyPlaced Sales Academy — UX Bible (01_ACADEMY_UX_BIBLE.md)

**Role:** Chief Product Designer & Staff UX Engineer  
**Status:** Permanent Executive UX & Visual Architecture Standard  
**Scope:** SurelyPlaced Knowledge OS & Interactive Sales Academy  

---

## 1. Overall Design Philosophy

The SurelyPlaced Sales Academy experience is built on **Active Immersion over Passive Consumption**. Traditional enterprise documentation platforms fail because they treat sales training like static technical manuals. 

Our philosophy fuses the precision of **Stripe Docs**, the keyboard-driven speed of **Raycast**, the delightful mastery loops of **Duolingo**, and the contextual clarity of **Linear**:

1. **Cognitive Clarity:** Reduce mental friction. Every screen communicates *where the advisor is*, *what they are practicing*, and *how it connects to real candidate conversations*.
2. **Interactive Realism:** Sales scripts are never plain blockquotes. They are rendered as high-fidelity call simulations, chat threads, and decision branching scenarios.
3. **Painless Progress:** Micro-feedback, instant self-comparisons, and visual progress milestones create a rewarding feeling of daily professional growth.
4. **Accessible Ergonomics:** Dark mode as a first-class citizen, high-contrast visual tokens, responsive fluid layouts, and strict WCAG AA compliance.

---

## 2. Visual Identity & Brand System

### Color Philosophy & Palette
- **Primary Brand Accent (Navy/Indigo):** `hsl(222.2 47.4% 11.2%)` / Dark: `hsl(217.2 91.2% 59.8%)` — Represents authority, structure, and professional executive calm.
- **Success / Mastery Emerald:** `hsl(142.1 76.2% 36.3%)` — Used exclusively for completed steps, passed scorecards, and correct advisor responses.
- **Accent Amber / Warning:** `hsl(37.7 92.1% 50.2%)` — Highlights decision pause points, hesitation indicators, and critical manager insights.
- **Sky Blue (Coaching & AI):** `hsl(199 89% 48%)` — Represents AI assistance, coaching breakdowns, and active practice reflection.
- **Destructive / Avoid Red:** `hsl(346.8 77.2% 49.8%)` — Highlights common advisor pitfalls, call objections, and failed scorecard criteria.

### Typography Hierarchy
- **Font Family:** `Inter`, system-ui, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`. Monospace elements use `JetBrains Mono` or `ui-monospace`.
- **Display Headings (`h1`):** `2.25rem` (`36px`), `font-extrabold`, `tracking-tight`, `leading-tight`.
- **Module Headings (`h2`):** `1.5rem` (`24px`), `font-bold`, `tracking-tight`, `border-b pb-2`.
- **Widget Titles (`h3`):** `1.125rem` (`18px`), `font-bold`, `leading-snug`.
- **Body Content:** `0.9375rem` (`15px`), `leading-relaxed` (`1.7` line-height), `text-fd-foreground`.
- **Micro Labels & Badges:** `0.6875rem` (`11px`) to `0.75rem` (`12px`), `font-mono` or `font-semibold`, `uppercase`, `tracking-wider`.

### Spacing & Grid System
- **Layout Max Width:** `max-w-6xl` (`1152px`) centered with `mx-auto px-4 sm:px-6 lg:px-8`.
- **Vertical Component Rhythm:** `space-y-6` (`24px` gaps) between major widget blocks.
- **Card Padding:** Standard `p-4 sm:p-6` for container cards; compact `p-3` for nested sub-cards.
- **Whitespace Ratio:** Generous `32px` (`py-8`) container paddings to ensure content never feels cramped.

---

## 3. Information Architecture

```
SurelyPlaced Knowledge OS
├── Dashboard / Home (/) ──► Stepper Journey + Continue Card + AI Copilot
├── Sales Academy (/docs)
│   ├── 1. Discovery Calls (/docs/discovery/*)
│   ├── 2. Discussion Calls (/docs/discussion/*)
│   ├── 3. Closing Calls (/docs/closing/*)
│   ├── 4. Objection Handling (/docs/objections/*)
│   ├── 5. Pricing & Investment (/docs/pricing/*)
│   ├── 6. Sales Coaching (/docs/sales-coaching/*)
│   ├── 7. Sales Constitution (/docs/sales-constitution/*)
│   └── 8. Complete Sales Call (/docs/sales-coaching/complete-sales-call-walkthrough)
├── Candidate Intelligence (/docs/candidate-intelligence/*) ──► 14 Role Collections
└── Global Tools ──► Orama Search Overlay (Cmd+K) & Grounded AI Assistant
```

---

## 4. Component Layout Specifications

### Conversation Layout (`ConversationViewer`)
- **Container:** Rounded `rounded-xl`, `border border-fd-border`, shadow-sm.
- **Header:** Displays call participant names, call direction (`inbound`/`outbound`), appearance variant icon, duration timer, and metadata badges.
- **Speech Bubbles:**
  - *Sales Executive (Left):* Rounded `rounded-xl rounded-tl-sm`, `bg-fd-secondary text-fd-secondary-foreground`.
  - *Candidate (Right):* Rounded `rounded-xl rounded-tr-sm`, `bg-fd-primary/10 text-fd-foreground` (WhatsApp: `bg-emerald-100 dark:bg-emerald-800`, LinkedIn: `bg-sky-100 dark:bg-sky-900`).
- **Annotations & Timestamps:** Rendered in `text-[10px]` italic muted typography below bubbles.

### Roleplay Simulation Layout (`RoleplayCard`)
- **2-Step Flow:**
  - *Step 1 (Practice Input):* Displays scenario card, difficulty badge, candidate prompt, hints toggle, and spoken response textarea.
  - *Step 2 (Coach Evaluation):* Shows learner's submitted response alongside the recommended response, coach explanation, and retry CTA button.

### Decision Point Layout (`DecisionPoint`)
- **Pause & Reflect Structure:** Top warning pause header (`amber-500/20`), context quote banner, decision prompt question, response input box, and reveal comparison toggle.

### Practice Box Layout (`PracticeBox`)
- **Micro-Interaction Structure:** Prompt statement, auto-expanding response textarea, real-time word counter badge, reveal button, and self-assessment rating buttons (*Nailed It*, *Close Match*, *Needs Review*).

---

## 5. Micro-Interactions & Animation Philosophy

1. **Subtle Motion Tokens:** Transitions restricted to `transition-all duration-200 ease-in-out` on hover, focus, and open state toggles.
2. **Typing Bounce Animation:** 3-dot typing indicator in `ConversationViewer` uses keyframe `@keyframes cv-bounce` for realistic messaging feedback.
3. **Progress Indicators:** Animated fill bars (`Progress`) smooth-transition when step hints or score percentages update.
4. **Zero Layout Shifts:** Accordions and collapsible elements operate with CSS height transitions to eliminate cumulative layout shift (CLS).

---

## 6. Accessibility & Responsive Philosophy

- **WCAG AA Compliance:** Color contrast ratio >= 4.5:1 across light and dark modes.
- **Keyboard Traversal:** All interactive widgets navigable via `Tab`, `Space`, and `Enter`. Visible focus outlines (`focus-visible:ring-1 focus-visible:ring-fd-ring`).
- **Screen Reader Semantics:** Log containers marked with `role="log"`, accordions with `aria-expanded`, active steps with `aria-current="step"`.
- **Mobile First:** Touch targets >= 44x44px. Multi-column cards stack single-column on `<640px` viewports.

---

## 7. Future Mobile App Blueprint

- **Gesture Controls:** Swipe right to mark lesson complete, swipe left to bookmark.
- **Audio Simulation Mode:** Voice-to-text roleplay practice allowing advisors to speak responses out loud during AI simulation loops.
- **Push Micro-Coaching:** Daily 2-minute objection handling quizzes delivered via mobile push notifications.
