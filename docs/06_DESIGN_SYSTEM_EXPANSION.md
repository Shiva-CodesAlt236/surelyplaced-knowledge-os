# SurelyPlaced Sales Academy — Design System Expansion (06_DESIGN_SYSTEM_EXPANSION.md)

**Role:** Chief Product Designer & Staff UX Engineer  
**Status:** Component Tokens, Motion Standards & Top 50 UX Improvements  
**Scope:** Complete Component Architecture Extension Specs  

---

## 1. Component Token Extensions

### Elevation & Layering
- **Level 0 (Flat):** `bg-fd-background` — Base document canvas.
- **Level 1 (Surface Cards):** `bg-fd-card border border-fd-border shadow-sm` — Main content widgets.
- **Level 2 (Elevated Panels):** `bg-fd-card border border-fd-border shadow-md` — Stepper card & featured practice.
- **Level 3 (Modal / Overlays):** `bg-fd-card border border-fd-border shadow-xl backdrop-blur-md` — Search overlay & AI panel.

### Iconography Taxonomy
- **Navigation & Journey:** `Compass`, `PhoneCall`, `MessageSquare`, `ShieldCheck`, `DollarSign`, `GraduationCap`, `BookOpen`, `Award`.
- **Feedback & Metrics:** `CheckCircle2`, `XCircle`, `Minus`, `TrendingUp`, `TrendingDown`, `AlertTriangle`, `Star`, `Trophy`.
- **Channel Branding:** `Phone` (Phone Call), `PhoneCall` (Cold Call), `Linkedin` (LinkedIn Thread), `PhoneOutgoing` (Outbound), `PhoneIncoming` (Inbound).

---

## 2. Motion & Micro-Interaction Principles

1. **Keystroke Responsiveness:** All click and keystroke feedback renders within `<16ms` (60fps target).
2. **Spring Physics for Toggles:** Collapsible accordions use `transition-all duration-200 ease-in-out`.
3. **Typing Indicator Animation:** `@keyframes cv-bounce` operates at 1.2s intervals across 3 dots with staggered delays (`0s`, `0.15s`, `0.3s`).

---

## 3. Top 50 UX Improvements Ranked by Impact

