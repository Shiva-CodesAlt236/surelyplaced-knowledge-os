"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import {
  Compass, ArrowRight, CheckCircle2,
  PhoneCall, MessageSquare, ShieldCheck, DollarSign,
  GraduationCap, BookOpen, Award, Sparkles, Layers
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface JourneyPhase {
  phaseNumber: number
  phaseTitle: string
  phaseBadge: string
  description: string
  steps: {
    id: string
    number: number
    title: string
    description: string
    href: string
    firstLessonSlug: string
    icon: React.ElementType
    estimatedTime: string
    totalLessons: number
  }[]
}

export const ACADEMY_PHASED_JOURNEY: JourneyPhase[] = [
  {
    phaseNumber: 1,
    phaseTitle: "Phase 1: Foundations & Discovery",
    phaseBadge: "Foundational",
    description: "Master opening discovery calls, establishing candidate rapport, and uncovering core career goals.",
    steps: [
      {
        id: "discovery",
        number: 1,
        title: "1. Discovery Calls",
        description: "Opening discovery calls, building candidate rapport, probing goals, and qualifying candidates.",
        href: "/docs/discovery/opening-the-discovery-call",
        firstLessonSlug: "/docs/discovery/opening-the-discovery-call",
        icon: PhoneCall,
        estimatedTime: "45 min",
        totalLessons: 5,
      },
    ],
  },
  {
    phaseNumber: 2,
    phaseTitle: "Phase 2: Core Presentation & Closing",
    phaseBadge: "Intermediate",
    description: "Structure discussion calls, present Surely Placed solutions, and secure firm enrollment commitments.",
    steps: [
      {
        id: "discussion",
        number: 2,
        title: "2. Discussion Calls",
        description: "Structuring discussion calls, presenting Surely Placed solutions, and investment framing.",
        href: "/docs/discussion/structuring-the-discussion-call",
        firstLessonSlug: "/docs/discussion/structuring-the-discussion-call",
        icon: MessageSquare,
        estimatedTime: "50 min",
        totalLessons: 5,
      },
      {
        id: "closing",
        number: 3,
        title: "3. Closing Calls",
        description: "Executing closing calls, asking for commitment, handling final hesitation, and agreement processing.",
        href: "/docs/closing/asking-for-the-commitment",
        firstLessonSlug: "/docs/closing/asking-for-the-commitment",
        icon: ShieldCheck,
        estimatedTime: "40 min",
        totalLessons: 5,
      },
    ],
  },
  {
    phaseNumber: 3,
    phaseTitle: "Phase 3: Objection Handling & Value Psychology",
    phaseBadge: "Advanced",
    description: "Neutralize price, timing, visa, and consultancy objections while maintaining high value anchors.",
    steps: [
      {
        id: "objections",
        number: 4,
        title: "4. Objection Handling",
        description: "Frameworks for budget, timing, trust, spouse approval, and consultancy comparison objections.",
        href: "/docs/objections/objection-handling-framework",
        firstLessonSlug: "/docs/objections/objection-handling-framework",
        icon: Sparkles,
        estimatedTime: "60 min",
        totalLessons: 9,
      },
      {
        id: "pricing",
        number: 5,
        title: "5. Pricing & Investment",
        description: "Navigating investment psychology, discount guidelines, and engaging financial decision-makers.",
        href: "/docs/pricing/investment-psychology",
        firstLessonSlug: "/docs/pricing/investment-psychology",
        icon: DollarSign,
        estimatedTime: "55 min",
        totalLessons: 9,
      },
    ],
  },
  {
    phaseNumber: 4,
    phaseTitle: "Phase 4: Sales Coaching & Constitution",
    phaseBadge: "Expert",
    description: "Refine sales skills through call reviews, transcript self-audits, and internalizing core sales ethics.",
    steps: [
      {
        id: "sales-coaching",
        number: 6,
        title: "6. Sales Coaching & Case Studies",
        description: "Analyzing call recordings, transcript self-reviews, and studying real candidate case studies.",
        href: "/docs/sales-coaching/reading-a-sales-conversation",
        firstLessonSlug: "/docs/sales-coaching/reading-a-sales-conversation",
        icon: GraduationCap,
        estimatedTime: "65 min",
        totalLessons: 10,
      },
      {
        id: "sales-constitution",
        number: 7,
        title: "7. Sales Constitution",
        description: "Advisor mindset, candidate-first selling, ethical mandates, and non-negotiable sales principles.",
        href: "/docs/sales-constitution/advisor-mindset",
        firstLessonSlug: "/docs/sales-constitution/advisor-mindset",
        icon: BookOpen,
        estimatedTime: "35 min",
        totalLessons: 10,
      },
    ],
  },
  {
    phaseNumber: 5,
    phaseTitle: "Graduate: Complete Sales Call Mastery",
    phaseBadge: "Mastery",
    description: "Synthesize all 7 academy modules into full end-to-end sales call execution and graduation readiness.",
    steps: [
      {
        id: "complete-call",
        number: 8,
        title: "8. Complete Sales Call Walkthrough",
        description: "End-to-end composite case study integrating discovery, presentation, objection handling, and closing.",
        href: "/docs/sales-coaching/complete-sales-call-walkthrough",
        firstLessonSlug: "/docs/sales-coaching/complete-sales-call-walkthrough",
        icon: Award,
        estimatedTime: "30 min",
        totalLessons: 1,
      },
    ],
  },
]

