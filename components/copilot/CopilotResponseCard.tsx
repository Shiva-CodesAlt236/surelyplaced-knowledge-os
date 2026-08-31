"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CopilotResponse } from "@/lib/copilot/types"
import { COPILOT_OBJECTION_CATEGORIES } from "@/lib/copilot/objection-categories"
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
  Sparkles,
  PenLine,
  X,
} from "lucide-react"

const UNCLASSIFIED = "unclassified"
const EXPLICIT_REFUSAL = "explicit-refusal"

// Stable, ordered list for the correction dropdown/checkboxes. Sourced from
// the same taxonomy metadata the classifier itself uses (zero duplication of
// category definitions), plus the explicit "unclassified" option Phase 6B
// treats as a valid corrected primary state.
const CORRECTION_CATEGORY_OPTIONS = [
  ...Object.values(COPILOT_OBJECTION_CATEGORIES).map((c) => ({ id: c.id, name: c.name })),
  { id: UNCLASSIFIED, name: "Unclassified / None of these" },
]

export interface CopilotResponseCardProps {
  response: CopilotResponse
  /**
   * Phase 6B: submit an advisor classification correction. Optional so this
   * component keeps working (correction control simply hidden) for any
   * caller that hasn't wired it up yet.
   */
  onCorrect?: (payload: {
    correctedPrimaryCategoryId: string
    correctedSecondaryCategoryIds: string[]
    correctionReason?: string
  }) => Promise<void> | void
  isPersisted?: boolean
  /**
   * Phase 6B: incremented by a parent (AskAIPanel) when the OutcomeRecorder
   * thumbs-down nudge's "Correct it" link is clicked, so this card's
   * correction panel opens even though the two components are siblings.
   */
  openCorrectionSignal?: number
}

