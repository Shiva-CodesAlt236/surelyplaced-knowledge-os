# SurelyPlaced Sales Academy — Widget Usage Guide & UX Audit (03_WIDGET_USAGE_GUIDE.md)

**Role:** Chief Product Designer & Staff UX Engineer  
**Status:** Component Architecture, MDX Usage & UX Quality Specification  
**Scope:** Complete Audit of all 13 Academy Learning Widgets  

---

## Complete Widget Reference & Usage Rules

### 1. `ConversationViewer`
- **Purpose:** Renders sales scripts as realistic messaging dialogues or call transcripts.
- **When to Use:** When demonstrating dialogue between an advisor and candidate.
- **When NOT to Use:** For plain narrative prose or list items.
- **MDX Example:**
  ```mdx
  <ConversationViewer
    repName="Aayush"
    candidateName="Rahul"
    appearance="phone"
    callDirection="outbound"
    callDuration="8:50"
    visaStatus="F1 OPT"
    leadSource="Referral"
    difficulty="Advanced"
    expectedOutcome="Diagnose objection variant"
    messages={[
      { sender: "candidate", text: "Honestly, this feels like too much.", mood: "hesitant" }
    ]}
  />
  ```

---

### 2. `RoleplayCard`
- **Purpose:** Interactive 2-step simulation card for scenario practice.
- **When to Use:** In roleplay sections of lessons to test advisor response.
- **When NOT to Use:** For simple single-sentence practice questions.
- **MDX Example:**
  ```mdx
  <RoleplayCard
    scenario="Comparison objection against a cheaper consultancy"
    difficulty="Intermediate"
    yourRole="Sales Executive"
    theirRole="Candidate (Emily)"
    objective="Understand comparison without getting defensive"
    recommendedAnswer="Fair thing to bring up — what do you know about what that includes?"
    managerTip="Always check what's included before defending price."
  />
  ```

---

### 3. `DecisionPoint`
- **Purpose:** Pauses lesson flow to force active reflection ("What would you say next?").
- **When to Use:** At critical junction points in call scripts.
- **When NOT to Use:** At the start of a lesson before concepts are explained.
- **MDX Example:**
  ```mdx
  <DecisionPoint
    context="Rahul says 'too much' — which variant is in play?"
    prompt="What should Aayush say next?"
    bestAnswer="Is that about the number itself, or where things stand financially?"
  />
  ```

---

### 4. `PracticeBox`
- **Purpose:** Free-text response box with real-time word counting and self-assessment buttons.
- **When to Use:** For short script exercises and phrasing practice.
- **When NOT to Use:** For full call scenario simulations (use `RoleplayCard`).
- **MDX Example:**
  ```mdx
  <PracticeBox
    prompt="Candidate says 'this feels like too much.' Write your diagnostic question."
    recommendedAnswer="Is that about the number itself, or doubt about value?"
  />
  ```

---

### 5. `LearningJourneyStepper`
- **Purpose:** Renders the 8-step visual training path for the Academy.
- **When to Use:** On Academy home pages (`index.mdx`) and Dashboard.
- **When NOT to Use:** Inside individual lesson articles.

---

### 6. `CallScorecard`
- **Purpose:** Displays call evaluation criteria with pass/fail badges, category grouping, and score bars.
- **When to Use:** In call review and self-coaching lessons.

---

### 7. `DecisionTree`
- **Purpose:** Renders visual branching options with quality ratings (*Best*, *Acceptable*, *Avoid*).
- **When to Use:** When demonstrating multiple possible conversational paths.

---

### 8. `ManagerTip`
- **Purpose:** Expandable priority coaching advice from senior leadership.
- **When to Use:** For critical warnings or strategic insights.

---

### 9. `CoachingNotes`
- **Purpose:** Collapsible deep-dive explanation block.
- **When to Use:** For detailed methodology breakdowns.

---

### 10. `MistakesPanel`
- **Purpose:** Accordion listing common advisor errors and recommended corrections.
- **When to Use:** In lesson wrap-up sections.

---

### 11. `QuickReferencePanel`
- **Purpose:** Sticky cheat-sheet card listing key takeaways.
- **When to Use:** Near the end of major lessons.

