"use client"

import * as React from "react"
import { Search, X, SlidersHorizontal, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ScriptType } from "@/lib/scripts-registry"

export interface ScriptFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedType: ScriptType | "all"
  onTypeChange: (type: ScriptType | "all") => void
  selectedDifficulty: string | "all"
  onDifficultyChange: (difficulty: string | "all") => void
  availableDifficulties: string[]
  hasActiveFilters: boolean
  onResetFilters: () => void
  totalMatching: number
}

const TYPE_OPTIONS: { id: ScriptType | "all"; label: string }[] = [
  { id: "all", label: "All Types" },
  { id: "roleplay", label: "Roleplay" },
  { id: "objection-response", label: "Objection Response" },
  { id: "practice", label: "Practice" },
  { id: "quickref", label: "Quick Reference" },
]

export function ScriptFilterBar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedDifficulty,
  onDifficultyChange,
  availableDifficulties,
  hasActiveFilters,
  onResetFilters,
  totalMatching,
}: ScriptFilterBarProps) {
  const hasDifficulties = availableDifficulties.length > 0

  return (
    <div className="space-y-3 rounded-xl border border-fd-border/80 bg-fd-card/90 p-4 shadow-2xs backdrop-blur-xs">
      {/* Top row: Search input + Results counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search verbatim scripts, scenarios, prompts, tags..."
            className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-fd-background/50 border-fd-border focus:bg-fd-background"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fd-muted-foreground hover:text-fd-foreground p-0.5 rounded-md"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <Badge variant="outline" className="h-9 px-3 text-xs font-semibold">
            {totalMatching} {totalMatching === 1 ? "script" : "scripts"}
          </Badge>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-2.5 text-xs text-fd-muted-foreground hover:text-fd-foreground gap-1"
            >
              <X className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search scope disclaimer per requirement */}
      <div className="flex items-center gap-1.5 text-[11px] text-fd-muted-foreground bg-fd-accent/20 rounded-lg p-2 border border-fd-border/40">
        <Info className="size-3.5 text-indigo-500 shrink-0" />
        <span>Search covers the selected module&apos;s scripts, scenarios, prompts, and lesson titles.</span>
      </div>

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-fd-border/50 text-xs">
        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-fd-muted-foreground mr-1 flex items-center gap-1">
            <SlidersHorizontal className="size-3" />
            Type:
          </span>
          {TYPE_OPTIONS.map((opt) => {
            const isSelected = selectedType === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onTypeChange(opt.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md font-medium text-xs transition-colors select-none",
                  isSelected
                    ? "bg-fd-accent text-fd-accent-foreground font-semibold border border-fd-border"
                    : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/40"
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Difficulty pills (rendered only if availableDifficulties exist) */}
        {hasDifficulties && (
          <div className="flex flex-wrap items-center gap-1 pl-0 sm:pl-3 sm:border-l border-fd-border/60">
            <span className="text-[10px] uppercase font-bold text-fd-muted-foreground mr-1">
              Difficulty:
            </span>
            <button
              type="button"
              onClick={() => onDifficultyChange("all")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium text-xs transition-colors select-none",
                selectedDifficulty === "all"
                  ? "bg-fd-accent text-fd-accent-foreground font-semibold border border-fd-border"
                  : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/40"
              )}
            >
              All
            </button>
            {availableDifficulties.map((diff) => {
              const isSelected = selectedDifficulty === diff
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onDifficultyChange(diff)}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium text-xs transition-colors select-none",
                    isSelected
                      ? "bg-fd-accent text-fd-accent-foreground font-semibold border border-fd-border"
                      : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/40"
                  )}
                >
                  {diff}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
