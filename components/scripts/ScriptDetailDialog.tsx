"use client"

import * as React from "react"
import Link from "next/link"
import { ExternalLink, Bookmark, BookmarkCheck, Lightbulb, Target, User, Users, AlertCircle, FileText, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/scripts/CopyButton"
import { useBookmarksStore } from "@/lib/stores/useBookmarksStore"
import type { ScriptEntry } from "@/lib/scripts-registry"

export interface ScriptDetailDialogProps {
  script: ScriptEntry | null
  isOpen: boolean
  onClose: () => void
}

export function ScriptDetailDialog({
  script,
  isOpen,
  onClose,
}: ScriptDetailDialogProps) {
  const { toggleBookmark, isBookmarked } = useBookmarksStore()

  if (!script) return null

  const bookmarked = isBookmarked(script.id)

  const handleBookmarkToggle = () => {
    toggleBookmark({
      slug: script.id,
      title: script.scenario || script.prompt || script.quickRefTitle || script.lessonTitle,
      href: script.lessonSlug,
      category: script.moduleName,
    })
  }

  const title = script.scenario || script.prompt || script.quickRefTitle || script.lessonTitle

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 border border-fd-border bg-fd-card text-fd-foreground shadow-xl">
        <DialogHeader className="p-5 sm:p-6 border-b border-fd-border/80 bg-fd-accent/30 space-y-3">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {script.moduleName}
            </Badge>

            {script.type === "roleplay" && (
              <Badge variant="default">Roleplay Scenario</Badge>
            )}
            {script.type === "objection-response" && (
              <Badge variant="accent">Objection Response</Badge>
            )}
            {script.type === "practice" && (
              <Badge variant="info">Practice Exercise</Badge>
            )}
            {script.type === "quickref" && (
              <Badge variant="accent">Quick Reference</Badge>
            )}

            {script.difficulty && (
              <Badge
                variant={
                  script.difficulty === "Foundational"
                    ? "success"
                    : script.difficulty === "Intermediate"
                    ? "info"
                    : script.difficulty === "Advanced"
                    ? "accent"
                    : "destructive"
                }
              >
                {script.difficulty}
              </Badge>
            )}

            {script.funnelStage && (
              <Badge variant="outline" className="text-fd-muted-foreground">
                {script.funnelStage}
              </Badge>
            )}
          </div>

          <DialogTitle className="text-lg sm:text-xl font-bold leading-snug text-fd-foreground">
            {title}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-fd-muted-foreground flex items-center gap-1.5">
            <FileText className="size-3.5 shrink-0" />
            From lesson: <span className="font-medium text-fd-foreground">{script.lessonTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Recommended Answer / Primary Script Box */}
          {script.recommendedAnswer && (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  Recommended Verbatim Script
                </h4>
                <CopyButton
                  textToCopy={script.recommendedAnswer}
                  label="Copy Script"
                  size="sm"
                  variant="primary"
                />
              </div>
              <p className="text-sm sm:text-base font-medium text-fd-foreground leading-relaxed whitespace-pre-line selection:bg-indigo-500/20">
                &ldquo;{script.recommendedAnswer}&rdquo;
              </p>
            </div>
          )}

          {/* Quick Reference Items Table */}
          {script.quickRefItems && script.quickRefItems.length > 0 && (
            <div className="rounded-xl border border-fd-border bg-fd-accent/20 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-fd-foreground flex items-center gap-1.5">
                <FileText className="size-4 text-amber-500" />
                {script.quickRefTitle || "Quick Reference Items"}
              </h4>
              <div className="divide-y divide-fd-border/60 rounded-lg border border-fd-border bg-fd-card overflow-hidden text-xs sm:text-sm">
                {script.quickRefItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-1 sm:gap-4">
                    <span className="font-semibold text-fd-foreground shrink-0 sm:w-1/3">{item.label}</span>
                    <span className="text-fd-muted-foreground sm:w-2/3 sm:text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scenario Context */}
          {script.context && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
                Scenario Context
              </h4>
              <p className="text-xs sm:text-sm text-fd-foreground leading-relaxed rounded-lg border border-fd-border/70 bg-fd-accent/10 p-3">
                {script.context}
              </p>
            </div>
          )}

          {/* Objective & Success Criteria Grid */}
          {(script.objective || script.successCriteria) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {script.objective && (
                <div className="space-y-1.5 rounded-lg border border-fd-border/70 bg-fd-card p-3.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground flex items-center gap-1.5">
                    <Target className="size-3.5 text-indigo-500" />
                    Objective
                  </h5>
                  <p className="text-xs sm:text-sm text-fd-foreground leading-relaxed">
                    {script.objective}
                  </p>
                </div>
              )}

              {script.successCriteria && (
                <div className="space-y-1.5 rounded-lg border border-fd-border/70 bg-fd-card p-3.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    Success Criteria
                  </h5>
                  <p className="text-xs sm:text-sm text-fd-foreground leading-relaxed">
                    {script.successCriteria}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Roles */}
          {(script.yourRole || script.theirRole) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {script.yourRole && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-fd-border bg-fd-accent/20">
                  <User className="size-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-fd-muted-foreground block text-[10px] uppercase font-bold">Your Role</span>
                    <span className="font-semibold text-fd-foreground">{script.yourRole}</span>
                  </div>
                </div>
              )}
              {script.theirRole && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-fd-border bg-fd-accent/20">
                  <Users className="size-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-fd-muted-foreground block text-[10px] uppercase font-bold">Candidate Role</span>
                    <span className="font-semibold text-fd-foreground">{script.theirRole}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hints */}
          {script.hints && script.hints.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground flex items-center gap-1.5">
                <Lightbulb className="size-3.5 text-amber-500" />
                Key Hints & Reminders
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-fd-foreground">
                {script.hints.map((hint, idx) => (
                  <li key={idx} className="flex items-start gap-2 rounded-md border border-fd-border/50 bg-fd-card p-2.5">
                    <span className="size-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Manager Tip */}
          {script.managerTip && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="size-4" />
                Manager Tip
              </h4>
              <p className="text-xs sm:text-sm text-fd-foreground leading-relaxed">
                {script.managerTip}
              </p>
            </div>
          )}

          {/* Why This Works & Common Mistake (for practice boxes) */}
          {(script.whyThisWorks || script.commonMistake) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {script.whyThisWorks && (
                <div className="space-y-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Why This Works
                  </h5>
                  <p className="text-xs sm:text-sm text-fd-foreground leading-relaxed">
                    {script.whyThisWorks}
                  </p>
                </div>
              )}
              {script.commonMistake && (
                <div className="space-y-1.5 rounded-lg border border-red-500/30 bg-red-500/5 p-3.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" />
                    Common Mistake
                  </h5>
                  <p className="text-xs sm:text-sm text-fd-foreground leading-relaxed">
                    {script.commonMistake}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {script.tags && script.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-fd-border/50">
              <span className="text-[10px] uppercase font-bold text-fd-muted-foreground mr-1">Tags:</span>
              {script.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-fd-secondary px-2.5 py-0.5 text-[10px] font-medium text-fd-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-fd-border bg-fd-accent/20 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant={bookmarked ? "secondary" : "outline"}
            size="sm"
            onClick={handleBookmarkToggle}
            className="gap-1.5"
          >
            {bookmarked ? (
              <>
                <BookmarkCheck className="size-4 text-amber-500 fill-amber-500" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="size-4 text-fd-muted-foreground" />
                <span>Bookmark</span>
              </>
            )}
          </Button>

          <Link href={script.lessonSlug} onClick={onClose}>
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>View in Lesson</span>
              <ExternalLink className="size-3.5" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
