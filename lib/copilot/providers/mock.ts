import type { CopilotAIProvider } from './types'
import type { CopilotResponse } from '../types'

interface TaxonomyItem {
  objectionId: string
  title: string
  category: string
  keywords: string[]
  template: string
  whyThisWorks: string
  nextQuestion: string
  avoidSaying: string
}

const MOCK_TAXONOMY: TaxonomyItem[] = [
  {
    objectionId: 'OBJ_THINK_ABOUT_IT',
    title: 'Need Time To Think / Delayed Decision',
    category: 'Timing / Decision Delay',
    keywords: ['think about it', 'think it over', 'decide tomorrow', 'sleep on it', 'need time', 'not ready yet', 'think about this', 'let you know later', 'hold off'],
    template: 'I completely understand wanting to take time to make the right decision for your career transition. To make sure you have everything you need to evaluate this, what specific questions or details can I clarify for you right now before we finish our call?',
    whyThisWorks: 'Reframes a passive delay into an active discovery conversation. Respects the candidate\'s process while uncovering hidden doubts or unspoken objections before ending the call.',
    nextQuestion: 'What specific information or reassurance do you need between now and tomorrow to make a confident decision?',
    avoidSaying: 'Avoid saying: "What is there to think about?" or pushing aggressively for immediate payment on the spot.'
  },
  {
    objectionId: 'OBJ_TOO_EXPENSIVE',
    title: 'Price / Budget Concern',
    category: 'Price / Investment',
    keywords: ['too expensive', "can't afford", 'costs too much', 'high price', 'no money', 'budget issue', 'price is high', 'out of my budget', 'expensive', 'cost is high'],
    template: 'I hear you, and investing in your career transition is a significant decision. When candidates evaluate our program, they compare the enrollment cost to the cost of months of unemployment or missed interview opportunities. Let\'s look at how our payment structure aligns with your current cash flow.',
    whyThisWorks: 'Shifts focus from immediate expense to long-term ROI and the high opportunity cost of delayed placement. Re-anchors value on interview velocity.',
    nextQuestion: 'If we could structure the investment to fit your current monthly cash flow, would you be ready to move forward with the placement push?',
    avoidSaying: 'Avoid making unauthorized discounts, altering fee structures, or guaranteeing specific salary figures.'
  },
  {
    objectionId: 'OBJ_JOB_GUARANTEE',
    title: 'Trust / Placement Guarantee Concern',
    category: 'Trust / Guarantee',
    keywords: ['guarantee a job', 'guarantee placement', 'job guarantee', "what if i don't get a job", 'is it guaranteed', 'promise a job', 'can you promise', 'guarantee', 'how do i know this works'],
    template: 'That is a crucial question. While no organization can legally guarantee hiring decisions made by third-party employers, our team guarantees dedicated 1-on-1 career support, resume optimization, and aggressive interview scheduling until you land an offer.',
    whyThisWorks: 'Builds credibility by being honest about third-party hiring boundaries while offering 100% commitment to the advisor process and placement support resources.',
    nextQuestion: 'Besides the placement process itself, what is the biggest milestone you want to achieve in your first 90 days?',
    avoidSaying: 'Never guarantee job placement, specific employer offers, or income figures. Adhere strictly to compliant admissions guidelines.'
  },
  {
    objectionId: 'OBJ_TALK_TO_PARENTS',
    title: 'Family / Spouse / Advisor Consultation',
    category: 'Family / Decision Partner',
    keywords: ['talk to my parents', 'discuss with my spouse', 'ask my husband', 'ask my wife', 'consult my family', 'talk to my family', 'parents approval', 'discuss with parents', 'talk to my dad', 'talk to my mom'],
    template: 'That makes total sense. Having your family aligned is important for your support system during your job search. Would it be helpful if I shared an overview summary with key program highlights so you can review it together with them?',
    whyThisWorks: 'Validates the decision partner\'s role and equips the candidate with clear facts to advocate for the program at home.',
    nextQuestion: 'What is the main question or concern you think your family will have about your career transition?',
    avoidSaying: 'Avoid dismissing the family member\'s role or pressuring the student to bypass their family.'
  },
  {
    objectionId: 'OBJ_SELF_STUDY',
    title: 'DIY / Self-Study Alternative',
    category: 'DIY / Alternative Option',
    keywords: ['apply on my own', 'do it myself', 'free resources', 'self study', "don't need help", 'youtube tutorials', 'apply directly', 'on my own', 'myself'],
    template: 'You definitely can apply independently, and many candidates try that first. The challenge is navigating applicant tracking systems (ATS) and interview loops alone, which often takes 6 to 12 months. Our program streamlines that timeline to get you hired significantly faster.',
    whyThisWorks: 'Respects self-reliance while contrasting the slow trial-and-error approach against a structured, accelerated recruitment pipeline.',
    nextQuestion: 'How many weeks or months have you been applying on your own so far, and how many hiring manager interviews have you landed?',
    avoidSaying: 'Avoid putting down the candidate\'s self-study efforts or implying they cannot succeed on their own.'
  }
]

const FALLBACK_MATCH: TaxonomyItem = {
  objectionId: 'OBJ_GENERAL_FALLBACK',
  title: 'General Objection / Needs Clarification',
  category: 'General Discovery',
  keywords: [],
  template: "I appreciate you sharing that concern with me. Every candidate's situation is unique, and we want to ensure all your questions are answered clearly so you feel confident in your next steps.",
  whyThisWorks: "Acknowledges the candidate's sentiment, maintains rapport, and opens the door for deeper diagnostic discovery.",
  nextQuestion: 'Could you tell me a bit more about what would make this the right time and program for your career goals?',
  avoidSaying: 'Avoid guessing or making unapproved claims. Focus on active listening and clarifying candidate needs.'
}

export class MockCopilotProvider implements CopilotAIProvider {
  async analyzeObjection(input: string, candidateName?: string): Promise<CopilotResponse> {
    const cleanInput = input.trim()
    const lowerInput = cleanInput.toLowerCase()

    let bestMatch: TaxonomyItem | null = null
    let bestScore = 0

    MOCK_TAXONOMY.forEach((item) => {
      let score = 0
      item.keywords.forEach((kw) => {
        if (lowerInput.includes(kw)) {
          score += kw.length > 8 ? 3 : 2
        }
      })
      if (score > bestScore) {
        bestScore = score
        bestMatch = item
      }
    })

    const hasMatch = bestMatch !== null && bestScore > 0
    const matched = hasMatch ? bestMatch : FALLBACK_MATCH

    let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Low'
    let confidenceScore = 40

    if (hasMatch) {
      if (bestScore >= 5) {
        confidenceLevel = 'High'
        confidenceScore = 92
      } else if (bestScore >= 2) {
        confidenceLevel = 'Medium'
        confidenceScore = 74
      }
    }

    let finalResponse = matched.template
    if (candidateName) {
      finalResponse = `Hi ${candidateName}, ${finalResponse}`
    }

    // Simulate async network delay
    await new Promise((resolve) => setTimeout(resolve, 250))

    return {
      exchangeId: `exch_mock_${Date.now()}`,
      objectionId: matched.objectionId,
      detectedObjection: matched.title,
      category: matched.category,
      confidenceLevel,
      confidenceScore,
      recommendedResponse: finalResponse,
      whyThisWorks: matched.whyThisWorks,
      nextQuestion: matched.nextQuestion,
      avoidSaying: matched.avoidSaying,
      isLowConfidence: confidenceLevel === 'Low',
      hasMatch,
    }
  }
}

export const mockProvider = new MockCopilotProvider()