| Rank | Impact Category | Feature / UX Improvement Name | Description & Strategic Value |
|---|---|---|---|
| 1 | **High Impact** | Speech-to-Text Voice Roleplay Practice | Allow advisors to speak responses out loud using Web Speech API |
| 2 | **High Impact** | Realistic Audio Transcript Playback | Add synthetic voice playback for candidate lines in `ConversationViewer` |
| 3 | **High Impact** | Multi-Turn Branching Scenario Simulator | Interactive decision tree runner supporting multi-turn dialogues |
| 4 | **High Impact** | Daily Learning Streak & Gamification Header | Display consecutive daily practice streaks on the top navigation bar |
| 5 | **High Impact** | Video/Audio Self-Recording for Manager Review | Enable advisors to submit recorded audio roleplays for manager grading |
| 6 | **High Impact** | AI Speech Filler-Word & Pacing Analysis | Analyze advisor spoken audio for pacing (WPM) and filler words |
| 7 | **High Impact** | One-Click Downloadable PDF Cheat Sheets | Export `QuickReferencePanel` items as print-ready PDF cheat sheets |
| 8 | **High Impact** | Instant Dark Mode Keyboard Shortcut (`Shift+D`) | Fast toggle between light and dark themes without clicking settings |
| 9 | **High Impact** | Interactive Call Timeline Stage Seeking | Clicking a stage in `ConversationTimeline` scrolls to that script section |
| 10 | **High Impact** | Custom Bookmark Reading List Folders | Organize saved articles into custom folders (*Closing*, *Objections*) |
| 11 | **High Impact** | In-Line Text Annotation & Personal Notes | Highlight any line of lesson text to attach personal advisor notes |
| 12 | **High Impact** | Manager Coaching Review Inbox Portal | Dedicated dashboard for sales managers to grade advisor roleplays |
| 13 | **High Impact** | Interactive Live Call Scorecard Calculator | Interactive slider scorecard for real-time call evaluation |
| 14 | **High Impact** | Custom Roleplay Creator Studio for Managers | Allow managers to author custom roleplay scenarios directly in UI |
| 15 | **High Impact** | Team Leaderboard & Cohort Progress Analytics | Compare completion rates and quiz scores across sales cohorts |
| 16 | **High Impact** | Offline PWA Mobile Caching Support | Cache lesson modules locally for offline reading on mobile devices |
| 17 | **High Impact** | Global Command Palette Shortcuts (`Cmd+J`) | Keyboard shortcut to jump directly to the Next Lesson in journey |
| 18 | **High Impact** | Automated Certificate PDF Generator | Generate downloadable PDF certificates upon completing the 8-step journey |
| 19 | **High Impact** | Distraction-Free Focus Reading Mode (`F`) | Hide sidebar and navigation chrome for immersive reading |
| 20 | **High Impact** | Adaptive Difficulty Recommender Engine | Suggest foundational vs expert roleplays based on quiz scores |
| 21 | **High Impact** | Candidate Persona Interactive Flashcards | Flip-cards for studying the 14 candidate role collections |
| 22 | **High Impact** | Candidate Visa Type Objection Matrix | Filter objections by visa type (F1 OPT, H-1B, L1) |
| 23 | **High Impact** | Text-to-Speech Hands-Free Lesson Reader | Listen to lesson articles hands-free while commuting |
| 24 | **High Impact** | Component-Filtered Search Gateway | Filter search results specifically by lessons containing Roleplays |
| 25 | **High Impact** | GitHub-Style Weekly Contribution Heatmap | Visual activity grid tracking daily learning engagement |
| 26 | **Medium Impact** | Interactive Pricing ROI Calculator Widget | Embeddable ROI calculator for candidate tuition investment |
| 27 | **Medium Impact** | Script Copy Button for Speech Bubbles | One-click copy for `ConversationViewer` speech text |
| 28 | **Medium Impact** | Print-Optimized Stylesheet for Lessons | Clean print styles for offline reference manuals |
| 29 | **Medium Impact** | Social Shareable Badge Credentials | Share completed Sales Academy badges on LinkedIn |
| 30 | **Medium Impact** | Dynamic Reading Speed Time Adjuster | Customize estimated reading times based on advisor WPM |
| 31 | **Medium Impact** | Interactive Quiz Explainer Overlay | Detailed breakdown popovers for incorrect quiz answers |
| 32 | **Medium Impact** | Candidate Visa Countdown Calculator | Interactive tool for calculating OPT STEM extension timelines |
| 33 | **Medium Impact** | Contextual Search Snippet Highlights | Highlight exact matching query words in search result modal |
| 34 | **Medium Impact** | Auto-Save Draft Progress in Practice Boxes | Preserve partial text responses in `PracticeBox` across reloads |
| 35 | **Medium Impact** | Interactive Glossary Hover Tooltips | Hover over sales terms (*LTV*, *CAC*, *Rapport*) for instant popover definitions |
| 36 | **Medium Impact** | Roleplay Hint Reveal Counter Badge | Display remaining unrevealed hints count on roleplay buttons |
| 37 | **Medium Impact** | Manager Tip Priority Color Accents | Color-coded border pulses for `critical` priority manager tips |
| 38 | **Medium Impact** | Floating Table of Contents Active Highlight | Highlight active section header as user scrolls through long lessons |
| 39 | **Medium Impact** | Dual-Pane Code & Script Comparison | Side-by-side script comparison view for A/B testing approaches |
| 40 | **Medium Impact** | Audio Waveform Visualizer for Phone Mode | Animated SVG waveform for `ConversationViewer` phone mode |
| 41 | **Low Impact** | Custom Theme Color Accent Picker | Select custom primary accent colors in user settings |
| 42 | **Low Impact** | Interactive Sound Effects on Step Complete | Optional subtle audio chime upon completing a learning step |
| 43 | **Low Impact** | Compact Sidebar Density Toggle | Toggle between comfortable and compact sidebar spacing |
| 44 | **Low Impact** | Export Personal Notes to Markdown/Notion | One-click export for all personal notes to Notion or Markdown |
| 45 | **Low Impact** | Avatar Customization for Roleplay Personas | Select custom avatar initials or colors for candidate profiles |
| 46 | **Low Impact** | Recent Search History Clear Button | One-click clear for recent Orama search queries |
| 47 | **Low Impact** | Keyboard Navigation Visual Legend Overlay | Show keyboard shortcut legend popup by pressing `?` |
| 48 | **Low Impact** | Sticky Header Collapse on Scroll | Auto-hide header bar on downward scroll for maximum reading space |
| 49 | **Low Impact** | Multi-Language Interface Subtitle Support | Support multi-language captions for global advisor cohorts |
| 50 | **Low Impact** | Weekly Progress Digest Email Template | Automated email summary of weekly lessons completed |
