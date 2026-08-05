"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { BookmarkToggle } from "@/components/learning/BookmarkToggle"
import { MarkCompleteControl } from "@/components/learning/MarkCompleteControl"
import { Clock, BarChart2, BookOpen, Compass, CheckCircle2, ArrowRight, ShieldCheck, Target } from "lucide-react"

export interface ModuleHeaderProps {
  title: string
  description?: string
  moduleName?: string
  /** Omit when the real reading time isn't known. */
  readingTimeMinutes?: number
  /** Omit when the real difficulty isn't classified. */
  difficulty?: "Foundational" | "Intermediate" | "Advanced" | "Expert"
  /** Route path of the current article, used as the Bookmark/Progress store key. */
  articleSlug: string
  /**
   * When embedding inside app/docs/[[...slug]]/page.tsx, fumadocs'
   * own `DocsTitle`/`DocsDescription` already render the title, so
   * this is set to `false` there to avoid rendering it twice.
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
      {/* Top Toolbar */}
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

      {/* Lesson Learning Frame: Why this matters | When to use | What you will learn | What happens next */}
      <div className="rounded-xl border border-fd-border bg-fd-secondary/30 p-4 grid gap-3 sm:grid-cols-2 text-xs">
        <div className="flex items-start gap-2">
          <Target className="size-3.5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold text-fd-foreground">Why This Matters</span>
            <span className="text-fd-muted-foreground">Mastering this framework prevents lost deals and builds high candidate trust.</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold text-fd-foreground">When To Use This</span>
            <span className="text-fd-muted-foreground">Apply directly during advisor call interactions and objection moments.</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold text-fd-foreground">What You Will Learn</span>
            <span className="text-fd-muted-foreground">Core phrasing, diagnostic scripts, common pitfalls, and scenario practice.</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ArrowRight className="size-3.5 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold text-fd-foreground">What Happens Next</span>
            <span className="text-fd-muted-foreground">Interactive roleplay simulation and next sequential journey module.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
