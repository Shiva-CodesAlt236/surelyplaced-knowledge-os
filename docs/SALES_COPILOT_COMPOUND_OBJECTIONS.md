# Sales Copilot — Compound Objection Strategy & Handling Design

**Status:** Design Architecture Specification (Phase 3 Prep)  
**Author:** AI Product & Sales Enablement Architect  
**Scope:** Specifies how Sales Copilot identifies, ranks, and surfaces compound candidate objections (e.g. "It's expensive AND I need to ask my wife").

---

## 1. Problem Definition

In real sales calls, prospects rarely state objections in single isolated categories. Compound objections combine two distinct concerns into a single statement:

- **Example A**: *"It's too expensive and I need to ask my wife first."* (`Price Concern` + `Spouse Approval`)
- **Example B**: *"How do I know this is real? Plus I'm already applying on LinkedIn."* (`Trust Concern` + `Applying Myself`)

If a system picks one category and ignores the second, the advisor receives incomplete coaching.

---

## 2. Selection & Ranking Strategy

When a compound input is received, the reasoning pipeline extracts all candidate categories scoring above minimum threshold ($S > 0.40$) and ranks them:

### A. Primary Objection Selection (Dominant Driver)
1. **Severity Weighting**: Categories carry intrinsic severity weights (`price` & `trust` > `timing` & `spouse approval` > `applying myself`).
2. **Order of Appearance & Framing**: The first stated objection or the one accompanied by explicit financial/trust hesitation is selected as **Primary**.

### B. Secondary Objection Retention
- Any second category scoring within $0.30$ of the primary score is retained as **Secondary Objection**.

---

## 3. UI Presentation & Exposure in Phase 3

In the Copilot UI (`CopilotResponseCard.tsx`):

1. **Primary Response**: The main card displays the approved response for the **Primary Objection** (e.g., `Price Concern`).
2. **Secondary Objection Chip**: A secondary banner appears directly below:
   > 💡 **Secondary Concern Detected**: Candidate also expressed *Parent / Spouse Approval*.  
   > *[Click to view Spouse Approval bridge response]*
3. **Bridge Coaching Tip**: The "Why This Works" section provides a combined coaching line bridging both concerns:
   > *"Address the ROI value first with the candidate, then provide our outcome report so they can present clear numbers to their spouse."*
