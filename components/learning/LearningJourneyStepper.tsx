"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import {
  Compass, ArrowRight, CheckCircle2, Circle, Play,
  PhoneCall, MessageSquare, ShieldCheck, DollarSign,
  GraduationCap, BookOpen, Award, Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface JourneyStep {
  id: string
  number: number
  title: string
  description: string
  href: string
  icon: React.ElementType
  estimatedTime: string
  totalLessons: number
  firstLessonSlug: string
}

export const ACADEMY_JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "discovery",
    number: 1,
    title: "1. Discovery Calls",
    description: "Master opening discovery, building candidate rapport, probing goals, and uncovering core pain points.",
    href: "/docs/discovery/opening-the-discovery-call",
    firstLessonSlug: "/docs/discovery/opening-the-discovery-call",
    icon: PhoneCall,
    estimatedTime: "45 min",
    totalLessons: 5,
  },
  {
    id: "discussion",
    number: 2,
    title: "2. Discussion Calls",
    description: "Structure the discussion call, present Surely Placed solutions, and articulate investment value.",
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
    description: "Execute the closing call, ask for commitment, handle final hesitation, and process agreements.",
    href: "/docs/closing/asking-for-the-commitment",
    firstLessonSlug: "/docs/closing/asking-for-the-commitment",
    icon: ShieldCheck,
    estimatedTime: "40 min",
    totalLessons: 5,
  },
  {
    id: "objections",
    number: 4,
    title: "4. Objection Handling",
    description: "Overcome price, timing, trust, spouse/family approval, and third-party consultancy objections.",
    href: "/docs/objections/objection-handling-framework",
    firstLessonSlug: "/docs/objections/objection-handling-framework",
    icon: Sparkles,
    estimatedTime: "60 min",
    totalLessons: 9,
  },
  {
    id: "pricing",
    number: 5,
    title: "5. Pricing & Value",
    description: "Navigate investment psychology, present pricing confidently, and engage financial decision-makers.",
    href: "/docs/pricing/investment-psychology",
    firstLessonSlug: "/docs/pricing/investment-psychology",
    icon: DollarSign,
    estimatedTime: "55 min",
    totalLessons: 9,
  },
  {
    id: "sales-coaching",
    number: 6,
    title: "6. Sales Coaching & Case Studies",
    description: "Analyze call recordings, self-review transcripts, and study real candidate scenario case studies.",
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
    description: "Internalize advisor mindset, ethical selling mandates, candidate-first principles, and non-negotiables.",
    href: "/docs/sales-constitution/advisor-mindset",
    firstLessonSlug: "/docs/sales-constitution/advisor-mindset",
    icon: BookOpen,
    estimatedTime: "35 min",
    totalLessons: 10,
  },
  {
    id: "complete-call",
    number: 8,
    title: "8. Complete Sales Call Mastery",
    description: "Synthesize all 7 modules into end-to-end sales call mastery and certification readiness.",
    href: "/docs/sales-coaching/composite-case-study-opt-software-engineer",
    firstLessonSlug: "/docs/sales-coaching/composite-case-study-opt-software-engineer",
    icon: Award,
    estimatedTime: "30 min",
    totalLessons: 1,
  },
]

export function LearningJourneyStepper() {
  const completedSlugs = useProgressStore((s) => s.completedSlugs)

  return (
    <Card className="border-fd-border bg-fd-card shadow-md overflow-hidden">
      <CardHeader className="border-b border-fd-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="accent" className="gap-1 font-semibold">
            <Compass className="size-3.5" />
            Guided Career Advisor Journey
          </Badge>
          <span className="text-xs font-mono font-semibold text-fd-muted-foreground">
            8 Modules
          </span>
        </div>
        <CardTitle className="mt-2 text-xl font-extrabold text-fd-foreground">
          Sales Academy Learning Path
        </CardTitle>
        <CardDescription className="text-xs text-fd-muted-foreground">
          Follow the sequential training path below from initial Discovery to complete call execution.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="relative space-y-6">
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-fd-border" aria-hidden />

          {ACADEMY_JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon
            const isCompleted = completedSlugs.includes(step.firstLessonSlug)
            const isCurrent = !isCompleted && (idx === 0 || completedSlugs.includes(ACADEMY_JOURNEY_STEPS[idx - 1]?.firstLessonSlug))

            return (
              <div key={step.id} className="relative flex items-start gap-4 group">
                {/* Step Circle Indicator */}
                <div
                  className={cn(
                    "z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all shadow-sm",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isCurrent
                      ? "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "border-fd-border bg-fd-background text-fd-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>

                {/* Step Content Card */}
                <div
                  className={cn(
                    "flex-1 rounded-xl border p-4 transition-all shadow-sm",
                    isCurrent
                      ? "border-primary/40 bg-primary/5 shadow-md"
                      : isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-fd-border bg-fd-card hover:bg-fd-accent/40"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-fd-muted-foreground uppercase tracking-wider">
                          Step {step.number}
                        </span>
                        {isCompleted && (
                          <Badge variant="success" className="text-[10px] py-0">
                            Completed
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="accent" className="text-[10px] py-0 animate-pulse">
                            Current Step
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-fd-foreground mt-0.5">
                        {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-fd-muted-foreground font-mono">
                        {step.estimatedTime} • {step.totalLessons} lessons
                      </span>
                      <Link href={step.href}>
                        <Button
                          size="sm"
                          variant={isCurrent ? "primary" : isCompleted ? "secondary" : "outline"}
                          className="gap-1.5 text-xs h-8"
                        >
                          <span>{isCompleted ? "Review" : isCurrent ? "Start Step" : "Explore"}</span>
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-fd-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
