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
  articleSlug?: string
  children: React.ReactNode
}

export function LessonViewer({
  title,
  description,
  moduleName,
  readingTimeMinutes,
  difficulty,
  articleSlug,
  children,
}: LessonViewerProps) {
  return (
    <article className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <ModuleHeader
        title={title}
        description={description}
        moduleName={moduleName}
        readingTimeMinutes={readingTimeMinutes}
        difficulty={difficulty}
        articleSlug={articleSlug}
      />

      <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
        {children}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <NotesPanel articleSlug={articleSlug} />
      </div>
    </article>
  )
}
