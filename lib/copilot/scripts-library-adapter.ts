import { SCRIPTS_REGISTRY, ScriptEntry, getScriptById } from '@/lib/scripts-registry'
import { COPILOT_OBJECTION_CATEGORIES, ObjectionCategoryMetadata } from './objection-categories'

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

/**
 * Converts a raw `ScriptEntry` from `lib/scripts-registry.ts` into a clean
 * read-only `ScriptReference` for Sales Copilot intelligence consumption.
 *
 * THIS ADAPTER DOES NOT COPY SCRIPT CONTENT OR STORE DUPLICATE TABLES.
 * It directly references `SCRIPTS_REGISTRY` entries compiled from MDX files.
 */
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

/**
 * Returns all approved script entries matching a given objection category ID.
 */
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

  // Fallback: search by lessonSlug matching categoryId
  if (references.length === 0) {
    const matchingEntries = SCRIPTS_REGISTRY.filter(
      (s) => s.type === 'objection-response' && s.lessonSlug.includes(categoryId)
    )
    matchingEntries.forEach((entry) => references.push(toScriptReference(entry)))
  }

  return references
}

/**
 * Retrieves a single script reference by exact script ID.
 */
export function getScriptReferenceById(scriptId: string): ScriptReference | null {
  const entry = getScriptById(scriptId)
  return entry ? toScriptReference(entry) : null
}

/**
 * Performs lightweight keyword classification against the 5 category metadata
 * example phrases and resolves the matching category and grounded script reference.
 */
export function findMatchingObjectionCategory(inputText: string): {
  category: ObjectionCategoryMetadata
  scripts: ScriptReference[]
  primaryScript: ScriptReference | null
} {
  const text = inputText.toLowerCase()

  let matchedCategoryKey = 'trust-and-credibility'

  if (text.includes('think') || text.includes('time') || text.includes('decide') || text.includes('call back')) {
    matchedCategoryKey = 'need-time-to-think'
  } else if (text.includes('expensive') || text.includes('cost') || text.includes('price') || text.includes('budget') || text.includes('money')) {
    matchedCategoryKey = 'price-objection'
  } else if (text.includes('parent') || text.includes('spouse') || text.includes('family') || text.includes('husband') || text.includes('wife')) {
    matchedCategoryKey = 'parents-spouse-approval'
  } else if (text.includes('apply') || text.includes('myself') || text.includes('own') || text.includes('linkedin')) {
    matchedCategoryKey = 'already-applying-myself'
  } else if (text.includes('trust') || text.includes('scam') || text.includes('guarantee') || text.includes('proof')) {
    matchedCategoryKey = 'trust-and-credibility'
  }

  const category = COPILOT_OBJECTION_CATEGORIES[matchedCategoryKey]
  const scripts = getScriptsForObjectionCategory(matchedCategoryKey)
  const primaryScript = scripts.length > 0 ? scripts[0] : null

  return {
    category,
    scripts,
    primaryScript,
  }
}
