"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { ModuleHeader } from "@/components/learning/ModuleHeader"
import { NotesPanel } from "@/components/learning/NotesPanel"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import { getLessonNavigation } from "@/lib/academy-sequence"
import { Button } from "@/components/ui/button"
import { Compass, ArrowLeft, ArrowRight, Layers } from "lucide-react"

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
  const setLastActiveArticle = useProgressStore((state) => state.setLastActiveArticle)

  useEffect(() => {
    setLastActiveArticle({
      title,
      href: articleSlug,
      moduleName: moduleName ?? "Sales Academy Knowledge Module",
    })
  }, [title, articleSlug, moduleName, setLastActiveArticle])

  // Get strict sequential navigation data
  const nav = getLessonNavigation(articleSlug)

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

      {/* Lesson Navigation & Sequential Journey Location Banner */}
      <div className="mt-8 space-y-4 pt-6 border-t border-border">
        {nav.current && (
          <div className="rounded-xl border border-border bg-fd-secondary/30 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-primary shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground">
                    Lesson {nav.currentPosition} of {nav.totalCount} • {nav.current.moduleName}
                  </span>
                  <span className="text-xs font-semibold text-fd-foreground">
                    {nav.current.title}
                  </span>
                </div>
              </div>

              {nav.nextModule && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-fd-muted-foreground">
                  <Layers className="size-3" />
                  <span>Up Next Module: {nav.nextModule.moduleName}</span>
                </div>
              )}
            </div>

            {/* Navigation Button Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {nav.prevLesson ? (
                <Link href={nav.prevLesson.slug}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <ArrowLeft className="size-3" />
                    <span>Prev: {nav.prevLesson.title}</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nav.nextLesson ? (
                <Link href={nav.nextLesson.slug}>
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs h-8 font-semibold ml-auto">
                    <span>Next: {nav.nextLesson.title}</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </Link>
              ) : (
                <Link href="/docs/sales-coaching/complete-sales-call-walkthrough">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs h-8 font-semibold ml-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                    <span>Graduate: Complete Walkthrough</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        <NotesPanel articleSlug={articleSlug} />
      </div>
    </>
  )
}
