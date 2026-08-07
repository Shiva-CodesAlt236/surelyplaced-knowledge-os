import { SCRIPTS_REGISTRY, ScriptEntry, getScriptById } from '@/lib/scripts-registry'
import { COPILOT_OBJECTION_CATEGORIES, ObjectionCategoryMetadata } from './objection-categories'
import type { CopilotResponseLevelOption, ConfidenceLevel } from './types'

export interface ScriptReference {
  scriptId: string
  title: string
  moduleName: string
  moduleId: string
  difficulty: string | null
  sourcePath: string
  recommendedAnswer: string | null
  managerTip: string | null
  whyThisWorks: string | null
  entry: ScriptEntry
}

function toScriptReference(entry: ScriptEntry): ScriptReference {
  return {
    scriptId: entry.id,
    title: entry.lessonTitle,
    moduleName: entry.moduleName,
    moduleId: entry.moduleId,
    difficulty: entry.difficulty,
    sourcePath: `content/docs/${entry.lessonSlug}.mdx`,
    recommendedAnswer: entry.recommendedAnswer,
    managerTip: entry.managerTip,
    whyThisWorks: entry.whyThisWorks,
    entry,
  }
}

export function getScriptsForObjectionCategory(categoryId: string): ScriptReference[] {
  const categoryMeta = COPILOT_OBJECTION_CATEGORIES[categoryId]
  if (!categoryMeta) return []

  const references: ScriptReference[] = []
  for (const scriptId of categoryMeta.mappingScriptIds) {
    const entry = getScriptById(scriptId)
    if (entry) {
      references.push(toScriptReference(entry))
    }
  }

  if (references.length === 0) {
    const matchingEntries = SCRIPTS_REGISTRY.filter(
      (s) => s.type === 'objection-response' && s.lessonSlug.includes(categoryId)
    )
    matchingEntries.forEach((entry) => references.push(toScriptReference(entry)))
  }

  return references
}

export function getScriptReferenceById(scriptId: string): ScriptReference | null {
  const entry = getScriptById(scriptId)
  return entry ? toScriptReference(entry) : null
}

/**
 * Builds Response Level options (Level 1 Foundational & Level 2 Experienced)
 * directly from available `SCRIPTS_REGISTRY` entries.
 */
export function buildResponseLevelOptions(scripts: ScriptReference[]): CopilotResponseLevelOption[] {
  if (scripts.length === 0) return []

  const level1Script = scripts.find((s) => s.difficulty === 'Foundational') || scripts[0]
  const level2Script = scripts.find((s) => s.difficulty === 'Intermediate' || s.difficulty === 'Advanced') || scripts[1] || scripts[0]

  const options: CopilotResponseLevelOption[] = [
    {
      level: 1,
      levelLabel: 'Level 1 — Foundational Advisor',
      response:
        level1Script.recommendedAnswer ||
        level1Script.entry.prompt ||
        "I completely respect that you want to evaluate this carefully before taking the next step.",
      difficulty: level1Script.difficulty || 'Foundational',
      matchedScriptId: level1Script.scriptId,
    },
  ]

  if (level2Script && level2Script.scriptId !== level1Script.scriptId) {
    options.push({
      level: 2,
      levelLabel: 'Level 2 — Experienced Advisor',
      response:
        level2Script.recommendedAnswer ||
        level2Script.entry.prompt ||
        "Let's look at what's driving your hesitation directly so we can make sure every concern is addressed.",
      difficulty: level2Script.difficulty || 'Intermediate',
      matchedScriptId: level2Script.scriptId,
    })
  }

  return options
}

/**
 * Performs keyword classification & confidence scoring against the 5 category metadata definitions.
 */
export function findMatchingObjectionCategory(inputText: string): {
  category: ObjectionCategoryMetadata | null
  scripts: ScriptReference[]
  primaryScript: ScriptReference | null
  confidence: ConfidenceLevel
  isRefusal: boolean
  refusalReason?: string
} {
  const text = inputText.toLowerCase().trim()

  if (!text || text.length < 3) {
    return {
      category: null,
      scripts: [],
      primaryScript: null,
      confidence: 'low',
      isRefusal: true,
      refusalReason: 'Input statement is too short to classify against approved sales scripts.',
    }
  }

  let matchedCategoryKey: string | null = null
  let confidence: ConfidenceLevel = 'high'

  if (text.includes('think') || text.includes('time') || text.includes('decide') || text.includes('call back')) {
    matchedCategoryKey = 'need-time-to-think'
    confidence = 'high'
  } else if (text.includes('expensive') || text.includes('cost') || text.includes('price') || text.includes('budget') || text.includes('money')) {
    matchedCategoryKey = 'price-objection'
    confidence = 'high'
  } else if (text.includes('parent') || text.includes('spouse') || text.includes('family') || text.includes('husband') || text.includes('wife')) {
    matchedCategoryKey = 'parents-spouse-approval'
    confidence = 'high'
  } else if (text.includes('apply') || text.includes('myself') || text.includes('own') || text.includes('linkedin')) {
    matchedCategoryKey = 'already-applying-myself'
    confidence = 'medium'
  } else if (
    text.includes('trust') ||
    text.includes('scam') ||
    text.includes('guarantee') ||
    text.includes('proof') ||
    text.includes('real') ||
    text.includes('legit') ||
    text.includes('company') ||
    text.includes('fake') ||
    text.includes('reviews') ||
    text.includes('reputation')
  ) {
    matchedCategoryKey = 'trust-and-credibility'
    confidence = 'high'
  } else {
    // Unclassified / Low Confidence Refusal
    return {
      category: null,
      scripts: [],
      primaryScript: null,
      confidence: 'low',
      isRefusal: true,
      refusalReason:
        'I am unable to confidently classify this statement against approved Sales Academy objection categories. Please rephrase what the candidate expressed or select a module manually in the Scripts Library.',
    }
  }

  const category = COPILOT_OBJECTION_CATEGORIES[matchedCategoryKey]
  const scripts = getScriptsForObjectionCategory(matchedCategoryKey)
  const primaryScript = scripts.length > 0 ? scripts[0] : null

  return {
    category,
    scripts,
    primaryScript,
    confidence,
    isRefusal: false,
  }
}
