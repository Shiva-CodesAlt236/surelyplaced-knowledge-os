import { SCRIPTS_REGISTRY, type ScriptEntry } from '@/lib/scripts-registry'
import { getCategoryById } from './objection-categories'

export interface ScriptAdapterResult {
  script: ScriptEntry | null
  sourceScriptId: string | null
  level: 'Level 1' | 'Level 2'
}

/**
 * Knowledge OS Scripts Library Adapter
 *
 * Single point of retrieval into `lib/scripts-registry.ts`.
 * NEVER copies or duplicates script text — returns references directly to
 * entries auto-generated from lesson .mdx files.
 */
export function getScriptForObjection(
  objectionCategoryId: string,
  preferredDifficulty: 'Foundational' | 'Intermediate' = 'Foundational'
): ScriptAdapterResult {
  const category = getCategoryById(objectionCategoryId)
  if (!category) {
    return { script: null, sourceScriptId: null, level: 'Level 1' }
  }

  // 1. Search SCRIPTS_REGISTRY by category tags & keywords
  const matches = SCRIPTS_REGISTRY.filter((entry) => {
    // Must be objection-response or roleplay/practice type
    if (entry.type === 'quickref') return false

    // Tag matching
    const hasTagMatch = entry.tags.some((t) =>
      category.scriptTags.some((ct) => t.toLowerCase().includes(ct.toLowerCase()))
    )

    // Slug matching
    const hasSlugMatch = category.defaultLessonSlug
      ? entry.lessonSlug.toLowerCase().includes(category.defaultLessonSlug.toLowerCase())
      : false

    return hasTagMatch || hasSlugMatch
  })

  // 2. Filter by requested difficulty level (Level 1 = Foundational, Level 2 = Intermediate)
  const filtered = matches.filter((m) => {
    if (preferredDifficulty === 'Intermediate') {
      return m.difficulty === 'Intermediate' || m.difficulty === 'Foundational'
    }
    return m.difficulty === 'Foundational' || !m.difficulty
  })

  const chosen = filtered.length > 0 ? filtered[0] : matches.length > 0 ? matches[0] : null

  return {
    script: chosen,
    sourceScriptId: chosen ? chosen.id : null,
    level: preferredDifficulty === 'Intermediate' ? 'Level 2' : 'Level 1',
  }
}

/**
 * Returns count of available objection script entries in registry
 */
export function getObjectionScriptCount(): number {
  return SCRIPTS_REGISTRY.filter(
    (e) => e.type === 'objection-response' || e.moduleId === 'objections'
  ).length
}