---

### 12. `EstimatedTime`
- **Purpose:** Compact badge strip showing reading time and practice time.
- **When to Use:** Near the top of every lesson article.

---

### 13. `ModuleCompletion`
- **Purpose:** 4-dimension completion tracker (*Read*, *Practiced*, *Roleplay*, *Quiz*).
- **When to Use:** At the bottom of every lesson article.

---

## Executive UX Review

### Current UX Weaknesses Identified
1. **Lack of Audio/Voice Practice:** Roleplays rely solely on typed text rather than vocal practice.
2. **Static Knowledge Check Integration:** Knowledge checks are scattered rather than tied directly to module completion badges.
3. **No Peer Review / Manager Submission Flow:** Roleplays are self-evaluated rather than submitted to managers for asynchronous feedback.
4. **Mobile Drawer Dense Padding:** On small mobile screens (<375px), container paddings can consume valuable horizontal real estate.

---

### Top 25 Recommended UX Improvements
1. **Voice Speech-to-Text Input:** Allow advisors to speak roleplay answers out loud using Web Speech API.
2. **Audio Transcript Playback:** Add realistic synthetic voice audio playback for candidate lines in `ConversationViewer`.
3. **Interactive Decision Branching Simulator:** Full multi-turn conversational tree runner.
4. **Streak & Gamification Badges:** Display consecutive daily learning streaks on the top header bar.
5. **Roleplay Self-Recording Video/Audio:** Let advisors record video responses for manager evaluation.
6. **AI Speech Tone Analysis:** Analyze advisor responses for sentiment, pacing, and filler words.
7. **Downloadable Cheat-Sheet PDFs:** One-click export for `QuickReferencePanel` items.
8. **Dark Mode Theme Switcher Quick Key:** Shift+D shortcut to toggle light/dark modes.
9. **Interactive Call Timeline Seek:** Clicking stages in `ConversationTimeline` jumps to that script section.
10. **Bookmark Reading List Folders:** Group saved articles into custom folders.
11. **In-Line Annotation Comments:** Highlight any text line in a lesson to add personal notes.
12. **Manager Review Inbox:** Dedicated dashboard for managers to listen to advisor roleplays.
13. **Live Call Scorecard Calculator:** Interactive slider scorecard for real-time call grading.
14. **Custom Roleplay Creator:** Allow managers to author custom roleplay scenarios directly in UI.
15. **Leaderboard & Cohort Analytics:** Compare team completion rates across cohorts.
16. **Offline PWA Support:** Cache lessons locally for offline reading on mobile.
17. **Global Command Palette Shortcuts:** Cmd+J to jump directly to Next Lesson.
18. **Interactive Quiz Certificates:** Auto-generate downloadable PDF certificates upon module completion.
19. **Focused Reading Mode:** Press 'F' to hide sidebar and collapse chrome for distraction-free reading.
20. **Dynamic Difficulty Recommender:** Suggest foundational vs expert roleplays based on quiz performance.
21. **Candidate Persona Flashcards:** Interactive flip cards for studying the 14 candidate role collections.
22. **Interactive Objection Matrix:** Filtering matrix to search objections by candidate visa type.
23. **Text-to-Speech Lesson Reader:** Listen to lesson articles hands-free while commuting.
24. **Live Search Filtering by Component:** Filter search results specifically by lessons containing Roleplays.
25. **Weekly Activity Heatmap:** GitHub-style contribution grid tracking daily learning activity.

---

### Quick Wins (Immediate Value)
- Add Shift+D shortcut for dark mode toggle.
- Add "Copy Script Text" button to `ConversationViewer` speech bubbles.
- Add print-optimized CSS for quick reference cheat sheets.

---

### Future UX Roadmap
- **Phase 1 (Q3):** Speech-to-Text Voice Roleplay & Audio Playback integration.
- **Phase 2 (Q4):** Manager Coaching Review Portal & Cohort Analytics Dashboard.
- **Phase 3 (Q1 Next Year):** Native iOS / Android Mobile App with offline caching & push coaching.
