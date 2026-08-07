"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CopilotResponse } from "@/lib/copilot/types"
import {
  ShieldCheck,
  Copy,
  Check,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  ShieldAlert,
  Layers,
  ArrowRight,
  Link2,
} from "lucide-react"

export interface CopilotResponseCardProps {
  response: CopilotResponse
}

export function CopilotResponseCard({ response }: CopilotResponseCardProps) {
  const [copied, setCopied] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<number>(response.selectedLevel || 1)

  // Handle Refusal State
  if (response.isRefusal) {
    return (
      <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>Classification Deferred (Low Confidence)</span>
        </div>
        <p className="text-xs text-foreground leading-relaxed">
          {response.refusalReason ||
            "I am unable to confidently classify this statement against approved Sales Academy objection categories."}
        </p>
        <div className="pt-2 border-t border-amber-500/20 flex justify-end">
          <Link
            href="/docs/scripts"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Browse Scripts Library manually
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  // Get active text based on selected level option
  const activeLevelOption = response.levelOptions?.find((opt) => opt.level === selectedLevel)
  const activeResponseText = activeLevelOption ? activeLevelOption.response : response.recommendedResponse
  const activeScriptId = activeLevelOption?.matchedScriptId || response.matchedScriptId
  const activeDifficulty = activeLevelOption?.difficulty || (selectedLevel === 1 ? "Foundational" : "Intermediate")

  const confidenceBadgeVariant =
    response.confidence === "high"
      ? "default"
      : response.confidence === "medium"
      ? "secondary"
      : "outline"

  const lessonUrl = response.objectionId ? `/docs/objections/${response.objectionId}` : "/docs/scripts"

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Header: Detected Objection & Confidence */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Detected Objection:
          </span>
          <span className="text-xs font-bold text-foreground">
            {response.objectionTitle}
          </span>
        </div>

        <Badge variant={confidenceBadgeVariant} className="text-[10px] uppercase font-mono">
          {response.confidence} Confidence
        </Badge>
      </div>

      {/* Response Level Selector (Level 1 Foundational vs Level 2 Experienced) */}
      {response.levelOptions && response.levelOptions.length > 1 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            Response Ladder Level:
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-lg border border-border/60">
            {response.levelOptions.map((opt) => {
              const isSelected = opt.level === selectedLevel
              return (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSelectedLevel(opt.level)}
                  className={`text-[11px] font-bold py-1.5 px-2 rounded-md transition-all text-center ${
                    isSelected
                      ? "bg-card text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.level === 1 ? "Level 1: Foundational" : "Level 2: Experienced"}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommended Response Box */}
      <div className="space-y-2 rounded-lg bg-primary/5 border border-primary/20 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Approved Response ({selectedLevel === 1 ? "Level 1" : "Level 2"})
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCopy(activeResponseText)}
            className="h-7 px-2.5 text-[11px] font-bold gap-1 bg-card hover:bg-accent"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Response
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-foreground leading-relaxed font-medium">
          "{activeResponseText}"
        </p>
      </div>

      {/* Why This Works */}
      {response.whyItWorks && (
        <div className="space-y-1.5 rounded-md bg-secondary/50 p-3 border border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            Why This Works
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {response.whyItWorks}
          </p>
        </div>
      )}

      {/* Next Question To Ask */}
      {response.nextQuestion && (
        <div className="space-y-1.5 rounded-md bg-indigo-500/5 p-3 border border-indigo-500/15">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="h-3.5 w-3.5" />
            Next Question To Ask
          </div>
          <p className="text-[11px] text-foreground italic font-medium">
            "{response.nextQuestion}"
          </p>
        </div>
      )}

      {/* Avoid Saying */}
      {response.avoidSaying && response.avoidSaying.length > 0 && (
        <div className="space-y-1.5 rounded-md bg-rose-500/5 p-3 border border-rose-500/15">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Avoid Saying
          </div>
          <ul className="space-y-1 pl-4 list-disc text-[11px] text-muted-foreground">
            {response.avoidSaying.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Traceability Footer */}
      <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between text-[10px] text-muted-foreground gap-2">
        <div className="flex items-center gap-1.5 font-mono">
          <Link2 className="h-3 w-3 text-indigo-500 shrink-0" />
          <span className="truncate max-w-[200px]" title={activeScriptId || "SCRIPTS_REGISTRY"}>
            Ref: {activeScriptId || "Objection Handling"}
          </span>
          {activeDifficulty && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono">
              {activeDifficulty}
            </Badge>
          )}
        </div>

        <Link
          href={lessonUrl}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
        >
          View Lesson
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
