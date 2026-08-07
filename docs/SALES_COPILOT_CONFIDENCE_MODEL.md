# Sales Copilot — Confidence Calculation Model Design

**Status:** Design Architecture Specification (Phase 3 Prep)  
**Author:** AI Reasoning & Safety Architect  
**Scope:** Defines how the Phase 3 reasoning pipeline calculates, reconciles, and gates classification confidence scores.

---

## 1. Overview

In live sales conversations, an advisor relies on Sales Copilot to accurately diagnose candidate objections. Presenting a false-confident classification for a misidentified objection can lead an advisor to deliver the wrong sales strategy.

To ensure safety and reliability, confidence is calculated using a **hybrid multi-signal reconciliation model** rather than relying solely on LLM self-reported confidence.

---

## 2. Input Signals

The Phase 3 Confidence Engine evaluates four distinct input signals:

1. **Provider Self-Reported Confidence ($S_p \in [0.0, 1.0]$)**:
   - Self-reported confidence score returned by the classification LLM prompt.
2. **Taxonomy Embedding / Vector Similarity ($S_v \in [0.0, 1.0]$)**:
   - Cosine similarity between the student input statement vector and the canonical `examplePhrases` vector set of candidate categories.
3. **Keyword & Exact Phrase Overlap ($S_k \in [0.0, 1.0]$)**:
   - Exact substring and stemmed keyword overlap ratio matching known high-signal triggers (e.g., "expensive", "budget", "spouse", "scam").
4. **Ambiguity / Multi-Match Margin ($M_a \in [0.0, 1.0]$)**:
   - Difference between the top-ranked category score and the second-ranked category score:
     $$M_a = S_{top1} - S_{top2}$$
   - A small margin ($M_a < 0.15$) indicates a compound or ambiguous objection requiring caution or clarification.

---

## 3. Confidence Calculation & Reconciliation Formula

The final reconciled confidence score $C_{final}$ is derived conservatively:

$$C_{final} = \min(S_p, S_v, S_k) \times (0.5 + 0.5 \times M_a)$$

### Conservative Threshold Gating Rules:
- **High Confidence ($C_{final} \ge 0.75$)**: Single clear match. Proceed immediately to Step 4 (Retrieve Approved Scripts) and present Level 1 & Level 2 response options.
- **Medium Confidence ($0.50 \le C_{final} < 0.75$)**: Probable match. Present recommended response with explicit confidence indicator and option to switch categories if needed.
- **Low Confidence / Deferral ($C_{final} < 0.50$)**: Trigger **Confidence Refusal Path**. Present an honest status notice asking the advisor to clarify or link directly to the manual `Scripts Library`.

---

## 4. Safety & Failure Behavior

When $C_{final} < 0.50$:
1. The pipeline halts execution before generating ungrounded advice.
2. The UI renders the Refusal Banner with an amber alert icon:
   > *"I am unable to confidently classify this statement against approved Sales Academy objection categories. Please rephrase or select a module manually in the Scripts Library."*
3. The exchange is logged in telemetry with `confidence: 'low'` to identify taxonomy coverage gaps.
