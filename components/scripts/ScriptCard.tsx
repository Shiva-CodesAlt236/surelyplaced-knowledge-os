"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Bookmark, BookmarkCheck, ExternalLink, Maximize2 } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/scripts/CopyButton"
import { useBookmarksStore } from "@/lib/stores/useBookmarksStore"
import { cn } from "@/lib/utils"
import type { ScriptEntry } from "@/lib/scripts-registry"

export interface ScriptCardProps {
  script: ScriptEntry
  onOpenDetail: (script: ScriptEntry) => void
}

export function ScriptCard({ script, onOpenDetail }: ScriptCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { toggleBookmark, isBookmarked } = useBookmarksStore()

  const bookmarked = isBookmarked(script.id)

  const title = script.scenario || script.prompt || script.quickRefTitle || script.lessonTitle
  const copyableText = script.recommendedAnswer || (script.quickRefItems ? script.quickRefItems.map(i => `${i.label}: ${i.value}`).join('\n') : '')

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark({
      slug: script.id,
      title,
      href: script.lessonSlug,
      category: script.moduleName,
    })
  }

  return (
    <Card
      role="listitem"
      className={cn(
        "group relative flex flex-col justify-between transition-all duration-200",
        isExpanded ? "border-fd-ring/50 shadow-md bg-fd-card" : "hover:border-fd-border hover:shadow-xs"
      )}
    >
      <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-3 space-y-2.5">
        {/* Header badges & metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {script.type === "roleplay" && (
              <Badge variant="default">Roleplay</Badge>
            )}
            {script.type === "objection-response" && (
              <Badge variant="accent">Objection</Badge>
            )}
            {script.type === "practice" && (
              <Badge variant="info">Practice</Badge>
            )}
            {script.type === "quickref" && (
              <Badge variant="accent">Quick Ref</Badge>
            )}

            {script.difficulty && (
              <Badge
                variant={(() => {
                  const difficulty = script.difficulty?.toLowerCase()
                  switch (difficulty) {
                    case "foundational":
                      return "success"
                    case "intermediate":
                      return "info"
                    case "advanced":
                      return "accent"
                    case "expert":
                      return "destructive"
                    default:
                      return "outline"
                  }
                })() as any}
              >
                {script.difficulty}
              </Badge>
            )}
          </div>

          <button
            type="button"
            onClick={handleBookmarkToggle}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            title={bookmarked ? "Bookmarked" : "Bookmark script"}
            className="p-1 rounded-md text-fd-muted-foreground hover:text-amber-500 hover:bg-fd-accent/50 transition-colors"
          >
            {bookmarked ? (
              <BookmarkCheck className="size-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </button>
        </div>

        {/* Script title / scenario */}
        <h3 className="font-bold text-sm sm:text-base text-fd-foreground leading-snug tracking-tight">
          {title}
        </h3>

        {/* Lesson source label */}
        <p className="text-[11px] sm:text-xs text-fd-muted-foreground line-clamp-1">
          {script.lessonTitle}
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0 space-y-3 flex-1">
        {/* Recommended answer preview */}
        {script.recommendedAnswer && (
          <div className="rounded-lg border border-fd-border/70 bg-fd-accent/20 p-3 text-xs sm:text-sm text-fd-foreground/90 font-medium leading-relaxed">
            <p className={cn("whitespace-pre-line", !isExpanded && "line-clamp-2")}>
              &ldquo;{script.recommendedAnswer}&rdquo;
            </p>
          </div>
        )}

        {/* Inline QuickReference items preview when expanded */}
        {script.quickRefItems && (
          <div className="rounded-lg border border-fd-border/70 bg-fd-accent/20 p-3 text-xs space-y-1.5">
            <p className="font-semibold text-fd-foreground text-[11px] uppercase tracking-wider">
              {script.quickRefTitle || "Quick Reference"}
            </p>
            <ul className="space-y-1 text-fd-muted-foreground">
              {(isExpanded ? script.quickRefItems : script.quickRefItems.slice(0, 2)).map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2">
                  <span className="font-medium text-fd-foreground">{item.label}:</span>
                  <span className="truncate">{item.value}</span>
                </li>
              ))}
              {!isExpanded && script.quickRefItems.length > 2 && (
                <li className="text-[10px] italic text-fd-muted-foreground">
                  +{script.quickRefItems.length - 2} more items...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Expanded metadata */}
        {isExpanded && (
          <div className="space-y-3 pt-2 text-xs border-t border-fd-border/60 animate-in fade-in-50 duration-150">
            {script.objective && (
              <div>
                <span className="font-bold text-fd-muted-foreground uppercase text-[10px] block">Objective</span>
                <p className="text-fd-foreground leading-relaxed">{script.objective}</p>
              </div>
            )}
            {script.managerTip && (
              <div className="rounded border border-amber-500/30 bg-amber-500/10 p-2.5">
                <span className="font-bold text-amber-700 dark:text-amber-300 uppercase text-[10px] block">Manager Tip</span>
                <p className="text-fd-foreground leading-relaxed">{script.managerTip}</p>
              </div>
            )}
            {script.hints && script.hints.length > 0 && (
              <div>
                <span className="font-bold text-fd-muted-foreground uppercase text-[10px] block">Hints</span>
                <ul className="list-disc list-inside text-fd-foreground space-y-0.5">
                  {script.hints.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0 sm:pt-0 flex items-center justify-between gap-2 border-t border-fd-border/40 mt-auto">
        <div className="flex items-center gap-1.5">
          {copyableText && (
            <CopyButton
              textToCopy={copyableText}
              size="sm"
              variant="outline"
              label="Copy"
            />
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenDetail(script)}
            aria-label={`View details for ${title}`}
            className="text-xs gap-1 text-fd-muted-foreground hover:text-fd-foreground"
          >
            <Maximize2 className="size-3.5" />
            <span className="hidden sm:inline">Details</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs text-fd-muted-foreground hover:text-fd-foreground gap-1 px-2"
          >
            <span>{isExpanded ? "Less" : "More"}</span>
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </Button>

          <Link href={script.lessonSlug} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              title="Open lesson"
              aria-label={`Open lesson: ${script.lessonTitle}`}
              className="size-8 text-fd-muted-foreground hover:text-fd-foreground"
            >
              <ExternalLink className="size-3.5" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
