# SurelyPlaced Sales Academy — Learning Experience Guidelines (02_LEARNING_EXPERIENCE_GUIDELINES.md)

**Role:** Chief Product Designer & Staff UX Engineer  
**Status:** Pedagogical & Experiential Design Specification  
**Scope:** Learner Journey, Lesson Dynamics, Simulation Mechanics  

---

## 1. The Core Learning Loop

The SurelyPlaced Sales Academy operates on a 6-stage mastery cycle designed for rapid skill acquisition and behavioral transformation:

$$\text{Read} \longrightarrow \text{Observe} \longrightarrow \text{Reflect} \longrightarrow \text{Practice} \longrightarrow \text{Evaluate} \longrightarrow \text{Master}$$

```
 ┌──────────────────────────────────────────────────────────┐
 │ 1. READ          Theory & Frameworks                    │
 ├──────────────────────────────────────────────────────────┤
 │ 2. OBSERVE       Real Conversation Viewer Scripts        │
 ├──────────────────────────────────────────────────────────┤
 │ 3. REFLECT       Decision Point Pause Statements         │
 ├──────────────────────────────────────────────────────────┤
 │ 4. PRACTICE      Roleplay Simulation & Practice Boxes    │
 ├──────────────────────────────────────────────────────────┤
 │ 5. EVALUATION    Call Scorecards & Self-Rating Feedback  │
 ├──────────────────────────────────────────────────────────┤
 │ 6. MASTERY       Module Completion & Certification Track │
 └──────────────────────────────────────────────────────────┘
```

---

## 2. How Each Lesson Should Feel

Every lesson in the SurelyPlaced Academy must feel like an **interactive sales workshop with a master mentor**, rather than a textbook chapter.

1. **Immediate Context:** The learner opens a lesson and instantly sees the estimated time, difficulty rating, and stage location in the 8-step sales funnel.
2. **Realistic Dialogue:** Script examples are presented as actual call recordings or chat transcripts with candidate mood badges, visa status, and timing details.
3. **Active Interruption:** Lessons deliberately pause at key moments ("What would you say next?") to force active cognitive engagement before revealing answers.
4. **Safety to Fail:** Roleplays provide a safe space to type or test answers without pressure, offering constructive manager insights immediately after submission.
5. **Clear Progression:** Upon finishing, the learner receives visual feedback, can record personal notes, and is seamlessly guided to the next logical step in the journey.

---

## 3. Transition & Navigation Dynamics

- **Lesson Entry:** Smooth scroll to top, header badge fade-in, automatically updating the progress store with the current active article title.
- **In-Lesson Navigation:** Breadcrumb track (`Sales Academy > Discovery > Opening the Discovery Call`) allows effortless jumping between hierarchy levels.
- **Lesson Exit / Footer Navigation:** The `LessonViewer` footer provides dual action buttons:
  - *Previous Step:* Returns to the previous module in the canonical journey.
  - *Next Step:* Primary highlighted button leading directly to the next logical training module.

---

## 4. Roleplay Simulation Mechanics

The roleplay experience is structured as an interactive 2-phase simulation:

1. **Phase 1: Scenario Setup & Spoken Response Input**
   - Learner reads the candidate scenario, difficulty level, persona details, and core objective.
   - Learner formulates their spoken response in the active practice box.
   - Optional progressive hints can be unlocked if the learner is stuck.
2. **Phase 2: Coach Evaluation & Comparison**
   - Learner submits their response.
   - The UI reveals the **Recommended Advisor Response** alongside the learner's text.
   - **Coach Explanation & Manager Insight** breaks down why the recommended answer works (psychology, framing, value anchor).
   - Learner can click **Try Roleplay Again** to re-attempt.

---

## 5. AI Copilot Experience Guidelines

- **Grounded Assistant:** The AI Copilot (`AskAIPanel`) is grounded strictly in SurelyPlaced curriculum content.
- **Contextual Awareness:** When invoked inside a specific lesson, the copilot automatically receives the active `articleSlug` and `moduleName` context.
- **Socratic Coaching:** The AI is programmed to coach advisors through questioning and script refinement rather than just providing generic answers.

---

## 6. Progress & Mastery Feel

- **Persistent Progress:** Lesson completions, notes, and bookmarks are saved instantly in client `localStorage` via consolidated Zustand stores.
- **Visual Rewarding:** Completing a module updates progress rings on the Dashboard and marks step indicators with green checkmarks in the `LearningJourneyStepper`.