export function CopilotResponseCard({
  response,
  onCorrect,
  isPersisted = true,
  openCorrectionSignal,
}: CopilotResponseCardProps) {
  const [copied, setCopied] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<number>(response.selectedLevel || 1)

  // Phase 6B: classification correction panel state. Local to this card —
  // Phase 6B deliberately does not build a correction-history browser here,
  // only the latest in-session correction outcome.
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [correctedPrimary, setCorrectedPrimary] = useState<string>(response.objectionId || UNCLASSIFIED)
  const [correctedSecondaries, setCorrectedSecondaries] = useState<string[]>([])
  const [correctionReason, setCorrectionReason] = useState("")
  const [correctionSaving, setCorrectionSaving] = useState(false)
  const [correctionError, setCorrectionError] = useState<string | null>(null)
  const [correctionSaved, setCorrectionSaved] = useState<{
    primary: string
    secondaries: string[]
  } | null>(null)

  // Skip the initial mount value (0/undefined) so the panel doesn't pop open
  // on first render — only actual nudge clicks (signal increments) open it.
  const lastNudgeSignal = useRef(openCorrectionSignal)
  useEffect(() => {
    if (openCorrectionSignal !== undefined && openCorrectionSignal !== lastNudgeSignal.current) {
      lastNudgeSignal.current = openCorrectionSignal
      setCorrectionOpen(true)
    }
  }, [openCorrectionSignal])

  const secondariesLocked = correctedPrimary === UNCLASSIFIED || correctedPrimary === EXPLICIT_REFUSAL

  const handleCorrectedPrimaryChange = (value: string) => {
    setCorrectedPrimary(value)
    if (value === UNCLASSIFIED || value === EXPLICIT_REFUSAL) {
      setCorrectedSecondaries([])
    }
  }

  const toggleCorrectedSecondary = (categoryId: string) => {
    if (secondariesLocked) return
    setCorrectedSecondaries((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      }
      if (prev.length >= 5) {
        return prev
      }
      return [...prev, categoryId]
    })
  }

  const handleSaveCorrection = async () => {
    if (!onCorrect) return
    setCorrectionSaving(true)
    setCorrectionError(null)
    try {
      await onCorrect({
        correctedPrimaryCategoryId: correctedPrimary,
        correctedSecondaryCategoryIds: secondariesLocked ? [] : correctedSecondaries,
        correctionReason: correctionReason.trim() || undefined,
      })
      setCorrectionSaved({
        primary: correctedPrimary,
        secondaries: secondariesLocked ? [] : correctedSecondaries,
      })
      setCorrectionOpen(false)
    } catch (err: any) {
      setCorrectionError(err?.message || "Could not save correction. Please try again.")
    } finally {
      setCorrectionSaving(false)
    }
  }

  const categoryName = (id: string) =>
    CORRECTION_CATEGORY_OPTIONS.find((c) => c.id === id)?.name || id

  const renderCorrectionSection = () => {
    if (!onCorrect) return null

    return (
      <div className="pt-2 border-t border-border/60 space-y-2">
        {!correctionOpen && (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!isPersisted}
              onClick={() => setCorrectionOpen(true)}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
              title={!isPersisted ? "Unavailable because this response was not saved." : undefined}
            >
              <PenLine className="h-3 w-3" />
              Correct classification
            </button>
            {correctionSaved && (
              <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Classification corrected
              </span>
            )}
          </div>
        )}

        {correctionSaved && !correctionOpen && (
          <p className="text-[10px] text-muted-foreground">
            Original:{" "}
            <span className="font-semibold text-foreground">
              {response.objectionTitle || "Unclassified (Low Confidence)"}
            </span>
            {" -> "}
            Corrected:{" "}
            <span className="font-semibold text-foreground">{categoryName(correctionSaved.primary)}</span>
            {correctionSaved.secondaries.length > 0 && (
              <>
                {" "}(+{correctionSaved.secondaries.map((id) => categoryName(id)).join(", ")})
              </>
            )}
          </p>
        )}

        {correctionOpen && (
          <div className="space-y-2.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <PenLine className="h-3.5 w-3.5" />
                Correct Classification
              </span>
              <button
                type="button"
                onClick={() => {
                  setCorrectionOpen(false)
                  setCorrectionError(null)
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Cancel correction"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {correctionError && (
              <div className="flex items-center gap-1.5 p-1.5 text-[11px] text-rose-600 bg-rose-500/10 rounded border border-rose-500/20">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                <span>{correctionError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Correct Primary Objection
              </label>
              <select
                value={correctedPrimary}
                onChange={(e) => handleCorrectedPrimaryChange(e.target.value)}
                className="w-full h-8 text-xs rounded-md border border-border bg-card px-2 text-foreground font-medium"
              >
                {CORRECTION_CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                className={`text-[10px] font-bold uppercase tracking-wide ${
                  secondariesLocked ? "text-muted-foreground/50" : "text-muted-foreground"
                }`}
              >
                Correct Secondary Objections (optional, max 5)
              </label>
              <div className="grid grid-cols-1 gap-1 max-h-28 overflow-y-auto pr-1">
                {CORRECTION_CATEGORY_OPTIONS.filter((c) => c.id !== UNCLASSIFIED && c.id !== correctedPrimary).map(
                  (c) => {
                    const isChecked = correctedSecondaries.includes(c.id)
                    const isMaxReached = !isChecked && correctedSecondaries.length >= 5
                    const isDisabled = secondariesLocked || isMaxReached
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-1.5 text-[11px] ${
                          isDisabled ? "text-muted-foreground/40 cursor-not-allowed" : "text-foreground"
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isDisabled}
                          checked={isChecked}
                          onChange={() => toggleCorrectedSecondary(c.id)}
                          className="h-3 w-3"
                        />
                        {c.name}
                      </label>
                    )
                  }
                )}
              </div>
              {secondariesLocked ? (
                <p className="text-[10px] text-muted-foreground italic">
                  Not available for "{categoryName(correctedPrimary)}" corrections.
                </p>
              ) : correctedSecondaries.length >= 5 ? (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Maximum 5 secondary categories selected.
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Reason (optional)
              </label>
              <input
                type="text"
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value.slice(0, 500))}
                placeholder="Short note on why this correction is being made"
                className="w-full h-8 text-xs rounded-md border border-border bg-card px-2 text-foreground font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setCorrectionOpen(false)
                  setCorrectionError(null)
                }}
                className="h-7 px-2.5 text-[11px] font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={correctionSaving}
                onClick={handleSaveCorrection}
                className="h-7 px-2.5 text-[11px] font-bold"
              >
                {correctionSaving ? "Saving..." : "Save Correction"}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

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

        {/* Phase 6B: Classification Correction available on unclassified / refusal responses */}
        {renderCorrectionSection()}
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
  const isNotPersisted = response.persistenceStatus === "not-persisted"

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

        <div className="flex items-center gap-1.5">
          <Badge variant={confidenceBadgeVariant} className="text-[10px] uppercase font-mono">
            {response.confidence} Confidence
          </Badge>
          {typeof response.numericConfidence === "number" && (
            <span className="text-[10px] font-mono text-muted-foreground font-semibold">
              ({Math.round(response.numericConfidence * 100)}%)
            </span>
          )}
        </div>
      </div>

      {/* Persistence Warning Banner (When DB persistence failed or unconfigured) */}
      {isNotPersisted && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 space-y-1 text-amber-600 dark:text-amber-400">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Response Not Persisted</span>
          </div>
          <p className="text-[11px] text-foreground font-medium leading-relaxed">
            Response generated, but this conversation was not saved. Feedback and outcome tracking are unavailable for this response.
          </p>
        </div>
      )}

      {/* Compound Objection Secondary Concern Chip */}
      {response.secondaryObjections && response.secondaryObjections.length > 0 && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Compound Objection Detected
          </div>
          <p className="text-[11px] text-foreground leading-relaxed font-medium">
            Candidate also expressed:{" "}
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {response.secondaryObjections.map((s) => s.objectionTitle).join(", ")}
            </span>
          </p>
        </div>
      )}

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

      {/* Phase 6B: Classification Correction */}
      {renderCorrectionSection()}
    </div>
  )
}
