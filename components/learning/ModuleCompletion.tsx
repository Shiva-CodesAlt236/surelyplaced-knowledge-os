"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BookOpen, Dumbbell, Drama, HelpCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ModuleCompletionProps {
  read?: boolean
  practiced?: boolean
  roleplayCompleted?: boolean
  quizCompleted?: boolean
}

const steps = [
  { key: "read", label: "Read", icon: BookOpen },
  { key: "practiced", label: "Practiced", icon: Dumbbell },
  { key: "roleplayCompleted", label: "Roleplay Completed", icon: Drama },
  { key: "quizCompleted", label: "Quiz Completed", icon: HelpCircle },
] as const

/**
 * Multi-dimension completion tracker showing which learning activities
 * the learner has finished. Authors set booleans in MDX (or connect to
 * real state stores when backend support is available).
 *
 * When all props are omitted, the component renders all steps as
 * incomplete — an honest empty state rather than fabricated progress.
 */
export function ModuleCompletion({
  read = false,
  practiced = false,
  roleplayCompleted = false,
  quizCompleted = false,
}: ModuleCompletionProps) {
  const vals: Record<string, boolean> = {
    read,
    practiced,
    roleplayCompleted,
    quizCompleted,
  }
  const completed = Object.values(vals).filter(Boolean).length

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-bold">
          <span>Module Completion</span>
          <span className="text-xs font-mono text-fd-muted-foreground">
            {completed}/{steps.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map(({ key, label, icon: Icon }) => {
            const done = vals[key]
            return (
              <div
                key={key}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors",
                  done
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-fd-border bg-fd-secondary/30"
                )}
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full",
                    done
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-fd-muted-foreground/10 text-fd-muted-foreground"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider",
                    done
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-fd-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