export const ACADEMY_JOURNEY_STEPS = ACADEMY_PHASED_JOURNEY.flatMap((p) =>
  p.steps.map((s) => ({
    ...s,
    phaseNumber: p.phaseNumber,
    phaseTitle: p.phaseTitle,
  }))
)

export function LearningJourneyStepper() {
  const completedSlugs = useProgressStore((s) => s.completedSlugs)

  return (
    <Card className="border-fd-border bg-fd-card shadow-md overflow-hidden">
      <CardHeader className="border-b border-fd-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="accent" className="gap-1 font-semibold">
            <Compass className="size-3.5" />
            Academy Phased Learning Journey
          </Badge>
          <span className="text-xs font-mono font-semibold text-fd-muted-foreground">
            Phases 1 – 5 (Graduate)
          </span>
        </div>
        <CardTitle className="mt-2 text-xl font-extrabold text-fd-foreground">
          Sales Advisor Progression Pathway
        </CardTitle>
        <CardDescription className="text-xs text-fd-muted-foreground">
          Progress sequentially through each training Phase to achieve Complete Sales Call Graduation.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-8">
        {ACADEMY_PHASED_JOURNEY.map((phase) => (
          <div key={phase.phaseNumber} className="space-y-4">
            {/* Phase Header */}
            <div className="flex items-center justify-between border-b border-fd-border pb-2">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-md bg-fd-primary text-fd-primary-foreground font-mono text-xs font-bold">
                  P{phase.phaseNumber}
                </div>
                <h3 className="text-sm font-extrabold text-fd-foreground">
                  {phase.phaseTitle}
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {phase.phaseBadge}
              </Badge>
            </div>

            <p className="text-xs text-fd-muted-foreground leading-relaxed -mt-1">
              {phase.description}
            </p>

            {/* Steps in Phase */}
            <div className="space-y-3">
              {phase.steps.map((step) => {
                const Icon = step.icon
                const isCompleted = completedSlugs.includes(step.firstLessonSlug)

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 transition-all shadow-sm",
                      isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-fd-border bg-fd-card hover:bg-fd-accent/40"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                          isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-fd-border bg-fd-secondary text-fd-foreground"
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-fd-foreground">
                            {step.title}
                          </h4>
                          {isCompleted && (
                            <Badge variant="success" className="text-[9px] py-0">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-fd-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-fd-border">
                      <span className="text-[10px] font-mono text-fd-muted-foreground">
                        {step.estimatedTime} • {step.totalLessons} lessons
                      </span>
                      <Link href={step.href}>
                        <Button
                          size="sm"
                          variant={isCompleted ? "secondary" : "primary"}
                          className="gap-1 text-xs h-7 px-3"
                        >
                          <span>{isCompleted ? "Review" : "Start Phase"}</span>
                          <ArrowRight className="size-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
