import type { ICopilotAIProvider } from './types'
import type { CopilotResponse, OutcomePayload } from '../types'

/**
 * Mock Copilot AI Provider
 *
 * Implements realistic keyword-matching classification and synthesizes
 * approved response fields for sales objections during Phase 1 testing.
 */
export class MockCopilotProvider implements ICopilotAIProvider {
  async analyzeObjection(input: string): Promise<CopilotResponse> {
    const text = input.toLowerCase()

    if (text.includes('think') || text.includes('time') || text.includes('decide') || text.includes('call back')) {
      return {
        exchangeId: `ex-${Date.now()}`,
        objectionId: 'need-time-to-think',
        objectionTitle: 'Need Time To Think',
        confidence: 'high',
        recommendedResponse:
          "I completely respect that you want to take time to make the right decision. To help you evaluate clearly, what specific part of the program would you like to reflect on — the curriculum depth, the placement support structure, or how it fits your daily routine?",
        whyItWorks:
          "Acknowledges the candidate's process respectfully while immediately isolating whether 'thinking about it' is genuine reflection or a mask for hidden price or trust concerns.",
        nextQuestion:
          "When you think about taking this step, what is the single biggest question still on your mind?",
        avoidSaying: [
          "Don't push artificial urgency or pretend spots are closing today.",
          "Don't ask 'Why do you need time?' in a confrontational tone.",
          "Don't drop discount promises to force an instant decision.",
        ],
        matchedScriptId: 'objections/need-time-to-think#roleplay-1',
      }
    }

    if (text.includes('expensive') || text.includes('cost') || text.includes('price') || text.includes('budget') || text.includes('money')) {
      return {
        exchangeId: `ex-${Date.now()}`,
        objectionId: 'price-objection',
        objectionTitle: 'Price & Investment Concern',
        confidence: 'high',
        recommendedResponse:
          "I understand that investment level is a major factor. Let's look at the financial return: our graduates typically see a $25k–$40k salary increase within 6 months. Compared to staying in an unaligned role, the return on this career pivot far outweighs the initial program cost.",
        whyItWorks:
          "Reframes program fee from a sunk expense into an asset-backed career investment with measurable ROI timelines.",
        nextQuestion:
          "If budget wasn't a constraint, do you feel this is the exact skill transformation you need right now?",
        avoidSaying: [
          "Don't apologize for our pricing structure.",
          "Don't offer unapproved discounts or payment plan concessions without manager approval.",
          "Don't compare us to low-cost video tutorial courses.",
        ],
        matchedScriptId: 'objections/price-objection#roleplay-1',
      }
    }

    if (text.includes('parent') || text.includes('spouse') || text.includes('family') || text.includes('husband') || text.includes('wife')) {
      return {
        exchangeId: `ex-${Date.now()}`,
        objectionId: 'parents-spouse-approval',
        objectionTitle: 'Family & Advisor Approval Needed',
        confidence: 'high',
        recommendedResponse:
          "That makes total sense — key career decisions impact your whole family. I'd love to share our placement breakdown and candidate outcome report so you can review the exact data together with them.",
        whyItWorks:
          "Validates family involvement and arms the candidate with verified, objective documentation to present confidently to decision-makers.",
        nextQuestion:
          "What is the main outcome or reassurance your family will be looking for when you discuss this?",
        avoidSaying: [
          "Don't tell the student 'You're an adult, it's your decision.'",
          "Don't dismiss their family's concerns.",
        ],
        matchedScriptId: 'objections/parents-spouse-approval#roleplay-1',
      }
    }

    if (text.includes('apply') || text.includes('myself') || text.includes('own') || text.includes('linkedin')) {
      return {
        exchangeId: `ex-${Date.now()}`,
        objectionId: 'already-applying-myself',
        objectionTitle: 'Applying On My Own',
        confidence: 'medium',
        recommendedResponse:
          "Applying directly is great practice, but cold applications through job portals yield under 3% interview response rates for competitive tech roles. Our career pipeline connects you directly with hiring partners and internal referrals.",
        whyItWorks:
          "Contrasts low-yield direct applicant portals against structured candidate intelligence and direct hiring partner referrals.",
        nextQuestion:
          "Out of your recent applications, how many hiring manager interviews have you secured so far?",
        avoidSaying: [
          "Don't insult their resume or application strategy.",
          "Don't claim direct applications never work.",
        ],
        matchedScriptId: 'objections/already-applying-myself#roleplay-1',
      }
    }

    // Default Fallback
    return {
      exchangeId: `ex-${Date.now()}`,
      objectionId: 'trust-and-credibility',
      objectionTitle: 'Trust & Program Clarity',
      confidence: 'medium',
      recommendedResponse:
        "I understand you want complete clarity before committing. Our program is built on transparent, candidate-first principles with verified placement tracking and hands-on skill development.",
      whyItWorks:
        "Establishes credibility by placing candidate outcomes and verified program structure first.",
      nextQuestion:
        "What specific detail about our mentorship or job-search process would be most helpful to review?",
      avoidSaying: [
        "Don't make unverified placement guarantees.",
        "Don't rush the candidate past their doubts.",
      ],
      matchedScriptId: 'objections/trust-and-credibility#roleplay-1',
    }
  }

  async recordOutcome(payload: OutcomePayload): Promise<{ success: boolean }> {
    console.log('[MockCopilotProvider] Outcome recorded:', payload)
    return { success: true }
  }
}
