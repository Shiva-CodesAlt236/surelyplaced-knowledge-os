"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { useAssessmentsStore } from "@/lib/stores/useAssessmentsStore"
import { cn } from "@/lib/utils"

export interface Option {
  id: string
  text: string
  isCorrect: boolean
}

export interface KnowledgeCheckCardProps {
  id?: string
  question: string
  options: Option[]
  explanation: string
}

export function KnowledgeCheckCard({
  id = "kc-budget-objection",
  question = "When dealing with a prospect raising budget objections, what is the primary recommended approach?",
  options = [
    { id: "a", text: "Immediately grant a 15% discount to keep the deal moving.", isCorrect: false },
    { id: "b", text: "Re-anchor on quantifiable business value & ROI before discussing pricing adjustments.", isCorrect: true },
    { id: "c", text: "Escalate immediately to the VP of Sales without probing further.", isCorrect: false },
    { id: "d", text: "Pause all communication until the prospect's new fiscal year.", isCorrect: false },
  ],
  explanation = "Standard closing protocol dictates re-anchoring on quantifiable business value & ROI before entertaining any price adjustments. Concessions without value trade-offs degrade margin.",
}: KnowledgeCheckCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const recordResult = useAssessmentsStore((s) => s.recordResult)

  const selectedOption = options.find((o) => o.id === selectedOptionId)
  const isCorrect = selectedOption?.isCorrect ?? false

  const handleSubmit = () => {
    setSubmitted(true)
    recordResult(id, isCorrect ? 100 : 0, isCorrect)
  }

  const handleReset = () => {
    setSelectedOptionId(null)
    setSubmitted(false)
  }

  return (
    <Card className="my-6 border-primary/20 bg-secondary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <HelpCircle className="h-4 w-4" />
          <span>Knowledge Check</span>
        </div>
        <CardTitle className="text-base font-bold mt-1 leading-snug">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id
          let optionClass = "border-border bg-card hover:bg-accent/60"

          if (submitted) {
            if (option.isCorrect) {
              optionClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            } else if (isSelected && !option.isCorrect) {
              optionClass = "border-destructive/50 bg-destructive/10 text-destructive"
            } else {
              optionClass = "border-border bg-card opacity-50"
            }
          } else if (isSelected) {
            optionClass = "border-primary bg-primary/10 text-primary font-medium"
          }

          return (
            <button
              key={option.id}
              disabled={submitted}
              onClick={() => setSelectedOptionId(option.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5",
                optionClass
              )}
            >
              <span className="font-bold text-muted-foreground uppercase">{option.id}.</span>
              <span className="flex-1">{option.text}</span>
              {submitted && option.isCorrect && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              )}
              {submitted && isSelected && !option.isCorrect && (
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              )}
            </button>
          )
        })}

        {submitted && (
          <div
            className={cn(
              "mt-4 p-3 rounded-lg border text-xs leading-relaxed space-y-1",
              isCorrect
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
            )}
          >
            <div className="font-bold flex items-center gap-1.5">
              {isCorrect ? "Correct!" : "Incorrect"}
            </div>
            <p>{explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        {submitted ? (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className="ml-auto text-xs"
          >
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
