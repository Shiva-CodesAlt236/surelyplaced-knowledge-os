"use client"

import React from "react"
import { ModuleHeader } from "@/components/learning/ModuleHeader"
import { NotesPanel } from "@/components/learning/NotesPanel"

export interface LessonViewerProps {
  title: string
  description?: string
  moduleName?: string
  readingTimeMinutes?: number
  difficulty?: "Foundational" | "Intermediate" | "Advanced" | "Expert"
  /** Route path of the current article, used as the Bookmark/Progress/Notes store key. */
  articleSlug: string
  /** Passed through to ModuleHeader — `false` when the host page (e.g. fumadocs' DocsTitle) already renders the title. */
  showTitle?: boolean
  children: React.ReactNode
}

/**
 * Extends fumadocs' own `DocsPage`/`DocsBody` (app/docs/[[...slug]]/page.tsx)
 * with the Academy-specific chrome fumadocs doesn't provide — bookmark
 * and completion controls, and a personal notes panel — rather than
 * duplicating fumadocs' own MDX rendering or typography. `children` is
 * expected to already be `DocsBody`'s rendered output, so this
 * component does not wrap it in a second `prose` layer; fumadocs-ui's
 * own CSS already styles that content (Milestone 4C, Priority 7).
 */
export function LessonViewer({
  title,
  description,
  moduleName,
  readingTimeMinutes,
  difficulty,
  articleSlug,
  showTitle = true,
  children,
}: LessonViewerProps) {
  return (
    <>
      <ModuleHeader
        title={title}
        description={description}
        moduleName={moduleName}
        readingTimeMinutes={readingTimeMinutes}
        difficulty={difficulty}
        articleSlug={articleSlug}
        showTitle={showTitle}
      />

      {children}

      <div className="mt-8 pt-6 border-t border-border">
        <NotesPanel articleSlug={articleSlug} />
      </div>
    </>
  )
}
