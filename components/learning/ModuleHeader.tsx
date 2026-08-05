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
  readingTimeMinutes?: number
  difficulty?: "Foundational" | "Intermediate" | "Advanced" | "Expert"
  prerequisites?: string[]
  isCompleted?: boolean
  isBookmarked?: boolean
  articleSlug?: string
}

export function ModuleHeader({
  title,
  description,
  moduleName = "Sales Academy Knowledge Module",
  readingTimeMinutes = 8,
  difficulty = "Intermediate",
  isCompleted = false,
  isBookmarked = false,
  articleSlug,
}: ModuleHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-border mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {moduleName}
          </Badge>
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <BarChart2 className="h-3 w-3" />
            {difficulty}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground ml-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTimeMinutes} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BookmarkToggle initialBookmarked={isBookmarked} articleSlug={articleSlug} articleTitle={title} />
          <MarkCompleteControl initialCompleted={isCompleted} articleSlug={articleSlug} />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>

      {description && (
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
