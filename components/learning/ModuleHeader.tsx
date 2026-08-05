"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { BookmarkToggle } from "@/components/learning/BookmarkToggle"
import { MarkCompleteControl } from "@/components/learning/MarkCompleteControl"
import { Clock, BarChart2, BookOpen } from "lucide-react"

export interface ModuleHeaderProps {
  title: string
  description?: string
  moduleName?: string
  /** Omit when the real reading time isn't known — no fixed fallback is shown, since one would be fabricated for every article. */
  readingTimeMinutes?: number
  /** Omit when the real difficulty isn't classified — no fixed fallback is shown. */
  difficulty?: "Foundational" | "Intermediate" | "Advanced" | "Expert"
  /** Route path of the current article, used as the Bookmark/Progress store key. */
  articleSlug: string
  /**
   * When embedding inside app/docs/[[...slug]]/page.tsx, fumadocs'
   * own `DocsTitle`/`DocsDescription` already render the title, so
   * this is set to `false` there to avoid rendering it twice
   * (Milestone 4C, Priority 7). Defaults to `true` for standalone use.
   */
  showTitle?: boolean
}

export function ModuleHeader({
  title,
  description,
  moduleName = "Sales Academy Knowledge Module",
  readingTimeMinutes,
  difficulty,
  articleSlug,
  showTitle = true,
}: ModuleHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-border mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {moduleName}
          </Badge>
          {difficulty && (
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <BarChart2 className="h-3 w-3" />
              {difficulty}
            </Badge>
          )}
          {typeof readingTimeMinutes === "number" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTimeMinutes} min read
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <BookmarkToggle articleSlug={articleSlug} articleTitle={title} />
          <MarkCompleteControl articleSlug={articleSlug} />
        </div>
      </div>

      {showTitle && (
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
      )}

      {showTitle && description && (
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
