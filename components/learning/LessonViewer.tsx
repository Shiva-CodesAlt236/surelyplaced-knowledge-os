"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { ModuleHeader } from "@/components/learning/ModuleHeader"
import { NotesPanel } from "@/components/learning/NotesPanel"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import { ACADEMY_JOURNEY_STEPS } from "@/components/learning/LearningJourneyStepper"
import { Button } from "@/components/ui/button"
import { Compass, ArrowLeft, ArrowRight, BookOpen } from "lucide-react"

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

  // Determine current step and adjacent steps in the journey
  const currentStepIdx = ACADEMY_JOURNEY_STEPS.findIndex((s) => articleSlug.includes(s.id))
  const currentStep = currentStepIdx >= 0 ? ACADEMY_JOURNEY_STEPS[currentStepIdx] : null
  const prevStep = currentStepIdx > 0 ? ACADEMY_JOURNEY_STEPS[currentStepIdx - 1] : null
  const nextStep = currentStepIdx >= 0 && currentStepIdx < ACADEMY_JOURNEY_STEPS.length - 1 ? ACADEMY_JOURNEY_STEPS[currentStepIdx + 1] : null

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

      {/* Lesson Navigation & Journey Location Banner */}
      <div className="mt-8 space-y-6 pt-6 border-t border-border">
        {currentStep && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-fd-secondary/30">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-primary shrink-0" />
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground">
                  Academy Step {currentStep.number} of {ACADEMY_JOURNEY_STEPS.length}
                </span>
                <span className="text-xs font-semibold text-fd-foreground">
                  {currentStep.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {prevStep && (
                <Link href={prevStep.href}>
                  <Button variant="outline" size="sm" className="gap-1 text-xs h-8">
                    <ArrowLeft className="size-3" />
                    <span>Prev: {prevStep.id}</span>
                  </Button>
                </Link>
              )}
              {nextStep && (
                <Link href={nextStep.href}>
                  <Button variant="primary" size="sm" className="gap-1 text-xs h-8 font-semibold">
                    <span>Next: {nextStep.id}</span>
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
